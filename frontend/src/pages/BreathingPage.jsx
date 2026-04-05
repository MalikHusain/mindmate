import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Wind } from 'lucide-react'

const TECHNIQUES = [
  {
    id: 'box', name: 'Box Breathing', desc: 'Equal intervals — calm and balance', emoji: '⬜',
    steps: [
      { label: 'Breathe In', duration: 4, color: 'var(--accent-primary)' },
      { label: 'Hold', duration: 4, color: 'var(--accent-secondary)' },
      { label: 'Breathe Out', duration: 4, color: 'var(--accent-tertiary)' },
      { label: 'Hold', duration: 4, color: 'var(--neutral)' },
    ],
  },
  {
    id: '478', name: '4-7-8 Technique', desc: 'Developed by Dr. Andrew Weil — deep relaxation', emoji: '🌙',
    steps: [
      { label: 'Breathe In', duration: 4, color: 'var(--accent-primary)' },
      { label: 'Hold', duration: 7, color: 'var(--accent-secondary)' },
      { label: 'Breathe Out', duration: 8, color: 'var(--positive)' },
    ],
  },
  {
    id: 'calm', name: 'Calming Breath', desc: 'Extended exhale — activates parasympathetic nervous system', emoji: '🍃',
    steps: [
      { label: 'Breathe In', duration: 4, color: 'var(--accent-primary)' },
      { label: 'Breathe Out', duration: 6, color: 'var(--positive)' },
    ],
  },
]

export default function BreathingPage() {
  const [technique, setTechnique] = useState(TECHNIQUES[0])
  const [playing, setPlaying] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [cycles, setCycles] = useState(0)
  const [totalSeconds, setTotalSeconds] = useState(0)
  const intervalRef = useRef(null)
  const currentStep = technique.steps[stepIndex]

  useEffect(() => {
    return () => clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    if (playing) {
      setTimeLeft(currentStep.duration)
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setStepIndex(si => {
              const next = (si + 1) % technique.steps.length
              if (next === 0) setCycles(c => c + 1)
              return next
            })
            return 0
          }
          return prev - 1
        })
        setTotalSeconds(t => t + 1)
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [playing, stepIndex, technique])

  useEffect(() => {
    if (playing) setTimeLeft(technique.steps[stepIndex].duration)
  }, [stepIndex])

  const togglePlay = () => setPlaying(!playing)
  const reset = () => {
    setPlaying(false)
    setStepIndex(0)
    setTimeLeft(0)
    setCycles(0)
    setTotalSeconds(0)
    clearInterval(intervalRef.current)
  }
  const selectTechnique = (t) => { reset(); setTechnique(t) }

  const isInhale = currentStep?.label === 'Breathe In'
  const isExhale = currentStep?.label === 'Breathe Out'
  const progress = playing ? (currentStep.duration - timeLeft) / currentStep.duration : 0
  let circleScale = 1
  if (playing) {
    if (isInhale) circleScale = 1 + progress * 0.6
    else if (isExhale) circleScale = 1.6 - progress * 0.6
    else circleScale = 1.6
  }

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div className="page-fade-in space-y-8" style={{ width: '100%', overflowX: 'hidden', boxSizing: 'border-box' }}>

      {/* Header */}
      <div className="page-header animate-fade-in-up" style={{ textAlign: 'center', width: '100%' }}>
        <h1 className="font-display gradient-text">Guided Breathing</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Calm your mind with evidence-based breathing exercises</p>
      </div>

      {/* Technique selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 stagger-children">
        {TECHNIQUES.map((t) => {
          const active = technique.id === t.id
          return (
            <button
              key={t.id}
              onClick={() => selectTechnique(t)}
              className="card-hover transition-all rounded-xl"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '1rem 0.75rem',
                width: '100%',
                minWidth: 0,
                overflow: 'hidden',
                background: active ? 'rgba(124,92,252,0.1)' : 'var(--surface-glass)',
                border: `1px solid ${active ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                boxShadow: active ? 'var(--shadow-glow)' : 'none',
              }}
            >
              {/* Emoji */}
              <span className="float-icon" style={{ fontSize: '1.5rem', lineHeight: 1, marginBottom: '0.375rem', display: 'block' }}>
                {t.emoji}
              </span>
              {/* Name — wraps, centered */}
              <span
                className="text-sm font-semibold font-display"
                style={{
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  display: 'block',
                  width: '100%',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere',
                  textAlign: 'center',
                  lineHeight: 1.35,
                  marginBottom: '0.25rem',
                }}
              >
                {t.name}
              </span>
              {/* Desc — wraps, centered */}
              <p
                className="text-xs"
                style={{
                  color: 'var(--text-muted)',
                  width: '100%',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  overflowWrap: 'anywhere',
                  textAlign: 'center',
                  lineHeight: 1.45,
                  margin: 0,
                }}
              >
                {t.desc}
              </p>
            </button>
          )
        })}
      </div>

      {/* Breathing visualizer */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }} className="animate-scale-in">
        <div
          className="relative flex items-center justify-center mb-8"
          style={{ width: 220, height: 220, flexShrink: 0 }}
        >
          {/* Blur halo */}
          <div
            className="absolute rounded-full transition-all duration-1000 ease-in-out"
            style={{
              width: `${circleScale * 140}px`,
              height: `${circleScale * 140}px`,
              background: `radial-gradient(circle, ${currentStep?.color || 'var(--accent-primary)'}30 0%, transparent 70%)`,
              filter: 'blur(20px)',
              animation: playing ? 'gentlePulse 2s ease-in-out infinite' : 'none',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          {/* Middle ring */}
          <div
            className="absolute rounded-full transition-all duration-1000 ease-in-out"
            style={{
              width: `${circleScale * 120}px`,
              height: `${circleScale * 120}px`,
              border: `2px solid ${currentStep?.color || 'var(--accent-primary)'}40`,
              animation: playing ? 'slowSpin 12s linear infinite' : 'none',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          {/* Inner circle */}
          <div
            className="absolute rounded-full transition-all duration-1000 ease-in-out flex items-center justify-center"
            style={{
              width: `${circleScale * 100}px`,
              height: `${circleScale * 100}px`,
              background: `radial-gradient(circle, ${currentStep?.color || 'var(--accent-primary)'}20 0%, ${currentStep?.color || 'var(--accent-primary)'}08 100%)`,
              border: `2px solid ${currentStep?.color || 'var(--accent-primary)'}50`,
              animation: playing ? 'softBounce 2s ease-in-out infinite' : 'none',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {playing ? (
              <span className="text-3xl font-bold font-display transition-all duration-300" style={{ color: currentStep?.color }}>
                {timeLeft}
              </span>
            ) : (
              <Wind className="w-8 h-8 float-icon" style={{ color: 'var(--accent-primary)', opacity: 0.5 }} />
            )}
          </div>
        </div>

        {/* Step label */}
        <p
          className="text-xl sm:text-2xl font-bold font-display mb-2 transition-all duration-300"
          style={{
            color: playing ? currentStep?.color : 'var(--text-secondary)',
            textAlign: 'center',
            width: '100%',
            padding: '0 1rem',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'anywhere',
            lineHeight: 1.3,
          }}
        >
          {playing ? currentStep?.label : 'Ready to begin'}
        </p>

        {/* Step dots */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {technique.steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                style={{
                  background: i === stepIndex && playing ? s.color : 'rgba(255,255,255,0.1)',
                  boxShadow: i === stepIndex && playing ? `0 0 10px ${s.color}` : 'none',
                  transform: i === stepIndex && playing ? 'scale(1.4)' : 'scale(1)',
                  animation: i === stepIndex && playing ? 'pulseDot 1s ease infinite' : 'none',
                  flexShrink: 0,
                }}
              />
              {i < technique.steps.length - 1 && (
                <div style={{ width: '1rem', height: '1px', background: 'rgba(255,255,255,0.06)', flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={togglePlay}
            className="btn-gradient w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
          >
            {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
          <button
            onClick={reset}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 hover:bg-white/5"
            style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div
        className="grid grid-cols-2 gap-3 stagger-children"
        style={{ maxWidth: '24rem', marginLeft: 'auto', marginRight: 'auto', width: '100%' }}
      >
        <div className="glass-card-static p-4 card-hover" style={{ textAlign: 'center' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Cycles</p>
          <p className="text-2xl font-bold font-display transition-all duration-300" style={{ color: 'var(--accent-primary)' }}>
            {cycles}
          </p>
        </div>
        <div className="glass-card-static p-4 card-hover" style={{ textAlign: 'center' }}>
          <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>Duration</p>
          <p className="text-2xl font-bold font-display transition-all duration-300" style={{ color: 'var(--accent-secondary)' }}>
            {formatTime(totalSeconds)}
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="glass-card-static p-5 sm:p-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-sm font-semibold mb-3 font-display" style={{ color: 'var(--text-secondary)' }}>
          🧠 Why Breathing Exercises Work
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'Activates the parasympathetic nervous system, reducing stress hormones',
            'Lowers heart rate and blood pressure within minutes',
            'Improves focus and concentration by increasing oxygen flow',
            'Can reduce anxiety symptoms by up to 44% (clinical studies)',
          ].map((text, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-xs leading-relaxed card-hover p-2 rounded-lg transition-all"
              style={{ color: 'var(--text-secondary)', minWidth: 0 }}
            >
              <span className="flex-shrink-0 mt-0.5" style={{ color: 'var(--positive)' }}>✓</span>
              <span style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes gentlePulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        @keyframes slowSpin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes softBounce {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.03); }
        }
        @keyframes pulseDot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  )
}