import { useState, useEffect } from 'react'
import { BookOpen, Plus, X, Save, Heart, Sparkles } from 'lucide-react'
import { saveJournalEntry, getJournalEntries, saveGratitude, getGratitude } from '../api'

const MOOD_OPTIONS = [
  { value: 'Positive', emoji: '😊', label: 'Good', color: 'var(--positive)' },
  { value: 'Neutral', emoji: '😐', label: 'Okay', color: 'var(--neutral)' },
  { value: 'Negative', emoji: '😔', label: 'Low', color: 'var(--negative)' },
]

export default function JournalPage() {
  const [tab, setTab] = useState('journal')
  const [entries, setEntries] = useState([])
  const [gratitudeEntries, setGratitudeEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [mood, setMood] = useState('Neutral')
  const [saving, setSaving] = useState(false)

  // Gratitude
  const [g1, setG1] = useState('')
  const [g2, setG2] = useState('')
  const [g3, setG3] = useState('')
  const [savingGratitude, setSavingGratitude] = useState(false)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [jData, gData] = await Promise.all([
        getJournalEntries().catch(() => ({ entries: [] })),
        getGratitude().catch(() => ({ entries: [] })),
      ])
      setEntries(jData.entries || [])
      setGratitudeEntries(gData.entries || [])
    } finally { setLoading(false) }
  }

  const handleSave = async () => {
    if (!content.trim()) return
    try {
      setSaving(true)
      await saveJournalEntry(title.trim(), content.trim(), mood)
      setTitle(''); setContent(''); setMood('Neutral'); setShowForm(false)
      await fetchAll()
    } catch { alert('Failed to save. Make sure the backend is running.') }
    finally { setSaving(false) }
  }

  const handleSaveGratitude = async () => {
    const items = [g1, g2, g3].filter(x => x.trim())
    if (items.length === 0) return
    try {
      setSavingGratitude(true)
      await saveGratitude(items)
      setG1(''); setG2(''); setG3('')
      await fetchAll()
    } catch { alert('Failed to save. Make sure the backend is running.') }
    finally { setSavingGratitude(false) }
  }

  const moodColor = (m) => m === 'Positive' ? 'var(--positive)' : m === 'Negative' ? 'var(--negative)' : 'var(--neutral)'
  const moodEmoji = (m) => m === 'Positive' ? '😊' : m === 'Negative' ? '😔' : '😐'

  return (
    <div className="space-y-5 page-enter">
      {/* Header */}
      <div className="page-header flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-display gradient-text">Journal & Gratitude</h1>
          <p>Express yourself and cultivate positivity</p>
        </div>
        {tab === 'journal' && (
          <button onClick={() => setShowForm(!showForm)} className="btn-gradient px-5 py-2.5 text-sm rounded-xl inline-flex items-center gap-2 self-start">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? 'Cancel' : 'New Entry'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab('journal')} className="tab-btn" style={{
          background: tab === 'journal' ? 'rgba(124,92,252,0.12)' : 'transparent',
          color: tab === 'journal' ? 'var(--accent-primary)' : 'var(--text-muted)',
          border: `1px solid ${tab === 'journal' ? 'rgba(124,92,252,0.25)' : 'var(--border-subtle)'}`
        }}>
          <BookOpen className="w-4 h-4" /> Journal
        </button>
        <button onClick={() => setTab('gratitude')} className="tab-btn" style={{
          background: tab === 'gratitude' ? 'rgba(34,214,154,0.12)' : 'transparent',
          color: tab === 'gratitude' ? 'var(--positive)' : 'var(--text-muted)',
          border: `1px solid ${tab === 'gratitude' ? 'rgba(34,214,154,0.25)' : 'var(--border-subtle)'}`
        }}>
          <Heart className="w-4 h-4" /> Gratitude
        </button>
      </div>

      {/* ═══ JOURNAL TAB ═══ */}
      {tab === 'journal' && (
        <>
          {showForm && (
            <div className="glass-card-static p-5 sm:p-6 animate-slide-down">
              <h2 className="text-sm font-semibold mb-4 font-display" style={{ color: 'var(--text-secondary)' }}>✍️ Write a Journal Entry</h2>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)"
                className="w-full bg-transparent outline-none px-4 py-3 rounded-xl text-sm mb-3" style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
              <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What's on your mind? Write freely..." rows={5}
                className="w-full bg-transparent outline-none px-4 py-3 rounded-xl text-sm leading-relaxed resize-none mb-4" style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
              <div className="mb-4">
                <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>How are you feeling?</p>
                <div className="flex flex-wrap gap-2">
                  {MOOD_OPTIONS.map((m) => (
                    <button key={m.value} onClick={() => setMood(m.value)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{ border: `1px solid ${mood === m.value ? m.color + '50' : 'var(--border-subtle)'}`, background: mood === m.value ? m.color + '12' : 'transparent', color: mood === m.value ? m.color : 'var(--text-secondary)' }}>
                      <span>{m.emoji}</span><span>{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={handleSave} disabled={!content.trim() || saving} className="btn-gradient px-6 py-2.5 text-sm rounded-xl inline-flex items-center gap-2"
                style={{ opacity: !content.trim() || saving ? 0.5 : 1 }}>
                <Save className="w-4 h-4" />{saving ? 'Saving...' : 'Save Entry'}
              </button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-16">
              <BookOpen className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--accent-primary)', opacity: 0.5 }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading journal...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-16 glass-card-static p-10 rounded-2xl">
              <p className="text-5xl mb-4">📔</p>
              <p className="text-lg font-semibold font-display mb-2" style={{ color: 'var(--text-secondary)' }}>Your journal is empty</p>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>Start writing to track your emotional journey over time.</p>
              <button onClick={() => setShowForm(true)} className="btn-gradient px-6 py-3 text-sm rounded-xl inline-flex items-center gap-2">
                <Plus className="w-4 h-4" /> Write Your First Entry
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry, i) => (
                <div key={entry.id || i} className="glass-card p-5 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-start justify-between mb-3 gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-lg flex-shrink-0">{moodEmoji(entry.mood)}</span>
                      <div className="min-w-0">
                        {entry.title && <h3 className="text-sm font-semibold font-display truncate" style={{ color: 'var(--text-primary)' }}>{entry.title}</h3>}
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {new Date(entry.timestamp).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ background: moodColor(entry.mood) + '12', color: moodColor(entry.mood), border: `1px solid ${moodColor(entry.mood)}20` }}>{entry.mood}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)', wordBreak: 'break-word' }}>{entry.content}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ═══ GRATITUDE TAB ═══ */}
      {tab === 'gratitude' && (
        <>
          <div className="glass-card-static p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5" style={{ color: 'var(--positive)' }} />
              <h2 className="text-sm font-semibold font-display" style={{ color: 'var(--text-secondary)' }}>What are you grateful for today?</h2>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold" style={{ color: 'var(--positive)' }}>1.</span>
                <input type="text" value={g1} onChange={(e) => setG1(e.target.value)} placeholder="I'm grateful for..."
                  className="flex-1 bg-transparent outline-none px-4 py-3 rounded-xl text-sm" style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold" style={{ color: 'var(--positive)' }}>2.</span>
                <input type="text" value={g2} onChange={(e) => setG2(e.target.value)} placeholder="I appreciate..."
                  className="flex-1 bg-transparent outline-none px-4 py-3 rounded-xl text-sm" style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold" style={{ color: 'var(--positive)' }}>3.</span>
                <input type="text" value={g3} onChange={(e) => setG3(e.target.value)} placeholder="I'm thankful for..."
                  className="flex-1 bg-transparent outline-none px-4 py-3 rounded-xl text-sm" style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }} />
              </div>
            </div>
            <button onClick={handleSaveGratitude} disabled={(!g1.trim() && !g2.trim() && !g3.trim()) || savingGratitude}
              className="btn-gradient px-6 py-2.5 text-sm rounded-xl inline-flex items-center gap-2"
              style={{ opacity: (!g1.trim() && !g2.trim() && !g3.trim()) || savingGratitude ? 0.5 : 1 }}>
              <Heart className="w-4 h-4" /> {savingGratitude ? 'Saving...' : 'Save Gratitude 🙏'}
            </button>
          </div>

          {/* Gratitude History */}
          {loading ? (
            <div className="text-center py-10"><p className="text-sm" style={{ color: 'var(--text-muted)' }}>Loading...</p></div>
          ) : gratitudeEntries.length === 0 ? (
            <div className="text-center py-12 glass-card-static p-8 rounded-2xl">
              <p className="text-4xl mb-3">🙏</p>
              <p className="text-base font-semibold font-display mb-2" style={{ color: 'var(--text-secondary)' }}>No gratitude entries yet</p>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Write what you're grateful for above to start building a positive mindset!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {gratitudeEntries.map((entry, i) => (
                <div key={entry.id || i} className="glass-card p-4 animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <p className="text-xs mb-3 font-medium" style={{ color: 'var(--text-muted)' }}>
                    {new Date(entry.timestamp).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </p>
                  <div className="space-y-2">
                    {(entry.items || []).map((item, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <span className="text-sm flex-shrink-0">💛</span>
                        <p className="text-sm" style={{ color: 'var(--text-primary)', wordBreak: 'break-word' }}>{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
