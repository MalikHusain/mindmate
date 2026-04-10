import { useState, useEffect } from 'react'
import { User, Shield, Save, Sun, Moon, Check, Trash2, LogOut, RefreshCcw } from 'lucide-react'
import { useTheme } from '../ThemeContext'
import { clearData, deleteAccount, resetChats } from '../api'

const AVATARS = ['🧠', '🌱', '🌸', '🌟', '🦋', '🌈', '🌊', '🔥', '🎯', '💫']

export default function ProfileSettingsPage() {
  const { theme, toggleTheme } = useTheme()

  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState('🧠')
  const [saved, setSaved] = useState(false)
  
  const [clearDataLoading, setClearDataLoading] = useState(false)
  const [resetChatsLoading, setResetChatsLoading] = useState(false)
  const [deleteAccountLoading, setDeleteAccountLoading] = useState(false)
  
  const [backendClearConfirm, setBackendClearConfirm] = useState(false)
  const [resetChatsConfirm, setResetChatsConfirm] = useState(false)
  const [accountDeleteConfirm, setAccountDeleteConfirm] = useState(false)

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem('mindmate_settings') || '{}')
      if (s.name) setName(s.name)
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
      if (channel) { channel.postMessage('mindmate_data_sync'); channel.close(); }
    } catch (e) {}
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
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setClearDataLoading(false)
    }
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
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setResetChatsLoading(false)
    }
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
    } catch (err) {
      alert('Error: ' + err.message)
    } finally {
      setDeleteAccountLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-10 px-4 min-h-[70vh] page-enter">
      <div className="max-w-md w-full flex flex-col items-center space-y-12 text-center mx-auto">
        
        {/* Profile Card */}
        <section className="w-full flex flex-col items-center space-y-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold gradient-text">My Profile</h1>
            <p className="text-sm text-muted">Manage your identity and privacy</p>
          </div>

          <div className="flex flex-col items-center space-y-8">
            <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-xl hover:scale-105 transition-all" 
                 style={{ border: '2px solid var(--border-accent)', background: 'var(--accent-glow)' }}>
              {avatar}
            </div>

            <div className="flex flex-wrap justify-center gap-2 max-w-[280px]">
               {AVATARS.map(a => (
                 <button 
                   key={a} 
                   onClick={() => setAvatar(a)} 
                   className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-all ${avatar === a ? 'scale-110 shadow-lg' : 'opacity-30 hover:opacity-100'}`} 
                   style={{ background: avatar === a ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', color: avatar === a ? 'white' : 'inherit' }}
                 >
                   {a}
                 </button>
               ))}
            </div>

            <div className="w-full max-w-[300px] space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted opacity-60">Display Name</p>
              <input 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)}
                placeholder="What should I call you?"
                className="w-full bg-transparent border-b border-white/10 px-2 py-2 text-xl font-bold text-center outline-none focus:border-teal-500 transition-all placeholder:opacity-20"
              />
            </div>
          </div>
        </section>

        {/* Global Atmosphere */}
        <section className="w-full max-w-[340px]">
          <div 
            onClick={toggleTheme}
            className="group flex flex-col items-center gap-3 p-6 rounded-[2.5rem] bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer w-full"
          >
              <div className={`p-4 rounded-2xl transition-all duration-500 ${theme === 'dark' ? 'bg-amber-500/10' : 'bg-amber-500/20'}`}>
                {theme === 'dark' ? <Moon className="w-6 h-6 text-amber-500" /> : <Sun className="w-6 h-6 text-amber-500" />}
              </div>
              <div className="space-y-0.5">
                <p className="font-bold text-base">App Atmosphere</p>
                <p className="text-[10px] text-muted uppercase">Currently: {theme}</p>
              </div>
              <div className={`w-12 h-7 rounded-full relative transition-all duration-300 p-1 ${theme === 'dark' ? 'bg-teal-600' : 'bg-gray-700'}`}>
                <div className={`w-5 h-5 rounded-full bg-white shadow-lg transition-all duration-300 ${theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
          </div>
        </section>

        {/* Sensitive Actions */}
        <section className="w-full max-w-[380px] space-y-6">
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-4 h-4 text-red-500/40" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-muted">Data controls</h2>
          </div>
          
          <div className="w-full space-y-3">
            <div className="grid grid-cols-2 gap-3 w-full">
              <button 
                onClick={handleResetChats}
                disabled={resetChatsLoading}
                className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-3xl transition-all border border-red-500/10 hover:border-red-500/30"
                style={{ background: resetChatsConfirm ? '#ef4444' : 'rgba(239, 68, 68, 0.03)', color: resetChatsConfirm ? 'white' : '#ef4444' }}
              >
                <RefreshCcw className={`w-4 h-4 ${resetChatsLoading ? 'animate-spin' : ''}`} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Reset Chats</span>
              </button>

              <button 
                onClick={handleClearBackendData}
                disabled={clearDataLoading}
                className="flex flex-col items-center justify-center gap-2 px-4 py-6 rounded-3xl transition-all border border-red-500/10 hover:border-red-500/30"
                style={{ background: backendClearConfirm ? '#ef4444' : 'rgba(239, 68, 68, 0.03)', color: backendClearConfirm ? 'white' : '#ef4444' }}
              >
                <Trash2 className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Clear All</span>
              </button>
            </div>
            
            <button 
              onClick={handleDeleteAccountAction}
              disabled={deleteAccountLoading}
              className="w-full group flex items-center justify-center gap-2 px-4 py-4 rounded-3xl font-bold transition-all bg-red-500/5 hover:bg-red-500/10"
              style={{ 
                color: accountDeleteConfirm ? 'white' : 'var(--text-muted)',
                background: accountDeleteConfirm ? '#ef4444' : '',
                fontSize: '10px',
                border: '1px solid rgba(239, 68, 68, 0.1)'
              }}
            >
              <LogOut className="w-3 h-3 opacity-40 group-hover:opacity-100" />
              <span className="uppercase tracking-widest">Delete Identity</span>
            </button>
          </div>
        </section>

        {/* Global Action */}
        <div className="pt-8 w-full flex justify-center pb-20">
          <button 
            onClick={handleSave} 
            className="btn-gradient w-full max-w-[280px] py-4 rounded-full font-bold text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
             {saved ? <Check className="w-5 h-5 text-teal-200" /> : <Save className="w-5 h-5" />}
             {saved ? 'Settings Saved' : 'Update Profile'}
          </button>
        </div>

      </div>
    </div>
  )
}