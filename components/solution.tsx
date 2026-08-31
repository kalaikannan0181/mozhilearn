import { ChartColumnBig, Languages, Palette, Volume2 } from 'lucide-react'

const features = [
  {
    icon: Languages,
    step: '01',
    title: 'AI-Assisted Translation',
    tamil: 'மொழிபெயர்ப்பு',
    body: 'English lessons are converted to Tamil accurately, preserving subject terminology.',
    tone: 'primary' as const,
  },
  {
    icon: Palette,
    step: '02',
    title: 'Grade-Level Simplification',
    tamil: 'கற்பித்தல் முறை',
    body: 'Content is rewritten for Grades 1–5 with age-appropriate vocabulary and familiar examples.',
    tone: 'accent' as const,
  },
  {
    icon: Volume2,
    step: '03',
    title: 'Tamil Audio Learning',
    tamil: 'ஒலி வாசிப்பு',
    body: 'Natural-sounding Tamil narration lets early readers listen, follow, and build comprehension.',
    tone: 'success' as const,
  },
  {
    icon: ChartColumnBig,
    step: '04',
    title: 'Teacher Progress Insights',
    tamil: 'முன்னேற்றம்',
    body: 'Dashboards show which lessons students engaged with and how they performed in quizzes.',
    tone: 'primary' as const,
  },
]

const toneStyles = {
  primary: { icon: 'bg-primary/10 text-primary', step: 'text-primary', connector: 'bg-primary/20' },
  accent: { icon: 'bg-accent/10 text-accent', step: 'text-accent', connector: 'bg-accent/20' },
  success: { icon: 'bg-success/10 text-success', step: 'text-success', connector: 'bg-success/20' },
}

export function Solution() {
  return (
    <section
      id="features"
      className="bg-gradient-to-b from-secondary/40 to-background py-16 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-2xl">
          <p className="text-sm font-bold tracking-widest text-primary uppercase">
            The Solution
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            More Than Translation
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-pretty text-muted-foreground">
            Four interconnected capabilities that take a lesson from English
            text to a full Tamil learning experience.
          </p>
        </div>

        {/* Learning pathway — connected cards */}
        <div className="mt-14 relative">
          {/* Desktop connector line */}
          <div
            aria-hidden="true"
            className="absolute top-14 right-[6%] left-[6%] -z-10 hidden h-0.5 bg-[repeating-linear-gradient(to_right,oklch(0.918_0.014_252)_0_10px,transparent_10px_20px)] lg:block"
          />

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const styles = toneStyles[feature.tone]
              return (
                <li
                  key={feature.title}
                  className="group relative flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-xl"
                >
                  {/* Step number + icon */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex size-13 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${styles.icon}`}
                    >
                      <feature.icon className="size-6.5" aria-hidden="true" />
                    </span>
                    <span className={`font-display text-3xl font-extrabold tabular-nums opacity-20 ${styles.step}`}>
                      {feature.step}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-base font-bold text-foreground leading-snug">
                    {feature.title}
                  </h3>
                  <p className="font-tamil mt-0.5 text-sm text-muted-foreground">
                    {feature.tamil}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground flex-1">
                    {feature.body}
                  </p>

                  {/* Subtle bottom accent bar */}
                  <div className={`mt-5 h-1 rounded-full ${styles.connector}`} aria-hidden="true" />
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
