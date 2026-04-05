import { useNavigate } from 'react-router-dom'
import {
  Brain, MessageCircle, BarChart3, Sparkles, Wind, BookOpen,
  Shield, ArrowRight, ChevronDown, Sun, Moon, Mic, Heart as HeartIcon,
  Award, Zap, Lock, Users, Globe
} from 'lucide-react'
import { useTheme } from '../ThemeContext'

const FEATURES = [
  { icon: <MessageCircle className="w-6 h-6" />, title: 'AI Emotional Chat', desc: 'Share how you feel and receive empathetic, motivational responses powered by advanced AI with real-time emotion detection.', color: 'var(--accent-primary)' },
  { icon: <BarChart3 className="w-6 h-6" />, title: 'Mood Analytics', desc: 'Interactive dashboards with mood trends, emotion pie charts, 30-day calendar heatmap, and streak tracking.', color: 'var(--accent-secondary)' },
  { icon: <Mic className="w-6 h-6" />, title: 'Voice Input', desc: 'Speak your feelings using voice recognition. Sometimes talking is easier than typing.', color: 'var(--accent-tertiary)' },
  { icon: <Wind className="w-6 h-6" />, title: 'Guided Breathing', desc: 'Clinically-validated breathing exercises with animated visual guides — Box, 4-7-8, and Calming techniques.', color: 'var(--positive)' },
  { icon: <BookOpen className="w-6 h-6" />, title: 'Journal & Gratitude', desc: 'Express yourself through mood journaling and daily gratitude tracking to build positive thinking patterns.', color: 'var(--neutral)' },
  { icon: <Shield className="w-6 h-6" />, title: 'Crisis Safety Net', desc: 'Auto-detects crisis signals and instantly provides emergency helplines. Your safety comes first, always.', color: 'var(--negative)' },
  { icon: <Award className="w-6 h-6" />, title: 'Achievement Badges', desc: 'Earn badges for consistent self-care — First Chat, 7-Day Streak, Gratitude Guru, and more.', color: '#f59e0b' },
  { icon: <Sparkles className="w-6 h-6" />, title: 'Weekly Reports', desc: 'Personalized weekly progress summaries with mood trajectory analysis and tailored recommendations.', color: '#ec4899' },
]

const TECH_STACK = [
  { name: 'React.js', desc: 'Frontend Framework' },
  { name: 'Flask', desc: 'Backend API' },
  { name: 'MongoDB Atlas', desc: 'Cloud Database' },
  { name: 'Gemini AI', desc: 'NLP Engine' },
  { name: 'Recharts', desc: 'Data Visualization' },
  { name: 'Web Speech API', desc: 'Voice Recognition' },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="min-h-screen">
      {/* ═══ FIXED LANDING NAV ═══ */}
      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <div className="flex items-center gap-2.5">
            <div className="mindmate-logo-sm">🧠</div>
            <span className="font-display gradient-text text-lg font-bold">MindMate</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="landing-theme-btn" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button onClick={() => navigate('/chat')} className="btn-gradient px-5 py-2 text-sm rounded-xl">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section className="landing-hero">
        <div className="landing-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%' }}>
          <div className="mindmate-logo-lg animate-scale-in" style={{ display: 'flex', justifyContent: 'center' }}>🧠</div>

          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-black font-display gradient-text mb-4 animate-fade-in-up"
            style={{ lineHeight: 1.1, width: '100%', textAlign: 'center' }}
          >
            MindMate
          </h1>

          <p
            className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-3 animate-fade-in-up font-display"
            style={{ color: 'var(--text-primary)', animationDelay: '0.15s', fontWeight: 600, textAlign: 'center', width: '100%' }}
          >
            Your AI-Powered Mental Health Companion
          </p>

          <p
            className="text-sm sm:text-base max-w-2xl mx-auto mb-10 animate-fade-in-up leading-relaxed"
            style={{ color: 'var(--text-secondary)', animationDelay: '0.3s', textAlign: 'center', width: '100%' }}
          >
            A comprehensive mental wellness platform that combines empathetic AI conversations, real-time emotion detection, mood analytics, guided breathing, journaling, and crisis support — all in one safe, private, and beautifully designed space.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.45s', width: '100%' }}>
            <button onClick={() => navigate('/chat')} className="btn-gradient px-8 py-4 text-base font-semibold flex items-center justify-center gap-2 rounded-2xl">
              Start Your Journey <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 text-base font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all landing-outline-btn"
            >
              Explore Features <ChevronDown className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-14 flex flex-wrap justify-center gap-6 sm:gap-10 animate-fade-in-up" style={{ animationDelay: '0.6s', width: '100%' }}>
            <Stat icon={<Zap className="w-4 h-4" />} value="Real-time" label="Emotion Detection" />
            <Stat icon={<Lock className="w-4 h-4" />} value="100%" label="Private & Secure" />
            <Stat icon={<Globe className="w-4 h-4" />} value="24/7" label="Always Available" />
            <Stat icon={<Users className="w-4 h-4" />} value="Free" label="Open Access" />
          </div>

          <div className="mt-12 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '1s', width: '100%' }}>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Scroll to explore</span>
            <ChevronDown className="w-4 h-4 animate-bounce" style={{ color: 'var(--text-muted)' }} />
          </div>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section id="features" className="landing-section">
        <div className="landing-container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', marginBottom: '3.5rem' }}>
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{ background: 'rgba(124,92,252,0.1)', color: 'var(--accent-primary)', border: '1px solid rgba(124,92,252,0.2)' }}
            >
              ✨ CORE FEATURES
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display gradient-text mb-4" style={{ textAlign: 'center' }}>
              Powerful Wellness Toolkit
            </h2>
            <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
              8 advanced features designed to support your mental health journey, backed by evidence-based psychology and powered by cutting-edge AI.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <div key={i} className="glass-card p-5 group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                  style={{ background: `${f.color}15`, color: f.color }}
                >
                  {f.icon}
                </div>
                <h3 className="text-sm font-bold mb-1.5 font-display" style={{ color: 'var(--text-primary)', textAlign: 'center', width: '100%' }}>
                  {f.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', textAlign: 'center', width: '100%' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ HOW IT WORKS ═══════ */}
      <section className="landing-section">
        <div className="landing-container" style={{ maxWidth: 800 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', marginBottom: '3.5rem' }}>
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{ background: 'rgba(92,138,252,0.1)', color: 'var(--accent-secondary)', border: '1px solid rgba(92,138,252,0.2)' }}
            >
              🔄 HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display gradient-text" style={{ textAlign: 'center' }}>
              Three Simple Steps
            </h2>
          </div>
          <div className="space-y-5">
            <Step num="01" title="Express Yourself" desc="Type or speak naturally about your emotions, thoughts, or day. Our AI powered by Google Gemini understands context, nuance, and emotional subtlety with real-time NLP analysis." />
            <Step num="02" title="Receive Support & Insights" desc="MindMate detects your emotion (Positive/Neutral/Negative), measures severity (1-10), provides empathetic motivational responses, and suggests evidence-based coping techniques." />
            <Step num="03" title="Track, Grow & Celebrate" desc="Watch your mood trends on interactive dashboards, earn achievement badges for consistency, practice guided breathing, and build lasting mental wellness habits." />
          </div>
        </div>
      </section>

      {/* ═══════ TECH STACK ═══════ */}
      <section className="landing-section">
        <div className="landing-container" style={{ maxWidth: 800 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '100%', marginBottom: '2.5rem' }}>
            <span
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{ background: 'rgba(192,132,252,0.1)', color: 'var(--accent-tertiary)', border: '1px solid rgba(192,132,252,0.2)' }}
            >
              🛠️ TECHNOLOGY
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display gradient-text" style={{ textAlign: 'center' }}>
              Built With Modern Tech
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TECH_STACK.map((t, i) => (
              <div key={i} className="glass-card-static p-4 text-center">
                <p className="text-sm font-bold font-display" style={{ color: 'var(--text-primary)' }}>{t.name}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="landing-section">
        <div className="landing-container" style={{ maxWidth: 750 }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              borderRadius: '1.5rem',
              padding: 'clamp(2rem, 5vw, 3.5rem)',
              background: 'linear-gradient(135deg, rgba(124,92,252,0.15), rgba(92,138,252,0.1))',
              border: '1px solid rgba(124,92,252,0.25)',
              position: 'relative',
              overflow: 'hidden',
              width: '100%',
            }}
          >
            <Brain className="w-12 h-12 mb-5" style={{ color: 'var(--accent-primary)' }} />
            <h2
              className="text-2xl sm:text-3xl font-bold font-display mb-3"
              style={{ color: 'var(--text-primary)', textAlign: 'center' }}
            >
              Ready to Transform Your Mental Wellness?
            </h2>
            <p
              className="text-sm sm:text-base mb-8 max-w-md mx-auto"
              style={{ color: 'var(--text-secondary)', textAlign: 'center' }}
            >
              Your mental health journey starts with a single conversation. MindMate is free, private, and available 24/7. Take the first step today.
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="btn-gradient px-10 py-4 text-base sm:text-lg font-semibold rounded-2xl inline-flex items-center gap-2"
            >
              <MessageCircle className="w-5 h-5" /> Start Chatting Now
            </button>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="text-center py-8 px-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <div className="landing-container">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-lg">🧠</span>
            <span className="font-semibold font-display gradient-text">MindMate</span>
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © 2025 MindMate • Built with 💜 for IdeaThon • Not a substitute for professional mental health support
          </p>
        </div>
      </footer>
    </div>
  )
}

function Stat({ icon, value, label }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <span style={{ color: 'var(--accent-primary)' }}>{icon}</span>
        <p className="text-lg sm:text-xl font-bold font-display" style={{ color: 'var(--accent-primary)' }}>{value}</p>
      </div>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
  )
}

function Step({ num, title, desc }) {
  return (
    <div className="glass-card p-5 sm:p-6 flex items-start gap-4 sm:gap-5">
      <span
        className="text-xl sm:text-2xl font-black font-display flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: 'rgba(124,92,252,0.1)', color: 'var(--accent-primary)' }}
      >
        {num}
      </span>
      <div className="min-w-0">
        <h3 className="text-base sm:text-lg font-semibold mb-1 font-display" style={{ color: 'var(--text-primary)' }}>{title}</h3>
        <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
      </div>
    </div>
  )
}