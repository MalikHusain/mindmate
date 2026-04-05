export function EmotionBadge({ emotion }) {
  const cls =
    emotion === 'Positive' ? 'emotion-positive'
    : emotion === 'Negative' ? 'emotion-negative'
    : 'emotion-neutral'

  const emoji =
    emotion === 'Positive' ? '😊' : emotion === 'Negative' ? '😔' : '😐'

  return (
    <span className={`emotion-badge ${cls}`}>
      <span>{emoji}</span>
      {emotion}
    </span>
  )
}

export function SeverityMeter({ severity }) {
  const level = severity >= 7 ? 'high' : severity >= 4 ? 'medium' : 'low'

  return (
    <div className="flex items-center gap-2">
      <div className="severity-meter">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className={`severity-bar ${i < severity ? `active ${level}` : ''}`} />
        ))}
      </div>
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{severity}/10</span>
    </div>
  )
}
