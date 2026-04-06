import { useState, useEffect } from 'react'
import { User, Bell, Palette, Shield, Save, Sun, Moon, Check, Trash2 } from 'lucide-react'
import { useTheme } from '../ThemeContext'

const AVATARS = ['🧠', '🌱', '🌸', '🌟', '🦋', '🌈', '🌊', '🔥', '🎯', '💫']

const NOTIFICATION_OPTIONS = [
  { id: 'daily_checkin', label: 'Daily Check-in Reminder', desc: 'Get reminded to log your mood every day' },
  { id: 'breathing', label: 'Breathing Exercise Reminders', desc: 'Reminders to take mindful breathing breaks' },
  { id: 'weekly_report', label: 'Weekly Progress Report', desc: 'Summary of your mood trends every Monday' },
  { id: 'achievements', label: 'Achievement Notifications', desc: 'Get notified when you unlock new badges' },
]

const ACCENT_COLORS = [
  { name: 'Purple', primary: '#7c5cfc', secondary: '#5c8afc' },
  { name: 'Teal', primary: '#06b6d4', secondary: '#0891b2' },
  { name: 'Rose', primary: '#f43f5e', secondary: '#ec4899' },
  { name: 'Emerald', primary: '#10b981', secondary: '#059669' },
  { name: 'Amber', primary: '#f59e0b', secondary: '#d97706' },
  { name: 'Indigo', primary: '#6366f1', secondary: '#4f46e5' },
]

export default function ProfileSettingsPage() {
  const { theme, toggleTheme } = useTheme()

  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('🧠')
  const [notifications, setNotifications] = useState({
    daily_checkin: true,
    breathing: false,
    weekly_report: true,
    achievements: true,
  })
  const [selectedAccent, setSelectedAccent] = useState('Purple')
  const [saved, setSaved] = useState(false)
  const [clearConfirm, setClearConfirm] = useState(false)

  // Load settings
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('mindmate_settings') || '{}')
      if (s.name) setName(s.name)
      if (s.avatar) setAvatar(s.avatar)
      if (s.notifications) setNotifications(s.notifications)
      if (s.accent) setSelectedAccent(s.accent)
    } catch {}
  }, [])

  const handleSave = () => {
    try {
      localStorage.setItem('mindmate_settings', JSON.stringify({ name, avatar, notifications, accent: selectedAccent }))
    } catch {}
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleClearData = () => {
    if (!clearConfirm) { setClearConfirm(true); setTimeout(() => setClearConfirm(false), 3000); return }
    try {
      localStorage.removeItem('mindmate_journal')
      localStorage.removeItem('mindmate_settings')
    } catch {}
    setClearConfirm(false)
    setName('')
    setAvatar('🧠')
    setNotifications({ daily_checkin: true, breathing: false, weekly_report: true, achievements: true })
    setSelectedAccent('Purple')
  }

  const toggleNotif = (id) => setNotifications(prev => ({ ...prev, [id]: !prev[id] }))

  const stats = (() => {
    try {
      const j = JSON.parse(localStorage.getItem('mindmate_journal') || '[]')
      return { journalEntries: j.length }
    } catch { return { journalEntries: 0 } }
  })()

  return (
    <div className="space-y-6 page-enter" style={{ width: '100%', overflowX: 'hidden' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', width: '100%' }}>
        <h1 className="font-display gradient-text text-2xl sm:text-3xl mb-1">Profile & Settings</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Personalize your MindMate experience</p>
      </div>

      {/* Profile card */}
      <div className="glass-card-static p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Your Profile</h2>
        </div>

        {/* Avatar row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto sm:mx-0"
            style={{ background: 'rgba(124,92,252,0.12)', fontSize: '2rem' }}
          >
            {avatar}
          </div>
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Choose your avatar</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {AVATARS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAvatar(a)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all hover:scale-110"
                  style={{
                    background: avatar === a ? 'rgba(124,92,252,0.2)' : 'var(--surface-glass)',
                    border: `1px solid ${avatar === a ? 'var(--border-accent)' : 'var(--border-subtle)'}`,
                  }}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Name input */}
        <div>
          <label className="text-xs font-medium block mb-1.5" style={{ color: 'var(--text-muted)' }}>Display Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What should we call you?"
            maxLength={30}
            style={{
              width: '100%',
              borderRadius: '0.75rem',
              padding: '0.75rem 1rem',
              background: 'var(--surface-glass)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--border-accent)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-subtle)'}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-3 text-center" style={{ background: 'var(--surface-glass)', border: '1px solid var(--border-subtle)' }}>
            <p className="text-lg font-bold font-display" style={{ color: 'var(--accent-primary)' }}>{stats.journalEntries}</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Journal Entries</p>
          </div>
          <div className="rounded-xl p-3 text-center" style={{ background: 'var(--surface-glass)', border: '1px solid var(--border-subtle)' }}>
            <p className="text-lg font-bold font-display" style={{ color: 'var(--accent-secondary)' }}>MindMate</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Member</p>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="glass-card-static p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Palette className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Appearance</h2>
        </div>

        {/* Theme toggle */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div style={{ minWidth: 0 }}>
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>App Theme</p>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Switch between dark and light mode</p>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 flex-shrink-0"
            style={{
              background: 'var(--surface-glass)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
            }}
          >
            {theme === 'dark'
              ? <><Sun className="w-4 h-4" /> Light Mode</>
              : <><Moon className="w-4 h-4" /> Dark Mode</>
            }
          </button>
        </div>

        {/* Accent color */}
        <div>
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Accent Color (visual preference)</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {ACCENT_COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => setSelectedAccent(c.name)}
                title={c.name}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all hover:scale-105"
                style={{
                  background: selectedAccent === c.name ? `${c.primary}22` : 'var(--surface-glass)',
                  border: `1px solid ${selectedAccent === c.name ? c.primary : 'var(--border-subtle)'}`,
                  color: selectedAccent === c.name ? c.primary : 'var(--text-secondary)',
                }}
              >
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: c.primary }} />
                {c.name}
                {selectedAccent === c.name && <Check className="w-3 h-3" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card-static p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Bell className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Notifications</h2>
        </div>

        <div className="space-y-3">
          {NOTIFICATION_OPTIONS.map((opt) => (
            <div
              key={opt.id}
              className="flex items-center justify-between gap-3 rounded-xl p-3 transition-all hover:bg-white/5 cursor-pointer"
              style={{ border: '1px solid var(--border-subtle)', minWidth: 0 }}
              onClick={() => toggleNotif(opt.id)}
            >
              <div style={{ minWidth: 0 }}>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{opt.label}</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)', wordBreak: 'break-word' }}>{opt.desc}</p>
              </div>
              {/* Toggle */}
              <div
                className="flex-shrink-0 w-11 h-6 rounded-full transition-all duration-300 relative"
                style={{
                  background: notifications[opt.id] ? 'var(--accent-primary)' : 'rgba(255,255,255,0.1)',
                  border: `1px solid ${notifications[opt.id] ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                }}
              >
                <div
                  className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300"
                  style={{
                    background: '#fff',
                    left: notifications[opt.id] ? 'calc(100% - 1.375rem)' : '0.125rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy & Data */}
      <div className="glass-card-static p-5 sm:p-6 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
          <h2 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Privacy & Data</h2>
        </div>

        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(124,92,252,0.06)', border: '1px solid rgba(124,92,252,0.15)' }}
        >
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', wordBreak: 'break-word' }}>
            🔒 MindMate stores your journal and settings locally on your device. No personal data is sent to any external server without your consent. Your conversations are private and secure.
          </p>
        </div>

        <button
          onClick={handleClearData}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-105"
          style={{
            background: clearConfirm ? 'rgba(239,68,68,0.15)' : 'var(--surface-glass)',
            border: `1px solid ${clearConfirm ? 'rgba(239,68,68,0.4)' : 'var(--border-subtle)'}`,
            color: clearConfirm ? 'var(--negative)' : 'var(--text-secondary)',
          }}
        >
          <Trash2 className="w-4 h-4" />
          {clearConfirm ? 'Tap again to confirm — this cannot be undone' : 'Clear All Local Data'}
        </button>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className="btn-gradient w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
      >
        {saved ? <><Check className="w-4 h-4" /> Settings Saved!</> : <><Save className="w-4 h-4" /> Save Settings</>}
      </button>

    </div>
  )
}