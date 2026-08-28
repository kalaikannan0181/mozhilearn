import { ChartColumnBig, Languages, Palette, Volume2 } from 'lucide-react'

const features = [
  {
    icon: Languages,
    title: 'AI Translation',
    tamil: 'மொழிபெயர்ப்பு',
    body: 'Instant English ↔ Tamil lesson conversion that keeps subject terms accurate.',
    tone: 'primary' as const,
  },
  {
    icon: Palette,
    title: 'Pedagogy Adaptation',
    tamil: 'கற்பித்தல் முறை',
    body: 'Age-appropriate rewriting for Grades 1–5, with examples children recognise.',
    tone: 'accent' as const,
  },
  {
    icon: Volume2,
    title: 'Audio Narration',
    tamil: 'ஒலி வாசிப்பு',
    body: 'Text-to-speech in a natural Tamil voice, so early readers can follow along.',
    tone: 'success' as const,
  },
  {
    icon: ChartColumnBig,
    title: 'Progress Tracking',
    tamil: 'முன்னேற்றம்',
    body: 'Real-time analytics showing which concepts each class actually understood.',
    tone: 'primary' as const,
  },
]

const toneStyles = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/12 text-accent',
  success: 'bg-success/12 text-success',
}

export function Solution() {
  return (
    <section
      id="features"
      className="bg-gradient-to-b from-secondary via-secondary/60 to-background py-16 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold tracking-widest text-primary uppercase">
            The Solution
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            How MozhiLearn helps
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-pretty text-muted-foreground">
            Four things every classroom needs, built into one workflow a teacher
            can finish before the bell.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <li
              key={feature.title}
              className="group flex flex-col rounded-3xl border border-border bg-card p-7 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-xl"
            >
              <span
                className={`inline-flex size-13 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 ${toneStyles[feature.tone]}`}
              >
                <feature.icon className="size-6.5" aria-hidden="true" />
              </span>
              <h3 className="mt-6 font-display text-lg font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="font-tamil mt-0.5 text-sm text-muted-foreground">
                {feature.tamil}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {feature.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
