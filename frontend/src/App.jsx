/**
 * App.jsx — Updated with new pages integrated
 *
 * New pages added:
 *   /journal        → GratitudeJournalPage
 *   /crisis         → CrisisSupportPage
 *   /settings       → ProfileSettingsPage
 *   DailyCheckInModal shown once per day on any authenticated route
 */

import { BrowserRouter, Routes, Route, NavLink, useLocation, Navigate } from 'react-router-dom'
import { useState } from 'react'
import {
  MessageCircle, BarChart3, Wind, BookOpen,
  Shield, User, Menu, X, LogOut, Sun, Moon
} from 'lucide-react'
import { ThemeProvider, useTheme } from './ThemeContext'

// Existing pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import ChatPage from './pages/ChatPage'
import DashboardPage from './pages/DashboardPage'
import BreathingPage from './pages/BreathingPage'

// New pages
import GratitudeJournalPage from './pages/GratitudeJournalPage'
import CrisisSupportPage from './pages/CrisisSupportPage'
import ProfileSettingsPage from './pages/ProfileSettingsPage'
import RegisterPage from './pages/RegisterPage'
import DailyCheckInModal, { useDailyCheckIn } from './components/DailyCheckInModal'


// ─── Nav items ───────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { path: '/chat',      icon: <MessageCircle className="w-5 h-5" />, label: 'Chat' },
  { path: '/dashboard', icon: <BarChart3 className="w-5 h-5" />,     label: 'Dashboard' },
  { path: '/breathing', icon: <Wind className="w-5 h-5" />,          label: 'Breathing' },
  { path: '/journal',   icon: <BookOpen className="w-5 h-5" />,      label: 'Journal' },
  { path: '/crisis',    icon: <Shield className="w-5 h-5" />,        label: 'Crisis Help' },
  { path: '/settings',  icon: <User className="w-5 h-5" />,          label: 'Profile' },
]

// ─── Shell (sidebar + topbar) ────────────────────────────────────────────────
function AppShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { showCheckIn, dismiss } = useDailyCheckIn()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

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
          width: '240px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          zIndex: 50,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'var(--bg-sidebar, var(--bg-card))',
          borderRight: '1px solid var(--border-subtle)',
        }}
        className="sidebar lg-sidebar"
      >

        {/* ── Logo Header ──
            Fixed height of 72px for a stable, spacious header.
            Uses flexbox centering so the logo is always vertically centered. */}
        <div
          style={{
            height: '72px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '0 20px',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div className="sidebar-logo-icon">
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '24px', color: 'white' }}
            >
              spa
            </span>
          </div>

          <span style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 800,
            fontSize: '1.25rem',
            background: 'linear-gradient(135deg, #006162, #006398)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap',
          }}>
            MindMate
          </span>

          {/* Close button — only on mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden"
            style={{
              marginLeft: 'auto',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
            }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Nav Items ──
            padding: 16px 12px gives a clear visual gap from the logo divider.
            flex: 1 + overflow-y: auto makes it scrollable if items overflow. */}
        <nav
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '11px 14px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '0.9rem',
                fontWeight: 500,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                background: isActive ? 'var(--surface-glass-hover)' : 'transparent',
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: isActive ? '1px solid var(--border-accent)' : '1px solid transparent',
              })}
            >
              <span style={{ flexShrink: 0, opacity: 0.9, display: 'flex' }}>
                {item.icon}
              </span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.label}
              </span>
              {item.path === '/crisis' && (
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: '10px',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    fontWeight: 700,
                    flexShrink: 0,
                    background: 'var(--negative-bg)',
                    color: 'var(--negative)',
                    animation: 'sosPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                  }}
                >
                  SOS
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Footer ──
            flexShrink: 0 locks it to the bottom — never collapses. */}
        <div
          style={{
            flexShrink: 0,
            padding: '16px 14px 20px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {/* Dark / Light toggle */}
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '11px 14px',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--surface-glass)',
            }}
          >
            {theme === 'dark'
              ? <Sun className="w-5 h-5 flex-shrink-0" />
              : <Moon className="w-5 h-5 flex-shrink-0" />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>

          {/* Logout */}
          <NavLink
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '11px 14px',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'all 0.2s',
              color: 'var(--negative)',
              background: 'transparent',
              border: '1px solid transparent',
            }}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span>Logout</span>
          </NavLink>

          {/* Version tag */}
          <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
            <p style={{
              fontSize: '10px',
              textAlign: 'center',
              fontWeight: 700,
              opacity: 0.3,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--text-muted)',
              margin: 0,
            }}>
              MindMate Companion v1.0
            </p>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div
        className="main-with-sidebar"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        {/* Mobile topbar */}
        <header
          className="lg:hidden"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '0 16px',
            height: '56px',
            position: 'sticky',
            top: 0,
            background: 'var(--bg-card)',
            borderBottom: '1px solid var(--border-subtle)',
            zIndex: 30,
            flexShrink: 0,
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
            }}
          >
            <Menu className="w-5 h-5" />
          </button>
          <span
            className="font-display gradient-text"
            style={{ fontSize: '1rem', fontWeight: 700 }}
          >
            {activeItem?.label || 'MindMate'}
          </span>
          <span style={{ fontSize: '1.25rem', marginLeft: 'auto' }}>🧠</span>
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
            dismiss()
          }}
        />
      )}

      {/* ── Responsive CSS ── */}
      <style>{`
        /* Desktop: sidebar fixed on left, main content offset */
        @media (min-width: 1024px) {
          .sidebar.lg-sidebar {
            transform: translateX(0) !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            height: 100vh !important;
            width: 240px !important;
          }
          .main-with-sidebar {
            margin-left: 240px;
            width: calc(100% - 240px);
          }
          /* Hide mobile topbar on desktop */
          .lg\\:hidden {
            display: none !important;
          }
        }

        /* Mobile: sidebar is a fixed overlay */
        @media (max-width: 1023px) {
          .sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            height: 100vh !important;
          }
          .main-with-sidebar {
            margin-left: 0;
            width: 100%;
          }
        }

        /* Thin scrollbar for nav overflow */
        nav::-webkit-scrollbar { width: 4px; }
        nav::-webkit-scrollbar-track { background: transparent; }
        nav::-webkit-scrollbar-thumb {
          background: var(--border-subtle);
          border-radius: 4px;
        }

        /* SOS badge pulse */
        @keyframes sosPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
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
          {/* Public */}
          <Route path="/"         element={<LandingPage />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* App shell */}
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
                  <Route path="*"          element={<Navigate to="/chat" replace />} />
                </Routes>
              </AppShell>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}