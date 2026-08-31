'use client'

import { ArrowRight, BarChart3, BookOpen, GraduationCap, Headphones, Languages } from 'lucide-react'

/* ─── Static mock screen previews ─────────────────────────────────────────── */

function TeacherCreatorMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-md" aria-hidden="true">
      <div className="flex items-center gap-1.5 bg-primary px-4 py-2.5">
        <Languages className="size-4 text-primary-foreground/80" />
        <span className="text-xs font-bold text-primary-foreground">Lesson Creator</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="rounded-xl border border-border bg-secondary/40 p-3">
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Hindi Input</p>
          <p className="mt-1 text-xs text-foreground leading-relaxed">&quot;पौधों को बढ़ने के लिए धूप, पानी और मिट्टी चाहिए। जड़ें पानी सोखती हैं...&quot;</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] font-bold text-accent">AI Processing &amp; Review</span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="rounded-xl border border-success/20 bg-success/6 p-3">
          <p className="text-[11px] font-semibold text-success uppercase tracking-wide">Santhali Output · Grade 3</p>
          <p className="mt-1 text-xs text-foreground leading-relaxed">दरयाः हाराअ लागित् सितुं, दः आर हासा ल़ड़क्-आ। रेहेत् दः ए सोबोच्-आ...</p>
        </div>
        <button className="w-full rounded-xl bg-accent py-2 text-xs font-bold text-accent-foreground" tabIndex={-1}>
          Review &amp; Publish →
        </button>
      </div>
    </div>
  )
}

function StudentLessonMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-md" aria-hidden="true">
      <div className="flex items-center gap-1.5 bg-success px-4 py-2.5">
        <BookOpen className="size-4 text-success-foreground/80" />
        <span className="text-xs font-bold text-success-foreground">Student Lesson View</span>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Environmental Studies · Grade 3</p>
          <h4 className="font-display font-bold text-sm text-foreground mt-0.5">Plants &amp; Sunlight</h4>
          <p className="text-[11px] font-semibold text-primary mt-0.5">दरयाः आर सितुं</p>
        </div>
        <div className="rounded-xl bg-secondary/40 p-3">
          <p className="text-xs leading-relaxed text-foreground">
            दरयाः हाराअ लागित् सितुं ल़ड़क्-आ। साकाम सितुं जमगाक् रेयाक् बदलाव-आ।
          </p>
        </div>
        <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-success/25 bg-success/8 py-2 text-xs font-bold text-success" tabIndex={-1}>
          <Headphones className="size-3.5" />
          Listen in Santhali
        </button>
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-border overflow-hidden">
            <div className="h-full w-3/5 rounded-full bg-primary" />
          </div>
          <span className="text-[10px] font-semibold text-muted-foreground">60%</span>
        </div>
      </div>
    </div>
  )
}

function ProgressMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-md" aria-hidden="true">
      <div className="flex items-center gap-1.5 bg-foreground px-4 py-2.5">
        <BarChart3 className="size-4 text-background/80" />
        <span className="text-xs font-bold text-background">Progress Insights</span>
      </div>
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Lessons', val: '6', tone: 'text-primary bg-primary/8' },
            { label: 'Students', val: '18', tone: 'text-success bg-success/8' },
          ].map((s) => (
            <div key={s.label} className={`rounded-2xl p-3 ${s.tone}`}>
              <p className="text-[10px] font-semibold opacity-70">{s.label}</p>
              <p className="text-lg font-extrabold">{s.val}</p>
            </div>
          ))}
        </div>
        {[
          { name: 'Saran M.', score: 85, color: 'bg-success' },
          { name: 'Ranchi K.', score: 62, color: 'bg-accent' },
          { name: 'Priya S.', score: 44, color: 'bg-destructive/50' },
        ].map((s) => (
          <div key={s.name} className="flex items-center gap-3">
            <div className="size-6 rounded-full bg-secondary flex items-center justify-center text-[9px] font-bold text-foreground shrink-0">
              {s.name[0]}
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-[10px] font-semibold text-foreground">{s.name}</span>
                <span className="text-[10px] font-bold text-muted-foreground">{s.score}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-border overflow-hidden">
                <div className={`h-full rounded-full ${s.color}`} style={{ width: `${s.score}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const screens = [
  { label: 'Teacher Lesson Creator', component: TeacherCreatorMock },
  { label: 'Student Santhali Lesson', component: StudentLessonMock },
  { label: 'Progress Insights', component: ProgressMock },
]

export function DemoSection() {
  return (
    <section id="demo" className="bg-foreground py-16 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold tracking-widest text-accent uppercase">
            Prototype Workflow Preview
          </p>
          <h2 className="mt-3 font-display text-3xl leading-tight font-bold tracking-tight text-balance text-background sm:text-4xl">
            See the Learning Flow
          </h2>
          <p className="mt-4 text-base leading-relaxed text-pretty text-background/70">
            Three static screens showing how a lesson travels from the teacher&apos;s
            Hindi input to a student&apos;s Santhali reading experience.
          </p>
        </div>

        {/* 3-screen mock grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {screens.map(({ label, component: MockComponent }) => (
            <div key={label} className="flex flex-col gap-3">
              <MockComponent />
              <p className="text-center text-xs font-semibold text-background/60">{label}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="#features"
            className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border-2 border-accent bg-accent px-8 text-base font-semibold text-accent-foreground shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-accent/50"
          >
            Explore the Learning Flow
            <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </a>
          <p className="mt-4 text-sm text-background/50">
            Static prototype screens — actual data is loaded from Supabase when signed in.
          </p>
        </div>
      </div>
    </section>
  )
}
