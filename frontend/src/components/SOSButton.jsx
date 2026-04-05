import { useState } from 'react'
import { Phone, X, AlertTriangle, Heart, ExternalLink, MessageCircle } from 'lucide-react'

const HELPLINES = [
  { name: 'iCall (India)', number: '9152987821', tel: 'tel:9152987821', country: '🇮🇳', available: '24/7' },
  { name: 'Vandrevala Foundation', number: '1860-2662-345', tel: 'tel:18602662345', country: '🇮🇳', available: '24/7' },
  { name: 'AASRA', number: '91-22-27546669', tel: 'tel:912227546669', country: '🇮🇳', available: '24/7' },
  { name: '988 Suicide & Crisis Lifeline', number: '988', tel: 'tel:988', country: '🇺🇸', available: '24/7' },
  { name: 'Crisis Text Line', number: 'Text HOME to 741741', tel: 'sms:741741', country: '🇺🇸', available: '24/7' },
  { name: 'Befrienders Worldwide', number: 'befrienders.org', tel: 'https://www.befrienders.org/need-to-talk', country: '🌍', available: '24/7' },
]

const QUICK_ACTIONS = [
  { emoji: '🫁', label: 'Breathing Exercise', desc: 'Calm down with guided breathing', link: '/breathe' },
  { emoji: '📝', label: 'Journal It Out', desc: 'Write about your feelings', link: '/journal' },
  { emoji: '💬', label: 'Talk to MindMate', desc: 'Get AI-powered support', link: '/chat' },
]

export default function SOSButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="sos-button"
        title="Emergency helplines"
        aria-label="SOS - Emergency Helplines"
      >
        <span className="text-white font-bold text-xs font-display">SOS</span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-fade-in"
          style={{ background: 'rgba(6,6,15,0.92)', backdropFilter: 'blur(10px)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="sos-modal animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sos-modal-header">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(255,51,85,0.12)' }}>
                  <AlertTriangle className="w-5 h-5" style={{ color: 'var(--crisis)' }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold font-display" style={{ color: 'var(--text-primary)' }}>
                    Crisis Support
                  </h2>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>You are not alone. Help is available.</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-white/5 transition-all" style={{ color: 'var(--text-muted)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Encouragement banner */}
            <div className="sos-banner">
              <Heart className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--crisis)' }} fill="var(--crisis)" />
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                <strong>You matter.</strong> Whatever you're going through, reaching out takes courage. 
                These professionals are available 24/7 and ready to help.
              </p>
            </div>

            {/* Helplines */}
            <div className="sos-helplines">
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                Emergency Helplines
              </h3>
              <div className="space-y-2">
                {HELPLINES.map((h, i) => (
                  <a key={i} href={h.tel} target={h.tel.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer" className="sos-helpline-item">
                    <span className="text-lg flex-shrink-0">{h.country}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{h.name}</p>
                      <p className="text-xs" style={{ color: 'var(--crisis)' }}>{h.number}</p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--positive-bg)', color: 'var(--positive)' }}>{h.available}</span>
                      {h.tel.startsWith('tel') ? (
                        <Phone className="w-4 h-4" style={{ color: 'var(--positive)' }} />
                      ) : (
                        <ExternalLink className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="sos-actions">
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                Quick Coping Actions
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {QUICK_ACTIONS.map((a, i) => (
                  <a key={i} href={a.link} onClick={() => setOpen(false)} className="sos-action-card">
                    <span className="text-xl mb-1">{a.emoji}</span>
                    <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{a.label}</p>
                  </a>
                ))}
              </div>
            </div>

            <p className="text-xs text-center pt-3" style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border-subtle)' }}>
              💙 You deserve help and support. You are not alone.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
