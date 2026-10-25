import type { Metadata } from "next"
import { ArchetypeHero } from "@/components/archetype-hero"
import { DemoForm } from "@/components/demo-form"
import { ImpactLoop } from "@/components/impact-loop"
import { PrinciplesInPractice } from "@/components/principles-in-practice"
import { Section } from "@/components/section"

export const metadata: Metadata = {
  title: "For problem owners",
  description: "Non-profits and social organisations can share a design problem and work with students and mentors to solve it.",
}

const POSSIBLE = [
  { title: "A clearer website", body: "Help people find what they need quickly, on any device." },
  { title: "Accessible services", body: "Make a service work for people with disabilities, low literacy or limited internet access." },
  { title: "Multilingual content", body: "Reach communities in the languages they're most comfortable in." },
  { title: "Smoother journeys", body: "Make intake, sign-up or booking processes less stressful." },
  { title: "Outreach materials", body: "Flyers, social media and signage that speak to your community." },
  { title: "Research", body: "Understand the needs of the people you serve, or the ones you're missing." },
]

const EXPECT = [
  {
    title: "You share the problem",
    body: "Tell us what's not working and who it affects. You don't need a design brief.",
  },
  {
    title: "We find the right support",
    body: "BRIDGEGOOD and its ambassadors match your problem with a student team and mentors.",
  },
  {
    title: "Your community helps shape the work",
    body: "With consent, the team listens to the people you serve. Their voices lead the design.",
  },
  {
    title: "You stay a partner",
    body: "Regular check-ins, honest updates, and decisions made together.",
  },
  {
    title: "You receive the work, and give feedback",
    body: "You get usable designs and documentation. Your feedback helps improve how future projects run.",
  },
]

const ACCESS_OPTIONS = [
  "Screen reader users",
  "Low vision",
  "Deaf or hard of hearing",
  "Limited internet or no smartphone",
  "Languages other than English",
  "Low literacy",
  "Cognitive or learning disabilities",
  "Older adults",
]

export default function ProblemOwnersPage() {
  return (
    <>
      <ArchetypeHero
        eyebrow="For non-profits & social organisations"
        title="Got a problem better design could help solve?"
        aside={
          <div className="rounded-2xl border bg-card p-6">
            <p className="text-sm font-bold text-archetype">Good fit if you…</p>
            <ul className="mt-3 space-y-2">
              <li>Serve a community that often gets overlooked</li>
              <li>Don&apos;t have in-house design capacity</li>
              <li>Can make time to collaborate and connect us with your community</li>
            </ul>
          </div>
        }
      >
        <p>
          You know your community best. Share a challenge, whether it&apos;s a website, a service or making something
          accessible, and work with emerging designers and experienced mentors to solve it together.
        </p>
      </ArchetypeHero>

      <Section id="possible" eyebrow="What's possible" title="The kinds of problems design can help with">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {POSSIBLE.map((p) => (
            <li key={p.title} className="rounded-xl border bg-card p-5">
              <h3 className="text-lg font-bold">{p.title}</h3>
              <p className="mt-1 text-muted-foreground">{p.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="expect"
        tone="soft"
        eyebrow="What to expect"
        title="How we work with you"
        intro="This isn't a handover to a vendor. It's a collaboration that keeps your community at the centre."
      >
        <ol className="space-y-4">
          {EXPECT.map((step, i) => (
            <li key={step.title} className="flex gap-4 rounded-xl border bg-card p-5">
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-archetype font-bold text-white"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div>
                <h3 className="text-lg font-bold">
                  <span className="sr-only">Step {i + 1}: </span>
                  {step.title}
                </h3>
                <p className="mt-1 text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        id="principles"
        eyebrow="How we work"
        title="The principles behind it"
        intro="Open each one to see what it means for your organisation."
      >
        <PrinciplesInPractice archetype="problem-owner" />
      </Section>

      <Section id="loop" tone="muted" eyebrow="Where you fit" title="Every project starts with you">
        <ImpactLoop current="problem-owner" />
      </Section>

      <Section
        id="submit"
        eyebrow="Share a problem"
        title="Tell us what you're trying to fix"
        intro="Plain language is perfect. There are no wrong answers, and we'll follow up with questions."
      >
        <div className="max-w-3xl">
          <DemoForm
            submitLabel="Share this problem"
            successTitle="Thank you for sharing your problem"
            successBody="In the real service, BRIDGEGOOD would review it and look for an ambassador and student team to support you."
            fields={[
              { name: "organisation", label: "Organisation name", type: "text", required: true, autoComplete: "organization" },
              { name: "contact", label: "Your name", type: "text", required: true, autoComplete: "name" },
              { name: "email", label: "Email address", type: "email", autoComplete: "email" },
              {
                name: "problem",
                label: "What's the problem?",
                type: "textarea",
                required: true,
                hint: "What isn't working today, and what happens because of it?",
                errorMessage: "Describe the problem you'd like help with",
              },
              {
                name: "community",
                label: "Who does it affect?",
                type: "textarea",
                required: true,
                hint: "Describe the people you serve. Please don't include anyone's personal details.",
                errorMessage: "Tell us who the problem affects",
              },
              {
                name: "access",
                label: "Which access needs should the design consider?",
                type: "checkboxes",
                hint: "Choose any that apply.",
                options: ACCESS_OPTIONS,
              },
              {
                name: "constraints",
                label: "Anything we should know?",
                type: "textarea",
                hint: "Deadlines, existing tools, budget or other constraints.",
              },
            ]}
          />
        </div>
      </Section>
    </>
  )
}
