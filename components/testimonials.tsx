import { Quote, Star } from 'lucide-react'
import Image from 'next/image'

const testimonials = [
  {
    quote:
      'My Grade 3 students finally answer in their own words. Earlier they copied the textbook, now they explain the water cycle to me in Tamil.',
    tamil: 'குழந்தைகள் இப்போது தாய்மொழியில் சிந்திக்கிறார்கள்.',
    name: 'Lakshmi Sundaram',
    role: 'Primary Teacher, Govt. School, Madurai',
    image: '/images/teacher-1.png',
  },
  {
    quote:
      'Preparing a bilingual worksheet used to take my evening. MozhiLearn does it in under two minutes and the language level is right for the grade.',
    tamil: 'பாடத் தயாரிப்பு நேரம் பெரிதும் குறைந்தது.',
    name: 'Arun Prakash',
    role: 'Science Teacher, Panchayat Union School, Trichy',
    image: '/images/teacher-2.png',
  },
  {
    quote:
      'The audio narration changed everything for our slow readers. They listen, repeat and follow the text together — attendance in reading class went up.',
    tamil: 'ஒலி வாசிப்பு மாணவர்களுக்கு பெரிதும் உதவுகிறது.',
    name: 'Meena Rajendran',
    role: 'Headmistress, Corporation School, Coimbatore',
    image: '/images/teacher-3.png',
  },
]

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-background py-16 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-bold tracking-widest text-primary uppercase">
            Teacher Voices
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight font-bold tracking-tight text-balance text-foreground sm:text-4xl">
            Loved by the teachers who use it every day
          </h2>
        </div>

        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {testimonials.map((item) => (
            <li
              key={item.name}
              className="flex flex-col rounded-3xl border border-border bg-card p-7 shadow-sm transition-shadow hover:shadow-lg"
            >
              <Quote className="size-8 text-accent/70" aria-hidden="true" />
              <blockquote className="mt-4 flex-1 text-base leading-relaxed text-pretty text-foreground">
                {item.quote}
              </blockquote>
              <p className="font-tamil mt-4 text-sm leading-relaxed text-muted-foreground">
                {item.tamil}
              </p>
              <div className="mt-6 flex items-center gap-4 border-t border-border pt-6">
                <Image
                  src={item.image}
                  alt={`Portrait of ${item.name}`}
                  width={96}
                  height={96}
                  sizes="56px"
                  className="size-14 shrink-0 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="font-display text-sm font-bold text-foreground">
                    {item.name}
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {item.role}
                  </p>
                  <div
                    className="mt-1 flex gap-0.5"
                    role="img"
                    aria-label="Rated 5 out of 5"
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className="size-3.5 fill-accent text-accent"
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
