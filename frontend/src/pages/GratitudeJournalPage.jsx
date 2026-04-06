import { useState, useEffect } from 'react'
import { BookOpen, Plus, Trash2, Heart, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'

const PROMPTS = [
  'What made you smile today?',
  'Who are you grateful for right now?',
  'What is one thing your body did well today?',
  'What small thing brought you comfort today?',
  'What challenge helped you grow recently?',
  'What beauty did you notice in your surroundings?',
  'What is something you take for granted but appreciate?',
  'What skill or talent are you thankful to have?',
]

const MOODS = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😌', label: 'Peaceful', value: 'peaceful' },
  { emoji: '🥰', label: 'Grateful', value: 'grateful' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '😔', label: 'Sad', value: 'sad' },
  { emoji: '😤', label: 'Frustrated', value: 'frustrated' },
]

export default function GratitudeJournalPage() {
  const [entries, setEntries] = useState([])
  const [text, setText] = useState('')
  const [mood, setMood] = useState(null)
  const [promptIdx, setPromptIdx] = useState(0)
  const [expandedId, setExpandedId] = useState(null)
  const [saved, setSaved] = useState(false)

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('mindmate_journal') || '[]')
      setEntries(stored)
    } catch { setEntries([]) }
    setPromptIdx(Math.floor(Math.random() * PROMPTS.length))
  }, [])

  const saveEntries = (updated) => {
    setEntries(updated)
    try { localStorage.setItem('mindmate_journal', JSON.stringify(updated)) } catch {}
  }

  const handleAdd = () => {
    if (!text.trim()) return
    const entry = {
      id: Date.now(),
      text: text.trim(),
      mood: mood || null,
      date: new Date().toISOString(),
    }
    saveEntries([entry, ...entries])
    setText('')
    setMood(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleDelete = (id) => {
    saveEntries(entries.filter(e => e.id !== id))
  }

  const newPrompt = () => setPromptIdx((i) => (i + 1) % PROMPTS.length)

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  }

  const streak = (() => {
    if (!entries.length) return 0
    const days = [...new Set(entries.map(e => new Date(e.date).toDateString()))]
    let count = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      if (days.includes(d.toDateString())) count++
      else break
    }
    return count
  })()

  return (
    <div className="space-y-6 page-enter" style={{ width: '100%', overflowX: 'hidden' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        <h1 className="font-display gradient-text text-2xl sm:text-3xl mb-1">Gratitude Journal</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Build positivity one entry at a time</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Entries', value: entries.length, color: 'var(--accent-primary)' },
          { label: 'Day Streak', value: `${streak}🔥`, color: 'var(--neutral)' },
          { label: 'This Week', value: entries.filter(e => (Date.now() - new Date(e.date)) < 7 * 86400000).length, color: 'var(--positive)' },
        ].map((s, i) => (
          <div key={i} className="glass-card-static p-3 sm:p-4" style={{ textAlign: 'center' }}>
            <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
            <p className="text-lg sm:text-xl font-bold font-display" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Writing card */}
      <div className="glass-card-static p-5 sm:p-6 space-y-4">
        {/* Prompt */}
        <div
          className="rounded-xl p-3 sm:p-4 flex items-start justify-between gap-3"
          style={{ background: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.18)' }}
        >
          <div style={{ minWidth: 0 }}>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--accent-primary)' }}>✨ Today's Prompt</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)', wordBreak: 'break-word' }}>
              {PROMPTS[promptIdx]}
            </p>
          </div>
          <button
            onClick={newPrompt}
            className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:scale-105"
            style={{ background: 'rgba(124,92,252,0.15)', color: 'var(--accent-primary)', whiteSpace: 'nowrap' }}
          >
            New ✦
          </button>
        </div>

        {/* Mood picker */}
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>How are you feeling?</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {MOODS.map((m) => (
              <button
                key={m.value}
                onClick={() => setMood(mood === m.value ? null : m.value)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:scale-105"
                style={{
                  background: mood === m.value ? 'rgba(124,92,252,0.2)' : 'var(--surface-glass)',
                  border: `1px solid ${mood === m.value ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                  color: mood === m.value ? 'var(--text-primary)' : 'var(--text-secondary)',
                }}
              >
                <span>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write what you're grateful for today…"
          rows={4}
          style={{
            width: '100%',
            resize: 'vertical',
            borderRadius: '0.75rem',
            padding: '0.875rem 1rem',
            background: 'var(--surface-glass)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            fontSize: '0.875rem',
            lineHeight: 1.6,
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--border-accent)'}
          onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
        />

        {/* Save button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleAdd}
            disabled={!text.trim()}
            className="btn-gradient px-6 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all"
            style={{ opacity: text.trim() ? 1 : 0.45, cursor: text.trim() ? 'pointer' : 'not-allowed' }}
          >
            {saved ? <><Heart className="w-4 h-4" /> Saved!</> : <><Plus className="w-4 h-4" /> Add Entry</>}
          </button>
        </div>
      </div>

      {/* Entries list */}
      {entries.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold px-1" style={{ color: 'var(--text-secondary)' }}>
            <BookOpen className="w-4 h-4 inline mr-1.5" />
            Past Entries ({entries.length})
          </h2>
          {entries.map((entry) => {
            const isOpen = expandedId === entry.id
            const moodObj = MOODS.find(m => m.value === entry.mood)
            return (
              <div
                key={entry.id}
                className="glass-card-static rounded-xl overflow-hidden"
                style={{ width: '100%' }}
              >
                {/* Entry header */}
                <div
                  className="flex items-center justify-between gap-3 p-4 cursor-pointer"
                  onClick={() => setExpandedId(isOpen ? null : entry.id)}
                  style={{ minWidth: 0 }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                      {moodObj && <span className="text-sm">{moodObj.emoji}</span>}
                      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{formatDate(entry.date)}</span>
                    </div>
                    <p
                      className="text-sm"
                      style={{
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: isOpen ? 'normal' : 'nowrap',
                        wordBreak: 'break-word',
                      }}
                    >
                      {entry.text}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(entry.id) }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--negative)' }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {isOpen
                      ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                      : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                    }
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="glass-card-static p-10" style={{ textAlign: 'center' }}>
          <p className="text-3xl mb-2">📓</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No entries yet — write your first gratitude note above!</p>
        </div>
      )}
    </div>
  )
}