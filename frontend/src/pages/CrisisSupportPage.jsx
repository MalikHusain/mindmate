import { useState, useEffect } from 'react'
import {
  Shield, Phone, MessageCircle, Heart, AlertTriangle,
  ChevronDown, ChevronUp, CheckCircle2, Circle, Flame,
  Wind, Droplets, Users, Footprints, PenLine
} from 'lucide-react'

const HELPLINES = [
  {
    country: '🇮🇳 India',
    key: 'india',
    color: 'rgba(249,115,22,0.12)',
    accent: '#f97316',
    lines: [
      { name: 'iCall', number: '9152987821', desc: 'Psychological support helpline', available: 'Mon–Sat, 8am–10pm' },
      { name: 'Vandrevala Foundation', number: '18602662345', display: '1860-2662-345', desc: '24/7 mental health support', available: '24 / 7' },
      { name: 'AASRA', number: '9820466627', desc: 'Crisis intervention & suicide prevention', available: '24 / 7' },
      { name: 'Snehi', number: '04424640050', display: '044-24640050', desc: 'Emotional support for distress', available: '24 / 7' },
    ],
  },
  {
    country: '🌐 International',
    key: 'intl',
    color: 'rgba(99,102,241,0.12)',
    accent: '#818cf8',
    lines: [
      { name: 'Crisis Text Line (US)', number: '741741', display: 'Text HOME to 741741', desc: 'Free 24/7 crisis support via text', available: '24 / 7' },
      { name: 'Samaritans (UK)', number: '116123', display: '116 123', desc: 'Emotional support for anyone in distress', available: '24 / 7' },
      { name: 'Lifeline (Australia)', number: '131114', display: '13 11 14', desc: 'Crisis support and suicide prevention', available: '24 / 7' },
      { name: 'NIMH (US)', number: '18666156464', display: '1-866-615-6464', desc: 'National Institute of Mental Health info', available: 'Mon–Fri, 8am–8pm' },
    ],
  },
]

const COPING_TIPS = [
  { Icon: Wind, title: 'Breathe', desc: 'Take 5 slow deep breaths. Inhale for 4 counts, hold for 4, exhale for 6.', color: 'rgba(56,189,248,0.12)', accent: '#38bdf8' },
  { Icon: Flame, title: 'Ground Yourself', desc: 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.', color: 'rgba(251,146,60,0.12)', accent: '#fb923c' },
  { Icon: Droplets, title: 'Hydrate', desc: 'Drink a glass of cold water slowly. Physical sensation helps break a spiral.', color: 'rgba(34,211,238,0.12)', accent: '#22d3ee' },
  { Icon: Users, title: 'Reach Out', desc: 'Call or text someone you trust. You don\'t need to explain — just say you need company.', color: 'rgba(167,139,250,0.12)', accent: '#a78bfa' },
  { Icon: Footprints, title: 'Move Your Body', desc: 'A short walk outside, even 5 minutes, can shift your nervous system.', color: 'rgba(52,211,153,0.12)', accent: '#34d399' },
  { Icon: PenLine, title: 'Write It Down', desc: 'Put your thoughts on paper. You don\'t need to make sense — just let it out.', color: 'rgba(251,191,36,0.12)', accent: '#fbbf24' },
]

const QUESTIONS = [
  'Are you having thoughts of harming yourself or others?',
  'Are you feeling like things will never get better?',
  'Have you lost interest in most things you used to enjoy?',
  'Are you struggling to get through daily tasks?',
  'Do you feel completely alone or disconnected from others?',
]

export default function CrisisSupportPage() {
  const [expanded, setExpanded] = useState('india')
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const toggleAnswer = (i, val) => {
    setAnswers(prev => ({ ...prev, [i]: val }))
    setShowResult(false)
  }

  const yesCount = Object.values(answers).filter(v => v === true).length
  const allAnswered = Object.keys(answers).length === QUESTIONS.length

  const riskLevel = yesCount === 0 ? 'low' : yesCount <= 2 ? 'moderate' : 'high'
  const riskConfig = {
    low: {
      label: 'You seem to be doing okay',
      color: 'var(--positive)',
      border: 'rgba(34,197,94,0.3)',
      bg: 'rgba(34,197,94,0.06)',
      msg: 'Keep practicing self-care. MindMate is here whenever you need to talk.',
    },
    moderate: {
      label: 'You may benefit from extra support',
      color: '#fbbf24',
      border: 'rgba(251,191,36,0.3)',
      bg: 'rgba(251,191,36,0.06)',
      msg: 'Consider talking to someone you trust, or reach out to a helpline below. You are not alone.',
    },
    high: {
      label: 'Please reach out for help right now',
      color: 'var(--negative)',
      border: 'rgba(239,68,68,0.3)',
      bg: 'rgba(239,68,68,0.06)',
      msg: 'Your feelings are valid and help is available. Please contact a helpline or a trusted person immediately.',
    },
  }

  return (
    <div
      style={{
        width: '100%',
        overflowX: 'hidden',
        paddingBottom: '3rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        opacity: mounted ? 1 : 0,
        transition: 'opacity 0.4s ease',
      }}
    >
      {/* ── Header ── */}
      <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
          }}
        >
          <Shield style={{ width: 28, height: 28, color: 'var(--negative)' }} />
        </div>
        <h1
          className="font-display gradient-text"
          style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '0.5rem', fontWeight: 700 }}
        >
          Crisis Support
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 420, margin: '0 auto', lineHeight: 1.6 }}>
          You are not alone. Compassionate help is always available — 24 hours a day, 7 days a week.
        </p>
      </div>

      {/* ── Emergency Banner ── */}
      <div
        style={{
          borderRadius: 16,
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '1rem',
          background: 'rgba(239,68,68,0.07)',
          border: '1px solid rgba(239,68,68,0.22)',
        }}
      >
        <AlertTriangle style={{ width: 20, height: 20, color: 'var(--negative)', flexShrink: 0, marginTop: 2 }} />
        <div>
          <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--negative)', marginBottom: '0.35rem' }}>
            If you are in immediate danger
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
            Call your local emergency services —{' '}
            <strong style={{ color: 'var(--text-primary)' }}>India: 112</strong>,{' '}
            <strong style={{ color: 'var(--text-primary)' }}>US: 911</strong>,{' '}
            <strong style={{ color: 'var(--text-primary)' }}>UK: 999</strong>{' '}
            — or go to your nearest emergency room immediately.
          </p>
        </div>
      </div>

      {/* ── Helplines ── */}
      <section>
        <SectionLabel icon={<Phone style={{ width: 16, height: 16 }} />} text="Mental Health Helplines" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
          {HELPLINES.map((group) => {
            const isOpen = expanded === group.key
            return (
              <div
                key={group.key}
                className="glass-card-static"
                style={{ borderRadius: 16, overflow: 'hidden' }}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : group.key)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.1rem 1.5rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {group.country}
                  </span>
                  {isOpen
                    ? <ChevronUp style={{ width: 18, height: 18, color: 'var(--text-muted)', flexShrink: 0 }} />
                    : <ChevronDown style={{ width: 18, height: 18, color: 'var(--text-muted)', flexShrink: 0 }} />}
                </button>

                {isOpen && (
                  <div style={{ padding: '0 1rem 1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                      {group.lines.map((line, i) => (
                        <div
                          key={i}
                          style={{
                            borderRadius: 12,
                            padding: '1rem 1.25rem',
                            background: 'var(--surface-glass)',
                            border: '1px solid var(--border-subtle)',
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.75rem',
                          }}
                        >
                          <div style={{ flex: '1 1 180px', minWidth: 0 }}>
                            <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                              {line.name}
                            </p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', lineHeight: 1.5 }}>
                              {line.desc}
                            </p>
                            <span
                              style={{
                                display: 'inline-block',
                                fontSize: '0.72rem',
                                fontWeight: 600,
                                padding: '0.25rem 0.65rem',
                                borderRadius: 99,
                                background: 'rgba(34,197,94,0.1)',
                                color: 'var(--positive)',
                                letterSpacing: '0.02em',
                              }}
                            >
                              {line.available}
                            </span>
                          </div>
                          <a
                            href={`tel:${line.number}`}
                            style={{
                              flexShrink: 0,
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 8,
                              padding: '0.6rem 1.1rem',
                              borderRadius: 12,
                              background: 'rgba(239,68,68,0.1)',
                              border: '1px solid rgba(239,68,68,0.22)',
                              color: 'var(--negative)',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              textDecoration: 'none',
                              whiteSpace: 'nowrap',
                              transition: 'transform 0.15s ease, background 0.15s ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)'; e.currentTarget.style.transform = 'scale(1.03)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.transform = 'scale(1)' }}
                          >
                            <Phone style={{ width: 14, height: 14 }} />
                            {line.display || line.number}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Self-Check ── */}
      <section className="glass-card-static" style={{ borderRadius: 20, padding: 'clamp(1.25rem, 4vw, 2rem)' }}>
        <SectionLabel
          icon={<Heart style={{ width: 16, height: 16, color: 'var(--negative)' }} />}
          text="Quick Self-Check"
          sub="Answer honestly — this is for you only."
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
          {QUESTIONS.map((q, i) => {
            const answered = answers[i] !== undefined
            return (
              <div
                key={i}
                style={{
                  borderRadius: 14,
                  padding: '1rem 1.25rem',
                  background: 'var(--surface-glass)',
                  border: `1px solid ${answered ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                  transition: 'border-color 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.875rem' }}>
                  {answered
                    ? <CheckCircle2 style={{ width: 18, height: 18, color: 'var(--positive)', flexShrink: 0, marginTop: 1 }} />
                    : <Circle style={{ width: 18, height: 18, color: 'var(--text-muted)', flexShrink: 0, marginTop: 1 }} />
                  }
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0 }}>{q}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.625rem', paddingLeft: '1.7rem', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Yes', val: true, activeColor: 'var(--negative)', activeBg: 'rgba(239,68,68,0.1)', activeBorder: 'rgba(239,68,68,0.35)' },
                    { label: 'No', val: false, activeColor: 'var(--positive)', activeBg: 'rgba(34,197,94,0.1)', activeBorder: 'rgba(34,197,94,0.35)' },
                  ].map(({ label, val, activeColor, activeBg, activeBorder }) => {
                    const active = answers[i] === val
                    return (
                      <button
                        key={label}
                        onClick={() => toggleAnswer(i, val)}
                        style={{
                          padding: '0.45rem 1.25rem',
                          borderRadius: 10,
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.18s ease',
                          background: active ? activeBg : 'transparent',
                          border: `1px solid ${active ? activeBorder : 'var(--border-subtle)'}`,
                          color: active ? activeColor : 'var(--text-muted)',
                          letterSpacing: '0.01em',
                        }}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>

        {/* Progress */}
        <div style={{ marginTop: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Progress</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {Object.keys(answers).length} / {QUESTIONS.length}
            </span>
          </div>
          <div style={{ height: 4, borderRadius: 99, background: 'var(--border-subtle)', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                borderRadius: 99,
                background: 'linear-gradient(90deg, var(--positive), #34d399)',
                width: `${(Object.keys(answers).length / QUESTIONS.length) * 100}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        <button
          onClick={() => setShowResult(true)}
          disabled={!allAnswered}
          className="btn-gradient"
          style={{
            width: '100%',
            padding: '0.85rem',
            borderRadius: 14,
            fontSize: '0.9rem',
            fontWeight: 600,
            marginTop: '1.25rem',
            cursor: allAnswered ? 'pointer' : 'not-allowed',
            opacity: allAnswered ? 1 : 0.45,
            border: 'none',
            transition: 'opacity 0.2s ease',
          }}
        >
          See My Result
        </button>

        {showResult && allAnswered && (
          <div
            style={{
              marginTop: '1rem',
              borderRadius: 14,
              padding: '1rem 1.25rem',
              background: riskConfig[riskLevel].bg,
              border: `1px solid ${riskConfig[riskLevel].border}`,
              animation: 'fadeUp 0.3s ease',
            }}
          >
            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: riskConfig[riskLevel].color, marginBottom: '0.35rem' }}>
              {riskConfig[riskLevel].label}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              {riskConfig[riskLevel].msg}
            </p>
          </div>
        )}
      </section>

      {/* ── Coping Strategies ── */}
      <section>
        <SectionLabel icon={<MessageCircle style={{ width: 16, height: 16 }} />} text="Immediate Coping Strategies" />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
            gap: '0.75rem',
            marginTop: '0.75rem',
          }}
        >
          {COPING_TIPS.map(({ Icon, title, desc, color, accent }, i) => (
            <div
              key={i}
              className="glass-card-static"
              style={{
                borderRadius: 16,
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.875rem',
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: color,
                  border: `1px solid ${accent}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon style={{ width: 18, height: 18, color: accent }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                  {title}
                </p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Disclaimer ── */}
      <div
        style={{
          borderRadius: 14,
          padding: '1rem 1.25rem',
          background: 'var(--surface-glass)',
          border: '1px solid var(--border-subtle)',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          
          If you are in crisis, please contact a licensed professional or emergency services.
        </p>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

function SectionLabel({ icon, text, sub }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}>{icon}</span>
        <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {text}
        </h2>
      </div>
      {sub && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', paddingLeft: '1.5rem' }}>{sub}</p>}
    </div>
  )
}