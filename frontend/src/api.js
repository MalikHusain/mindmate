const API_BASE = '/api'







const getUserId = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const id = user.email || 'default_user';
    return id;
  } catch {
    return 'default_user';
  }
};

export async function trackLogin(userData) {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  })
  if (!res.ok) throw new Error('Failed to track login')
  return res.json()
}

export async function sendMessage(message, userId = getUserId()) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, user_id: userId }),
  })
  if (!res.ok) throw new Error('Failed to send message')
  return res.json()
}

export async function getMoodData(days = 7, userId = getUserId()) {
  const res = await fetch(`${API_BASE}/mood?days=${days}&user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch mood data')
  return res.json()
}

export async function getPersonalization(userId = getUserId()) {
  const res = await fetch(`${API_BASE}/personalization?user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch personalization')
  return res.json()
}

export async function getConversations(userId = getUserId()) {
  const res = await fetch(`${API_BASE}/conversations?user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch conversations')
  return res.json()
}

export async function saveJournalEntry(title, content, mood, userId = getUserId()) {
  const res = await fetch(`${API_BASE}/journal`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, content, mood, user_id: userId }),
  })
  if (!res.ok) throw new Error('Failed to save journal entry')
  return res.json()
}

export async function getJournalEntries(userId = getUserId()) {
  const res = await fetch(`${API_BASE}/journal?user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch journal')
  return res.json()
}

export async function getCalendarData(days = 30, userId = getUserId()) {
  const res = await fetch(`${API_BASE}/calendar?days=${days}&user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch calendar')
  return res.json()
}

export async function getStreaks(userId = getUserId()) {
  const res = await fetch(`${API_BASE}/streaks?user_id=${userId}`)
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

export async function saveGratitude(items, userId = getUserId()) {
  const res = await fetch(`${API_BASE}/gratitude`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items, user_id: userId }),
  })
  if (!res.ok) throw new Error('Failed to save gratitude')
  return res.json()
}

export async function getGratitude(userId = getUserId()) {
  const res = await fetch(`${API_BASE}/gratitude?user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch gratitude')
  return res.json()
}

export async function getAchievements(userId = getUserId()) {
  const res = await fetch(`${API_BASE}/achievements?user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch achievements')
  return res.json()
}

export async function unlockAchievement(badge_id, userId = getUserId()) {
  const res = await fetch(`${API_BASE}/achievements/unlock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ badge_id, user_id: userId }),
  })
  if (!res.ok) throw new Error('Failed to unlock')
  return res.json()
}

export async function getWeeklyReport(userId = getUserId()) {
  const res = await fetch(`${API_BASE}/weekly-report?user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch report')
  return res.json()
}

export async function clearData(userId = getUserId()) {
  const res = await fetch(`${API_BASE}/user/data?user_id=${userId}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to clear data')
  return res.json()
}

export async function deleteAccount(userId = getUserId()) {
  const res = await fetch(`${API_BASE}/user/account?user_id=${userId}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to delete account')
  return res.json()
}

export async function getHistory(userId = getUserId()) {
  const res = await fetch(`${API_BASE}/history?user_id=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch history')
  return res.json()
}

export async function resetChats(userId = getUserId()) {
  const res = await fetch(`${API_BASE}/user/conversations?user_id=${userId}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error('Failed to reset chats')
  return res.json()
}
