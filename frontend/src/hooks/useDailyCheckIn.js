/**
 * src/hooks/useDailyCheckIn.js
 *
 * Standalone hook — import this wherever you need the check-in gate.
 * Triggers the modal once per day per logged-in user.
 */

import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'

export function useDailyCheckIn() {
  const [show, setShow] = useState(false)
  const location        = useLocation()

  const checkAndShow = useCallback(() => {
    try {
      const user   = JSON.parse(localStorage.getItem('user') || '{}')
      const userId = user?.email || user?.id || 'guest'
      const key    = `mindmate_last_checkin_${userId}`

      if (localStorage.getItem(key) !== new Date().toDateString()) {
        setTimeout(() => setShow(true), 800)   // small delay feels natural
      }
    } catch {
      // silently ignore storage errors
    }
  }, [])

  // ① Fire on mount — catches the very first render after login
  useEffect(() => {
    checkAndShow()
  }, [checkAndShow])

  // ② Fire on every route change — catches SPA navigation
  useEffect(() => {
    checkAndShow()
  }, [location.pathname, location.search, checkAndShow])

  const dismiss = useCallback(() => setShow(false), [])

  return { showCheckIn: show, dismiss }
}