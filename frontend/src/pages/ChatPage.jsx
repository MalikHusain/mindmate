import { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Send, Lightbulb, Trash2, Sparkles, Mic, MicOff, Loader2 } from 'lucide-react'

import { sendMessage, getConversations } from '../api'
import { EmotionBadge, SeverityMeter } from '../components/EmotionBadge'
import CrisisAlert from '../components/CrisisAlert'
import TypingIndicator from '../components/TypingIndicator'

const WELCOME_MSG = {
  role: 'ai',
  text: "Hi there! I'm MindMate, your AI mental health companion. I'm here to listen, support, and help you understand your emotions better.\n\nYou can type or use the voice button to talk to me. How are you feeling today?",
  emotion: null,
  severity: null,
}

const QUICK_PROMPTS = [
  "I'm feeling stressed today",
  "I had a really good day!",
  "I'm feeling anxious about work",
  "I can't sleep well lately",
  "I'm grateful for my friends",
  "I feel lonely right now",
]

export default function ChatPage() {
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPrompts, setShowPrompts] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)
  const recognitionRef = useRef(null)

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const userStr = localStorage.getItem('user')
        const user = userStr ? JSON.parse(userStr) : null
        const userId = user?.email || 'default_user'
        
        const data = await getConversations(userId)
        if (data.conversations?.length) {
          const pastMsgs = []
          data.conversations.forEach(conv => {
            // Each conversation doc in DB is a pair: user message + AI response
            if (conv.user_message) {
              pastMsgs.push({ 
                role: 'user', 
                text: conv.user_message, 
                timestamp: conv.timestamp 
              })
            }
            if (conv.ai_response) {
              pastMsgs.push({ 
                role: 'ai', 
                text: conv.ai_response, 
                emotion: conv.emotion, 
                severity: conv.severity, 
                recommendation: conv.recommendation,
                timestamp: conv.timestamp 
              })
            }
          })
          // Prepend past messages to the welcome message
          setMessages([WELCOME_MSG, ...pastMsgs])
        }
      } catch (err) {
        console.error("Failed to load chat history", err)
      }
    }
    loadHistory()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])


  // Voice Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(r => r[0].transcript)
          .join('')
        setInput(transcript)
      }

      recognition.onend = () => setIsListening(false)
      recognition.onerror = () => setIsListening(false)

      recognitionRef.current = recognition
    }
    return () => recognitionRef.current?.abort()
  }, [])

  const toggleVoice = () => {
    if (!recognitionRef.current) return
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      setInput('')
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const handleSend = async (text) => {
    const msg = (text || input).trim()
    if (!msg || loading) return

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
    }

    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setInput('')
    setLoading(true)
    setShowPrompts(false)

    try {
      const userStr = localStorage.getItem('user')
      const user = userStr ? JSON.parse(userStr) : null
      const userId = user?.email || 'default_user'

      const data = await sendMessage(msg, userId)

      try {
        const channel = new BroadcastChannel('mindmate_data_updates')
        channel.postMessage('mindmate_data_sync')
        channel.close()
      } catch (e) {}

      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: data.empathetic_response,
          emotion: data.emotion,
          severity: data.severity,
          recommendation: data.recommendation,
          is_crisis: data.is_crisis,
          crisis_message: data.crisis_message,
        },
      ])
    } catch {
      setMessages(prev => [
        ...prev,
        {
          role: 'ai',
          text: "I'm sorry, I'm having trouble connecting right now. Please make sure the backend server is running on port 5000.",
          emotion: null,
          severity: null,
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Clears messages from local React state only — does not delete from database
  const clearChat = () => {
    setMessages([WELCOME_MSG])
    setShowPrompts(true)
  }

  const hasVoice = !!(window.SpeechRecognition || window.webkitSpeechRecognition)

  return (
    <div className="chat-container page-enter">

      {/* Header */}
      <div className="page-header flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="font-display gradient-text">Chat with MindMate</h1>
          <p>Your safe space to express yourself</p>
        </div>
        {/* Clear Chat History — always visible so users can reset anytime */}
        <button
          onClick={clearChat}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:bg-white/5"
          style={{ color: 'var(--text-muted)', border: '1px solid var(--border-subtle)' }}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Chat History
        </button>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <MessageBubble key={idx} message={msg} index={idx} />
        ))}

        {showPrompts && messages.length <= 1 && (
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-3.5 h-3.5" style={{ color: 'var(--accent-primary)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Try saying...</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((p, i) => (
                <button key={i} onClick={() => handleSend(p)} className="quick-prompt">{p}</button>
              ))}
            </div>
          </div>
        )}

        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <div className="chat-input-box">
          {hasVoice && (
            <button
              onClick={toggleVoice}
              className={`voice-btn ${isListening ? 'voice-btn-active' : ''}`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          )}
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? 'Listening...' : "Tell me how you're feeling..."}
            rows={1}
            className="chat-textarea"
            disabled={loading}
            id="chat-input"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="send-btn"
            style={{
              background: input.trim() && !loading
                ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                : 'rgba(255,255,255,0.04)',
              opacity: input.trim() && !loading ? 1 : 0.3,
              cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
            }}
            id="send-button"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
        {isListening && (
          <p className="text-center text-xs mt-2 animate-fade-in" style={{ color: 'var(--negative)' }}>
            Listening... Speak now. Click mic to stop.
          </p>
        )}
        <p className="text-center text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
          
        </p>
      </div>
    </div>
  )
}

function MessageBubble({ message, index }) {
  const isUser = message.role === 'user'
  const animClass = isUser ? 'animate-slide-right' : 'animate-slide-left'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${animClass}`} style={{ animationDelay: `${index * 0.03}s` }}>
      <div className={`msg-row ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isUser && (
          <div className="msg-avatar">M</div>
        )}
        <div className="msg-content">
          <div className={`msg-bubble ${isUser ? 'msg-user' : 'msg-ai'}`}>
            {message.text.split('\n').map((line, i) => (
              <span key={i}>{line}{i < message.text.split('\n').length - 1 && <br />}</span>
            ))}
          </div>
          {!isUser && message.emotion && (
            <div className="flex items-center gap-3 flex-wrap">
              <EmotionBadge emotion={message.emotion} />
              <SeverityMeter severity={message.severity} />
            </div>
          )}
          {!isUser && message.recommendation && (
            <div className="msg-recommendation">
              <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent-primary)' }} />
              <span>{message.recommendation}</span>
            </div>
          )}
          {!isUser && message.is_crisis && message.crisis_message && (
            <CrisisAlert message={message.crisis_message} />
          )}
        </div>
      </div>
    </div>
  )
}