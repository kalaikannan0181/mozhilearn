'use client'

import React from 'react'
import {
  SUPPORTED_LANGUAGES,
  SupportedLanguageCode,
  LanguageOption,
} from '@/config/languages'
import { Languages, Check, Mic, Download, Sparkles } from 'lucide-react'

interface LanguageSelectorProps {
  value: SupportedLanguageCode
  onChange: (code: SupportedLanguageCode) => void
  label?: string
  showSourceSelector?: boolean
  sourceValue?: SupportedLanguageCode
  onSourceChange?: (code: SupportedLanguageCode) => void
  className?: string
  compact?: boolean
}

export function LanguageSelector({
  value,
  onChange,
  label = 'Teach In:',
  showSourceSelector = false,
  sourceValue = 'hi',
  onSourceChange,
  className = '',
  compact = false,
}: LanguageSelectorProps) {
  const targetLanguages = SUPPORTED_LANGUAGES.filter((l) => l.code !== 'hi')
  const currentTarget = SUPPORTED_LANGUAGES.find((l) => l.code === value) || targetLanguages[0]

  const getStatusBadge = (status: LanguageOption['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        )
      case 'beta':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <Sparkles className="h-3 w-3" />
            Beta
          </span>
        )
      case 'coming_soon':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/10 px-2 py-0.5 text-xs font-semibold text-slate-500">
            Coming Soon
          </span>
        )
    }
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Languages className="h-4 w-4 text-muted-foreground" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SupportedLanguageCode)}
          className="rounded-xl border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          {targetLanguages.map((lang) => (
            <option key={lang.code} value={lang.code} disabled={!lang.enabled}>
              {lang.nativeName} ({lang.name}) {lang.status === 'beta' ? '[Beta]' : ''}
            </option>
          ))}
        </select>
      </div>
    )
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {showSourceSelector && (
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-1.5 shadow-sm">
          <span className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Source:
          </span>
          <div className="flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
            <span>हिन्दी</span>
            <span className="text-xs font-normal text-muted-foreground">(Hindi)</span>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 rounded-2xl border border-border bg-card p-1.5 shadow-sm">
        {label && (
          <span className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
        )}
        <div className="flex items-center gap-1.5">
          {targetLanguages.map((lang) => {
            const isSelected = value === lang.code
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => onChange(lang.code)}
                disabled={!lang.enabled}
                className={`relative flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  isSelected
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <span>{lang.nativeName}</span>
                <span className={`text-xs ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                  ({lang.name})
                </span>
                {lang.status === 'beta' && (
                  <span
                    className={`rounded px-1 text-[10px] uppercase tracking-wider font-extrabold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    BETA
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {currentTarget && (
        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground pl-1">
          {getStatusBadge(currentTarget.status)}
          <span className="flex items-center gap-1">
            <Mic className={`h-3.5 w-3.5 ${currentTarget.voiceAvailable ? 'text-emerald-500' : 'text-slate-400'}`} />
            {currentTarget.voiceAvailable ? 'Voice Enabled' : 'Voice (Beta/Text Preview)'}
          </span>
          <span className="flex items-center gap-1">
            <Download className={`h-3.5 w-3.5 ${currentTarget.offlinePackAvailable ? 'text-emerald-500' : 'text-slate-400'}`} />
            {currentTarget.offlinePackAvailable ? 'Offline Ready' : 'Online Draft'}
          </span>
        </div>
      )}
    </div>
  )
}
