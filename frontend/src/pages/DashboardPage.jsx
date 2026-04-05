import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { TrendingUp, Calendar, Activity, Flame, Award, BarChart3 } from 'lucide-react'
import { getMoodData, getStreaks, getCalendarData, getAchievements, getWeeklyReport } from '../api'
import { EmotionBadge } from '../components/EmotionBadge'

const PIE_COLORS = ['var(--positive)', 'var(--neutral)', 'var(--negative)']

export default function DashboardPage() {
  const [moodData, setMoodData] = useState(null)
  const [streakData, setStreakData] = useState(null)
  const [calendarData, setCalendarData] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [weeklyReport, setWeeklyReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [days, setDays] = useState(7)

  useEffect(() => { fetchAll() }, [days])

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [mood, streak, cal, badges, report] = await Promise.all([
        getMoodData(days), getStreaks(), getCalendarData(30),
        getAchievements().catch(() => ({ achievements: [] })),
        getWeeklyReport().catch(() => null),
      ])
      setMoodData(mood)
      setStreakData(streak)
      setCalendarData(cal)
      setAchievements(badges.achievements || [])
      setWeeklyReport(report)
    } catch {
      setError('Could not load data. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="text-center animate-fade-in">
          <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(124,92,252,0.1)' }}>
            <Activity className="w-7 h-7" style={{ color: 'var(--accent-primary)' }} />
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading your mood data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="glass-card-static p-8 text-center max-w-md w-full">
          <p style={{ color: 'var(--text-secondary)' }}>{error}</p>
          <button onClick={fetchAll} className="btn-gradient px-5 py-2.5 mt-4 text-sm rounded-xl">Retry</button>
        </div>
      </div>
    )
  }

  const chartData = (moodData?.moods || []).map((m) => ({
    date: new Date(m.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    time: new Date(m.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    score: m.score, emotion: m.emotion, severity: m.severity,
  }))

  const dist = moodData?.distribution || {}
  const pieData = [
    { name: 'Positive', value: dist.Positive || 0 },
    { name: 'Neutral', value: dist.Neutral || 0 },
    { name: 'Negative', value: dist.Negative || 0 },
  ].filter(d => d.value > 0)

  const moodLabel = (s) =>
    s >= 2.5 ? { t: 'Good', c: 'var(--positive)' }
    : s >= 1.5 ? { t: 'Okay', c: 'var(--neutral)' }
    : { t: 'Low', c: 'var(--negative)' }
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

  const unlockedCount = achievements.filter(a => a.unlocked).length

  return (
    <div className="space-y-5 page-enter">
      {/* Header */}
      <div className="page-header flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display gradient-text text-2xl sm:text-3xl">Mood Dashboard</h1>
          <p className="text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>Track your emotional patterns over time</p>
        </div>
        <select value={days} onChange={(e) => setDays(Number(e.target.value))}
          className="bg-transparent text-sm px-3 py-2 rounded-xl outline-none cursor-pointer self-start sm:self-auto"
          style={{ border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
          <option value={7}>Last 7 days</option>
          <option value={14}>Last 14 days</option>
          <option value={30}>Last 30 days</option>
        </select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<Activity className="w-5 h-5" />} label="Average Mood" value={moodData?.average?.toFixed(1) || '—'} sub={avgL.t} color={avgL.c} />
        <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Trend" value={moodData?.trend || '—'} sub={`Last ${days} days`} color="var(--accent-primary)" small />
        <StatCard icon={<Calendar className="w-5 h-5" />} label="Entries" value={moodData?.total_entries || 0} sub="This period" color="var(--accent-secondary)" />
        <StatCard icon={<Flame className="w-5 h-5" />} label="Streak" value={`${streakData?.current_streak || 0}d`} sub={`${streakData?.total_days || 0} total days`} color="var(--neutral)" />
      </div>

      {/* Weekly Report */}
      {weeklyReport && weeklyReport.total_conversations > 0 && (
        <div className="glass-card-static p-5" style={{ borderLeft: '3px solid var(--accent-primary)' }}>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
            <h2 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>Weekly Report</h2>
          </div>
          <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--text-primary)' }}>{weeklyReport.message}</p>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-lg" style={{ background: 'var(--surface-glass)', color: 'var(--text-secondary)' }}>
              💬 {weeklyReport.total_conversations} conversations
            </span>
            <span className="px-3 py-1.5 rounded-lg" style={{ background: 'var(--surface-glass)', color: 'var(--text-secondary)' }}>
              {weeklyReport.mood_trajectory}
            </span>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card-static p-5">
          <h2 className="text-sm font-semibold mb-4 text-center" style={{ color: 'var(--text-secondary)' }}>Mood Over Time</h2>
          {chartData.length > 0 ? (
            <div style={{ width: '100%', height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                  <YAxis domain={[0, 4]} ticks={[1, 2, 3]} tickFormatter={v => v === 3 ? '😊' : v === 2 ? '😐' : v === 1 ? '😔' : ''} tick={{ fontSize: 14 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="score" stroke="var(--accent-primary)" strokeWidth={2.5} fill="url(#moodGrad)" dot={{ r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : <EmptyState />}
        </div>

        <div className="glass-card-static p-5 text-center">
          <h2 className="text-sm font-semibold mb-4 text-center" style={{ color: 'var(--text-secondary)' }}>Emotion Distribution</h2>
          {pieData.length > 0 ? (
            <div className="flex flex-col items-center">
              <div style={{ width: '100%', maxWidth: 180, height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value" stroke="none" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-3 mt-3">
                {pieData.map((d, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </div>
          ) : <EmptyState />}
        </div>
      </div>

      {/* Achievements */}
      <div className="glass-card-static p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
            <Award className="w-4 h-4" style={{ color: 'var(--accent-tertiary)' }} /> Achievement Badges
          </h2>
          <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: 'rgba(192,132,252,0.1)', color: 'var(--accent-tertiary)' }}>
            {unlockedCount}/{achievements.length} unlocked
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {achievements.map((badge) => (
            <div key={badge.badge_id} className={`text-center p-2 rounded-xl ${badge.unlocked ? 'bg-white/5' : 'bg-white/2'}`}>
              <span className="text-2xl mb-1 block">{badge.unlocked ? badge.emoji : '🔒'}</span>
              <p className="text-xs font-bold truncate" style={{ color: badge.unlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>{badge.name}</p>
              <p className="text-[10px] leading-tight mt-0.5" style={{ color: 'var(--text-muted)' }}>{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar */}
      <div className="glass-card-static p-5">
        <h2 className="text-sm font-semibold mb-4 text-center" style={{ color: 'var(--text-secondary)' }}>
          <Calendar className="w-4 h-4 inline mr-2" /> 30-Day Mood Calendar
        </h2>
        <div className="grid grid-cols-7 gap-1 max-w-md mx-auto">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
            <div key={idx} className="text-center text-[10px] font-medium py-1" style={{ color: 'var(--text-muted)' }}>{day}</div>
          ))}
          {calDays.map((d, i) => (
            <div key={i} className={`mood-cell level-${d.level} text-center text-[11px] font-medium rounded-md p-1.5`} title={`${d.date}: ${d.count} entries`}>
              {d.day}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-3 mt-3 text-[10px] flex-wrap" style={{ color: 'var(--text-muted)' }}>
          <span>Less</span>
          <div className="w-3 h-3 rounded mood-cell level-0" />
          <div className="w-3 h-3 rounded mood-cell level-1" />
          <div className="w-3 h-3 rounded mood-cell level-2" />
          <div className="w-3 h-3 rounded mood-cell level-3" />
          <span>More positive</span>
        </div>
      </div>

      {/* Insight */}
      {moodData?.trend && (
        <div className="glass-card-static p-4 text-center">
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            💡 You've been feeling <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{moodData.trend}</span>
          </p>
        </div>
      )}
    </div>
  )
}

function StatCard({ icon, label, value, sub, color, small }) {
  return (
    <div
      className="glass-card p-4"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minWidth: 0,
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
        style={{ background: `${color}12`, color }}
      >
        {icon}
      </div>
      <span
        className="text-xs font-medium mb-1 block w-full"
        style={{ color: 'var(--text-muted)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {label}
      </span>
      <p
        className={`${small ? 'text-sm' : 'text-xl'} font-bold w-full`}
        style={{ color, textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {value}
      </p>
      <p
        className="text-xs mt-0.5 w-full"
        style={{ color: 'var(--text-muted)', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {sub}
      </p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <p className="text-3xl mb-2">📊</p>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Start chatting to see data here!</p>
    </div>
  )
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const ec = d.emotion === 'Positive' ? 'var(--positive)' : d.emotion === 'Negative' ? 'var(--negative)' : 'var(--neutral)'
  return (
    <div className="rounded-xl px-4 py-3 text-xs" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
      <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{d.date} at {d.time}</p>
      <p className="mt-1" style={{ color: ec }}>{d.emotion} · Severity {d.severity}/10</p>
    </div>
  )
}