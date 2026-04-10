import { useState, useEffect, useCallback, useRef } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { TrendingUp, Calendar, Activity, Flame, Award, BarChart3, Zap, Radio } from 'lucide-react'
import { getMoodData, getStreaks, getCalendarData, getAchievements, getWeeklyReport } from '../api'

const PIE_COLORS = ['var(--positive)', 'var(--neutral)', 'var(--negative)']

function useNow() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return now
}

function getWeekRangeLabel() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek)
  const monday = new Date(today)
  monday.setDate(today.getDate() + diffToMonday)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${fmt(monday)} – ${fmt(sunday)}`
}

export default function DashboardPage() {
  const [moodData,     setMoodData]     = useState(null)
  const [streakData,   setStreakData]   = useState(null)
  const [calendarData, setCalendarData] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [weeklyReport, setWeeklyReport] = useState(null)
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)
  const [days,         setDays]         = useState(7)
  const [lastUpdated,  setLastUpdated]  = useState(null)
  const [pulse,        setPulse]        = useState(false)

  // ── NEW: real-time "just synced" flash ──
  const [syncFlash,    setSyncFlash]    = useState(false)
  const pollRef = useRef(null)
  const now = useNow()
  const weekRangeLabel = getWeekRangeLabel()

  const fetchAll = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setLoading(true)
      const [mood, streak, cal, badges, report] = await Promise.all([
        getMoodData(days),
        getStreaks(),
        getCalendarData(30),
        getAchievements().catch(() => ({ achievements: [] })),
        getWeeklyReport().catch(() => null),
      ])
      setMoodData(mood)
      setStreakData(streak)
      setCalendarData(cal)
      setAchievements(badges.achievements || [])
      setWeeklyReport(report)
      setLastUpdated(new Date())
      setPulse(true)
      setTimeout(() => setPulse(false), 600)
      setError(null)
    } catch {
      if (showLoading) setError('Could not load data. Make sure the backend is running.')
    } finally {
      if (showLoading) setLoading(false)
    }
  }, [days])

  // Initial load + re-fetch when day range changes
  useEffect(() => { fetchAll(true) }, [fetchAll])

  // ── UPDATED: faster polling — every 2s ──
  useEffect(() => {
    pollRef.current = setInterval(() => fetchAll(false), 2000)
    return () => clearInterval(pollRef.current)
  }, [fetchAll])

  // ── UPDATED: BroadcastChannel — instant re-fetch on chat message ──
  useEffect(() => {
    let channel
    const doSync = () => {
      // Flash the "New data" indicator
      setSyncFlash(true)
      setTimeout(() => setSyncFlash(false), 1800)

      // Clear stale data immediately so chart updates feel snappy
      setMoodData(null)
      setWeeklyReport(null)
      setStreakData(null)
      setCalendarData([])
      setAchievements([])

      // Fetch fresh data after a short delay (let backend finish writing)
      setTimeout(() => fetchAll(false), 600)
    }

    try {
      channel = new BroadcastChannel('mindmate_data_updates')
      channel.onmessage = (event) => {
        if (event.data === 'mindmate_data_sync') doSync()
      }
    } catch {}

    // localStorage fallback (same tab or older browsers)
    const handleStorage = (e) => {
      if (e.key === 'mindmate_last_sync') doSync()
    }
    window.addEventListener('storage', handleStorage)

    return () => {
      channel?.close()
      window.removeEventListener('storage', handleStorage)
    }
  }, [fetchAll])

  // ─────────────────────────────────────────
  if (loading) {
    return (
      <div style={s.center}>
        <div style={{ textAlign: 'center' }}>
          <div style={s.loadIcon}><Activity size={24} color="var(--accent-primary)" /></div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Loading your mood data…</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={s.center}>
        <div style={{ ...s.card, padding: 32, textAlign: 'center', maxWidth: 400 }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>{error}</p>
          <button onClick={() => fetchAll(true)} style={s.retryBtn}>Retry</button>
        </div>
      </div>
    )
  }

  const formatTimestamp = (ts) => {
    if (!ts) return new Date()
    return new Date(ts.endsWith('Z') ? ts : ts + 'Z')
  }

  const chartData = (moodData?.moods || []).map((m) => {
    const d = formatTimestamp(m.timestamp)
    return {
      date:     d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time:     d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      score:    m.score,
      emotion:  m.emotion,
      severity: m.severity,
    }
  })

  // Live trailing point — always appended at the current second
  const livePoint = chartData.length > 0 ? {
    date:     now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    time:     now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    score:    chartData[chartData.length - 1].score,
    emotion:  chartData[chartData.length - 1].emotion,
    severity: chartData[chartData.length - 1].severity,
    isLive:   true,
  } : null
  const chartDataWithLive = livePoint ? [...chartData, livePoint] : chartData

  const dist   = moodData?.distribution || {}
  const pieData = [
    { name: 'Positive', value: dist.Positive || 0 },
    { name: 'Neutral',  value: dist.Neutral  || 0 },
    { name: 'Negative', value: dist.Negative || 0 },
  ].filter(d => d.value > 0)

  const moodLabel = (v) =>
    v >= 2.5 ? { t: 'Good', c: 'var(--positive)' }
    : v >= 1.5 ? { t: 'Okay', c: 'var(--neutral)'  }
    : { t: 'Low',  c: 'var(--negative)' }
  const avgL = moodLabel(moodData?.average || 0)

  const calMap = {}
  ;(calendarData?.calendar || []).forEach(c => { calMap[c.date] = c })
  const calDays = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i)
    const key = d.toISOString().split('T')[0]
    const entry = calMap[key]
    calDays.push({ date: key, day: d.getDate(), level: entry ? Math.round(entry.avg_score) : 0, count: entry?.count || 0 })
  }

  const unlockedCount  = achievements.filter(a => a.unlocked).length
  const timeSinceUpdate = lastUpdated ? Math.floor((now - lastUpdated) / 1000) : null

  return (
    <div style={s.page}>

      {/* ── NEW: Real-time sync flash banner ── */}
      <div style={{
        ...s.syncBanner,
        opacity:    syncFlash ? 1 : 0,
        transform:  syncFlash ? 'translateY(0)' : 'translateY(-8px)',
        pointerEvents: 'none',
      }}>
        <Radio size={11} color="#22c55e" />
        <span>New mood data received — chart updated</span>
      </div>

      {/* Header */}
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Mood Dashboard</h1>
          <p style={s.subtitle}>Track your emotional patterns over time</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={s.clockBadge}>
            <div style={{ ...s.liveDot, background: pulse ? '#4ade80' : '#22c55e' }} />
            <span style={s.clockText}>
              {now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            {timeSinceUpdate !== null && (
              <span style={s.syncText}>· {timeSinceUpdate}s ago</span>
            )}
          </div>
          <select value={days} onChange={(e) => setDays(Number(e.target.value))} style={s.select}>
            <option value={7}>Last 7 days</option>
            <option value={14}>Last 14 days</option>
            <option value={30}>Last 30 days</option>
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={s.statsGrid}>
        <StatCard icon={<Activity   size={20} />} label="Average Mood" value={moodData?.average?.toFixed(1) || '—'} sub={avgL.t}              color={avgL.c} />
        <StatCard icon={<TrendingUp size={20} />} label="Trend"        value={moodData?.trend || '—'}               sub={`Last ${days} days`}  color="var(--accent-primary)" small />
        <StatCard icon={<Calendar   size={20} />} label="Entries"      value={moodData?.total_entries || 0}          sub="This period"          color="var(--accent-secondary)" />
        <StatCard icon={<Flame      size={20} />} label="Streak"       value={`${streakData?.current_streak || 0}d`} sub={`${streakData?.total_days || 0} total`} color="var(--neutral)" />
      </div>

      {/* Weekly Mood Score */}
      <div style={s.weekRangeBanner}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Calendar size={13} color="var(--accent-primary)" />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Weekly Mood Score</span>
          <span style={s.weekRangeTag}>{weekRangeLabel}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: avgL.c }}>{moodData?.average?.toFixed(1) || '—'}</span>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>/ 3.0</span>
          <span style={{ fontSize: 12, color: avgL.c, marginLeft: 4 }}>{avgL.t}</span>
        </div>
      </div>

      {/* AI Insight */}
      {moodData?.trend && moodData?.total_entries >= 2 && (
        <div style={s.insightBanner}>
          <div style={s.insightIcon}><Zap size={15} color="#2dd4bf" /></div>
          <div>
            <p style={s.insightTitle}>Personalized AI Insight</p>
            <p style={s.insightBody}>
              Your history suggests your mood is{' '}
              <strong style={{ color: 'var(--accent-primary)' }}>{moodData.trend}</strong>.{' '}
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Breathing Exercises</span>
              {' '}and{' '}
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Gratitude Journaling</span>
              {' '}are your most effective interventions.
            </p>
          </div>
        </div>
      )}

      {/* Weekly Report */}
      {weeklyReport && weeklyReport.total_conversations > 0 && (
        <div style={s.weeklyCard}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
            <BarChart3 size={14} color="var(--accent-primary)" />
            <span style={s.sectionLabel}>Weekly Report</span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6, margin: '0 0 10px' }}>
            {weeklyReport.message}
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span style={s.tag}>Conversations: {weeklyReport.total_conversations}</span>
            <span style={s.tag}>{weeklyReport.mood_trajectory}</span>
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div style={s.chartsRow}>

        {/* Area Chart */}
        <div style={{ ...s.card, flex: 2, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <p style={s.cardLabel}>Mood Over Time</p>
            {/* ── NEW: live indicator shows "Syncing…" during fresh fetch ── */}
            <div style={s.liveChip}>
              <Radio size={10} color="#22c55e" />
              <span style={{ fontSize: 10, color: '#22c55e', fontWeight: 700, letterSpacing: '0.06em' }}>LIVE</span>
              <span style={{ fontSize: 10, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>
                {syncFlash ? 'Syncing…' : now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>
          </div>
          {chartDataWithLive.length > 0 ? (
            <div style={{ width: '100%', height: 215 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartDataWithLive} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="var(--accent-primary)" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 4]} ticks={[1, 2, 3]}
                    tickFormatter={v => v === 3 ? 'Good' : v === 2 ? 'Okay' : v === 1 ? 'Low' : ''}
                    tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone" dataKey="score"
                    stroke="var(--accent-primary)" strokeWidth={2.5}
                    fill="url(#moodGrad)"
                    dot={({ cx, cy, index }) =>
                      index === chartDataWithLive.length - 1
                        ? <LiveDot key={`live-${cx}-${cy}`} cx={cx} cy={cy} />
                        : <circle key={`dot-${index}`} cx={cx} cy={cy} r={3.5} fill="var(--accent-primary)" stroke="none" />
                    }
                    activeDot={{ r: 5 }}
                    isAnimationActive={syncFlash}    /* animate only on new data, not every second */
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : <EmptyState />}
        </div>

        {/* Pie Chart */}
        <div style={{ ...s.card, flex: 1, minWidth: 200, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <p style={{ ...s.cardLabel, marginBottom: 8 }}>Emotion Distribution</p>
          {pieData.length > 0 ? (
            <>
              <div style={{ width: '100%', height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={46} outerRadius={70}
                      paddingAngle={3} dataKey="value" stroke="none"
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 6 }}>
                {pieData.map((d, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: PIE_COLORS[i] }} />
                    <span style={{ color: 'var(--text-secondary)', fontSize: 11 }}>{d.name} ({d.value})</span>
                  </div>
                ))}
              </div>
            </>
          ) : <EmptyState />}
        </div>

      </div>

      {/* Achievements */}
      <div style={s.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <Award size={14} color="var(--accent-tertiary)" />
            <span style={s.sectionLabel}>Achievement Badges</span>
          </div>
          <span style={s.achieveBadge}>{unlockedCount}/{achievements.length} unlocked</span>
        </div>
        <div style={s.badgesGrid}>
          {achievements.map((b) => (
            <div key={b.badge_id} style={{ ...s.badgeItem, opacity: b.unlocked ? 1 : 0.42 }}>
              <span style={{ fontSize: 24, display: 'block', marginBottom: 5 }}>
                {b.unlocked ? b.emoji : '?'}
              </span>
              <p style={{ fontSize: 11, fontWeight: 700, marginBottom: 3,
                color: b.unlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>{b.name}</p>
              <p style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.35, margin: 0 }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div style={s.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 14 }}>
          <Calendar size={13} color="var(--text-muted)" />
          <span style={s.sectionLabel}>30-Day Mood Calendar</span>
        </div>
        <div style={s.calGrid}>
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 9, color: 'var(--text-muted)',
              fontWeight: 600, letterSpacing: '0.04em', paddingBottom: 5 }}>{d}</div>
          ))}
          {calDays.map((d, i) => (
            <div key={i} className={`mood-cell level-${d.level}`}
              title={`${d.date}: ${d.count} entries`}
              style={{ textAlign: 'center', fontSize: 10, fontWeight: 500,
                borderRadius: 7, padding: '5px 0', cursor: 'default' }}>
              {d.day}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginTop: 12 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>Less</span>
          {[0,1,2,3].map(l => (
            <div key={l} className={`mood-cell level-${l}`} style={{ width: 12, height: 12, borderRadius: 3 }} />
          ))}
          <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>More positive</span>
        </div>
      </div>

      {/* Bottom Insight */}
      {moodData?.trend && moodData?.total_entries >= 2 && (
        <div style={s.bottomInsight}>
          You've been feeling{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{moodData.trend}</strong>
        </div>
      )}

    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LiveDot({ cx, cy }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={8} fill="var(--accent-primary)" opacity={0.18}>
        <animate attributeName="r"       from="5"  to="13" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.3" to="0" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx={cx} cy={cy} r={4.5} fill="var(--accent-primary)" />
    </g>
  )
}

function StatCard({ icon, label, value, sub, color, small }) {
  return (
    <div style={s.statCard}>
      <div style={{ ...s.statIcon, background: `${color}15`, color }}>{icon}</div>
      <span style={s.statLabel}>{label}</span>
      <p style={{ ...s.statValue, color, fontSize: small ? 14 : 24 }}>{value}</p>
      <p style={s.statSub}>{sub}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '36px 0' }}>
      <p style={{ fontSize: 28, marginBottom: 8 }}>💬</p>
      <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Start chatting to see data here!</p>
    </div>
  )
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d  = payload[0].payload
  const ec = d.emotion === 'Positive' ? 'var(--positive)'
           : d.emotion === 'Negative' ? 'var(--negative)' : 'var(--neutral)'
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
      borderRadius: 10, padding: '8px 13px' }}>
      {d.isLive
        ? <p style={{ color: '#22c55e', fontSize: 11, fontWeight: 700, margin: 0 }}>Live · {d.time}</p>
        : <>
            <p style={{ color: 'var(--text-primary)', fontSize: 11, fontWeight: 600, marginBottom: 3 }}>
              {d.date} · {d.time}
            </p>
            <p style={{ color: ec, fontSize: 11, margin: 0 }}>{d.emotion} · Severity {d.severity}/10</p>
          </>
      }
    </div>
  )
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = {
  page:      { display: 'flex', flexDirection: 'column', gap: 14, padding: '18px 20px', maxWidth: 1100, margin: '0 auto' },
  header:    { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 },
  title:     { fontSize: 23, fontWeight: 700, margin: '0 0 2px',
               background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
               WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle:  { fontSize: 12, color: 'var(--text-muted)', margin: 0 },
  select:    { background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', borderRadius: 9, padding: '6px 11px', fontSize: 12, outline: 'none', cursor: 'pointer' },

  // ── NEW: sync flash banner ──
  syncBanner: {
    position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)',
    display: 'flex', alignItems: 'center', gap: 7,
    padding: '7px 16px', borderRadius: 999, zIndex: 200,
    background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)',
    fontSize: 12, fontWeight: 600, color: '#22c55e',
    transition: 'opacity 0.3s ease, transform 0.3s ease',
    whiteSpace: 'nowrap',
  },

  clockBadge:  { display: 'flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 9, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)' },
  liveDot:     { width: 7, height: 7, borderRadius: '50%', transition: 'background 0.3s' },
  clockText:   { fontSize: 12, color: '#22c55e', fontWeight: 600, fontVariantNumeric: 'tabular-nums' },
  syncText:    { fontSize: 10, color: 'var(--text-muted)' },

  statsGrid:   { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 11 },
  statCard:    { background: 'var(--bg-card, rgba(255,255,255,0.04))', border: '1px solid var(--border-subtle)', borderRadius: 15, padding: '16px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, textAlign: 'center' },
  statIcon:    { width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  statLabel:   { fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 },
  statValue:   { fontWeight: 700, lineHeight: 1, margin: '1px 0' },
  statSub:     { fontSize: 11, color: 'var(--text-muted)', margin: 0 },

  weekRangeBanner: { background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderLeft: '3px solid var(--accent-secondary)', borderRadius: 13, padding: '12px 16px' },
  weekRangeTag:    { fontSize: 11, padding: '2px 9px', borderRadius: 6, background: 'rgba(92,138,252,0.12)', color: 'var(--accent-secondary)', fontWeight: 600, marginLeft: 4 },

  insightBanner: { display: 'flex', alignItems: 'flex-start', gap: 12, padding: '13px 16px', borderRadius: 13, background: 'var(--accent-glow, rgba(124,92,252,0.08))', borderLeft: '3px solid var(--accent-primary)' },
  insightIcon:   { width: 28, height: 28, borderRadius: 8, background: 'rgba(45,212,191,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 },
  insightTitle:  { fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 },
  insightBody:   { fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 },

  weeklyCard:    { background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderLeft: '3px solid var(--accent-primary)', borderRadius: 13, padding: '14px 16px' },

  sectionLabel:  { fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' },
  tag:           { padding: '4px 11px', borderRadius: 7, background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', fontSize: 11 },

  chartsRow:     { display: 'flex', gap: 13, flexWrap: 'wrap' },
  card:          { background: 'var(--bg-card, rgba(255,255,255,0.04))', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: '16px' },
  cardLabel:     { fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.04em', textTransform: 'uppercase', margin: 0 },

  liveChip:      { display: 'flex', alignItems: 'center', gap: 5, padding: '3px 9px', borderRadius: 7, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)' },

  achieveBadge:  { fontSize: 10, padding: '3px 10px', borderRadius: 20, background: 'rgba(192,132,252,0.12)', color: 'var(--accent-tertiary)', fontWeight: 600 },
  badgesGrid:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(88px, 1fr))', gap: 9 },
  badgeItem:     { textAlign: 'center', padding: '11px 7px', borderRadius: 11, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' },

  calGrid:       { display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 5, maxWidth: 430, margin: '0 auto' },

  bottomInsight: { textAlign: 'center', padding: '11px 18px', borderRadius: 11, background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', fontSize: 13, color: 'var(--text-secondary)' },

  center:        { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' },
  loadIcon:      { width: 46, height: 46, borderRadius: 13, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(124,92,252,0.1)' },
  retryBtn:      { padding: '8px 20px', borderRadius: 9, border: 'none', background: 'var(--accent-primary)', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 13 },
}