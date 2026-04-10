import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Cloud, BookOpen, MessageSquare, List } from 'lucide-react'
import { getHistory } from '../api'

export default function JournalPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)

  const fetchAll = async () => {
    try {
      setLoading(true)
      const data = await getHistory()
      // Filter or sort as needed, here we show all as a unified reflection history
      setHistory(data.history || [])
    } catch (err) {
      console.error("Failed to load history", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
    
    // Real-time sync with Chat/Profile
    try {
      const channel = new BroadcastChannel('mindmate_data_updates')
      channel.onmessage = (event) => {
        if (event.data === 'mindmate_data_sync') {
          setTimeout(() => fetchAll(), 500)
        }
      }
      return () => channel.close()
    } catch (e) {}
  }, [])

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    const d = new Date(dateStr.endsWith('Z') ? dateStr : dateStr + 'Z')
    return d.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <BookOpen className="w-10 h-10 text-teal-600 mb-4 opacity-50" />
        <p className="text-gray-500 text-sm">Loading your reflections...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 page-enter">
      
      {/* Header Area */}
      <div>
        <h1 className="text-4xl font-bold mb-2" style={{ color: '#0f766e' }}>Journal</h1>
        <p className="text-gray-500 text-lg">
          Your personal reflection history — every conversation, saved automatically.
        </p>
      </div>

      {/* Info Banner */}
      <div 
        className="flex items-center justify-between px-6 py-4 rounded-2xl"
        style={{ 
          background: 'rgba(20, 184, 166, 0.05)', 
          border: '1px solid rgba(20, 184, 166, 0.15)',
          color: '#0d9488'
        }}
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5" />
          <span className="font-semibold text-lg">{history.length} Journal Entries</span>
        </div>
        <span className="text-sm opacity-80 hidden sm:block">
          Tap any entry to read the full response
        </span>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {history.length > 0 ? (
          history.map((item) => {
            const isChat = item.type === 'chat'
            const isOpen = expandedId === item.id
            const displayTitle = item.type === 'chat' ? item.last_message : (item.text || item.title || "Note")
            
            return (
              <div 
                key={item.id}
                className="bg-white border border-gray-100 rounded-3xl overflow-hidden transition-all hover:shadow-md cursor-pointer"
                onClick={() => setExpandedId(isOpen ? null : item.id)}
              >
                <div className="p-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    {/* Cloud Icon Box */}
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(124, 92, 252, 0.08)' }}
                    >
                      {isChat ? (
                        <Cloud className="w-7 h-7" style={{ color: '#7c5cfc' }} />
                      ) : (
                        <BookOpen className="w-7 h-7" style={{ color: '#0d9488' }} />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-800 truncate">
                        {displayTitle}
                      </h3>
                      <p className="text-gray-400 text-sm mt-0.5">
                        {formatDate(item.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {item.emotion && (
                      <span 
                        className="px-4 py-1.5 rounded-full text-xs font-bold"
                        style={{ 
                          background: 'white', 
                          border: '1.5px solid #e2e8f0',
                          color: '#64748b'
                        }}
                      >
                        {item.emotion}
                      </span>
                    )}
                    <ChevronDown 
                      className={`w-5 h-5 text-gray-300 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                    />
                  </div>
                </div>

                {/* Expanded content */}
                {isOpen && (
                  <div className="px-5 pb-6 animate-fade-in">
                    <div className="h-px bg-gray-50 mb-4" />
                    <div className="space-y-4">
                      {isChat ? (
                         <div className="p-4 rounded-2xl bg-gray-50 text-gray-600 text-sm leading-relaxed">
                            <h4 className="font-bold text-gray-800 mb-2">Conversation Recap:</h4>
                            <p>You shared your feelings about <span className="font-bold">"{item.last_message}"</span>.</p>
                            <p className="mt-2 italic">Open the Chat companion to dive deeper into this topic.</p>
                         </div>
                      ) : (
                        <p className="text-gray-600 leading-relaxed">
                          {item.text || item.content}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
            <p className="text-4xl mb-3">📓</p>
            <p className="text-gray-500">No reflections saved yet. Start a chat or write a note!</p>
          </div>
        )}
      </div>
    </div>
  )
}
