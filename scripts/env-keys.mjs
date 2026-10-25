#!/usr/bin/env node
/**
 * Set, read and check the AI keys in .env.local without typing them into your shell history or chat.
 *
 *   npm run keys -- status                 which providers are ready
 *   npm run keys -- setup gemma-google     ask for what that provider needs (hidden input), then switch to it
 *   npm run keys -- set OPENROUTER_API_KEY hidden prompt, or pipe the value in: pbpaste | npm run keys -- set NAME
 *   npm run keys -- get NAME [--show]      masked unless --show
 *   npm run keys -- list                   every variable in the file, masked
 *   npm run keys -- unset NAME
 *   npm run keys -- use gemma-openrouter   only change EVALUATOR_PROVIDER
 *
 * Add --file <path> to use another file. The file is written with mode 600 and .env* is git-ignored.
 */
import { chmodSync, existsSync, readFileSync, renameSync, writeFileSync } from "node:fs"
import { resolve } from "node:path"

// freeTier: the host may use inputs to improve its products, so the companion also needs EVALUATOR_FREE_TIER=synthetic-only.
const PROVIDERS = {
  "gemma-local": {
    needs: ["EVALUATOR_BASE_URL"],
    help: "Your own server's OpenAI-compatible URL: http://localhost:11434/v1 (Ollama), http://localhost:1234/v1 (LM Studio). No key needed.",
  },
  "gemma-google": { needs: ["GOOGLE_GENERATIVE_AI_API_KEY"], freeTier: true, help: "Free key: aistudio.google.com/apikey" },
  "gemma-openrouter": { needs: ["OPENROUTER_API_KEY"], freeTier: true, help: "Free key: openrouter.ai/settings/keys (the default model is a :free one)" },
  claude: { needs: ["ANTHROPIC_API_KEY"], help: "Direct Anthropic key, console.anthropic.com (the fallback)" },
  "gemma-gateway": { needs: ["AI_GATEWAY_API_KEY"], help: "Vercel AI Gateway (billed; not pursued for now)" },
}
const FREE_TIER = ["EVALUATOR_FREE_TIER", "synthetic-only"]
const NAME = /^[A-Z0-9_]+$/
const SECRET = /KEY|TOKEN|SECRET|PASSWORD/i

const args = process.argv.slice(2)
const fileIdx = args.indexOf("--file")
const file = resolve(fileIdx >= 0 ? args.splice(fileIdx, 2)[1] : ".env.local")
const show = args.includes("--show") && args.splice(args.indexOf("--show"), 1)
const [cmd, ...rest] = args

const mask = (name, v) => (!SECRET.test(name) || !v ? v : v.length <= 8 ? "••••" : `${v.slice(0, 3)}…${v.slice(-3)} (${v.length} chars)`)
const read = () => (existsSync(file) ? readFileSync(file, "utf8").replace(/\n+$/, "").split("\n").filter((_, i, a) => a.length > 1 || a[0] !== "") : [])
const parse = (lines) => {
  const out = {}
  for (const l of lines) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)$/.exec(l)
    if (m) out[m[1]] = m[2].replace(/^(['"])(.*)\1$/, "$2")
  }
  return out
}
function write(lines) {
  while (lines.length && lines.at(-1) === "") lines.pop()
  const tmp = `${file}.tmp`
  writeFileSync(tmp, `${lines.join("\n")}\n`, { mode: 0o600 })
  renameSync(tmp, file)
  chmodSync(file, 0o600)
}
function setVar(name, value) {
  const lines = read()
  const i = lines.findIndex((l) => new RegExp(`^\\s*${name}\\s*=`).test(l))
  const line = `${name}=${value}`
  if (i >= 0) lines[i] = line
  else lines.push(line)
  write(lines)
}
function unsetVar(name) {
  const lines = read()
  const next = lines.filter((l) => !new RegExp(`^\\s*${name}\\s*=`).test(l))
  if (next.length === lines.length) return false
  write(next)
  return true
}

/** Read one line without echoing it, or the whole of stdin when it's piped. */
function ask(prompt, { visible = false } = {}) {
  return new Promise((done) => {
    if (!process.stdin.isTTY) {
      let data = ""
      process.stdin.on("data", (c) => (data += c)).on("end", () => done(data.trim()))
      return
    }
    process.stdout.write(prompt)
    let buf = ""
    process.stdin.setRawMode(true)
    process.stdin.resume()
    process.stdin.setEncoding("utf8")
    const onData = (ch) => {
      for (const c of ch) {
        if (c === "\u0003") {
          process.stdin.setRawMode(false)
          process.stdout.write("\n")
          process.exit(130)
        }
        if (c === "\r" || c === "\n") {
          process.stdin.setRawMode(false)
          process.stdin.pause()
          process.stdin.off("data", onData)
          process.stdout.write("\n")
          return done(buf.trim())
        }
        if (c === "\u007f") buf = buf.slice(0, -1)
        else if (c >= " ") {
          buf += c
          if (visible) process.stdout.write(c)
        }
      }
    }
    process.stdin.on("data", onData)
  })
}

function die(message, code = 1) {
  console.error(message)
  process.exit(code)
}

const needsOf = (name) => [...PROVIDERS[name].needs, ...(PROVIDERS[name].freeTier ? [FREE_TIER[0]] : [])]
const ready = (name, env) =>
  needsOf(name).every((k) => (k === FREE_TIER[0] ? (env[k] || process.env[k]) === FREE_TIER[1] : env[k] || process.env[k]))

switch (cmd) {
  case "status": {
    const env = parse(read())
    console.log(`File: ${file}${existsSync(file) ? "" : " (not created yet)"}`)
    console.log(`Active provider: ${env.EVALUATOR_PROVIDER || "claude (default)"}\n`)
    for (const [name, p] of Object.entries(PROVIDERS)) console.log(`${ready(name, env) ? "ready  " : "missing"}  ${name.padEnd(17)} needs ${needsOf(name).join(", ")}${p.freeTier ? "=synthetic-only" : ""}`)
    break
  }
  case "list": {
    const env = parse(read())
    for (const [k, v] of Object.entries(env)) console.log(`${k}=${show ? v : mask(k, v)}`)
    if (!Object.keys(env).length) console.log("Nothing set.")
    break
  }
  case "get": {
    const [name] = rest
    if (!name) die("Usage: get NAME [--show]")
    const v = parse(read())[name]
    if (v === undefined) die(`${name} isn't set in ${file}.`)
    console.log(show ? v : mask(name, v))
    break
  }
  case "set": {
    const [name] = rest
    if (!name || !NAME.test(name)) die("Usage: set NAME  (upper-case name; value is prompted, or piped in)")
    const value = await ask(`${name}: `, { visible: !SECRET.test(name) })
    if (!value) die("No value given, nothing changed.")
    setVar(name, value)
    console.log(`Saved ${name}=${mask(name, value)} to ${file}`)
    break
  }
  case "unset": {
    const [name] = rest
    if (!name || !NAME.test(name)) die("Usage: unset NAME  (upper-case name)")
    console.log(unsetVar(name) ? `Removed ${name}.` : `${name} wasn't set.`)
    break
  }
  case "use":
  case "setup": {
    const [name] = rest
    const p = PROVIDERS[name]
    if (!p) die(`Usage: ${cmd} <${Object.keys(PROVIDERS).join("|")}>`)
    if (cmd === "setup") {
      console.log(`${name}: ${p.help}`)
      for (const k of p.needs) {
        const have = parse(read())[k]
        if (have && (await ask(`${k} is already set (${mask(k, have)}). Replace it? [y/N] `, { visible: true })).toLowerCase() !== "y") continue
        const v = await ask(`${k}: `, { visible: !SECRET.test(k) })
        if (v) setVar(k, v)
        else console.warn(`No value for ${k}, skipped.`)
      }
      if (p.freeTier && parse(read())[FREE_TIER[0]] !== FREE_TIER[1]) {
        console.log("This free tier may use what's sent to improve the host's products.")
        const yes = await ask("Will every input be synthetic (no real apprentice work or anyone's details)? [y/N] ", { visible: true })
        if (yes.toLowerCase() === "y") setVar(...FREE_TIER)
        else console.warn(`Not set. The companion stays off on ${name} until ${FREE_TIER.join("=")}.`)
      }
    }
    setVar("EVALUATOR_PROVIDER", name)
    const env = parse(read())
    console.log(`EVALUATOR_PROVIDER=${name} in ${file}. ${ready(name, env) ? "Ready." : "Still missing: " + needsOf(name).filter((k) => (k === FREE_TIER[0] ? env[k] !== FREE_TIER[1] : !env[k])).join(", ")}`)
    console.log("Restart `npm run dev` or `npm start` to pick it up. On Vercel, set the same variables in the project settings and redeploy.")
    break
  }
  default:
    console.log(readFileSync(new URL(import.meta.url), "utf8").split("\n").slice(2, 14).join("\n").replace(/^ \* ?/gm, ""))
}
