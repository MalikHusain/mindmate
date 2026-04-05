const API_BASE = '/api'

export async function sendMessage(message) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
  if (!res.ok) throw new Error('Failed to send message')
  return res.json()
}

export async function getMoodData(days = 7) {
  const res = await fetch(`${API_BASE}/mood?days=${days}`)
  if (!res.ok) throw new Error('Failed to fetch mood data')
  return res.json()
}

export async function getPersonalization() {
  const res = await fetch(`${API_BASE}/personalization`)
  if (!res.ok) throw new Error('Failed to fetch personalization')
  return res.json()
}

export async function getConversations() {
  const res = await fetch(`${API_BASE}/conversations`)
  if (!res.ok) throw new Error('Failed to fetch conversations')
  return res.json()
}

export async function saveJournalEntry(title, content, mood) {
  const res = await fetch(`${API_BASE}/journal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, mood }),
  })
  if (!res.ok) throw new Error('Failed to save journal entry')
  return res.json()
}

export async function getJournalEntries() {
  const res = await fetch(`${API_BASE}/journal`)
  if (!res.ok) throw new Error('Failed to fetch journal')
  return res.json()
}

export async function getCalendarData(days = 30) {
  const res = await fetch(`${API_BASE}/calendar?days=${days}`)
  if (!res.ok) throw new Error('Failed to fetch calendar')
  return res.json()
}

export async function getStreaks() {
  const res = await fetch(`${API_BASE}/streaks`)
  if (!res.ok) throw new Error('Failed to fetch streaks')
  return res.json()
}

export async function getHealth() {
  const res = await fetch(`${API_BASE}/health`)
  if (!res.ok) throw new Error('Backend not available')
  return res.json()
}

// ═══ NEW V3 ENDPOINTS ═══

export async function getDailyQuote() {
  const res = await fetch(`${API_BASE}/quotes`)
  if (!res.ok) throw new Error('Failed to fetch quote')
  return res.json()
}

export async function saveGratitude(items) {
  const res = await fetch(`${API_BASE}/gratitude`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  })
  if (!res.ok) throw new Error('Failed to save gratitude')
  return res.json()
}

export async function getGratitude() {
  const res = await fetch(`${API_BASE}/gratitude`)
  if (!res.ok) throw new Error('Failed to fetch gratitude')
  return res.json()
}

export async function getAchievements() {
  const res = await fetch(`${API_BASE}/achievements`)
  if (!res.ok) throw new Error('Failed to fetch achievements')
  return res.json()
}

export async function unlockAchievement(badge_id) {
  const res = await fetch(`${API_BASE}/achievements/unlock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ badge_id }),
  })
  if (!res.ok) throw new Error('Failed to unlock')
  return res.json()
}

export async function getWeeklyReport() {
  const res = await fetch(`${API_BASE}/weekly-report`)
  if (!res.ok) throw new Error('Failed to fetch report')
  return res.json()
}
