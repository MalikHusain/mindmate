import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Brain, ChevronRight, Globe, Sun, Moon } from 'lucide-react'
import { useTheme } from '../ThemeContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/chat')
    }, 1200)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300" 
         style={{ background: 'var(--bg-primary)' }}>
      
      {/* Background Decor */}
      <div className="ambient-bg">
        <div className="ambient-orb ambient-orb-1" style={{ width: 800, height: 800, top: '-15%', right: '-15%', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 75%)' }} />
        <div className="ambient-orb ambient-orb-2" style={{ width: 700, height: 700, bottom: '-15%', left: '-15%', background: 'radial-gradient(circle, rgba(3,105,161,0.06) 0%, transparent 75%)' }} />
      </div>

      {/* Floating Theme Toggle */}
      <button 
        type="button"
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2.5 rounded-2xl border hover:bg-white/5 transition-all z-50 shadow-md"
        style={{ color: 'var(--accent-primary)', borderColor: 'var(--border-subtle)', background: 'var(--surface-glass)' }}
      >
        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>

      {/* Optimized Proportion Card */}
      <div className="w-full max-w-[480px] glass-card-static p-8 sm:p-10 lg:p-12 animate-scale-in relative z-10 text-center" 
           style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)' }}>
        
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-5 mb-10">
          <div className="w-14 h-14 rounded-[20px] bg-teal-600 flex items-center justify-center shadow-xl shadow-teal-900/20">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold font-display tracking-tight" style={{ color: 'var(--text-primary)' }}>Sign In</h1>
            <p className="text-sm opacity-70" style={{ color: 'var(--text-secondary)' }}>Log in to your MindMate account</p>
          </div>
        </div>

        {/* Properly Spaced Form */}
        <form onSubmit={handleLogin} className="space-y-7 text-left">
          
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-[0.15em] px-1" style={{ color: 'var(--text-muted)' }}>Email Address</label>
            <div className="relative group">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 flex items-center justify-center" style={{ color: 'var(--text-muted)', opacity: 0.8 }}>
                <Mail className="w-4.5 h-4.5 transition-colors group-focus-within:text-teal-500" />
              </div>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-transparent outline-none pl-12 pr-6 py-4 rounded-xl text-[15px] transition-all focus:bg-teal-500/5 focus:ring-1 focus:ring-teal-500/30"
                style={{ color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
               <label className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>Password</label>
               <Link to="#" className="text-[11px] font-bold hover:text-teal-400 transition-colors" style={{ color: 'var(--accent-primary)' }}>Forgot your password?</Link>
            </div>
            <div className="relative group">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-12 flex items-center justify-center" style={{ color: 'var(--text-muted)', opacity: 0.8 }}>
                <Lock className="w-4.5 h-4.5 transition-colors group-focus-within:text-teal-500" />
              </div>
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent outline-none pl-12 pr-12 py-4 rounded-xl text-[15px] transition-all focus:bg-teal-500/5 focus:ring-1 focus:ring-teal-500/30"
                style={{ color: 'var(--text-primary)', border: '1px solid var(--border-subtle)' }}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 opacity-60 hover:opacity-100 transition-opacity"
                style={{ color: 'var(--text-muted)' }}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-gradient w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 group transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-teal-900/10"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t" style={{ borderColor: 'var(--border-subtle)', opacity: 0.5 }}></div>
          </div>
          <div className="relative flex justify-center text-[10px] font-bold tracking-[0.2em] uppercase">
            <span className="px-4 py-1" style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}>Or Securely Connect</span>
          </div>
        </div>

        {/* Social Buttons (Proportional) */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <button type="button" className="flex items-center justify-center gap-3 py-3 rounded-xl border hover:bg-white/5 transition-all text-xs font-bold shadow-sm" 
                  style={{ color: 'var(--text-primary)', borderColor: 'var(--border-subtle)', background: 'var(--surface-glass)' }}>
            <Globe className="w-4 h-4" /> Github
          </button>
          <button type="button" className="flex items-center justify-center gap-3 py-3 rounded-xl border hover:bg-white/5 transition-all text-xs font-bold shadow-sm" 
                  style={{ color: 'var(--text-primary)', borderColor: 'var(--border-subtle)', background: 'var(--surface-glass)' }}>
            <span className="w-4 h-4 flex items-center justify-center font-bold">G</span> Google
          </button>
        </div>

        {/* Footer Link */}
        <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          New to MindMate? {' '}
          <Link to="#" className="font-bold underline underline-offset-4 hover:text-teal-400 transition-colors" style={{ color: 'var(--accent-primary)' }}>Join now</Link>
        </p>
      </div>

      {/* Discreet Bottom Info */}
      <div className="absolute bottom-6 w-full text-center px-4 hidden sm:block">
        <p className="text-[9px] uppercase tracking-[0.2em] opacity-30 font-bold" style={{ color: 'var(--text-muted)' }}>
          Secure Authentication • Tech Titans
        </p>
      </div>
    </div>
  )
}
