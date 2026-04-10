import { useState, useEffect } from 'react'
import { Shield, Save, Sun, Moon, Check, Trash2, LogOut, RefreshCcw, Sparkles, Camera } from 'lucide-react'
import { useTheme } from '../ThemeContext'
import { clearData, deleteAccount, resetChats } from '../api'

const AVATARS = ['🧠', '🌱', '🌸', '🌟', '🦋', '🌈', '🌊', '🔥', '🎯', '💫']

export default function ProfileSettingsPage() {
  const { theme, toggleTheme } = useTheme()

  const [name,    setName]   = useState('')
  const [avatar,  setAvatar] = useState('🧠')
  const [saved,   setSaved]  = useState(false)

  const [clearDataLoading,     setClearDataLoading]     = useState(false)
  const [resetChatsLoading,    setResetChatsLoading]    = useState(false)
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false)

  const [backendClearConfirm,  setBackendClearConfirm]  = useState(false)
  const [resetChatsConfirm,    setResetChatsConfirm]    = useState(false)
  const [accountDeleteConfirm, setAccountDeleteConfirm] = useState(false)

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('mindmate_settings') || '{}')
      if (s.name)   setName(s.name)
      if (s.avatar) setAvatar(s.avatar)
    } catch {}
  }, [])

  const handleSave = () => {
    try {
      localStorage.setItem('mindmate_settings', JSON.stringify({ name, avatar }))
    } catch {}
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const triggerSync = () => {
    try {
      const channel = new BroadcastChannel('mindmate_data_updates')
      if (channel) { channel.postMessage('mindmate_data_sync'); channel.close() }
    } catch {}
    localStorage.setItem('mindmate_last_sync', Date.now().toString())
  }

  const handleClearBackendData = async () => {
    if (!backendClearConfirm) {
      setBackendClearConfirm(true)
      setTimeout(() => setBackendClearConfirm(false), 4000)
      return
    }
    setClearDataLoading(true)
    try {
      await clearData()
      alert('Success: All logs and data have been wiped.')
      triggerSync()
      setBackendClearConfirm(false)
    } catch (err) { alert('Error: ' + err.message) }
    finally { setClearDataLoading(false) }
  }

  const handleResetChats = async () => {
    if (!resetChatsConfirm) {
      setResetChatsConfirm(true)
      setTimeout(() => setResetChatsConfirm(false), 4000)
      return
    }
    setResetChatsLoading(true)
    try {
      await resetChats()
      alert('Success: Chat history has been reset.')
      triggerSync()
      setResetChatsConfirm(false)
    } catch (err) { alert('Error: ' + err.message) }
    finally { setResetChatsLoading(false) }
  }

  const handleDeleteAccountAction = async () => {
    if (!accountDeleteConfirm) {
      setAccountDeleteConfirm(true)
      setTimeout(() => setAccountDeleteConfirm(false), 4000)
      return
    }
    setDeleteAccountLoading(true)
    try {
      await deleteAccount()
      localStorage.clear()
      window.location.href = '/'
    } catch (err) { alert('Error: ' + err.message) }
    finally { setDeleteAccountLoading(false) }
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes avatarPop {
          0%   { transform: scale(0.85); opacity: 0; }
          70%  { transform: scale(1.06); }
          100% { transform: scale(1);    opacity: 1; }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .ps-card {
          background: var(--bg-card, rgba(255,255,255,0.04));
          border: 1px solid var(--border-subtle, rgba(0,0,0,0.07));
          border-radius: 1.5rem;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .ps-card:hover { border-color: var(--border-accent, rgba(0,150,150,0.25)); }
        .ps-section { animation: fadeUp 0.45s cubic-bezier(.22,.68,0,1.2) both; }
        .ps-avatar-ring {
          position: relative;
          width: 96px; height: 96px;
          border-radius: 2rem;
          display: flex; align-items: center; justify-content: center;
          font-size: 3rem;
          background: linear-gradient(135deg, rgba(0,97,98,0.12), rgba(0,99,152,0.12));
          border: 2px solid var(--border-accent, rgba(0,150,150,0.3));
          box-shadow: 0 8px 32px rgba(0,97,98,0.18);
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          animation: avatarPop 0.5s cubic-bezier(.22,.68,0,1.4) both;
        }
        .ps-avatar-ring:hover { transform: scale(1.05); box-shadow: 0 12px 40px rgba(0,97,98,0.28); }
        .ps-avatar-chip {
          width: 36px; height: 36px; border-radius: 0.75rem;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem; cursor: pointer;
          transition: all 0.18s cubic-bezier(.22,.68,0,1.4);
          border: 1.5px solid transparent;
        }
        .ps-avatar-chip:hover { transform: scale(1.12); }
        .ps-name-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1.5px solid var(--border-subtle, rgba(0,0,0,0.1));
          padding: 8px 4px;
          font-size: 1.35rem;
          font-weight: 700;
          text-align: center;
          outline: none;
          color: var(--text-primary);
          transition: border-color 0.2s;
          font-family: inherit;
        }
        .ps-name-input:focus { border-bottom-color: #006162; }
        .ps-name-input::placeholder { opacity: 0.25; font-weight: 400; }
        .ps-toggle-track {
          width: 46px; height: 26px; border-radius: 999px;
          position: relative; cursor: pointer;
          transition: background 0.3s;
          flex-shrink: 0;
        }
        .ps-toggle-thumb {
          position: absolute; top: 3px;
          width: 20px; height: 20px; border-radius: 50%;
          background: #fff; box-shadow: 0 1px 4px rgba(0,0,0,0.2);
          transition: left 0.3s cubic-bezier(.22,.68,0,1.4);
        }
        .ps-danger-btn {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; gap: 8px;
          padding: 20px 16px; border-radius: 1.25rem;
          cursor: pointer; border: 1.5px solid rgba(239,68,68,0.15);
          transition: all 0.2s;
          font-family: inherit;
        }
        .ps-danger-btn:hover:not(:disabled) {
          border-color: rgba(239,68,68,0.4);
          background: rgba(239,68,68,0.08) !important;
        }
        .ps-danger-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .ps-save-btn {
          width: 100%; max-width: 300px;
          padding: 14px 28px; border-radius: 999px;
          font-size: 1rem; font-weight: 700; letter-spacing: 0.02em;
          cursor: pointer; border: none; color: #fff;
          background: linear-gradient(135deg, #006162 0%, #006398 100%);
          box-shadow: 0 6px 24px rgba(0,97,98,0.32);
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: all 0.2s cubic-bezier(.22,.68,0,1.2);
          font-family: inherit;
        }
        .ps-save-btn:hover { transform: scale(1.04); box-shadow: 0 10px 32px rgba(0,97,98,0.42); }
        .ps-save-btn:active { transform: scale(0.97); }
        .ps-label {
          font-size: 10px; font-weight: 800; letter-spacing: 0.14em;
          text-transform: uppercase; opacity: 0.45;
          color: var(--text-muted);
          margin-bottom: 10px;
        }
      `}</style>

      <div style={{
        width: '100%',
        maxWidth: 560,
        margin: '0 auto',
        padding: 'clamp(1.5rem, 4vw, 2.5rem) 1rem 4rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
      }}>

        {/* ── Page Header ── */}
        <div className="ps-section" style={{ animationDelay: '0ms', textAlign: 'center', marginBottom: 4 }}>
          <p className="ps-label" style={{ marginBottom: 6 }}>
            <Sparkles size={10} style={{ display: 'inline', marginRight: 4 }} />
            Your Space
          </p>
          <h1 style={{
            fontSize: 'clamp(1.6rem, 4vw, 2rem)',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #006162, #006398)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0, lineHeight: 1.2,
          }}>
            My Profile
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6, opacity: 0.6 }}>
            Manage your identity and preferences
          </p>
        </div>

        {/* ── Identity Card ── */}
        <div className="ps-card ps-section" style={{ animationDelay: '60ms', padding: '2rem 1.75rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>

            {/* Avatar */}
            <div style={{ position: 'relative' }}>
              <div className="ps-avatar-ring">
                {avatar}
              </div>
              <div style={{
                position: 'absolute', bottom: -6, right: -6,
                width: 26, height: 26, borderRadius: '50%',
                background: 'linear-gradient(135deg, #006162, #006398)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,97,98,0.4)',
                border: '2px solid var(--bg-card, #fff)',
              }}>
                <Camera size={11} color="#fff" />
              </div>
            </div>

            {/* Avatar picker */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', maxWidth: 260 }}>
              {AVATARS.map((a, i) => {
                const sel = avatar === a
                return (
                  <button
                    key={a}
                    className="ps-avatar-chip"
                    onClick={() => setAvatar(a)}
                    style={{
                      background: sel
                        ? 'linear-gradient(135deg, rgba(0,97,98,0.15), rgba(0,99,152,0.15))'
                        : 'rgba(128,128,128,0.06)',
                      borderColor: sel ? 'rgba(0,97,98,0.4)' : 'transparent',
                      opacity: sel ? 1 : 0.4,
                      transform: sel ? 'scale(1.15)' : 'scale(1)',
                      boxShadow: sel ? '0 2px 10px rgba(0,97,98,0.2)' : 'none',
                    }}
                  >
                    {a}
                  </button>
                )
              })}
            </div>

            {/* Name input */}
            <div style={{ width: '100%', maxWidth: 280 }}>
              <p className="ps-label" style={{ textAlign: 'center' }}>Display Name</p>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="What should I call you?"
                className="ps-name-input"
              />
            </div>
          </div>
        </div>

        {/* ── App Atmosphere ── */}
        <div className="ps-card ps-section" style={{ animationDelay: '120ms' }}>
          <button
            onClick={toggleTheme}
            style={{
              width: '100%', padding: '1.25rem 1.5rem',
              display: 'flex', alignItems: 'center', gap: '1rem',
              background: 'transparent', border: 'none', cursor: 'pointer',
              borderRadius: '1.5rem', fontFamily: 'inherit',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,97,98,0.04)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            {/* Icon */}
            <div style={{
              width: 44, height: 44, borderRadius: '0.875rem', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: theme === 'dark' ? 'rgba(251,191,36,0.12)' : 'rgba(251,191,36,0.15)',
            }}>
              {theme === 'dark'
                ? <Moon size={20} style={{ color: '#f59e0b' }} />
                : <Sun  size={20} style={{ color: '#f59e0b' }} />}
            </div>

            {/* Label */}
            <div style={{ textAlign: 'left', flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                App Atmosphere
              </p>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', opacity: 0.55, margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Currently: {theme}
              </p>
            </div>

            {/* Toggle */}
            <div
              className="ps-toggle-track"
              style={{ background: theme === 'dark' ? '#006162' : 'rgba(0,0,0,0.15)' }}
            >
              <div
                className="ps-toggle-thumb"
                style={{ left: theme === 'dark' ? 23 : 3 }}
              />
            </div>
          </button>
        </div>

        {/* ── Data Controls ── */}
        <div className="ps-card ps-section" style={{ animationDelay: '180ms', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.25rem' }}>
            <Shield size={14} style={{ color: 'rgba(239,68,68,0.5)' }} />
            <p className="ps-label" style={{ margin: 0 }}>Data Controls</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Row: Reset Chats + Clear All */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button
                className="ps-danger-btn"
                onClick={handleResetChats}
                disabled={resetChatsLoading}
                style={{
                  background: resetChatsConfirm ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.04)',
                  color: '#ef4444',
                  borderColor: resetChatsConfirm ? 'rgba(239,68,68,0.5)' : 'rgba(239,68,68,0.15)',
                }}
              >
                <RefreshCcw size={16} className={resetChatsLoading ? 'animate-spin' : ''} />
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {resetChatsConfirm ? 'Confirm?' : 'Reset Chats'}
                </span>
              </button>

              <button
                className="ps-danger-btn"
                onClick={handleClearBackendData}
                disabled={clearDataLoading}
                style={{
                  background: backendClearConfirm ? 'rgba(239,68,68,0.12)' : 'rgba(239,68,68,0.04)',
                  color: '#ef4444',
                  borderColor: backendClearConfirm ? 'rgba(239,68,68,0.5)' : 'rgba(239,68,68,0.15)',
                }}
              >
                <Trash2 size={16} />
                <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {backendClearConfirm ? 'Confirm?' : 'Clear All'}
                </span>
              </button>
            </div>

            {/* Delete Identity */}
            <button
              className="ps-danger-btn"
              onClick={handleDeleteAccountAction}
              disabled={deleteAccountLoading}
              style={{
                flexDirection: 'row', padding: '14px 20px',
                background: accountDeleteConfirm ? 'rgba(239,68,68,0.1)' : 'transparent',
                color: accountDeleteConfirm ? '#ef4444' : 'var(--text-muted)',
                borderColor: accountDeleteConfirm ? 'rgba(239,68,68,0.4)' : 'rgba(239,68,68,0.1)',
                opacity: accountDeleteConfirm ? 1 : 0.6,
              }}
            >
              <LogOut size={14} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                {accountDeleteConfirm ? 'Are you sure? Click again to confirm' : 'Delete Identity'}
              </span>
            </button>
          </div>
        </div>

        {/* ── Save Button ── */}
        <div className="ps-section" style={{ animationDelay: '240ms', display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
          <button className="ps-save-btn" onClick={handleSave}>
            {saved
              ? <><Check size={18} /> Saved!</>
              : <><Save size={18} /> Update Profile</>}
          </button>
        </div>

      </div>
    </>
  )
}