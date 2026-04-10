import { useState, useEffect } from 'react'
import { BookOpen, Plus, Trash2, Heart, Sparkles, ChevronDown, ChevronUp, Download, MessageSquare, List } from 'lucide-react'
import { saveJournalEntry, getHistory } from '../api'


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

  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchHistory = async () => {
    try {
      const data = await getHistory()
      setHistory(data.history || [])
    } catch (err) {
      console.error("Failed to load history", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistory()
    setPromptIdx(Math.floor(Math.random() * PROMPTS.length))
    
    // Sync with other pages
    try {
      const channel = new BroadcastChannel('mindmate_data_updates')
      channel.onmessage = (event) => {
        if (event.data === 'mindmate_data_sync') setTimeout(() => fetchHistory(), 500)
      }
      return () => channel.close()
    } catch (e) {}
  }, [])

  const handleAdd = async () => {
    if (!text.trim()) return
    try {
      await saveJournalEntry("Reflection", text.trim(), mood)
      setText('')
      setMood(null)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      fetchHistory() // Refresh list
    } catch (err) {
      alert("Failed to save entry: " + err.message)
    }
  }

  const handleExport = (format) => {
    if (!history.length) return
    
    let content = ''
    let mimeType = ''
    let filename = `mindmate_history_${new Date().toISOString().split('T')[0]}`

    if (format === 'json') {
      content = JSON.stringify(history, null, 2)
      mimeType = 'application/json'
      filename += '.json'
    } else {
      // CSV
      const headers = ['Date', 'Type', 'Mood/Emotion', 'Content/Message']
      const rows = history.map(item => {
        const d = new Date(item.date && !item.date.endsWith('Z') ? item.date + 'Z' : item.date)
        const date = d.toLocaleString()
        const type = item.type
        const mood = item.mood || item.emotion || '—'
        const text = (item.text || item.last_message || (item.items ? item.items.join('; ') : '')).replace(/"/g, '""')
        return `"${date}","${type}","${mood}","${text}"`
      })
      content = [headers.join(','), ...rows].join('\n')
      mimeType = 'text/csv'
      filename += '.csv'
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleDelete = (id) => {
    saveEntries(entries.filter(e => e.id !== id))
  }

  const newPrompt = () => setPromptIdx((i) => (i + 1) % PROMPTS.length)

  const formatDate = (iso) => {
    if (!iso) return '—'
    const d = new Date(iso.endsWith('Z') ? iso : iso + 'Z')
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  }

  const streak = (() => {
    if (!entries.length) return 0
    const days = [...new Set(entries.map(e => {
      const dt = e.date ? (e.date.endsWith('Z') ? e.date : e.date + 'Z') : new Date().toISOString();
      return new Date(dt).toDateString()
    }))]
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div style={{ textAlign: 'left' }}>
          <h1 className="font-display gradient-text text-2xl sm:text-3xl mb-1">Gratitude & History</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Everything you've shared with MindMate</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => handleExport('csv')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 transition-all" style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button onClick={() => handleExport('json')} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 hover:bg-white/10 transition-all" style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
            <Download className="w-3.5 h-3.5" /> Export JSON
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Memories', value: history.length, color: 'var(--accent-primary)', icon: <List className="w-4 h-4" /> },
          { label: 'Conversations', value: history.filter(h => h.type === 'chat').length, color: 'var(--accent-secondary)', icon: <MessageSquare className="w-4 h-4" /> },
          { label: 'Day Streak', value: `${streak}🔥`, color: 'var(--neutral)', icon: <Sparkles className="w-4 h-4" /> },
        ].map((s, i) => (
          <div key={i} className="glass-card-static p-3 sm:p-4" style={{ textAlign: 'center' }}>
            <div className="flex items-center justify-center gap-2 mb-1" style={{ color: 'var(--text-muted)' }}>
              {s.icon}
              <span className="text-[10px] uppercase font-bold tracking-wider">{s.label}</span>
            </div>
            <p className="text-lg sm:text-xl font-bold font-display" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Writing card (existing) ... */}

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
      {history.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold px-1" style={{ color: 'var(--text-secondary)' }}>
            <BookOpen className="w-4 h-4 inline mr-1.5" />
            Your MindMate History ({history.length})
          </h2>
          {history.map((entry) => {
            const isOpen = expandedId === entry.id
            const moodObj = MOODS.find(m => m.value === entry.mood)
            
            return (
              <div key={entry.id} className="glass-card-static rounded-xl overflow-hidden transition-all hover:border-white/10" style={{ width: '100%', borderLeft: entry.type === 'chat' ? '3px solid var(--accent-secondary)' : entry.type === 'gratitude' ? '3px solid var(--positive)' : '3px solid var(--accent-primary)' }}>
                <div className="p-4 cursor-pointer" onClick={() => setExpandedId(isOpen ? null : entry.id)}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-width-0">
                      <div className="flex items-center gap-2 mb-2">
                        {entry.type === 'chat' ? <MessageSquare className="w-3.5 h-3.5" style={{ color: 'var(--accent-secondary)' }} /> : <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />}
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5" style={{ color: 'var(--text-muted)' }}>{entry.type}</span>
                        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{formatDate(entry.date)}</span>
                        {(entry.mood || entry.emotion) && <span className="text-xs ml-1">{moodObj?.emoji || (entry.emotion === 'Positive' ? '😊' : entry.emotion === 'Negative' ? '😔' : '😐')}</span>}
                      </div>
                      
                      {entry.type === 'chat' ? (
                        <p className="text-sm italic" style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: isOpen ? 'normal' : 'nowrap' }}>
                          Chat: "{entry.last_message}"
                        </p>
                      ) : entry.type === 'gratitude' ? (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {entry.items?.map((it, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 rounded-lg bg-white/5" style={{ color: 'var(--text-primary)' }}>✨ {it}</span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm" style={{ color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: isOpen ? 'normal' : 'nowrap', wordBreak: 'break-word' }}>
                          {entry.text}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 pt-1">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
                    </div>
                  </div>
                  
                  {isOpen && entry.type === 'chat' && (
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                      <div className="p-3 rounded-xl bg-white/5 text-xs text-secondary leading-relaxed">
                        This was a chat with {entry.messages_count} messages. Open the Chat page to start a new one.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="glass-card-static p-10" style={{ textAlign: 'center' }}>
          <p className="text-3xl mb-2">📓</p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No memories yet — start chatting or writing above!</p>
        </div>
      )}
    </div>
  )
}