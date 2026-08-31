import { BookOpenCheck, GraduationCap, Search, Upload, WandSparkles } from 'lucide-react'

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Teacher Speaks or Adds a Hindi Lesson',
    body: 'The teacher enters lesson text or speaks a classroom instruction in Hindi.',
  },
  {
    icon: WandSparkles,
    step: '02',
    title: 'AI Understands the Content',
    body: 'The system prepares a translation and teaching-friendly explanation for the selected grade.',
  },
  {
    icon: Search,
    step: '03',
    title: 'Mother Tongue Learning Support',
    body: 'The content is presented in the student’s selected mother tongue, such as Santhali.',
  },
  {
    icon: GraduationCap,
    step: '04',
    title: 'Teacher Reviews & Publishes',
    body: 'The teacher checks translation, explanation, worksheets, and flashcards before publishing.',
  },
]

/* Inline mock dashboard preview — no image dependency */
function DashboardMock() {
  return (
    <div
      className="overflow-hidden rounded-3xl border border-border bg-card shadow-lg"
      aria-hidden="true"
    >
      {/* Fake titlebar */}
      <div className="flex items-center gap-1.5 bg-secondary/60 px-4 py-3">
        <span className="size-2.5 rounded-full bg-destructive/40" />
        <span className="size-2.5 rounded-full bg-accent/40" />
        <span className="size-2.5 rounded-full bg-success/40" />
        <span className="ml-3 text-xs font-semibold text-muted-foreground">MozhiLearn — Teacher Dashboard</span>
      </div>
      {/* Mock content */}
      <div className="p-5 space-y-3">
        {/* Stat row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Lessons', val: '6', color: 'bg-primary/10 text-primary' },
            { label: 'Students', val: '18', color: 'bg-success/10 text-success' },
            { label: 'Pending', val: '2', color: 'bg-accent/10 text-accent' },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl p-3 ${s.color}`}>
              <p className="text-xs font-semibold opacity-70">{s.label}</p>
              <p className="text-xl font-extrabold">{s.val}</p>
            </div>
          ))}
        </div>
        {/* Fake lesson rows */}
        {['Plants & Sunlight', 'Numbers 1–10', 'Our Environment'].map((title) => (
          <div key={title} className="flex items-center justify-between rounded-2xl border border-border bg-background p-3">
            <div>
              <p className="text-xs font-bold text-foreground">{title}</p>
              <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">Hindi → Santhali Ready</p>
            </div>
            <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold text-success">Published</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-16 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold tracking-widest text-success uppercase">
            How It Works
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            From Teacher’s Voice to Student Understanding
          </h2>
          <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
            A simple teacher-guided workflow connects Hindi lessons to student understanding in their home language.
          </p>
        </div>

        {/* 4-step timeline */}
        <ol className="relative mt-14 grid gap-8 lg:grid-cols-4 lg:gap-6">
          {/* Desktop connector */}
          <div
            aria-hidden="true"
            className="absolute top-9 right-[12%] left-[12%] -z-10 hidden h-0.5 bg-[repeating-linear-gradient(to_right,oklch(0.918_0.014_252)_0_10px,transparent_10px_20px)] lg:block"
          />
          {steps.map((item, index) => (
            <li
              key={item.title}
              className="flex flex-col items-center rounded-3xl border border-border bg-card px-6 py-8 text-center shadow-sm"
            >
              <span className="relative flex size-18 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-md">
                <item.icon className="size-8" aria-hidden="true" />
                <span className="absolute -top-2 -right-2 flex size-8 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-accent-foreground">
                  {index + 1}
                </span>
              </span>
              <p className="mt-6 text-xs font-bold tracking-widest text-accent uppercase">
                Step {index + 1}
              </p>
              <h3 className="mt-2 font-display text-base font-bold text-balance text-foreground leading-snug">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-pretty text-muted-foreground">
                {item.body}
              </p>
            </li>
          ))}
        </ol>

        {/* Dashboard spotlight */}
        <div className="mt-16 grid items-center gap-10 rounded-4xl border border-border bg-secondary/30 p-6 sm:p-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold tracking-widest text-primary uppercase">Teacher View</p>
            <h3 className="mt-2 font-display text-2xl font-bold text-balance text-foreground sm:text-3xl">
              One dashboard for the whole class
            </h3>
            <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
              Teachers see every lesson, every student, and every weak concept
              in one place — in Hindi or student mother tongue, on any device.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {[
                'Class-level comprehension after each quiz',
                'Concept-wise weak areas flagged clearly',
                'Works on low-bandwidth school connections',
              ].map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-sm leading-relaxed text-foreground"
                >
                  <BookOpenCheck
                    className="mt-0.5 size-4 shrink-0 text-success"
                    aria-hidden="true"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <DashboardMock />
        </div>
      </div>
    </section>
  )
}
