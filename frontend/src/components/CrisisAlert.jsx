import { AlertTriangle, Phone } from 'lucide-react'

export default function CrisisAlert({ message }) {
  return (
    <div className="crisis-banner animate-fade-in-up">
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <AlertTriangle className="w-5 h-5" style={{ color: 'var(--crisis)' }} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--crisis)' }}>
            ⚠️ We're concerned about you
          </h4>
          <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'var(--text-primary)' }}>
            {message}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="tel:9152987821"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:brightness-110"
              style={{
                background: 'rgba(255, 51, 85, 0.2)',
                color: 'var(--crisis)',
                border: '1px solid rgba(255, 51, 85, 0.3)',
              }}
            >
              <Phone className="w-3 h-3" />
              iCall: 9152987821
            </a>
            <a
              href="tel:18002662345"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:brightness-110"
              style={{
                background: 'rgba(255, 51, 85, 0.2)',
                color: 'var(--crisis)',
                border: '1px solid rgba(255, 51, 85, 0.3)',
              }}
            >
              <Phone className="w-3 h-3" />
              Vandrevala: 1860-2662-345
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
