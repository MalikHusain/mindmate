import { useState } from 'react'
import { Shield, Phone, MessageCircle, Heart, AlertTriangle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react'

const HELPLINES = [
  {
    country: '🇮🇳 India',
    lines: [
      { name: 'iCall', number: '9152987821', desc: 'Psychological support helpline', available: 'Mon–Sat, 8am–10pm' },
      { name: 'Vandrevala Foundation', number: '1860-2662-345', desc: '24/7 mental health support', available: '24 / 7' },
      { name: 'AASRA', number: '9820466627', desc: 'Crisis intervention & suicide prevention', available: '24 / 7' },
      { name: 'Snehi', number: '044-24640050', desc: 'Emotional support for distress', available: '24 / 7' },
    ],
  },
  {
    country: '🌐 International',
    lines: [
      { name: 'Crisis Text Line (US)', number: 'Text HOME to 741741', desc: 'Free 24/7 crisis support via text', available: '24 / 7' },
      { name: 'Samaritans (UK)', number: '116 123', desc: 'Emotional support for anyone in distress', available: '24 / 7' },
      { name: 'Lifeline (Australia)', number: '13 11 14', desc: 'Crisis support and suicide prevention', available: '24 / 7' },
      { name: 'NIMH (US)', number: '1-866-615-6464', desc: 'National Institute of Mental Health info', available: 'Mon–Fri, 8am–8pm' },
    ],
  },
]

const COPING_TIPS = [
  { emoji: '🫁', title: 'Breathe', desc: 'Take 5 slow deep breaths. Inhale for 4 counts, hold for 4, exhale for 6.' },
  { emoji: '🌱', title: 'Ground Yourself', desc: 'Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.' },
  { emoji: '💧', title: 'Hydrate', desc: 'Drink a glass of cold water slowly. Physical sensation helps break a spiral.' },
  { emoji: '📞', title: 'Reach Out', desc: 'Call or text someone you trust. You don\'t have to explain — just say you need company.' },
  { emoji: '🚶', title: 'Move Your Body', desc: 'A short walk outside, even 5 minutes, can shift your nervous system.' },
  { emoji: '✍️', title: 'Write It Down', desc: 'Put your thoughts on paper. You don\'t need to make sense — just let it out.' },
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

  const toggleAnswer = (i, val) => {
    setAnswers(prev => ({ ...prev, [i]: val }))
  }

  const yesCount = Object.values(answers).filter(v => v === true).length
  const allAnswered = Object.keys(answers).length === QUESTIONS.length

  const riskLevel = yesCount === 0 ? 'low'
    : yesCount <= 2 ? 'moderate'
    : 'high'

  const riskConfig = {
    low: { label: 'You seem to be doing okay', color: 'var(--positive)', bg: 'rgba(34,197,94,0.08)', msg: 'Keep practicing self-care. MindMate is here whenever you need to talk.' },
    moderate: { label: 'You may benefit from extra support', color: 'var(--neutral)', bg: 'rgba(251,191,36,0.08)', msg: 'Consider talking to someone you trust, or reach out to a helpline below. You are not alone.' },
    high: { label: 'Please reach out for help right now', color: 'var(--negative)', bg: 'rgba(239,68,68,0.08)', msg: 'Your feelings are valid and help is available. Please contact a helpline or a trusted person immediately.' },
  }

  return (
    <div className="space-y-6 page-enter" style={{ width: '100%', overflowX: 'hidden' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3"
          style={{ background: 'rgba(239,68,68,0.1)' }}
        >
          <Shield className="w-7 h-7" style={{ color: 'var(--negative)' }} />
        </div>
        <h1 className="font-display gradient-text text-2xl sm:text-3xl mb-1">Crisis Support</h1>
        <p className="text-sm max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
          You are not alone. Help is always available — 24 hours a day, 7 days a week.
        </p>
      </div>

      {/* Emergency banner */}
      <div
        className="rounded-xl p-4 flex items-start gap-3"
        style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', width: '100%', boxSizing: 'border-box' }}
      >
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--negative)' }} />
        <div style={{ minWidth: 0 }}>
          <p className="text-sm font-semibold mb-1" style={{ color: 'var(--negative)' }}>If you are in immediate danger</p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', wordBreak: 'break-word' }}>
            Call your local emergency services (India: <strong>112</strong>, US: <strong>911</strong>, UK: <strong>999</strong>) or go to your nearest emergency room immediately.
          </p>
        </div>
      </div>

      {/* Helplines */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold px-1" style={{ color: 'var(--text-secondary)' }}>
          <Phone className="w-4 h-4 inline mr-1.5" />
          Mental Health Helplines
        </h2>
        {HELPLINES.map((group) => {
          const key = group.country.includes('India') ? 'india' : 'intl'
          const isOpen = expanded === key
          return (
            <div key={key} className="glass-card-static rounded-xl overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : key)}
                className="w-full flex items-center justify-between p-4 transition-all hover:bg-white/5"
                style={{ textAlign: 'left' }}
              >
                <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{group.country}</span>
                {isOpen
                  ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                  : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                }
              </button>
              {isOpen && (
                <div className="px-4 pb-4 space-y-3">
                  {group.lines.map((line, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      style={{ background: 'var(--surface-glass)', border: '1px solid var(--border-subtle)', width: '100%', boxSizing: 'border-box' }}
                    >
                      <div style={{ minWidth: 0 }}>
                        <p className="text-sm font-bold font-display mb-0.5" style={{ color: 'var(--text-primary)' }}>{line.name}</p>
                        <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)', wordBreak: 'break-word' }}>{line.desc}</p>
                        <span
                          className="inline-block text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(34,197,94,0.1)', color: 'var(--positive)' }}
                        >
                          {line.available}
                        </span>
                      </div>
                      <a
                        href={`tel:${line.number.replace(/\s/g, '')}`}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold flex-shrink-0 transition-all hover:scale-105"
                        style={{
                          background: 'rgba(239,68,68,0.12)',
                          color: 'var(--negative)',
                          border: '1px solid rgba(239,68,68,0.25)',
                          textDecoration: 'none',
                          whiteSpace: 'nowrap',
                          alignSelf: 'flex-start',
                        }}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {line.number}
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Self-check */}
      <div className="glass-card-static p-5 sm:p-6 space-y-4">
        <div>
          <h2 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-secondary)' }}>
            <Heart className="w-4 h-4 inline mr-1.5" style={{ color: 'var(--negative)' }} />
            Quick Self-Check
          </h2>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Answer honestly — this is for you only and helps guide you to the right support.
          </p>
        </div>

        <div className="space-y-3">
          {QUESTIONS.map((q, i) => (
            <div
              key={i}
              className="rounded-xl p-3 sm:p-4"
              style={{
                background: 'var(--surface-glass)',
                border: `1px solid ${answers[i] !== undefined ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                width: '100%',
                boxSizing: 'border-box',
              }}
            >
              <p className="text-sm mb-3" style={{ color: 'var(--text-primary)', wordBreak: 'break-word', lineHeight: 1.5 }}>{q}</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[['Yes', true, 'var(--negative)', 'rgba(239,68,68,0.12)'], ['No', false, 'var(--positive)', 'rgba(34,197,94,0.1)']].map(([label, val, color, bg]) => (
                  <button
                    key={label}
                    onClick={() => toggleAnswer(i, val)}
                    className="px-5 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105"
                    style={{
                      background: answers[i] === val ? bg : 'transparent',
                      border: `1px solid ${answers[i] === val ? color : 'var(--border-subtle)'}`,
                      color: answers[i] === val ? color : 'var(--text-muted)',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowResult(true)}
          disabled={!allAnswered}
          className="btn-gradient w-full py-3 rounded-xl text-sm font-semibold transition-all"
          style={{ opacity: allAnswered ? 1 : 0.45, cursor: allAnswered ? 'pointer' : 'not-allowed' }}
        >
          See My Result
        </button>

        {showResult && allAnswered && (
          <div
            className="rounded-xl p-4 animate-fade-in-up"
            style={{ background: riskConfig[riskLevel].bg, border: `1px solid ${riskConfig[riskLevel].color}40` }}
          >
            <p className="text-sm font-bold mb-1" style={{ color: riskConfig[riskLevel].color }}>
              {riskConfig[riskLevel].label}
            </p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', wordBreak: 'break-word' }}>
              {riskConfig[riskLevel].msg}
            </p>
          </div>
        )}
      </div>

      {/* Coping strategies */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold px-1" style={{ color: 'var(--text-secondary)' }}>
          <MessageCircle className="w-4 h-4 inline mr-1.5" />
          Immediate Coping Strategies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {COPING_TIPS.map((tip, i) => (
            <div
              key={i}
              className="glass-card-static p-4 flex items-start gap-3"
              style={{ width: '100%', boxSizing: 'border-box' }}
            >
              <span className="text-2xl flex-shrink-0">{tip.emoji}</span>
              <div style={{ minWidth: 0 }}>
                <p className="text-sm font-bold mb-1 font-display" style={{ color: 'var(--text-primary)' }}>{tip.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', wordBreak: 'break-word' }}>{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div
        className="rounded-xl p-4 text-center"
        style={{ background: 'var(--surface-glass)', border: '1px solid var(--border-subtle)' }}
      >
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          ⚠️ MindMate is not a substitute for professional mental health care.
          If you are in crisis, please contact a licensed professional or emergency services.
        </p>
      </div>
    </div>
  )
}