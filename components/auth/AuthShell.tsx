import { BookOpenText, GraduationCap, Languages, Sparkles, Volume2 } from 'lucide-react'
import Link from 'next/link'

/* ─── Left hero pane: educational visual ─────────────────────────────────── */
function AuthHeroPill({ icon: Icon, label }: { icon: typeof Languages; label: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/8 px-4 py-3">
      <span className="flex size-8 items-center justify-center rounded-xl bg-primary-foreground/15">
        <Icon className="size-4 text-primary-foreground/80" aria-hidden="true" />
      </span>
      <span className="text-sm font-semibold text-primary-foreground/80">{label}</span>
    </div>
  )
}

export function AuthShell({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode
  title: string
  subtitle: string
}) {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-background px-4 py-8 sm:px-6">
      {/* Subtle background tint */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#EFF6FF] via-background to-[#FFFBEB]"
      />

      <div className="relative mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
        {/* ── Left hero pane (desktop only) ─── */}
        <div className="hidden flex-col justify-between overflow-hidden rounded-4xl bg-primary bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px] p-10 lg:flex relative">
          {/* Top: Tamil text + headline */}
          <div>
            <p className="font-tamil text-2xl font-semibold text-primary-foreground/75">
              கற்றல் அனைவருக்கும்
            </p>
            <h1 className="mt-4 font-display text-4xl font-extrabold leading-tight text-primary-foreground">
              Learning feels closer in the language children know best.
            </h1>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-primary-foreground/75">
              MozhiLearn supports teacher-guided mother-tongue learning for primary education.
            </p>
          </div>

          {/* Middle: feature pills */}
          <div className="my-8 flex flex-col gap-3">
            <AuthHeroPill icon={Languages} label="English → Tamil lesson translation" />
            <AuthHeroPill icon={Volume2} label="Tamil audio narration" />
            <AuthHeroPill icon={GraduationCap} label="Teacher-reviewed content" />
          </div>

          {/* Bottom: SIH tag */}
          <p className="text-xs font-semibold text-primary-foreground/40">
            Smart India Hackathon 2026 · SIH26042
          </p>
        </div>

        {/* ── Right: form card ─── */}
        <section className="rounded-3xl border border-border bg-card/95 p-6 shadow-xl sm:p-10">
          {/* Logo link */}
          <Link
            href="/"
            className="flex w-fit items-center gap-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="relative flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <BookOpenText className="size-5" aria-hidden="true" />
              <Sparkles
                className="absolute -top-1 -right-1 size-4 text-accent"
                aria-hidden="true"
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-lg font-bold text-foreground">
                MozhiLearn
              </span>
              <span className="font-tamil text-[11px] text-muted-foreground">
                மொழி கற்றல்
              </span>
            </span>
          </Link>

          {/* Title */}
          <div className="mt-8">
            <h2 className="font-display text-3xl font-extrabold text-foreground">
              {title}
            </h2>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          </div>

          {/* Slot for form content */}
          <div className="mt-7">{children}</div>

          {/* Back link */}
          <Link
            href="/"
            className="mt-7 block text-center text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            ← Back to Home
          </Link>
        </section>
      </div>
    </main>
  )
}

export function Message({
  children,
  error = false,
}: {
  children: React.ReactNode
  error?: boolean
}) {
  return (
    <div
      role={error ? 'alert' : 'status'}
      className={`rounded-xl border p-3 text-sm ${
        error
          ? 'border-destructive/20 bg-destructive/8 text-destructive'
          : 'border-success/20 bg-success/8 text-success'
      }`}
    >
      {children}
    </div>
  )
}

export const inputClass =
  'mt-2 min-h-12 w-full rounded-xl border border-input bg-background px-4 text-foreground outline-none transition focus:border-primary focus:ring-3 focus:ring-primary/15'