import { Star } from 'lucide-react'

type Testimonial = {
  quote: string
  name: string
  role: string
  initials: string
  avatarClass: string
}

const testimonials: Testimonial[] = [
  {
    quote:
      'My students actually ask for more Tamil practice now. The games make learning feel like play.',
    name: 'Priya Ramesh',
    role: 'Grade 3 Teacher, Madurai',
    initials: 'PR',
    avatarClass: 'bg-primary text-primary-foreground',
  },
  {
    quote:
      'I love collecting stars when I read stories out loud. Tamil is my favorite class!',
    name: 'Arjun',
    role: 'Student, Age 8',
    initials: 'A',
    avatarClass: 'bg-sky text-sky-foreground',
  },
  {
    quote:
      'The progress dashboard helps me see exactly who needs a little extra help each week.',
    name: 'Lakshmi Nair',
    role: 'Primary Coordinator, Chennai',
    initials: 'LN',
    avatarClass: 'bg-leaf text-leaf-foreground',
  },
]

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="scroll-mt-20 bg-muted/50 py-16 md:py-24"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
            Loved by classrooms everywhere
          </h2>
          <p className="mt-3 font-semibold text-lg text-muted-foreground text-pretty">
            Here&apos;s what teachers and students are saying about MozhiLearn.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex h-full flex-col rounded-3xl border border-border bg-card p-7 shadow-sm"
            >
              <div className="flex gap-1" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-5 fill-accent text-accent"
                  />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 font-semibold text-lg leading-relaxed text-foreground text-pretty">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  className={`flex size-11 items-center justify-center rounded-full font-display font-bold ${t.avatarClass}`}
                  aria-hidden="true"
                >
                  {t.initials}
                </span>
                <span>
                  <span className="block font-bold text-foreground">
                    {t.name}
                  </span>
                  <span className="block text-sm font-medium text-muted-foreground">
                    {t.role}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
