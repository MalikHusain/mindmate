/**
 * src/utils/syncDashboard.js
 *
 * Call notifyDashboard() anywhere after a mood is logged or chat message sent.
 * Works across tabs via BroadcastChannel + localStorage fallback.
 */

export function notifyDashboard() {
  try {
    const channel = new BroadcastChannel('mindmate_data_updates')
    channel.postMessage('mindmate_data_sync')
    channel.close()
  } catch {}
  // localStorage fallback for same-tab / older browsers
  localStorage.setItem('mindmate_last_sync', Date.now().toString())
}