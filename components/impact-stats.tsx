import { BookOpenText, Sparkles } from 'lucide-react'

/**
 * Replaces the fake impact statistics (500+ lessons, 1,000+ students, 50+ schools)
 * with a deep-blue mission band containing the product's real purpose statement.
 */
export function MissionBand() {
  return (
    <section id="mission" className="bg-primary py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          {/* Left: mission text */}
          <div>
            <p className="text-sm font-bold tracking-widest text-accent uppercase">
              Our Mission
            </p>
            <h2 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-balance text-primary-foreground sm:text-4xl">
              Learning in Every Child&apos;s Mother Tongue
            </h2>
            <p className="mt-3 text-xl font-semibold text-primary-foreground/75">
              सीखना हर बच्चे की भाषा में
            </p>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-pretty text-primary-foreground/75">
              No child should struggle with a concept because it was explained
              in a language they don&apos;t speak at home. MozhiLearn exists to
              close that gap — one lesson at a time.
            </p>
          </div>

          {/* Right: build context */}
          <div className="flex flex-col gap-5">
            {[
              {
                label: 'Built for',
                value: 'Smart India Hackathon 2026',
                sub: 'Problem Statement SIH26042',
              },
              {
                label: 'Team',
                value: 'MozhiTech',
                sub: 'Nandha Engineering College, Erode',
              },
              {
                label: 'Focus area',
                value: 'Smart Education',
                sub: 'AI-Powered Vernacular Pedagogy',
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-3xl border border-primary-foreground/15 bg-primary-foreground/8 px-6 py-5"
              >
                <p className="text-xs font-bold tracking-widest text-primary-foreground/50 uppercase">
                  {item.label}
                </p>
                <p className="mt-1 font-display text-lg font-bold text-primary-foreground">
                  {item.value}
                </p>
                <p className="mt-0.5 text-sm text-primary-foreground/60">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
