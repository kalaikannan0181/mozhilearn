import { BookOpen, Brain, ScrollText, UserRoundX } from 'lucide-react'

const problems = [
  {
    icon: BookOpen,
    stat: '60%',
    title: "of rural students don't understand English-medium instruction",
    body: 'Lessons are delivered in a language most children do not speak at home, so meaning is lost before learning begins.',
  },
  {
    icon: UserRoundX,
    stat: '1 in 3',
    title: 'teachers lack multilingual teaching resources',
    body: 'Translating and re-levelling every worksheet by hand is unpaid work that few teachers have time for.',
  },
  {
    icon: Brain,
    stat: '78%',
    title: 'of students memorise without comprehension',
    body: 'Children reproduce answers they cannot explain, and the gap widens every single school year.',
  },
]

export function Problem() {
  return (
    <section id="problem" className="bg-background py-16 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold tracking-widest text-accent uppercase">
            The Challenge
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            Language shouldn&apos;t be the reason a child falls behind
          </h2>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {problems.map((problem) => (
            <li
              key={problem.stat}
              className="group flex flex-col rounded-3xl border border-border bg-card p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary">
                <problem.icon className="size-6" aria-hidden="true" />
              </span>
              <p className="mt-6 font-display text-4xl font-extrabold tracking-tight text-primary">
                {problem.stat}
              </p>
              <h3 className="mt-2 text-base font-semibold text-pretty text-foreground">
                {problem.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {problem.body}
              </p>
            </li>
          ))}
        </ul>

        <p className="mt-10 flex flex-col items-start gap-3 rounded-3xl border border-success/25 bg-success/8 p-6 text-base font-medium text-foreground sm:flex-row sm:items-center">
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
