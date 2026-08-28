import { ArrowRight, BadgeCheck, Languages, School, Volume2 } from 'lucide-react'
import Image from 'next/image'

const badges = [
  { icon: BadgeCheck, label: 'Aligned with NEP 2020' },
  { icon: School, label: 'Trusted by 50+ Schools' },
  { icon: Languages, label: 'Available in Tamil' },
]

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-gradient-to-b from-secondary to-background"
      />
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div className="reveal flex flex-col items-start">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            <span className="font-tamil">தாய்மொழியில் கற்றல்</span>
            <span aria-hidden="true">·</span>
            <span>Grades 1–5</span>
          </p>

          <h1 className="mt-6 font-display text-4xl leading-tight font-extrabold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            Every Child Deserves to Learn in Their{' '}
            <span className="text-primary">Mother Tongue</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
            AI-powered translation and pedagogy adaptation for primary education
            in Tamil Nadu. Teachers upload a lesson in English — students learn
            it in Tamil, with audio and quizzes.
          </p>

          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
            <a
              href="#cta"
              className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-accent px-7 text-base font-semibold text-accent-foreground shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-3 focus-visible:ring-accent/40 focus-visible:outline-none"
            >
              I&apos;m a Teacher
              <ArrowRight
                className="size-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
            <a
              href="#demo"
              className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl border-2 border-primary bg-background px-7 text-base font-semibold text-primary transition-colors hover:bg-primary/5 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              I&apos;m a Student
            </a>
          </div>

          <ul className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3">
            {badges.map((badge) => (
              <li
                key={badge.label}
                className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground"
              >
                <badge.icon
                  className="size-4.5 text-success"
                  aria-hidden="true"
                />
                {badge.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="reveal relative">
          <div className="relative overflow-hidden rounded-4xl border border-border bg-card shadow-xl">
            <Image
              src="/images/hero-classroom.png"
              alt="Indian primary school children learning together on tablets and laptops with their teacher in a bright classroom"
              width={1280}
              height={720}
              priority
              sizes="(min-width: 1024px) 42rem, 100vw"
              className="h-auto w-full"
            />
          </div>

          <div className="absolute -bottom-6 -left-2 w-[15rem] rounded-3xl border border-border bg-card p-4 shadow-lg sm:-left-6 sm:w-[17rem]">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              English lesson
            </p>
            <p className="mt-1 text-sm font-medium text-foreground">
              &quot;Plants need sunlight to grow.&quot;
            </p>
            <div className="my-3 h-px bg-border" />
            <p className="text-xs font-semibold tracking-wide text-primary uppercase">
              Tamil · Grade 3
            </p>
            <p className="font-tamil mt-1 text-sm leading-relaxed font-medium text-foreground">
              செடிகள் வளர சூரிய ஒளி தேவை.
            </p>
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-success">
              <Volume2 className="size-4" aria-hidden="true" />
              Audio ready
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
