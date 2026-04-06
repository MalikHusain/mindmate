import { useState, useEffect } from 'react'
import { X, ArrowRight, Sparkles } from 'lucide-react'

const MOODS = [
  { emoji: '😄', label: 'Great', score: 5, color: '#22c55e' },
  { emoji: '🙂', label: 'Good', score: 4, color: '#84cc16' },
  { emoji: '😐', label: 'Okay', score: 3, color: '#f59e0b' },
  { emoji: '😔', label: 'Low', score: 2, color: '#f97316' },
  { emoji: '😢', label: 'Struggling', score: 1, color: '#ef4444' },
]

const QUICK_NOTES = [
  'Feeling rested 😴', 'A bit anxious 😰', 'Excited about today 🎉',
  'Overwhelmed 😤', 'Grateful 🙏', 'Tired 😴', 'Hopeful 🌟', 'Lonely 💙',
]

export default function DailyCheckInModal({ onClose, onSubmit }) {
  const [step, setStep] = useState(1) // 1 = mood, 2 = note
  const [mood, setMood] = useState(null)
  const [note, setNote] = useState('')
  const [selectedTags, setSelectedTags] = useState([])

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleSubmit = () => {
    const entry = {
      mood,
      note: note || selectedTags.join(', '),
      date: new Date().toISOString(),
    }
    // Save today's check-in date
    try {
      localStorage.setItem('mindmate_last_checkin', new Date().toDateString())
    } catch {}
    onSubmit?.(entry)
    onClose()
  }

  const selectedMood = MOODS.find(m => m.label === mood)

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 999,
        }}
      />

      {/* Modal */}
      <div
        className="animate-scale-in"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 1000,
          width: 'min(92vw, 440px)',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: '1.5rem',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
          padding: '1.5rem',
          boxSizing: 'border-box',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--accent-primary)' }}>
                DAILY CHECK-IN
              </span>
            </div>
            <h2 className="text-lg font-bold font-display" style={{ color: 'var(--text-primary)' }}>
              {step === 1 ? 'How are you feeling today?' : 'Anything else on your mind?'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110 flex-shrink-0"
            style={{ background: 'var(--surface-glass)', color: 'var(--text-muted)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex gap-2 mb-6">
          {[1, 2].map(s => (
            <div
              key={s}
              className="h-1 rounded-full flex-1 transition-all duration-300"
              style={{ background: s <= step ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)' }}
            />
          ))}
        </div>

        {step === 1 ? (
          /* Mood selection */
          <div className="space-y-4">
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
              {MOODS.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setMood(m.label)}
                  className="flex-1 flex flex-col items-center gap-1.5 p-2 sm:p-3 rounded-xl transition-all hover:scale-105"
                  style={{
                    background: mood === m.label ? `${m.color}18` : 'var(--surface-glass)',
                    border: `2px solid ${mood === m.label ? m.color : 'var(--border-subtle)'}`,
                    minWidth: 0,
                  }}
                >
                  <span style={{ fontSize: 'clamp(1.25rem, 4vw, 1.75rem)' }}>{m.emoji}</span>
                  <span
                    className="text-[10px] sm:text-xs font-medium"
                    style={{ color: mood === m.label ? m.color : 'var(--text-muted)' }}
                  >
                    {m.label}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={() => mood && setStep(2)}
              disabled={!mood}
              className="btn-gradient w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
              style={{ opacity: mood ? 1 : 0.4, cursor: mood ? 'pointer' : 'not-allowed' }}
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 text-xs transition-all hover:opacity-80"
              style={{ color: 'var(--text-muted)' }}
            >
              Skip for today
            </button>
          </div>
        ) : (
          /* Note + quick tags */
          <div className="space-y-4">
            {/* Selected mood recap */}
            {selectedMood && (
              <div
                className="flex items-center gap-2 p-3 rounded-xl"
                style={{ background: `${selectedMood.color}12`, border: `1px solid ${selectedMood.color}30` }}
              >
                <span className="text-xl">{selectedMood.emoji}</span>
                <span className="text-sm font-medium" style={{ color: selectedMood.color }}>
                  Feeling {selectedMood.label}
                </span>
              </div>
            )}

            {/* Quick tags */}
            <div>
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Quick tags (optional)</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {QUICK_NOTES.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:scale-105"
                    style={{
                      background: selectedTags.includes(tag) ? 'rgba(124,92,252,0.2)' : 'var(--surface-glass)',
                      border: `1px solid ${selectedTags.includes(tag) ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                      color: selectedTags.includes(tag) ? 'var(--text-primary)' : 'var(--text-muted)',
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Freeform note */}
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Anything specific on your mind? (optional)"
              rows={3}
              style={{
                width: '100%',
                borderRadius: '0.75rem',
                padding: '0.75rem 1rem',
                background: 'var(--surface-glass)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                lineHeight: 1.6,
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--border-accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
            />

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'var(--surface-glass)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="btn-gradient flex-1 py-2.5 rounded-xl text-sm font-semibold"
              >
                Log Check-in ✓
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

/**
 * Hook — returns true if check-in should be shown today
 * Usage: const { showCheckIn, dismiss } = useDailyCheckIn()
 */
export function useDailyCheckIn() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      const last = localStorage.getItem('mindmate_last_checkin')
      if (last !== new Date().toDateString()) {
        // Delay slightly so page loads first
        const t = setTimeout(() => setShow(true), 1200)
        return () => clearTimeout(t)
      }
    } catch {}
  }, [])

  return { showCheckIn: show, dismiss: () => setShow(false) }
}