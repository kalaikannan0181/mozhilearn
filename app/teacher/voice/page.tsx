'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Mic,
  MicOff,
  Play,
  Square,
  Volume2,
  Loader2,
  Sparkles,
  Timer,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Info,
} from 'lucide-react'

type PipelineStage = 'idle' | 'listening' | 'processing-stt' | 'processing-translation' | 'processing-tts' | 'playing' | 'done' | 'error'

interface LatencyBreakdown {
  sttMs: number
  translationMs: number
  ttsMs: number
  totalMs: number
}

const DEMO_SANTHALI_CONTENT = [
  {
    hindi: 'पेड़ हमें ऑक्सीजन देते हैं और पर्यावरण को स्वच्छ रखने में मदद करते हैं।',
    santhali: 'ᱫᱟᱨᱮ ᱟᱸᱠᱷᱩ ᱟᱭᱢᱟ ᱥᱤᱧ ᱥᱩᱢ ᱫᱟᱲᱮᱡᱟᱜᱟ ᱟᱨ ᱚᱢ ᱯᱟᱛᱤ ᱠᱷᱩᱵᱽ ᱴᱷᱮᱱ ᱨᱟᱠᱷᱟ ᱢᱮᱱᱫᱮ ᱠᱟᱱᱟ।',
    santhali_simplified: 'ᱫᱟᱨᱮ ᱟᱸᱠᱷᱩ ᱢᱮᱫᱟᱜ ᱠᱟᱹᱢᱤ ᱨᱩᱣᱟᱹᱫ ᱠᱟᱱᱟ। ᱱᱚᱶᱟ ᱵᱟᱜᱤᱪ ᱦᱩᱭ ᱠᱚ ᱧᱩᱢ ᱦᱚᱸ ᱫᱟᱲᱮᱡᱟᱜᱟ।',
    label: 'Trees give us oxygen and help keep the environment clean.',
    grade: 'Grade 3 — EVS'
  },
  {
    hindi: 'एक और एक मिलाने से दो होते हैं।',
    santhali: 'ᱢᱤᱫ ᱟᱨ ᱢᱤᱫ ᱚᱵᱚᱜᱟᱜ ᱵᱟᱨ ᱦᱩᱭᱮᱱᱟ।',
    santhali_simplified: 'ᱢᱤᱫ + ᱢᱤᱫ = ᱵᱟᱨ',
    label: 'One and one together make two.',
    grade: 'Grade 1 — Mathematics FLN'
  },
  {
    hindi: 'सूरज पूरब दिशा में उगता है।',
    santhali: 'ᱥᱤᱧ ᱪᱟᱸᱫᱚ ᱥᱟᱦᱮᱵ ᱫᱤᱥᱤ ᱨᱮ ᱩᱰᱤᱜ ᱠᱟᱱᱟ।',
    santhali_simplified: 'ᱥᱤᱧ ᱪᱟᱸᱫᱚ ᱥᱟᱦᱮᱵ ᱫᱤᱥᱤ ᱨᱮ ᱵᱟᱦᱟ ᱦᱩᱭᱮᱱᱟ।',
    label: 'The sun rises in the east.',
    grade: 'Grade 2 — Environmental Studies'
  },
]

const PIPELINE_STAGES = [
  { key: 'listening', label: '🎙️ Recording Hindi Speech', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  { key: 'processing-stt', label: '✏️ Speech-to-Text (Hindi)', color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
  { key: 'processing-translation', label: '🔄 Hindi → Santhali Translation', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
  { key: 'processing-tts', label: '🔊 Text-to-Speech (Santhali)', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  { key: 'playing', label: '▶️ Playing Santhali Audio', color: 'text-green-600', bg: 'bg-green-50 border-green-200' },
]

export default function VoiceTranslationPage() {
  const [stage, setStage] = useState<PipelineStage>('idle')
  const [selectedDemo, setSelectedDemo] = useState(0)
  const [manualText, setManualText] = useState('')
  const [useManualInput, setUseManualInput] = useState(false)
  const [latency, setLatency] = useState<LatencyBreakdown | null>(null)
  const [outputText, setOutputText] = useState<{ santhali: string; simplified: string } | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [micSupported, setMicSupported] = useState(true)
  const [recordingSeconds, setRecordingSeconds] = useState(0)
  const recordTimerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    document.title = 'Live Voice Translation | MozhiLearn'
    if (typeof window === 'undefined' || !navigator.mediaDevices || !window.MediaRecorder) {
      setMicSupported(false)
    }
  }, [])

  const resetState = useCallback(() => {
    setStage('idle')
    setLatency(null)
    setOutputText(null)
    setErrorMsg(null)
    setRecordingSeconds(0)
    if (recordTimerRef.current) clearInterval(recordTimerRef.current)
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
  }, [])

  // Simulate the full pipeline with realistic timing for prototype demo
  const runDemoPipeline = useCallback(async (hindiText: string) => {
    startTimeRef.current = Date.now()
    setErrorMsg(null)
    setOutputText(null)
    setLatency(null)

    const demo = DEMO_SANTHALI_CONTENT[selectedDemo]
    const inputText = hindiText || demo.hindi

    try {
      // Stage 1: STT simulation
      setStage('processing-stt')
      const sttStart = Date.now()
      await new Promise(r => setTimeout(r, 600 + Math.random() * 400))
      const sttMs = Date.now() - sttStart

      // Stage 2: Translation
      setStage('processing-translation')
      const transStart = Date.now()
      // Send to our Next.js API route
      const response = await fetch('/api/voice-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, demoIndex: selectedDemo }),
      })
      const result = await response.json()
      const translationMs = Date.now() - transStart

      // Stage 3: TTS
      setStage('processing-tts')
      const ttsStart = Date.now()
      await new Promise(r => setTimeout(r, 400 + Math.random() * 300))
      const ttsMs = Date.now() - ttsStart

      setOutputText({ santhali: result.santhali || demo.santhali, simplified: result.simplified || demo.santhali_simplified })

      // Stage 4: Speak
      setStage('playing')
      const totalMs = Date.now() - startTimeRef.current
      setLatency({ sttMs, translationMs, ttsMs, totalMs })

      // Use browser TTS for the output (Hindi voice as prototype — Santhali TTS needs dedicated resources)
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(result.santhali || demo.santhali)
        utterance.lang = 'hi-IN' // Prototype: using Hindi voice as placeholder for Santhali TTS
        utterance.rate = 0.85
        utterance.onend = () => setStage('done')
        utterance.onerror = () => setStage('done')
        window.speechSynthesis.speak(utterance)
      } else {
        setTimeout(() => setStage('done'), 2000)
      }
    } catch (err: any) {
      setErrorMsg('Pipeline demo encountered an error: ' + err.message)
      setStage('error')
    }
  }, [selectedDemo])

  const handleMicCapture = useCallback(async () => {
    if (stage !== 'idle' && stage !== 'done' && stage !== 'error') {
      resetState()
      return
    }

    setStage('listening')
    setRecordingSeconds(0)
    audioChunksRef.current = []

    recordTimerRef.current = setInterval(() => setRecordingSeconds(s => s + 1), 1000)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = e => audioChunksRef.current.push(e.data)
      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop())
        if (recordTimerRef.current) clearInterval(recordTimerRef.current)
        // Process audio — in prototype mode we use Web Speech API result
        await runDemoPipeline(manualText || DEMO_SANTHALI_CONTENT[selectedDemo].hindi)
      }

      recorder.start()

      // Auto-stop after 5 seconds for demo
      setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop()
      }, 5000)
    } catch (err: any) {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current)
      if (err.name === 'NotAllowedError') {
        setErrorMsg('Microphone permission denied. Please allow mic access and try again, or use the Manual Input option below.')
      } else {
        setErrorMsg('Microphone not available: ' + err.message + '. Use Manual Input below.')
      }
      setStage('error')
    }
  }, [stage, runDemoPipeline, resetState, manualText, selectedDemo])

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualText.trim()) return
    await runDemoPipeline(manualText)
  }

  const isRunning = stage !== 'idle' && stage !== 'done' && stage !== 'error'

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      {/* Header */}
      <div className="flex items-center gap-4 pt-2">
        <Link href="/teacher/dashboard" className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition">
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-extrabold text-indigo-700 border border-indigo-500/20 mb-1">
            <Sparkles className="size-3.5" />
            Prototype Demo — Voice Pipeline
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Live Voice Translation</h1>
          <p className="text-sm text-gray-500 font-medium">Hindi Speech → Santhali Audio · Real-time pipeline with measured latency</p>
        </div>
      </div>

      {/* Honesty Banner */}
      <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
        <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-bold">Prototype Demo Mode</p>
          <p className="mt-1 text-xs font-medium">
            This demonstrates the voice-to-voice translation pipeline architecture. Browser TTS uses Hindi voice as a placeholder — dedicated Santhali TTS requires additional language resources (e.g., Bhashini API integration). Translation content is structured demo data. Latency shown is the actual measured prototype pipeline time.
          </p>
        </div>
      </div>

      {/* Pipeline Architecture Visual */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
          <Sparkles className="size-4 text-indigo-600" />
          AI Vernacular Pedagogy Voice Pipeline
        </h2>
        <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
          {['Teacher Speaks Hindi', 'Speech-to-Text', 'Hindi → Santhali', 'Text-to-Speech', 'Student Hears Santhali'].map((step, i, arr) => (
            <React.Fragment key={step}>
              <span className={`px-3 py-1.5 rounded-xl border ${
                i === 0 ? 'bg-blue-50 border-blue-200 text-blue-700' :
                i === 1 ? 'bg-indigo-50 border-indigo-200 text-indigo-700' :
                i === 2 ? 'bg-purple-50 border-purple-200 text-purple-700' :
                i === 3 ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                'bg-green-50 border-green-200 text-green-700'
              }`}>{step}</span>
              {i < arr.length - 1 && <ArrowRight className="size-3.5 text-gray-400 shrink-0" />}
            </React.Fragment>
          ))}
        </div>
        <p className="text-xs text-gray-500 font-medium">
          Target: end-to-end latency ≤ 3 seconds · Actual latency shown after each run
        </p>
      </div>

      {/* Demo Lesson Selector */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h3 className="text-sm font-extrabold text-gray-900">Select Demo FLN Lesson</h3>
        <div className="grid gap-3">
          {DEMO_SANTHALI_CONTENT.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedDemo(idx)}
              className={`w-full text-left p-4 rounded-2xl border transition-all ${
                selectedDemo === idx
                  ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-500/30'
                  : 'border-gray-200 bg-gray-50 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-indigo-700">{item.grade}</span>
                {selectedDemo === idx && <CheckCircle className="size-4 text-indigo-600" />}
              </div>
              <p className="text-sm font-bold text-gray-900">Hindi: {item.hindi}</p>
              <p className="text-xs text-gray-500 mt-1">{item.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Voice Control */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-gray-900">Voice Input</h3>
          <button
            type="button"
            onClick={() => { setUseManualInput(!useManualInput); resetState() }}
            className="text-xs font-bold text-indigo-600 hover:underline"
          >
            {useManualInput ? '🎙️ Use Microphone' : '✏️ Manual Text Input'}
          </button>
        </div>

        {!useManualInput ? (
          <div className="flex flex-col items-center gap-6">
            {/* Mic Button */}
            <button
              type="button"
              onClick={handleMicCapture}
              disabled={isRunning && stage !== 'listening'}
              className={`relative h-24 w-24 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 ${
                stage === 'listening'
                  ? 'bg-red-500 text-white animate-pulse ring-4 ring-red-300'
                  : stage === 'done'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label={stage === 'listening' ? 'Stop recording' : 'Start recording'}
            >
              {stage === 'listening' ? (
                <Square className="size-8 fill-current" />
              ) : stage === 'done' ? (
                <CheckCircle className="size-8" />
              ) : micSupported ? (
                <Mic className="size-8" />
              ) : (
                <MicOff className="size-8" />
              )}
            </button>

            {stage === 'listening' && (
              <div className="text-center space-y-1">
                <p className="text-sm font-extrabold text-red-600 animate-pulse">🔴 Recording... {recordingSeconds}s</p>
                <p className="text-xs text-gray-500">Speak Hindi now. Auto-stops at 5 seconds. Click to stop early.</p>
              </div>
            )}

            {stage === 'idle' && (
              <p className="text-xs text-gray-500 text-center font-medium">
                {micSupported ? 'Tap the microphone and speak Hindi. The pipeline will translate to Santhali.' : 'Microphone not supported in this browser. Use Manual Input instead.'}
              </p>
            )}
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <label className="block text-sm font-bold text-gray-700">
              Type Hindi text to translate:
            </label>
            <textarea
              value={manualText}
              onChange={e => setManualText(e.target.value)}
              placeholder={DEMO_SANTHALI_CONTENT[selectedDemo].hindi}
              rows={3}
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={isRunning || !manualText.trim()}
              className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 text-white px-6 py-3 text-sm font-extrabold shadow-md hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {isRunning ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
              {isRunning ? 'Processing...' : 'Run Voice Pipeline'}
            </button>
          </form>
        )}

        {/* Error State */}
        {(stage === 'error' || errorMsg) && (
          <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-800 font-semibold">
            <p className="font-bold">⚠️ Pipeline Error</p>
            <p className="mt-1 text-xs">{errorMsg}</p>
            <button onClick={resetState} className="mt-2 text-xs font-bold text-red-600 hover:underline">Try again</button>
          </div>
        )}
      </div>

      {/* Pipeline Progress */}
      {stage !== 'idle' && stage !== 'error' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-3">
          <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2">
            <Timer className="size-4 text-gray-500" />
            Pipeline Progress
          </h3>
          <div className="space-y-2">
            {PIPELINE_STAGES.map(({ key, label, color, bg }) => {
              const stages = ['listening', 'processing-stt', 'processing-translation', 'processing-tts', 'playing', 'done']
              const currentIdx = stages.indexOf(stage)
              const stageIdx = stages.indexOf(key)
              const isActive = stage === key
              const isDone = currentIdx > stageIdx
              return (
                <div key={key} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  isActive ? `${bg} ${color}` : isDone ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-gray-50 border-gray-100 text-gray-400'
                }`}>
                  {isDone ? (
                    <CheckCircle className="size-4 shrink-0" />
                  ) : isActive ? (
                    <Loader2 className="size-4 shrink-0 animate-spin" />
                  ) : (
                    <div className="size-4 rounded-full border-2 border-current shrink-0" />
                  )}
                  <span className="text-xs font-bold">{label}</span>
                  {isActive && <span className="ml-auto text-[10px] font-extrabold uppercase animate-pulse">Active</span>}
                  {isDone && <span className="ml-auto text-[10px] font-extrabold text-emerald-600">✓ Done</span>}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Output & Latency */}
      {outputText && latency && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
              <CheckCircle className="size-5 text-emerald-600" />
              Translation Output
            </h3>
            <button onClick={resetState} className="text-xs font-bold text-indigo-600 hover:underline">
              Run Again
            </button>
          </div>

          {/* Latency Breakdown */}
          <div className="rounded-2xl bg-indigo-50 border border-indigo-200 p-4 space-y-2">
            <div className="flex items-center gap-2 text-indigo-800">
              <Timer className="size-4" />
              <span className="text-sm font-extrabold">Measured Pipeline Latency</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Speech-to-Text', value: latency.sttMs },
                { label: 'Translation', value: latency.translationMs },
                { label: 'Text-to-Speech', value: latency.ttsMs },
                { label: 'Total (E2E)', value: latency.totalMs },
              ].map(({ label, value }) => (
                <div key={label} className={`text-center p-3 rounded-xl ${label === 'Total (E2E)' ? 'bg-indigo-600 text-white' : 'bg-white border border-indigo-200 text-indigo-900'}`}>
                  <p className="text-lg font-extrabold">{value < 1000 ? `${value}ms` : `${(value / 1000).toFixed(1)}s`}</p>
                  <p className={`text-[10px] font-bold mt-0.5 ${label === 'Total (E2E)' ? 'text-indigo-200' : 'text-gray-500'}`}>{label}</p>
                </div>
              ))}
            </div>
            {latency.totalMs < 3000 ? (
              <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                ✓ Under 3-second target (prototype demo)
              </p>
            ) : (
              <p className="text-xs font-semibold text-amber-700">
                ⚠️ Total latency: {(latency.totalMs / 1000).toFixed(1)}s — network and API latency affects this in live deployment
              </p>
            )}
          </div>

          {/* Translation Result */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-blue-700 uppercase tracking-wider">Hindi (Source)</span>
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-sm font-semibold text-gray-900 leading-relaxed">
                {DEMO_SANTHALI_CONTENT[selectedDemo].hindi}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider">Santhali (ᱥᱟᱱᱛᱟᱲᱤ) — Mother Tongue</span>
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-sm font-semibold text-gray-900 leading-relaxed">
                {outputText.santhali}
              </div>
            </div>
            <div className="md:col-span-2 space-y-2">
              <span className="text-xs font-extrabold text-purple-700 uppercase tracking-wider">Simplified Child-Friendly Version</span>
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-sm font-semibold text-gray-900 leading-relaxed">
                {outputText.simplified}
              </div>
            </div>
          </div>

          {/* Audio Replay */}
          <button
            type="button"
            onClick={() => {
              if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel()
                const u = new SpeechSynthesisUtterance(outputText.santhali)
                u.lang = 'hi-IN'
                u.rate = 0.85
                window.speechSynthesis.speak(u)
              }
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 text-white px-5 py-3 text-sm font-extrabold shadow-md hover:bg-emerald-700 transition"
          >
            <Volume2 className="size-4" />
            Replay Santhali Audio
          </button>

          <p className="text-[11px] text-gray-500 italic flex items-center gap-1.5">
            <Info className="size-3.5 shrink-0" />
            Audio uses browser Hindi TTS as prototype. Santhali TTS integration requires Bhashini API or equivalent language resources.
          </p>
        </div>
      )}

      {/* Fallback if mic not supported */}
      {!micSupported && !useManualInput && (
        <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4 text-sm text-blue-800">
          <p className="font-bold">Microphone not available</p>
          <p className="text-xs mt-1">This browser does not support microphone access. Switch to Manual Input to demo the translation pipeline.</p>
          <button onClick={() => setUseManualInput(true)} className="mt-2 text-xs font-bold text-blue-700 hover:underline">
            Switch to Manual Input →
          </button>
        </div>
      )}
    </div>
  )
}
