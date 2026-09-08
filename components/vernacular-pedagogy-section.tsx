import React from 'react'
import {
  BookOpen,
  Sparkles,
  Volume2,
  FileText,
  HelpCircle,
  Layers,
  Gamepad2,
  Languages,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type VernacularFeature = {
  title: string
  description: string
  icon: LucideIcon
  badge?: string
}

const features: VernacularFeature[] = [
  {
    title: 'Mother Tongue Learning',
    description: 'Adapts lesson content into the student’s selected familiar language.',
    icon: Languages,
    badge: 'Core Pedagogy',
  },
  {
    title: 'Simple Grade-Level Explanations',
    description: 'Breaks concepts into short, easy explanations suitable for primary-school learners.',
    icon: BookOpen,
    badge: 'Primary Friendly',
  },
  {
    title: 'Story-Based Learning',
    description: 'Turns concepts into short learning stories that help children understand and remember.',
    icon: Sparkles,
    badge: 'Contextual',
  },
  {
    title: 'Audio Learning Support',
    description: 'Lets children listen to lessons and instructions in the selected learning language.',
    icon: Volume2,
    badge: 'Multimodal',
  },
  {
    title: 'Picture Flashcards',
    description: 'Uses images and vocabulary cards to make early learning more visual and memorable.',
    icon: Layers,
    badge: 'Visual Vocab',
  },
  {
    title: 'Interactive Activities',
    description: 'Provides simple matching, counting, sorting, and picture-based learning activities.',
    icon: Gamepad2,
    badge: 'Practice & Play',
  },
  {
    title: 'Worksheets & Practice',
    description: 'Creates teacher-reviewed practice sheets for classroom and home learning.',
    icon: FileText,
    badge: 'Classroom & Home',
  },
  {
    title: 'Quiz & Progress Tracking',
    description: 'Uses short quizzes to help teachers understand student learning progress.',
    icon: HelpCircle,
    badge: 'Assessment',
  },
]

export function VernacularPedagogySection() {
  return (
    <section id="vernacular-pedagogy" className="scroll-mt-20 py-16 md:py-24 bg-card/40 border-y border-border/60">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="mx-auto max-w-3xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-extrabold text-primary border border-primary/20">
            <Sparkles className="size-4 text-amber-500" />
            AI-Powered Vernacular Pedagogy
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground text-balance sm:text-4xl">
            Learning Beyond Translation
          </h2>
          <p className="mt-3 font-semibold text-lg text-muted-foreground leading-relaxed text-pretty">
            MozhiLearn transforms lessons into child-friendly learning experiences using familiar language, stories, audio, pictures, activities, and teacher-guided practice.
          </p>
        </div>

        {/* Feature Cards Grid (8 Cards) */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <article
                key={feature.title}
                className="group relative flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/30"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs transition-transform duration-200 group-hover:scale-110">
                      <Icon className="size-6" aria-hidden="true" />
                    </span>
                    {feature.badge && (
                      <span className="rounded-full bg-secondary/80 px-2.5 py-1 text-[11px] font-extrabold text-muted-foreground border border-border">
                        {feature.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {feature.title}
                  </h3>
                  <p className="font-medium text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/40 flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                  <CheckCircle2 className="size-3.5 shrink-0" />
                  <span>Teacher Guided</span>
                </div>
              </article>
            )
          })}
        </div>

        {/* Mandatory Safe Wording Disclaimer Box */}
        <div className="mx-auto max-w-4xl rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-center text-xs sm:text-sm font-semibold text-amber-900 shadow-xs flex items-center justify-center gap-3">
          <ShieldCheck className="size-6 text-amber-600 shrink-0 hidden sm:block" />
          <p className="leading-relaxed">
            Language availability depends on validated translation and speech resources. AI-assisted content requires teacher review and language-expert validation before classroom use.
          </p>
        </div>
      </div>
    </section>
  )
}
