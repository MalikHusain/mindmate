/**
 * App.jsx — Updated with new pages integrated
 *
 * New pages added:
 *   /journal        → GratitudeJournalPage
 *   /crisis         → CrisisSupportPage
 *   /settings       → ProfileSettingsPage
 *   DailyCheckInModal shown once per day on any authenticated route
 *
 * Drop-in replacement for your existing App.jsx.
 * Adjust import paths to match your project structure.
 */

import { BrowserRouter, Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom'
import { useState } from 'react'
import {
  MessageCircle, BarChart3, Wind, BookOpen,
  Shield, User, Menu, X, Brain
} from 'lucide-react'
import { ThemeProvider } from './ThemeContext'

// Existing pages
import LandingPage from './pages/LandingPage'
import ChatPage from './pages/ChatPage'
import DashboardPage from './pages/DashboardPage'
import BreathingPage from './pages/BreathingPage'

// New pages
import GratitudeJournalPage from './pages/GratitudeJournalPage'
import CrisisSupportPage from './pages/CrisisSupportPage'
import ProfileSettingsPage from './pages/ProfileSettingsPage'
import DailyCheckInModal, { useDailyCheckIn } from './components/DailyCheckInModal'

// ─── Nav items ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { path: '/chat',     icon: <MessageCircle className="w-5 h-5" />, label: 'Chat' },
  { path: '/dashboard',icon: <BarChart3 className="w-5 h-5" />,     label: 'Dashboard' },
  { path: '/breathing',icon: <Wind className="w-5 h-5" />,          label: 'Breathing' },
  { path: '/journal',  icon: <BookOpen className="w-5 h-5" />,      label: 'Journal' },
  { path: '/crisis',   icon: <Shield className="w-5 h-5" />,        label: 'Crisis Help' },
  { path: '/settings', icon: <User className="w-5 h-5" />,          label: 'Profile' },
]

// ─── Shell (sidebar + topbar) ────────────────────────────────────────────────
function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { showCheckIn, dismiss } = useDailyCheckIn()
  const location = useLocation()

  // Active route label for mobile topbar
  const activeItem = NAV_ITEMS.find(n => location.pathname.startsWith(n.path))

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100%', position: 'relative' }}>

      {/* ── Sidebar overlay (mobile) ── */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(2px)',
            zIndex: 40,
          }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        style={{
          width: 220,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-sidebar, var(--bg-card))',
          borderRight: '1px solid var(--border-subtle)',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          overflowY: 'auto',
          // On lg screens: always visible
        }}
        className="lg-sidebar"
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 px-5 py-5"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <span className="text-2xl">🧠</span>
          <span className="font-display gradient-text text-lg font-bold">MindMate</span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden w-7 h-7 flex items-center justify-center rounded-lg transition-all hover:bg-white/5"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.625rem 0.875rem',
                borderRadius: '0.75rem',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                transition: 'all 0.15s',
                background: isActive ? 'rgba(124,92,252,0.15)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: isActive ? '1px solid rgba(124,92,252,0.25)' : '1px solid transparent',
              })}
            >
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
              {item.path === '/crisis' && (
                <span
                  className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0"
                  style={{ background: 'rgba(239,68,68,0.15)', color: 'var(--negative)' }}
                >
                  SOS
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4" style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            © 2025 MindMate · Not a medical service
          </p>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          // On lg: offset for sidebar
        }}
        className="main-with-sidebar"
      >
        {/* Mobile topbar */}
        <header
          className="lg:hidden flex items-center gap-3 px-4 py-3 sticky top-0"
          style={{
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-subtle)',
            zIndex: 30,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-white/5"
            style={{ color: 'var(--text-secondary)' }}
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-display gradient-text text-base font-bold">
            {activeItem?.label || 'MindMate'}
          </span>
          <span className="text-xl ml-auto">🧠</span>
        </header>

        {/* Page content */}
        <main
          style={{
            flex: 1,
            padding: 'clamp(1rem, 3vw, 1.75rem)',
            overflowX: 'hidden',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </main>
      </div>

      {/* Daily check-in modal */}
      {showCheckIn && (
        <DailyCheckInModal
          onClose={dismiss}
          onSubmit={(entry) => {
            console.log('Daily check-in:', entry)
            // Optionally POST to your backend here
            dismiss()
          }}
        />
      )}

      {/* Responsive sidebar CSS */}
      <style>{`
        @media (min-width: 1024px) {
          .lg-sidebar {
            transform: translateX(0) !important;
            position: sticky !important;
            height: 100vh;
          }
          .main-with-sidebar {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  )
}

// ─── Root ────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Public landing */}
          <Route path="/" element={<LandingPage />} />

          {/* App shell routes */}
          <Route
            path="/*"
            element={
              <AppShell>
                <Routes>
                  <Route path="/chat"      element={<ChatPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/breathing" element={<BreathingPage />} />
                  <Route path="/journal"   element={<GratitudeJournalPage />} />
                  <Route path="/crisis"    element={<CrisisSupportPage />} />
                  <Route path="/settings"  element={<ProfileSettingsPage />} />
                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/chat" replace />} />
                </Routes>
              </AppShell>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}