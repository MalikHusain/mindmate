export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 animate-fade-in" style={{ maxWidth: '80%' }}>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm"
        style={{
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
        }}
      >
        🧠
      </div>
      <div
        className="rounded-2xl rounded-tl-md"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div className="typing-indicator">
          <div className="typing-dot" />
          <div className="typing-dot" />
          <div className="typing-dot" />
        </div>
      </div>
    </div>
  )
}
