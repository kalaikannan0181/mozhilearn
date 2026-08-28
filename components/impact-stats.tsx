import { BookOpen, School, TrendingUp, Users } from 'lucide-react'

const stats = [
  { icon: BookOpen, value: '500+', label: 'Lessons translated' },
  { icon: Users, value: '1,000+', label: 'Students learning' },
  { icon: TrendingUp, value: '78%', label: 'Comprehension improvement' },
  { icon: School, value: '50+', label: 'Schools onboard' },
]

export function ImpactStats() {
  return (
    <section id="impact" className="bg-primary py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl leading-tight font-bold tracking-tight text-balance text-primary-foreground sm:text-4xl">
            Our impact so far
          </h2>
          <p className="font-tamil mt-3 text-base text-primary-foreground/75">
            எங்கள் பயணம்
          </p>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center rounded-3xl border border-primary-foreground/15 bg-primary-foreground/10 px-4 py-8 text-center"
            >
              <stat.icon
                className="size-7 text-primary-foreground/80"
                aria-hidden="true"
              />
              <dt className="sr-only">{stat.label}</dt>
              <dd className="mt-4 font-display text-3xl font-extrabold tracking-tight text-primary-foreground sm:text-4xl">
                {stat.value}
              </dd>
              <p
                aria-hidden="true"
                className="mt-2 text-sm leading-relaxed text-balance text-primary-foreground/80"
              >
                {stat.label}
              </p>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
