import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation } from 'react-router-dom'
import { MessageCircle, BarChart3, Sparkles, Heart, Wind, BookOpen, Menu, X, LifeBuoy, Sun, Moon } from 'lucide-react'
import { ThemeProvider, useTheme } from './ThemeContext'
import LandingPage from './pages/LandingPage'
import ChatPage from './pages/ChatPage'
import DashboardPage from './pages/DashboardPage'
import PersonalizationPage from './pages/PersonalizationPage'
import BreathingPage from './pages/BreathingPage'
import JournalPage from './pages/JournalPage'
import SOSButton from './components/SOSButton'

const NAV_ITEMS = [
  { to: '/chat', icon: <MessageCircle className="w-5 h-5" />, label: 'Chat' },
  { to: '/dashboard', icon: <BarChart3 className="w-5 h-5" />, label: 'Dashboard' },
  { to: '/personalize', icon: <Sparkles className="w-5 h-5" />, label: 'For You' },
  { to: '/breathe', icon: <Wind className="w-5 h-5" />, label: 'Breathe' },
  { to: '/journal', icon: <BookOpen className="w-5 h-5" />, label: 'Journal' },
]

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle-btn"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      <span className="theme-toggle-label">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
    </button>
  )
}

function AppContent() {
  const location = useLocation()
  const isLanding = location.pathname === '/'
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (isLanding) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="ambient-bg">
          <div className="ambient-orb ambient-orb-1" />
          <div className="ambient-orb ambient-orb-2" />
          <div className="ambient-orb ambient-orb-3" />
        </div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <div className="ambient-bg">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>

      {/* ═══ DESKTOP SIDEBAR ═══ */}
      <aside className="sidebar">
        <NavLink to="/" className="sidebar-logo">
          <div className="mindmate-logo-sm">🧠</div>
          <span className="sidebar-logo-text font-display gradient-text">MindMate</span>
        </NavLink>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span className="sidebar-link-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-divider" />
          <ThemeToggle />
          <NavLink to="/" className="sidebar-link sidebar-link-home">
            <span className="sidebar-link-icon"><LifeBuoy className="w-5 h-5" /></span>
            <span className="sidebar-link-label">Resources</span>
          </NavLink>
          <p className="sidebar-disclaimer">Not a substitute for professional mental health care.</p>
        </div>
      </aside>

      {/* ═══ MOBILE TOP BAR ═══ */}
      <header className="mobile-topbar">
        <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle menu">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        <NavLink to="/" className="mobile-topbar-logo">
          <div className="mindmate-logo-sm" style={{ width: 32, height: 32, fontSize: '16px' }}>🧠</div>
          <span className="font-display gradient-text text-lg font-bold">MindMate</span>
        </NavLink>
        <ThemeToggleMini />
      </header>

      {/* ═══ MOBILE SIDEBAR OVERLAY ═══ */}
      {sidebarOpen && (
        <>
          <div className="mobile-overlay animate-fade-in" onClick={() => setSidebarOpen(false)} />
          <aside className="mobile-sidebar animate-slide-right">
            <NavLink to="/" className="sidebar-logo" onClick={() => setSidebarOpen(false)}>
              <div className="mindmate-logo-sm">🧠</div>
              <span className="font-display gradient-text text-xl font-bold">MindMate</span>
            </NavLink>
            <nav className="sidebar-nav">
              {NAV_ITEMS.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}>
                  <span className="sidebar-link-icon">{item.icon}</span>
                  <span className="sidebar-link-label">{item.label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="sidebar-footer">
              <div className="sidebar-divider" />
              <ThemeToggle />
              <NavLink to="/" className="sidebar-link" onClick={() => setSidebarOpen(false)}>
                <span className="sidebar-link-icon"><LifeBuoy className="w-5 h-5" /></span>
                <span className="sidebar-link-label">Resources</span>
              </NavLink>
            </div>
          </aside>
        </>
      )}

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="main-content">
        <div className="main-content-inner">
          <Routes>
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/personalize" element={<PersonalizationPage />} />
            <Route path="/breathe" element={<BreathingPage />} />
            <Route path="/journal" element={<JournalPage />} />
          </Routes>
        </div>
      </main>

      <SOSButton />
    </div>
  )
}

function ThemeToggleMini() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button onClick={toggleTheme} className="mobile-theme-btn" aria-label="Toggle theme">
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  )
}

export default App
