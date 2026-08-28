import { GraduationCap, Upload, WandSparkles } from 'lucide-react'
import Image from 'next/image'

const steps = [
  {
    icon: Upload,
    step: 'Step 1',
    title: 'Upload the lesson',
    body: 'Drop in a PDF, worksheet or typed text in English. No formatting required.',
  },
  {
    icon: WandSparkles,
    step: 'Step 2',
    title: 'AI translates & adapts',
    body: 'MozhiLearn converts it to Tamil, re-levels the language for the grade and generates audio.',
  },
  {
    icon: GraduationCap,
    step: 'Step 3',
    title: 'Students learn & practise',
    body: 'Children read, listen and answer quizzes — results reach the teacher instantly.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-16 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold tracking-widest text-success uppercase">
            How It Works
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            Three steps from English worksheet to Tamil lesson
          </h2>
        </div>

        <ol className="relative mt-14 grid gap-8 lg:grid-cols-3 lg:gap-6">
          <div
            aria-hidden="true"
            className="absolute top-9 right-[12%] left-[12%] -z-10 hidden h-0.5 bg-[repeating-linear-gradient(to_right,var(--color-border)_0_10px,transparent_10px_20px)] lg:block"
          />
          {steps.map((item, index) => (
            <li
              key={item.title}
              className="flex flex-col items-center rounded-3xl border border-border bg-card px-7 py-9 text-center shadow-sm"
            >
              <span className="relative flex size-18 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-md">
                <item.icon className="size-8" aria-hidden="true" />
                <span className="absolute -top-2 -right-2 flex size-8 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-accent-foreground">
                  {index + 1}
                </span>
              </span>
              <p className="mt-6 text-xs font-bold tracking-widest text-accent uppercase">
                {item.step}
              </p>
              <h3 className="mt-2 font-display text-xl font-bold text-balance text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-pretty text-muted-foreground">
                {item.body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-16 grid items-center gap-10 rounded-4xl border border-border bg-secondary/50 p-6 sm:p-10 lg:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl font-bold text-balance text-foreground sm:text-3xl">
              One dashboard for the whole class
            </h3>
            <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
              Teachers see every lesson, every student and every weak concept in
              one place — in English or Tamil, on a laptop or a phone.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {[
                'Class-level comprehension scores after each quiz',
                'Concept-wise weak areas flagged automatically',
                'Works on low bandwidth school connections',
              ].map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-sm leading-relaxed text-foreground"
                >
                  <span
                    className="mt-1.5 size-2 shrink-0 rounded-full bg-success"
                    aria-hidden="true"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg">
            <Image
              src="/images/teacher-dashboard.png"
              alt="MozhiLearn teacher dashboard showing class progress charts and Tamil lesson list"
              width={1200}
              height={900}
              sizes="(min-width: 1024px) 34rem, 100vw"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
