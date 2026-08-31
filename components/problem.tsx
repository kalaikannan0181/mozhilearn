import { BookOpen, Brain, ScrollText, Zap } from 'lucide-react'

const problems = [
  {
    icon: BookOpen,
    title: 'Unfamiliar language makes concepts harder to understand',
    body: 'When lessons are delivered in English, children who speak Tamil at home lose meaning before learning even begins.',
    tone: 'primary' as const,
  },
  {
    icon: Zap,
    title: 'Teachers need faster ways to adapt lesson content',
    body: 'Translating and re-levelling every worksheet by hand is time-consuming, unpaid work that most teachers cannot sustain.',
    tone: 'accent' as const,
  },
  {
    icon: Brain,
    title: 'Children need audio, simple explanations, and practice',
    body: 'Young learners retain far more when they can hear a lesson in Tamil, re-read at their own pace, and test their understanding.',
    tone: 'success' as const,
  },
]

const toneMap = {
  primary: {
    bg: 'bg-primary/8',
    icon: 'text-primary',
    border: 'hover:border-primary/25',
  },
  accent: {
    bg: 'bg-accent/8',
    icon: 'text-accent',
    border: 'hover:border-accent/25',
  },
  success: {
    bg: 'bg-success/8',
    icon: 'text-success',
    border: 'hover:border-success/25',
  },
}

export function Problem() {
  return (
    <section id="problem" className="bg-background py-16 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold tracking-widest text-accent uppercase">
            The Challenge
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            Language Should Never Block Learning
          </h2>
          <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
            Three clear barriers stand between children and understanding in
            Indian primary classrooms today.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {problems.map((problem) => {
            const tone = toneMap[problem.tone]
            return (
              <li
                key={problem.title}
                className={`group flex flex-col rounded-3xl border border-border bg-card p-7 shadow-sm transition-all hover:-translate-y-1 ${tone.border} hover:shadow-lg`}
              >
                <span
                  className={`inline-flex size-12 items-center justify-center rounded-2xl ${tone.bg}`}
                >
                  <problem.icon
                    className={`size-6 ${tone.icon}`}
                    aria-hidden="true"
                  />
                </span>
                <h3 className="mt-6 text-base font-bold text-pretty text-foreground leading-snug">
                  {problem.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {problem.body}
                </p>
              </li>
            )
          })}
        </ul>

        {/* NEP 2020 policy strip — truthful reference */}
        <p className="mt-10 flex flex-col items-start gap-3 rounded-3xl border border-success/20 bg-success/6 p-6 text-base font-medium text-foreground sm:flex-row sm:items-center">
          <ScrollText
            className="size-6 shrink-0 text-success"
            aria-hidden="true"
          />
          <span className="text-pretty">
            NEP 2020 mandates mother-tongue instruction until Grade 5 — schools
            need tools, not just policy.
          </span>
        </p>
      </div>
    </section>
  )
}
