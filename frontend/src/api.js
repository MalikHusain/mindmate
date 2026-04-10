/**
 * src/api.js
 *
 * - Local dev:  requests go to /api  (Vite proxy forwards to localhost:5000)
 * - Production: requests go to VITE_API_URL (your Render backend URL)
 */

const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    return user.email || user.id || 'default_user'
  } catch {
    return 'default_user'
  }
}

// ─── helper so every fetch gets auth header if token exists ───────────────────
const authHeaders = () => {
  const headers = { 'Content-Type': 'application/json' }
  try {
    const token = localStorage.getItem('token')
    if (token) headers['Authorization'] = `Bearer ${token}`
  } catch {}
  return headers
}

const get  = (url) => fetch(url, { headers: authHeaders() })
const post = (url, body) => fetch(url, { method: 'POST',   headers: authHeaders(), body: JSON.stringify(body) })
const del  = (url)       => fetch(url, { method: 'DELETE', headers: authHeaders() })

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function trackLogin(userData) {
  const res = await post(`${API_BASE}/login`, userData)
  if (!res.ok) throw new Error('Failed to track login')
  const data = await res.json()
  // Save token if backend returns one
  if (data.token) localStorage.setItem('token', data.token)
  if (data.user)  localStorage.setItem('user', JSON.stringify(data.user))
  return data
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export async function sendMessage(message, userId = getUserId()) {
  const res = await post(`${API_BASE}/chat`, { message, user_id: userId })
  if (!res.ok) throw new Error('Failed to send message')
  return res.json()
}

export async function getHistory(userId = getUserId()) {
  const res = await get(`${API_BASE}/history?user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch history')
  return res.json()
}

export async function getConversations(userId = getUserId()) {
  const res = await get(`${API_BASE}/conversations?user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch conversations')
  return res.json()
}

export async function resetChats(userId = getUserId()) {
  const res = await del(`${API_BASE}/user/conversations?user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to reset chats')
  return res.json()
}

// ─── Mood / Dashboard ─────────────────────────────────────────────────────────

export async function getMoodData(days = 7, userId = getUserId()) {
  const res = await get(`${API_BASE}/mood?days=${days}&user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch mood data')
  return res.json()
}

export async function getCalendarData(days = 30, userId = getUserId()) {
  const res = await get(`${API_BASE}/calendar?days=${days}&user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch calendar')
  return res.json()
}

export async function getStreaks(userId = getUserId()) {
  const res = await get(`${API_BASE}/streaks?user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch streaks')
  return res.json()
}

export async function getWeeklyReport(userId = getUserId()) {
  const res = await get(`${API_BASE}/weekly-report?user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch report')
  return res.json()
}

export async function getAchievements(userId = getUserId()) {
  const res = await get(`${API_BASE}/achievements?user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch achievements')
  return res.json()
}

export async function unlockAchievement(badge_id, userId = getUserId()) {
  const res = await post(`${API_BASE}/achievements/unlock`, { badge_id, user_id: userId })
  if (!res.ok) throw new Error('Failed to unlock achievement')
  return res.json()
}

// ─── Journal ──────────────────────────────────────────────────────────────────

export async function saveJournalEntry(title, content, mood, userId = getUserId()) {
  const res = await post(`${API_BASE}/journal`, { title, content, mood, user_id: userId })
  if (!res.ok) throw new Error('Failed to save journal entry')
  return res.json()
}

export async function getJournalEntries(userId = getUserId()) {
  const res = await get(`${API_BASE}/journal?user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch journal')
  return res.json()
}

// ─── Gratitude ────────────────────────────────────────────────────────────────

export async function saveGratitude(items, userId = getUserId()) {
  const res = await post(`${API_BASE}/gratitude`, { items, user_id: userId })
  if (!res.ok) throw new Error('Failed to save gratitude')
  return res.json()
}

export async function getGratitude(userId = getUserId()) {
  const res = await get(`${API_BASE}/gratitude?user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch gratitude')
  return res.json()
}

// ─── Quotes ───────────────────────────────────────────────────────────────────

export async function getDailyQuote() {
  const res = await get(`${API_BASE}/quotes`)
  if (!res.ok) throw new Error('Failed to fetch quote')
  return res.json()
}

// ─── Personalization ──────────────────────────────────────────────────────────

export async function getPersonalization(userId = getUserId()) {
  const res = await get(`${API_BASE}/personalization?user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch personalization')
  return res.json()
}

// ─── User Data Controls ───────────────────────────────────────────────────────

export async function clearData(userId = getUserId()) {
  const res = await del(`${API_BASE}/user/data?user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to clear data')
  return res.json()
}

export async function deleteAccount(userId = getUserId()) {
  const res = await del(`${API_BASE}/user/account?user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to delete account')
  return res.json()
}

// ─── Health ───────────────────────────────────────────────────────────────────

export async function getHealth() {
  const res = await get(`${API_BASE}/health`)
  if (!res.ok) throw new Error('Backend not available')
  return res.json()
}