import { BarChart3, Languages, Sparkles, Volume2 } from 'lucide-react'
import { GlowingEffect } from '@/components/ui/glowing-effect'

const features = [
  {
    icon: Languages,
    step: '01',
    title: 'AI-Assisted Translation',
    tamil: 'மொழிபெயர்ப்பு',
    body: 'Converts teacher-created lesson content into clear Tamil learning material.',
    glowColor: '#1D4ED8', // Primary Blue
    tone: 'primary' as const,
  },
  {
    icon: Sparkles,
    step: '02',
    title: 'Grade-Level Simplification',
    tamil: 'கற்பித்தல் முறை',
    body: 'Adapts explanations into simple language suitable for Grades 1–5.',
    glowColor: '#F97316', // Accent Orange
    tone: 'accent' as const,
  },
  {
    icon: Volume2,
    step: '03',
    title: 'Tamil Audio Learning',
    tamil: 'ஒலி வாசிப்பு',
    body: 'Lets students listen to Tamil lesson content while they learn.',
    glowColor: '#059669', // Learning Green
    tone: 'success' as const,
  },
  {
    icon: BarChart3,
    step: '04',
    title: 'Teacher Progress Insights',
    tamil: 'முன்னேற்றம்',
    body: 'Helps teachers review lesson completion and quiz-based comprehension.',
    glowColor: '#102A43', // Deep Navy
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
      className="bg-gradient-to-b from-secondary/40 to-background py-16 lg:py-24 scroll-mt-24"
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
            MozhiLearn brings lesson adaptation, teacher guidance, audio support, and comprehension checks into one learning workflow.
          </p>
        </div>

        {/* Learning pathway — connected cards */}
        <div className="mt-14 relative">
          {/* Desktop connector line */}
          <div
            aria-hidden="true"
            className="absolute top-14 right-[6%] left-[6%] -z-10 hidden h-0.5 bg-[repeating-linear-gradient(to_right,oklch(0.918_0.014_252)_0_10px,transparent_10px_20px)] lg:block"
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const styles = toneStyles[feature.tone]
              return (
                <article
                  key={feature.title}
                  className="group relative flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm transition-transform hover:-translate-y-1.5 duration-300"
                >
                  <GlowingEffect
                    glowColor={feature.glowColor}
                    disabled={false}
                    glowSize={300}
                    className="z-10"
                  />

                  {/* Step number + icon */}
                  <div className="flex items-center justify-between relative z-20">
                    <span
                      className={`inline-flex size-13 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 duration-300 ${styles.icon}`}
                    >
                      <feature.icon className="size-6.5" aria-hidden="true" />
                    </span>
                    <span className={`font-display text-3xl font-extrabold tabular-nums opacity-20 ${styles.step}`}>
                      {feature.step}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-base font-bold text-foreground leading-snug relative z-20">
                    {feature.title}
                  </h3>
                  <p className="font-tamil mt-0.5 text-sm text-muted-foreground relative z-20">
                    {feature.tamil}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground flex-1 relative z-20">
                    {feature.body}
                  </p>

                  {/* Subtle bottom accent bar */}
                  <div className={`mt-5 h-1 rounded-full relative z-20 ${styles.connector}`} aria-hidden="true" />
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
