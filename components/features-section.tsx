import { BarChart3, BookOpen, Upload } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Feature = {
  title: string
  description: string
  icon: LucideIcon
  tint: string
  iconClass: string
}

const features: Feature[] = [
  {
    title: 'Upload Lessons',
    description:
      'Teachers upload any lesson and our AI turns it into playful, bite-sized activities in seconds.',
    icon: Upload,
    tint: 'bg-primary/10',
    iconClass: 'bg-primary text-primary-foreground',
  },
  {
    title: 'Learn in Tamil',
    description:
      'Students read, listen, and speak in their mother tongue with gentle AI guidance at every step.',
    icon: BookOpen,
    tint: 'bg-sky/25',
    iconClass: 'bg-sky text-sky-foreground',
  },
  {
    title: 'Track Progress',
    description:
      'Colorful dashboards show growth, streaks, and stars so every little win is celebrated.',
    icon: BarChart3,
    tint: 'bg-leaf/25',
    iconClass: 'bg-leaf text-leaf-foreground',
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 py-16 md:py-24">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
            Everything a young learner needs
          </h2>
          <p className="mt-3 font-semibold text-lg text-muted-foreground text-pretty">
            Built for primary classrooms, loved by teachers and students alike.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <article
                key={feature.title}
                className={`group rounded-3xl border border-border ${feature.tint} p-7 transition-transform duration-200 hover:-translate-y-1`}
              >
                <span
                  className={`flex size-14 items-center justify-center rounded-2xl ${feature.iconClass} shadow-sm transition-transform duration-200 group-hover:scale-110`}
                >
                  <Icon className="size-7" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-display text-2xl font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 font-medium leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
