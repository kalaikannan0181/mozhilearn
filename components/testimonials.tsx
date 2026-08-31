import { Code2, Headphones, Languages, School } from 'lucide-react'

/**
 * Replaces the fabricated testimonials section with an honest, factual
 * "About This Prototype" note — no fake teacher quotes or unverified claims.
 */
export function PrototypeNote() {
  const capabilities = [
    {
      icon: Languages,
      title: 'Hindi ↔ Santhali lesson adaptation',
      body: 'Converts teacher-written Hindi content into clear, grade-appropriate mother tongue learning material.',
      tone: 'primary' as const,
    },
    {
      icon: Headphones,
      title: 'Mother tongue audio narration',
      body: 'Generates spoken audio so students can listen and follow along in their home language.',
      tone: 'success' as const,
    },
    {
      icon: School,
      title: 'Teacher-controlled publishing',
      body: 'Teachers review the translation before students can access it.',
      tone: 'accent' as const,
    },
    {
      icon: Code2,
      title: 'Quiz-based comprehension checks',
      body: 'Short quizzes after each lesson with results visible to the teacher.',
      tone: 'primary' as const,
    },
  ]

  const toneMap = {
    primary: 'bg-primary/8 text-primary',
    success: 'bg-success/8 text-success',
    accent: 'bg-accent/8 text-accent',
  }

  return (
    <section id="about" className="bg-background py-16 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="text-sm font-bold tracking-widest text-primary uppercase">
            About This Prototype
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            What MozhiLearn Can Do Right Now
          </h2>
          <p className="mt-4 text-base leading-relaxed text-pretty text-muted-foreground">
            MozhiLearn is a working prototype built for Smart India Hackathon 2026.
            Below is an honest account of what the current version supports.
          </p>
        </div>

        {/* Capability cards */}
        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {capabilities.map((cap) => (
            <li
              key={cap.title}
              className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className={`inline-flex size-12 items-center justify-center rounded-2xl ${toneMap[cap.tone]}`}>
                <cap.icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-sm font-bold text-foreground leading-snug">
                {cap.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {cap.body}
              </p>
            </li>
          ))}
        </ul>

        {/* Honest disclaimer strip */}
        <div className="mt-10 rounded-3xl border border-border bg-secondary/40 p-6">
          <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
            <strong className="text-foreground">Prototype status:</strong> MozhiLearn is currently
            in active development and has not been deployed to live schools. No student outcome data,
            school adoption figures, or completion rates are claimed. This prototype demonstrates the
            intended teacher–student workflow for the SIH 2026 evaluation.
          </p>
        </div>
      </div>
    </section>
  )
}
