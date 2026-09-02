import React from 'react'
import Link from 'next/link'
import { 
  BookOpen, 
  Sparkles, 
  Database, 
  ShieldCheck, 
  Info, 
  CheckCircle2, 
  Cpu, 
  Award, 
  Download, 
  Volume2, 
  ArrowLeft,
  ArrowRight
} from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'

export const metadata = {
  title: 'About MozhiLearn | SIH 2026',
  description: 'AI-powered multilingual teaching and learning platform for mother tongue-based primary education in India.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SiteNav />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        {/* Header Hero */}
        <div className="rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-secondary/40 to-background p-8 sm:p-12 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-extrabold text-primary">
            <Sparkles className="h-4 w-4 text-amber-500" />
            Smart India Hackathon 2026 — SIH26042
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            About MozhiLearn
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground font-semibold leading-relaxed">
            MozhiLearn is an AI-powered multilingual teaching and learning platform designed for mother tongue-based primary education in India.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 bg-card border border-border px-3 py-1.5 rounded-full shadow-xs">
              <Award className="h-4 w-4 text-primary" /> Team: <strong>MozhiTech</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 bg-card border border-border px-3 py-1.5 rounded-full shadow-xs">
              <BookOpen className="h-4 w-4 text-emerald-600" /> Institution: <strong>Nandha Engineering College, Erode</strong>
            </span>
          </div>
        </div>

        {/* Feature 3: Verified Reference Dataset */}
        <section className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-6">
          <div className="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-emerald-600">
                <Database className="h-4 w-4" /> Feature 3
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Verified Reference Dataset
              </h2>
            </div>
            <div className="group relative inline-flex items-center gap-1.5 rounded-full bg-secondary/80 px-3.5 py-1.5 text-xs font-bold text-muted-foreground cursor-help border border-border">
              <Info className="h-4 w-4 text-primary" />
              <span>Dataset Info</span>
              <div className="absolute right-0 top-8 z-20 hidden w-72 rounded-2xl border border-border bg-popover p-3 text-xs text-popover-foreground shadow-lg group-hover:block">
                Content accuracy depends on validated resources and teacher review.
              </div>
            </div>
          </div>

          <p className="text-base text-muted-foreground font-medium leading-relaxed">
            Built from government textbooks, NIPUN Bharat materials, tribal-language books, dictionaries, and public research sets.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-foreground">
                Language accuracy validated through native speakers or community experts
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm font-semibold text-foreground">
                Dataset improves over time with more validated content
              </p>
            </div>
          </div>
        </section>

        {/* Feature 4 & Feature 2 Overview */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* AI + Human Validation */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-primary">
              <ShieldCheck className="h-4 w-4" /> Feature 4
            </div>
            <h3 className="text-xl font-extrabold text-foreground">
              AI + Human Validation
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground font-medium">
              <li className="flex items-start gap-2">
                <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <span>AI assists translation and lesson adaptation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <span>Teachers review educational quality and age-appropriateness</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                <span>Native speakers or language experts validate language accuracy</span>
              </li>
            </ul>
          </div>

          {/* Voice-to-Voice Pipeline */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-indigo-600">
              <Volume2 className="h-4 w-4" /> Feature 2
            </div>
            <h3 className="text-xl font-extrabold text-foreground">
              Voice-to-Voice Translation Pipeline
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground font-semibold">
              <li className="rounded-xl bg-secondary/50 p-2.5">1. Teacher speaks Hindi</li>
              <li className="rounded-xl bg-secondary/50 p-2.5">2. Speech-to-Text converts to Hindi text</li>
              <li className="rounded-xl bg-secondary/50 p-2.5">3. AI translates Hindi → selected mother tongue (e.g., Santhali)</li>
              <li className="rounded-xl bg-secondary/50 p-2.5">4. Text-to-Speech generates audio in the student’s language</li>
            </ul>
            <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-500/10 p-3 rounded-2xl border border-amber-500/20 font-medium">
              Note: Voice-to-voice translation is a prototype workflow. Full implementation requires validated speech and translation resources.
            </p>
          </div>
        </div>

        {/* Feature 9: Future AI Features (Planned) */}
        <section className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-purple-600">
              <Cpu className="h-4 w-4" /> Feature 9
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Future AI Features (Planned)
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              'Real-time voice translation (when technically feasible)',
              'On-device speech and translation models for full offline support',
              'Pronunciation assessment for speaking practice',
              'Teacher analytics dashboard',
              'Expansion to additional languages (e.g., Ho, Mundari, and other Indian languages)'
            ].map((item, idx) => (
              <div key={idx} className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 text-sm font-semibold text-foreground flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground bg-secondary/60 p-4 rounded-2xl border border-border font-medium">
            These features are planned for future development and depend on validated resources and technical feasibility.
          </p>
        </section>

        {/* Feature 6 PWA Note */}
        <section className="rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8 space-y-3">
          <div className="flex items-center gap-2 text-sm font-extrabold text-primary">
            <Download className="h-5 w-5" /> Progressive Web App (PWA) Support
          </div>
          <p className="text-sm text-foreground/90 font-medium leading-relaxed">
            MozhiLearn is installable from browser to home screen, works offline after initial setup, and auto-updates content when internet is available.
          </p>
        </section>

        {/* Back navigation */}
        <div className="text-center pt-4">
          <Link href="/" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-extrabold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all">
            <ArrowLeft className="h-4 w-4" /> Return to Home
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
