import { ArrowRight, BookOpen, GraduationCap } from 'lucide-react'

export function CtaSection() {
  return (
    <section id="cta" className="bg-background py-16 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-4xl border border-primary/15 bg-primary/5 px-6 py-14 text-center sm:px-12 lg:py-20">
          {/* Subtle decorative rings */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full border border-primary/10 opacity-40"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 -left-20 size-80 rounded-full border border-accent/10 opacity-40"
          />

          <h2 className="mx-auto max-w-3xl font-display text-3xl leading-tight font-extrabold tracking-tight text-balance text-foreground sm:text-4xl lg:text-5xl">
            Make Learning Feel Closer to Every Child
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
            Build a teacher-guided learning experience in the language children understand best.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="/signup?role=teacher"
              className="group inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-2xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-auto"
            >
              <GraduationCap className="size-5" aria-hidden="true" />
              I&apos;m a Teacher
              <ArrowRight
                className="size-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
            <a
              href="/signup?role=student"
              className="inline-flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-2xl border-2 border-foreground/15 bg-card px-8 text-base font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-auto"
            >
              <BookOpen className="size-5" aria-hidden="true" />
              I&apos;m a Student
            </a>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Built by Team MozhiTech · Smart India Hackathon 2026 · SIH26042
          </p>
        </div>
      </div>
    </section>
  )
}
