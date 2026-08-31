import { ArrowRight, BookOpenCheck, Headphones, Users } from 'lucide-react'

/* ─── Inline SVG illustration: language bridge / book motif ─── */
function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 560 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-auto w-full"
    >
      {/* Soft background shapes */}
      <ellipse cx="280" cy="210" rx="240" ry="190" fill="oklch(0.963 0.019 253)" />
      <ellipse cx="420" cy="320" rx="110" ry="80" fill="oklch(0.963 0.019 253 / 0.6)" />

      {/* Open book base */}
      <rect x="110" y="170" width="340" height="180" rx="18" fill="white" stroke="oklch(0.918 0.014 252)" strokeWidth="2" />
      {/* Book spine */}
      <rect x="276" y="170" width="8" height="180" rx="4" fill="oklch(0.918 0.014 252)" />

      {/* Left page: English content lines */}
      <rect x="128" y="196" width="120" height="8" rx="4" fill="oklch(0.476 0.235 264 / 0.18)" />
      <rect x="128" y="212" width="90" height="7" rx="3.5" fill="oklch(0.476 0.235 264 / 0.12)" />
      <rect x="128" y="226" width="105" height="7" rx="3.5" fill="oklch(0.476 0.235 264 / 0.12)" />
      <rect x="128" y="252" width="120" height="7" rx="3.5" fill="oklch(0.476 0.235 264 / 0.10)" />
      <rect x="128" y="266" width="80" height="7" rx="3.5" fill="oklch(0.476 0.235 264 / 0.10)" />
      {/* "EN" label */}
      <rect x="128" y="300" width="36" height="22" rx="8" fill="oklch(0.476 0.235 264 / 0.12)" />
      <text x="146" y="315" textAnchor="middle" fontFamily="system-ui" fontSize="10" fontWeight="700" fill="oklch(0.476 0.235 264)">EN</text>

      {/* Right page: Tamil content lines (wavy to suggest script) */}
      <rect x="292" y="196" width="115" height="8" rx="4" fill="oklch(0.574 0.158 162 / 0.22)" />
      <rect x="292" y="212" width="130" height="7" rx="3.5" fill="oklch(0.574 0.158 162 / 0.15)" />
      <rect x="292" y="226" width="100" height="7" rx="3.5" fill="oklch(0.574 0.158 162 / 0.15)" />
      <rect x="292" y="252" width="125" height="7" rx="3.5" fill="oklch(0.574 0.158 162 / 0.12)" />
      <rect x="292" y="266" width="85" height="7" rx="3.5" fill="oklch(0.574 0.158 162 / 0.12)" />
      {/* "தமிழ்" label */}
      <rect x="292" y="300" width="52" height="22" rx="8" fill="oklch(0.574 0.158 162 / 0.14)" />
      <text x="318" y="315" textAnchor="middle" fontFamily="system-ui" fontSize="9" fontWeight="700" fill="oklch(0.574 0.158 162)">தமிழ்</text>

      {/* Arrow bridge between pages */}
      <path d="M248 240 Q280 220 312 240" stroke="oklch(0.705 0.213 47.6)" strokeWidth="2.5" strokeDasharray="5 3" fill="none" strokeLinecap="round" />
      <polygon points="308,233 316,241 308,249" fill="oklch(0.705 0.213 47.6)" />

      {/* Audio speaker badge */}
      <circle cx="432" cy="188" r="32" fill="oklch(0.574 0.158 162)" />
      <path d="M422 181 L430 181 L438 174 L438 202 L430 195 L422 195 Z" fill="white" />
      <path d="M443 178 Q450 188 443 198" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" />

      {/* Student figure (simplified) */}
      <circle cx="128" cy="118" r="22" fill="oklch(0.705 0.213 47.6 / 0.15)" stroke="oklch(0.705 0.213 47.6)" strokeWidth="2" />
      <circle cx="128" cy="111" r="10" fill="oklch(0.705 0.213 47.6 / 0.4)" />
      <path d="M112 136 Q128 128 144 136 L148 154 L108 154 Z" fill="oklch(0.705 0.213 47.6 / 0.3)" />

      {/* Teacher figure */}
      <circle cx="432" cy="118" r="22" fill="oklch(0.476 0.235 264 / 0.12)" stroke="oklch(0.476 0.235 264)" strokeWidth="2" />
      <circle cx="432" cy="111" r="10" fill="oklch(0.476 0.235 264 / 0.35)" />
      <path d="M416 136 Q432 128 448 136 L452 154 L412 154 Z" fill="oklch(0.476 0.235 264 / 0.25)" />

      {/* Connecting dashed line: teacher → book → student */}
      <path d="M154 140 Q200 155 230 175" stroke="oklch(0.476 0.235 264 / 0.3)" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
      <path d="M406 140 Q380 155 350 175" stroke="oklch(0.574 0.158 162 / 0.3)" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />

      {/* Small quiz/check badge bottom-right */}
      <rect x="340" y="358" width="110" height="40" rx="14" fill="white" stroke="oklch(0.918 0.014 252)" strokeWidth="1.5" />
      <circle cx="358" cy="378" r="8" fill="oklch(0.574 0.158 162 / 0.2)" />
      <path d="M354 378 L357 381 L363 375" stroke="oklch(0.574 0.158 162)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="370" y="372" width="64" height="6" rx="3" fill="oklch(0.574 0.158 162 / 0.2)" />
      <rect x="370" y="382" width="46" height="5" rx="2.5" fill="oklch(0.476 0.235 264 / 0.15)" />
    </svg>
  )
}

const badges = [
  { icon: BookOpenCheck, label: 'Built for Primary Education' },
  { icon: Headphones, label: 'Tamil-first Prototype' },
  { icon: Users, label: 'Teacher-reviewed Learning' },
]

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-[#FFFBEB]">
      {/* Static grid background pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06] -z-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(29, 78, 216, 0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(29, 78, 216, 0.25) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px"
        }}
      />

      {/* Decorative soft glow overlays */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-[#F97316]/10 blur-3xl -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-32 h-[30rem] w-[30rem] rounded-full bg-[#1D4ED8]/10 blur-3xl -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/3 h-[25rem] w-[25rem] rounded-full bg-[#059669]/5 blur-3xl -z-10"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        {/* Left: text */}
        <div className="reveal flex flex-col items-start">
          {/* Tamil label pill */}
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm font-semibold text-primary">
            <span className="font-tamil">தாய்மொழியில் கற்றல்</span>
            <span aria-hidden="true">·</span>
            <span>Grades 1–5</span>
          </p>

          <h1 className="mt-6 font-display text-4xl leading-tight font-extrabold tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
            Every Child Deserves to Learn in Their{' '}
            <span className="text-primary">Mother Tongue</span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-pretty text-muted-foreground">
            MozhiLearn helps teachers create simple, age-appropriate learning
            experiences in the language children understand best.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
            <a
              href="/signup?role=teacher"
              className="group inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-2xl bg-accent px-7 text-base font-semibold text-accent-foreground shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-accent/40"
            >
              I&apos;m a Teacher
              <ArrowRight
                className="size-5 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </a>
            <a
              href="/signup?role=student"
              className="inline-flex min-h-[3.25rem] items-center justify-center gap-2 rounded-2xl border-2 border-primary bg-background px-7 text-base font-semibold text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              I&apos;m a Student
            </a>
          </div>

          {/* Truthful trust badges */}
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

        {/* Right: SVG illustration + translation preview card */}
        <div className="reveal relative">
          <div className="overflow-hidden rounded-4xl border border-border bg-card shadow-xl">
            <HeroIllustration />
          </div>

          {/* Floating translation preview card */}
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
              <Headphones className="size-4" aria-hidden="true" />
              Audio ready
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
