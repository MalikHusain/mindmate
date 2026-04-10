/**
 * src/components/DailyCheckInModal.jsx
 *
 * Self-contained modal — no router dependency here.
 * The hook lives in src/hooks/useDailyCheckIn.js
 */

import { useState, useEffect } from 'react'
import { X, ArrowRight, Sparkles, Flame, ChevronLeft, Check } from 'lucide-react'

// ─── Constants ───────────────────────────────────────────────────────────────

const MOODS = [
  { emoji: '😄', label: 'Great',      score: 5, color: '#22c55e' },
  { emoji: '🙂', label: 'Good',       score: 4, color: '#84cc16' },
  { emoji: '😐', label: 'Okay',       score: 3, color: '#f59e0b' },
  { emoji: '😔', label: 'Low',        score: 2, color: '#f97316' },
  { emoji: '😢', label: 'Struggling', score: 1, color: '#ef4444' },
]

const ENERGY_LABELS = ['Very low', 'Low', 'Moderate', 'High', 'Very high']

const QUICK_TAGS = [
  'Feeling rested 😴', 'A bit anxious 😰', 'Excited 🎉',
  'Overwhelmed 😤', 'Grateful 🙏', 'Tired 😪',
  'Hopeful 🌟', 'Lonely 💙', 'Focused 🎯', 'Calm 🌊',
  'Stressed 🌀', 'Happy 😊',
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Reads real streak from localStorage */
function getStreak() {
  try {
    const user   = JSON.parse(localStorage.getItem('user') || '{}')
    const userId = user?.email || user?.id || 'guest'
    const raw    = localStorage.getItem(`mindmate_streak_${userId}`)
    return raw ? parseInt(raw, 10) : 0
  } catch {
    return 0
  }
}

/** Increments streak by 1 and saves it */
function incrementStreak() {
  try {
    const user    = JSON.parse(localStorage.getItem('user') || '{}')
    const userId  = user?.email || user?.id || 'guest'
    const key     = `mindmate_streak_${userId}`
    const current = parseInt(localStorage.getItem(key) || '0', 10)
    localStorage.setItem(key, String(current + 1))
    return current + 1
  } catch {
    return 1
  }
}

/** Marks today as checked-in for the current user */
function markCheckedIn() {
  try {
    const user   = JSON.parse(localStorage.getItem('user') || '{}')
    const userId = user?.email || user?.id || 'guest'
    localStorage.setItem(`mindmate_last_checkin_${userId}`, new Date().toDateString())
  } catch {}
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepBar({ step, total = 3 }) {
  return (
    <div style={{ display: 'flex', gap: 6, margin: '1.1rem 0 1.5rem' }}>
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            flex: 1, height: 3, borderRadius: 4,
            background: i < step
              ? 'linear-gradient(90deg, #7c5cfc, #a78bfa)'
              : 'rgba(255,255,255,0.08)',
            transition: 'background 0.4s ease',
          }}
        />
      ))}
    </div>
  )
}

function Badge({ children }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
      color: '#b89fff', textTransform: 'uppercase',
      background: 'rgba(130,90,255,0.1)',
      border: '1px solid rgba(130,90,255,0.25)',
      padding: '3px 9px', borderRadius: 100, marginBottom: 8,
    }}>
      <Sparkles size={11} />
      {children}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DailyCheckInModal({ onClose, onSubmit }) {
  const [step,         setStep]   = useState(1)
  const [mood,         setMood]   = useState(null)
  const [energy,       setEnergy] = useState(3)
  const [selectedTags, setTags]   = useState([])
  const [note,         setNote]   = useState('')
  const [closing,      setClosing]= useState(false)
  const [streak,       setStreak] = useState(0)

  // animated close
  const handleClose = () => {
    setClosing(true)
    setTimeout(() => onClose?.(), 200)
  }

  const toggleTag = (tag) =>
    setTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )

  const handleSubmit = () => {
    // Mark checked-in BEFORE reading streak so the hook won't re-trigger
    markCheckedIn()
    const newStreak = incrementStreak()
    setStreak(newStreak)

    const entry = {
      mood:   mood?.label,
      score:  mood?.score,
      energy,
      tags:   selectedTags,
      note,
      date:   new Date().toISOString(),
      streak: newStreak,
    }

    onSubmit?.(entry)
    setStep(3)
  }

  // shared modal container styles
  const S = {
    backdrop: {
      position: 'fixed', inset: 0,
      background: 'rgba(5, 5, 20, 0.80)',
      backdropFilter: 'blur(14px)',
      WebkitBackdropFilter: 'blur(14px)',
      zIndex: 999,
      animation: closing ? 'mmFadeOut 0.2s ease forwards' : 'mmFadeIn 0.25s ease forwards',
    },
    modal: {
      position: 'fixed', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000,
      width: 'min(92vw, 456px)',
      maxHeight: '92vh',
      overflowY: 'auto',
      borderRadius: '1.75rem',
      background: 'linear-gradient(155deg, rgba(28,26,56,0.98), rgba(14,12,32,0.99))',
      border: '1px solid rgba(124,92,252,0.28)',
      boxShadow: '0 28px 70px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.07)',
      padding: '1.75rem',
      boxSizing: 'border-box',
      animation: closing
        ? 'mmSlideDown 0.2s ease forwards'
        : 'mmSlideUp 0.35s cubic-bezier(.22,.68,0,1.2) forwards',
    },
  }

  return (
    <>
      <style>{`
        @keyframes mmFadeIn    { from { opacity:0 } to { opacity:1 } }
        @keyframes mmFadeOut   { from { opacity:1 } to { opacity:0 } }
        @keyframes mmSlideUp   { from { opacity:0; transform:translate(-50%,-44%) scale(.97) } to { opacity:1; transform:translate(-50%,-50%) scale(1) } }
        @keyframes mmSlideDown { from { opacity:1; transform:translate(-50%,-50%) scale(1) } to { opacity:0; transform:translate(-50%,-44%) scale(.97) } }
        @keyframes mmPulse     { 0%,100%{transform:scale(1)} 50%{transform:scale(1.18)} }
        @keyframes mmTagIn     { from{opacity:0;transform:translateY(5px)} to{opacity:1;transform:none} }
        @keyframes mmCheckPop  { 0%{transform:scale(0);opacity:0} 60%{transform:scale(1.2)} 100%{transform:scale(1);opacity:1} }
        .mm-mood-btn { transition: all 0.2s cubic-bezier(.22,.68,0,1.2); }
        .mm-mood-btn:hover { transform: translateY(-2px) scale(1.05) !important; }
        .mm-mood-btn:hover .mm-emoji { animation: mmPulse 0.4s ease; }
        .mm-tag:hover { transform: scale(1.05); }
        .mm-close-btn:hover { background: rgba(255,255,255,0.12) !important; color: #d0c8f0 !important; }
        .mm-back-btn:hover  { background: rgba(255,255,255,0.08) !important; }
        .mm-done-btn:hover  { background: rgba(255,255,255,0.08) !important; }
      `}</style>

      {/* Backdrop */}
      <div onClick={handleClose} style={S.backdrop} />

      {/* Modal */}
      <div style={S.modal}>

        {/* Close button */}
        <button
          className="mm-close-btn"
          onClick={handleClose}
          style={{
            position: 'absolute', top: '1.2rem', right: '1.2rem',
            width: 30, height: 30, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(200,190,240,0.5)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.18s', padding: 0,
          }}
        >
          <X size={14} />
        </button>

        {/* ══ STEP 1 — Mood ══ */}
        {step === 1 && (
          <div style={{ animation: 'mmSlideUp 0.3s cubic-bezier(.22,.68,0,1.2)' }}>
            <Badge>Daily Check‑in</Badge>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f0eeff', lineHeight: 1.3, marginBottom: 3 }}>
              How are you feeling today?
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'rgba(180,170,220,0.5)', marginBottom: 0 }}>
              Your mood is private and only visible to you.
            </p>

            <StepBar step={1} />

            {/* Mood buttons */}
            <div style={{ display: 'flex', gap: 8, marginBottom: '1.25rem' }}>
              {MOODS.map(m => {
                const sel = mood?.label === m.label
                return (
                  <button
                    key={m.label}
                    className="mm-mood-btn"
                    onClick={() => setMood(m)}
                    style={{
                      flex: 1, display: 'flex', flexDirection: 'column',
                      alignItems: 'center', gap: 5,
                      padding: '10px 4px', borderRadius: 16, cursor: 'pointer',
                      background: sel ? `${m.color}1a` : 'rgba(255,255,255,0.03)',
                      border: `1.5px solid ${sel ? m.color + 'aa' : 'rgba(255,255,255,0.08)'}`,
                      transform: sel ? 'scale(1.06)' : 'none',
                      minWidth: 0,
                    }}
                  >
                    <span className="mm-emoji" style={{ fontSize: 'clamp(1.25rem,4vw,1.65rem)', lineHeight: 1 }}>{m.emoji}</span>
                    <span style={{ fontSize: 10, fontWeight: 500, color: sel ? m.color : 'rgba(180,170,220,0.5)' }}>
                      {m.label}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Energy slider — only after mood picked */}
            {mood && (
              <div style={{ marginBottom: '1.25rem', animation: 'mmTagIn 0.25s ease' }}>
                <p style={{
                  fontSize: 11, fontWeight: 600,
                  color: 'rgba(160,148,210,0.6)',
                  letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8,
                }}>
                  Energy level
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 14 }}>🔋</span>
                  <input
                    type="range" min={1} max={5} step={1} value={energy}
                    onChange={e => setEnergy(+e.target.value)}
                    style={{ flex: 1, accentColor: '#7c5cfc' }}
                  />
                  <span style={{
                    fontSize: 12, fontWeight: 600, color: '#a78bfa',
                    minWidth: 62, textAlign: 'right',
                  }}>
                    {ENERGY_LABELS[energy - 1]}
                  </span>
                </div>
              </div>
            )}

            <button
              disabled={!mood}
              onClick={() => setStep(2)}
              style={{
                width: '100%', padding: '13px', borderRadius: '1rem',
                fontSize: 15, fontWeight: 600,
                cursor: mood ? 'pointer' : 'not-allowed',
                border: 'none', color: '#fff',
                background: 'linear-gradient(135deg, #7c5cfc 0%, #a37ef9 100%)',
                boxShadow: mood ? '0 4px 18px rgba(124,92,252,0.38)' : 'none',
                opacity: mood ? 1 : 0.35,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                transition: 'all 0.2s',
              }}
            >
              Continue <ArrowRight size={16} />
            </button>

            <button
              onClick={handleClose}
              style={{
                width: '100%', marginTop: 10, padding: '10px',
                background: 'transparent', border: 'none',
                fontSize: 13, color: 'rgba(180,170,220,0.4)', cursor: 'pointer',
              }}
            >
              Skip for today
            </button>
          </div>
        )}

        {/* ══ STEP 2 — Tags + note ══ */}
        {step === 2 && (
          <div style={{ animation: 'mmSlideUp 0.3s cubic-bezier(.22,.68,0,1.2)' }}>
            <Badge>Daily Check‑in</Badge>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f0eeff', lineHeight: 1.3, marginBottom: 3 }}>
              Anything on your mind?
            </h2>
            <p style={{ fontSize: '0.78rem', color: 'rgba(180,170,220,0.5)', marginBottom: 0 }}>
              Optional — just for you.
            </p>

            <StepBar step={2} />

            {/* Mood + energy recap */}
            {mood && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 14, marginBottom: '1.1rem',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <span style={{ fontSize: '1.3rem' }}>{mood.emoji}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: mood.color }}>
                  Feeling {mood.label}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'rgba(160,148,200,0.45)' }}>
                  Energy: {ENERGY_LABELS[energy - 1]}
                </span>
              </div>
            )}

            {/* Quick tags */}
            <div style={{ marginBottom: '1rem' }}>
              <p style={{
                fontSize: 11, fontWeight: 600,
                color: 'rgba(160,148,210,0.6)',
                letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8,
              }}>
                Quick tags
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {QUICK_TAGS.map((tag, i) => {
                  const sel = selectedTags.includes(tag)
                  return (
                    <button
                      key={tag}
                      className="mm-tag"
                      onClick={() => toggleTag(tag)}
                      style={{
                        padding: '5px 11px', borderRadius: 100,
                        fontSize: 11.5, fontWeight: 500, cursor: 'pointer',
                        background: sel ? 'rgba(124,92,252,0.18)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${sel ? 'rgba(124,92,252,0.45)' : 'rgba(255,255,255,0.09)'}`,
                        color: sel ? '#c8b8ff' : 'rgba(180,170,220,0.55)',
                        transition: 'all 0.18s',
                        animation: `mmTagIn 0.25s ease ${i * 0.03}s both`,
                      }}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Freeform note */}
            <div style={{ position: 'relative', marginBottom: '1.1rem' }}>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value.slice(0, 240))}
                placeholder="Anything specific on your mind? (optional)"
                rows={3}
                style={{
                  width: '100%', borderRadius: 14, padding: '11px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1.5px solid rgba(255,255,255,0.09)',
                  color: '#e8e0ff', fontSize: '0.875rem', lineHeight: 1.6,
                  outline: 'none', resize: 'none', fontFamily: 'inherit',
                  boxSizing: 'border-box', transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(124,92,252,0.5)')}
                onBlur={e  => (e.target.style.borderColor = 'rgba(255,255,255,0.09)')}
              />
              <span style={{
                position: 'absolute', bottom: 9, right: 12,
                fontSize: 10, color: 'rgba(150,140,190,0.35)',
              }}>
                {note.length}/240
              </span>
            </div>

            {/* Back / Submit */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                className="mm-back-btn"
                onClick={() => setStep(1)}
                style={{
                  flex: 1, padding: 12, borderRadius: '1rem',
                  fontSize: 13.5, fontWeight: 500, cursor: 'pointer',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  color: 'rgba(180,170,220,0.6)', transition: 'all 0.18s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                }}
              >
                <ChevronLeft size={15} /> Back
              </button>
              <button
                onClick={handleSubmit}
                style={{
                  flex: 2, padding: 12, borderRadius: '1rem',
                  fontSize: 15, fontWeight: 600, cursor: 'pointer',
                  border: 'none', color: '#fff',
                  background: 'linear-gradient(135deg, #7c5cfc 0%, #a37ef9 100%)',
                  boxShadow: '0 4px 18px rgba(124,92,252,0.38)',
                  transition: 'all 0.2s',
                }}
              >
                Log Check‑in ✓
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 3 — Success ══ */}
        {step === 3 && (
          <div style={{ animation: 'mmSlideUp 0.35s cubic-bezier(.22,.68,0,1.2)', textAlign: 'center' }}>
            <StepBar step={3} />

            <div style={{
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '1rem',
              padding: '1rem 0.5rem 0.5rem',
            }}>
              {/* Animated check */}
              <div style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'linear-gradient(135deg, #7c5cfc, #a37ef9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 8px 30px rgba(124,92,252,0.45)',
                animation: 'mmCheckPop 0.5s cubic-bezier(.22,.68,0,1.4) forwards',
              }}>
                <Check size={32} color="#fff" strokeWidth={2.5} />
              </div>

              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#f0eeff', marginBottom: 5 }}>
                  Check‑in logged! ✨
                </h2>
                <p style={{ fontSize: 13, color: 'rgba(180,170,220,0.55)', lineHeight: 1.6 }}>
                  Great habit — keep it up.
                </p>
              </div>

              {/* Real streak badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 12, fontWeight: 600, color: '#ffc060',
                background: 'rgba(255,170,60,0.12)',
                border: '1px solid rgba(255,170,60,0.25)',
                padding: '5px 14px', borderRadius: 100,
              }}>
                <Flame size={13} />
                {streak}-day streak
              </div>

              {/* Summary card */}
              <div style={{
                width: '100%', textAlign: 'left',
                background: 'rgba(255,255,255,0.04)', borderRadius: 14,
                padding: '12px 14px', fontSize: 12.5,
                color: 'rgba(180,170,220,0.6)', lineHeight: 1.8,
                border: '1px solid rgba(255,255,255,0.07)',
              }}>
                <div>Mood: {mood?.emoji} {mood?.label}</div>
                <div>Energy: {ENERGY_LABELS[energy - 1]}</div>
                {selectedTags.length > 0 && (
                  <div>Tags: {selectedTags.map(t => t.split(' ')[0]).join(', ')}</div>
                )}
                {note.trim() && <div>Note: "{note.trim()}"</div>}
              </div>

              <button
                className="mm-done-btn"
                onClick={handleClose}
                style={{
                  width: '100%', padding: '12px', borderRadius: '1rem',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: 14, fontWeight: 500, color: 'rgba(180,170,220,0.7)',
                  cursor: 'pointer', transition: 'all 0.18s',
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}