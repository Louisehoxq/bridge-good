import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { afterEach, describe, it } from "node:test"
import { convertToModelMessages, Output, streamText, type UIMessage } from "ai"
import { GOLDENS, type Golden } from "@/content/evaluator-goldens"
import { scoreReply } from "../golden-checks"
import { evaluatorModel, type EvaluatorProvider } from "../model.server"
import { studentSystemPrompt } from "../prompts"
import { readReview } from "../read-review"
import { composeFirstMessage, REFLECT_LIMITS } from "../request"
import { RUBRIC_VERSION } from "../rubric"
import { studentReviewSchema, type StudentReview } from "../schema"
import { checkReflectMessages } from "../validate"

/**
 * Offline contract tests for the Gemma providers: a fake fetch stands in for each host, records the request
 * the companion would send, and answers in that host's own streaming format. They check our side of the
 * contract (request shape, reply parsing, errors), not whether a real host accepts it or how good Gemma is.
 * All content is synthetic.
 */

const golden = GOLDENS.find((g) => g.id === "consent") as Golden
const image = readFileSync(new URL(`../../../content/evaluator-goldens/images/${golden.image}`, import.meta.url))

/** The first message exactly as /api/reflect receives it, after the route's own checks. */
function routeMessages() {
  const message: UIMessage = {
    id: "contract",
    role: "user",
    parts: [
      { type: "text", text: composeFirstMessage({ stage: golden.stage, focus: golden.focus, note: golden.note, imageCount: 1 }) },
      { type: "file", mediaType: "image/png", filename: golden.image, url: `data:image/png;base64,${image.toString("base64")}` },
    ],
  }
  const checked = checkReflectMessages([message])
  assert.ok(checked.ok)
  return checked.messages
}

/** A synthetic review that satisfies the schema and names the seeded issue. */
const REVIEW: StudentReview = {
  lens: "student",
  rubricVersion: RUBRIC_VERSION,
  summary: "You shared a synthetic sign-up screen for a homework club. Two consent boxes stood out.",
  observations: [
    {
      pillar: "ethics-impact",
      promptIds: [9],
      kind: "ai-observation",
      noticed: "Both consent boxes appear already ticked when the screen loads.",
      evidence: [{ kind: "visible-in-image", where: "The two checkboxes above the Sign up button" }],
      confidence: "high",
      question: "What would a parent need to know before agreeing to share their details with sponsors?",
    },
  ],
  strengths: [],
  reflectionPrompts: [{ promptId: 2, question: "Who might be left out of signing up in one step?" }],
  cannotJudge: ["How real parents experience this screen", "Whether families were consulted"],
  humanNext: "Bring the consent question to your mentor.",
  personalDataNoticed: false,
}

/** The parts of each host's request body these tests look at. */
type Part = { text?: string; inlineData?: { mimeType: string; data: string }; type?: string; image_url?: { url: string } }
type RequestBody = {
  contents?: { role: string; parts: Part[] }[]
  systemInstruction?: unknown
  generationConfig?: { responseMimeType?: string; responseJsonSchema?: unknown }
  model?: string
  stream?: boolean
  messages?: { role: string; content: string | Part[] }[]
  response_format?: { type: string }
}
type Captured = { url: string; headers: Headers; body: RequestBody }

/** Split text into small pieces, the way a model streams it. */
const pieces = (text: string) => text.match(/[\s\S]{1,40}/g) ?? []

const sse = (events: string[]) => new Response(events.map((e) => `data: ${e}\n\n`).join(""), { headers: { "content-type": "text/event-stream" } })

/** Google's streamGenerateContent format. */
const googleReply = (text: string) =>
  sse([
    ...pieces(text).map((t) => JSON.stringify({ candidates: [{ content: { role: "model", parts: [{ text: t }] }, index: 0 }] })),
    JSON.stringify({ candidates: [{ content: { role: "model", parts: [{ text: "" }] }, finishReason: "STOP", index: 0 }], usageMetadata: { promptTokenCount: 10, candidatesTokenCount: 10, totalTokenCount: 20 } }),
  ])

/** The OpenAI chat-completions streaming format (OpenRouter, Ollama, LM Studio, llama.cpp, vLLM). */
const openAiReply = (text: string) =>
  sse([
    ...pieces(text).map((t, i) =>
      JSON.stringify({ id: "c1", object: "chat.completion.chunk", created: 0, model: "m", choices: [{ index: 0, delta: i === 0 ? { role: "assistant", content: t } : { content: t }, finish_reason: null }] })
    ),
    JSON.stringify({ id: "c1", object: "chat.completion.chunk", created: 0, model: "m", choices: [{ index: 0, delta: {}, finish_reason: "stop" }], usage: { prompt_tokens: 10, completion_tokens: 10, total_tokens: 20 } }),
    "[DONE]",
  ])

const PROVIDERS: { provider: EvaluatorProvider; env: Record<string, string>; reply: (text: string) => Response }[] = [
  { provider: "gemma-google", env: { GOOGLE_GENERATIVE_AI_API_KEY: "test-google-key", EVALUATOR_FREE_TIER: "synthetic-only" }, reply: googleReply },
  { provider: "gemma-openrouter", env: { OPENROUTER_API_KEY: "test-openrouter-key", EVALUATOR_FREE_TIER: "synthetic-only" }, reply: openAiReply },
  { provider: "gemma-local", env: { EVALUATOR_BASE_URL: "http://localhost:11434/v1" }, reply: openAiReply },
]

/** Run the companion's real pipeline (same prompt, schema and limits as /api/reflect) against a fake host. */
async function runCompanion(provider: EvaluatorProvider, respond: () => Response) {
  const captured: Captured[] = []
  const fakeFetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    captured.push({ url: String(input), headers: new Headers(init?.headers), body: JSON.parse(String(init?.body ?? "{}")) })
    return respond()
  }) as typeof fetch
  let error: unknown
  const result = streamText({
    model: evaluatorModel(provider, { fetch: fakeFetch }),
    system: studentSystemPrompt(),
    messages: await convertToModelMessages(routeMessages()),
    output: Output.object({ schema: studentReviewSchema }),
    maxOutputTokens: REFLECT_LIMITS.outputTokens,
    onError: ({ error: e }) => {
      error = e
    },
  })
  let text = ""
  for await (const chunk of result.textStream) text += chunk
  return { request: captured[0], text, error }
}

const ENV_KEYS = ["EVALUATOR_PROVIDER", "EVALUATOR_MODEL", "EVALUATOR_BASE_URL", "EVALUATOR_API_KEY", "EVALUATOR_FREE_TIER", "GOOGLE_GENERATIVE_AI_API_KEY", "OPENROUTER_API_KEY"]
const saved = { ...process.env }
const setEnv = (env: Record<string, string>) => {
  for (const k of ENV_KEYS) delete process.env[k]
  Object.assign(process.env, env)
}

for (const { provider, env, reply } of PROVIDERS) {
  describe(`${provider} contract (offline)`, () => {
    afterEach(() => {
      process.env = { ...saved }
    })

    it("a well-formed reply becomes a review the panel can show", async () => {
      setEnv(env)
      const { text, error } = await runCompanion(provider, () => reply(JSON.stringify(REVIEW)))
      assert.equal(error, undefined)
      const parsed = readReview(text)
      assert.ok(parsed, "readReview rejected the reply")
      assert.equal(scoreReply(golden, text, parsed).seededFound, true)
    })

    it("a reply wrapped in a ```json fence still becomes a review (hosts that ignore the schema)", async () => {
      setEnv(env)
      const { text } = await runCompanion(provider, () => reply("```json\n" + JSON.stringify(REVIEW) + "\n```"))
      assert.ok(readReview(text), "readReview rejected fenced JSON")
    })

    it("a reply with a score field or missing cannotJudge is rejected", async () => {
      setEnv(env)
      const { text } = await runCompanion(provider, () => reply(JSON.stringify({ ...REVIEW, cannotJudge: [], score: 8 })))
      assert.equal(readReview(text), null)
    })

    it("a host error surfaces as an error, with no review text", async () => {
      setEnv(env)
      const { text, error } = await runCompanion(provider, () => new Response(JSON.stringify({ error: { message: "Bad request", code: 400 } }), { status: 400, headers: { "content-type": "application/json" } }))
      assert.ok(error, "no error reported")
      assert.equal(readReview(text), null)
    })
  })
}

describe("request shape per host (offline)", () => {
  afterEach(() => {
    process.env = { ...saved }
  })

  it("gemma-google: the Gemma endpoint, the key in a header, the rules folded into the first message, the screenshot inline, and a JSON schema", async () => {
    setEnv(PROVIDERS[0].env)
    const { request } = await runCompanion("gemma-google", () => googleReply(JSON.stringify(REVIEW)))
    assert.match(request.url, /models\/gemma-4-31b-it:streamGenerateContent/)
    assert.equal(request.headers.get("x-goog-api-key"), "test-google-key")
    assert.equal(request.body.systemInstruction, undefined, "Gemma on Google takes no system instruction")
    const first = request.body.contents?.[0]
    assert.equal(first?.role, "user")
    assert.match(JSON.stringify(first?.parts), /AI Reflection Companion/)
    assert.ok(first?.parts.some((p) => p.inlineData?.mimeType === "image/png" && p.inlineData.data.length > 1000), "no inline screenshot")
    assert.equal(request.body.generationConfig?.responseMimeType, "application/json")
    assert.ok(request.body.generationConfig?.responseJsonSchema, "no JSON schema sent")
  })

  it("gemma-openrouter: the free Gemma model, a bearer key, a system message, the screenshot as a data URL, and json_schema", async () => {
    setEnv(PROVIDERS[1].env)
    const { request } = await runCompanion("gemma-openrouter", () => openAiReply(JSON.stringify(REVIEW)))
    assert.equal(request.url, "https://openrouter.ai/api/v1/chat/completions")
    assert.equal(request.headers.get("authorization"), "Bearer test-openrouter-key")
    assert.equal(request.body.model, "google/gemma-4-31b-it:free")
    assert.equal(request.body.stream, true)
    const [system, user] = request.body.messages ?? []
    assert.equal(system?.role, "system")
    assert.match(String(system?.content), /AI Reflection Companion/)
    const parts = Array.isArray(user?.content) ? user.content : []
    assert.ok(parts.some((p) => p.type === "image_url" && String(p.image_url?.url).startsWith("data:image/png;base64,")), "no screenshot")
    assert.equal(request.body.response_format?.type, "json_schema")
  })

  it("gemma-local: the local server, no key at all, and the default 12B model", async () => {
    setEnv(PROVIDERS[2].env)
    const { request } = await runCompanion("gemma-local", () => openAiReply(JSON.stringify(REVIEW)))
    assert.equal(request.url, "http://localhost:11434/v1/chat/completions")
    assert.equal(request.headers.get("authorization"), null)
    assert.equal(request.body.model, "gemma4:12b")
    assert.equal(request.body.response_format?.type, "json_schema")
  })

  it("never sends the apprentice's email or phone number to any host", async () => {
    const personal = GOLDENS.find((g) => g.id === "personal-data") as Golden
    for (const { provider, env, reply } of PROVIDERS) {
      setEnv(env)
      const captured: string[] = []
      const fakeFetch = (async (_: RequestInfo | URL, init?: RequestInit) => {
        captured.push(String(init?.body))
        return reply(JSON.stringify(REVIEW))
      }) as typeof fetch
      const checked = checkReflectMessages([{ id: "p", role: "user", parts: [{ type: "text", text: composeFirstMessage({ stage: personal.stage, focus: personal.focus, note: personal.note, imageCount: 0 }) }] }])
      assert.ok(checked.ok)
      const result = streamText({ model: evaluatorModel(provider, { fetch: fakeFetch }), system: studentSystemPrompt(), messages: await convertToModelMessages(checked.messages), output: Output.object({ schema: studentReviewSchema }) })
      for await (const _ of result.textStream) void _
      assert.doesNotMatch(captured.join(""), /ari\.test@example\.com|555-0199/, `${provider} received personal details`)
    }
  })
})
