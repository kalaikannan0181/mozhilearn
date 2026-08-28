import { ArrowRight, CircleCheckBig } from 'lucide-react'

const points = [
  'Free for government schools',
  'No app install needed',
  'Set up in one class period',
]

export function CtaSection() {
  return (
    <section id="cta" className="bg-background py-16 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-4xl border border-accent/25 bg-accent/8 px-6 py-14 text-center sm:px-12 lg:py-18">
          <h2 className="mx-auto max-w-3xl font-display text-3xl leading-tight font-extrabold tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl">
            Ready to Transform Your Classroom?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
            Join teachers across Tamil Nadu already teaching in the language
            their students think in.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#contact"
              className="group inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:w-auto"
            >
              Sign Up as Teacher
              <ArrowRight
                className="size-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
            <a
              href="#contact"
              className="inline-flex min-h-13 w-full items-center justify-center rounded-2xl border-2 border-foreground/15 bg-card px-8 text-base font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:w-auto"
            >
              Sign Up as Student
            </a>
          </div>

          <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {points.map((point) => (
              <li
                key={point}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground"
              >
                <CircleCheckBig
                  className="size-4.5 text-success"
                  aria-hidden="true"
                />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
