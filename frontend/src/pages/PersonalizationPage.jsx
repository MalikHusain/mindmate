import { useState, useEffect } from 'react'
import { Sparkles, ArrowRight, RefreshCw, TrendingUp, Heart } from 'lucide-react'
import { getPersonalization } from '../api'

export default function PersonalizationPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try { setLoading(true); setError(null); const res = await getPersonalization(); setData(res) }
    catch { setError('Could not load personalization. Make sure the backend is running.') }
    finally { setLoading(false) }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="text-center animate-fade-in">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(124,92,252,0.1)' }}>
            <Sparkles className="w-7 h-7" style={{ color: 'var(--accent-primary)' }} />
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>Analyzing your patterns...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="glass-card-static p-8 text-center max-w-md w-full">
          <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button onClick={fetchData} className="btn-gradient px-5 py-2.5 mt-4 text-sm rounded-xl inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 page-enter">
      <div className="page-header">
        <h1 className="font-display gradient-text">Personalized For You</h1>
        <p>Tailored recommendations based on your emotional patterns</p>
      </div>

      {data?.stats && (
        <div className="glass-card-static p-5 sm:p-6">
          <h2 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            <TrendingUp className="w-4 h-4" /> Recent Mood Breakdown (Last 5 entries)
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <MoodPill emoji="😊" label="Positive" count={data.stats.positive} color="var(--positive)" bg="var(--positive-bg)" />
            <MoodPill emoji="😐" label="Neutral" count={data.stats.neutral} color="var(--neutral)" bg="var(--neutral-bg)" />
            <MoodPill emoji="😔" label="Negative" count={data.stats.negative} color="var(--negative)" bg="var(--negative-bg)" />
          </div>
        </div>
      )}

      <div className="glass-card-static p-5 sm:p-6" style={{ background: 'linear-gradient(135deg, rgba(124,92,252,0.08), rgba(92,138,252,0.04))', borderColor: 'var(--border-accent)' }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold mb-1 font-display" style={{ color: 'var(--text-primary)' }}>MindMate's Insight</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {data?.message || 'Start chatting to receive personalized insights!'}
            </p>
          </div>
        </div>
      </div>

      {data?.suggestions?.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold mb-4 font-display" style={{ color: 'var(--text-secondary)' }}>Recommended Activities</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.suggestions.map((s, i) => (
              <div key={i} className="glass-card p-5 group cursor-pointer">
                <div className="flex items-start gap-3">
                  <span className="text-2xl sm:text-3xl flex-shrink-0">{s.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold mb-1 flex items-center gap-2 font-display" style={{ color: 'var(--text-primary)' }}>
                      {s.title}
                      <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 flex-shrink-0" style={{ color: 'var(--accent-primary)' }} />
                    </h3>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{s.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card-static p-5 sm:p-6">
        <h2 className="text-sm font-semibold mb-4 font-display" style={{ color: 'var(--text-secondary)' }}>💡 Daily Wellness Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <WellnessTip emoji="😴" text="Aim for 7-9 hours of sleep — it's the foundation of mental health." />
          <WellnessTip emoji="💧" text="Stay hydrated. Dehydration can significantly affect mood and cognition." />
          <WellnessTip emoji="🏃" text="20 minutes of movement daily can reduce anxiety by up to 20%." />
          <WellnessTip emoji="📱" text="Try a 1-hour digital detox before bed for better sleep quality." />
        </div>
      </div>

      <div className="text-center pt-2">
        <button onClick={fetchData} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/5"
          style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
          <RefreshCw className="w-4 h-4" /> Refresh Recommendations
        </button>
      </div>
    </div>
  )
}

function MoodPill({ emoji, label, count, color, bg }) {
  return (
    <div className="flex items-center gap-2 rounded-xl px-3 sm:px-4 py-3" style={{ background: bg, border: `1px solid ${color}20` }}>
      <span className="text-lg sm:text-xl">{emoji}</span>
      <div>
        <p className="text-lg sm:text-xl font-bold" style={{ color }}>{count}</p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
      </div>
    </div>
  )
}

function WellnessTip({ emoji, text }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)' }}>
      <span className="text-base flex-shrink-0">{emoji}</span>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{text}</p>
    </div>
  )
}