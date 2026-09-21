const toneFor = (score) => {
  if (score >= 70) return { ring: '#5f8f6f', label: 'Épanouie' }
  if (score >= 40) return { ring: '#b8874a', label: 'À entretenir' }
  return { ring: '#b3473f', label: 'Fragile' }
}

export default function HealthIndicator({ score = 0, size = 44, showLabel = false }) {
  const { ring, label } = toneFor(score)
  const radius = (size - 4) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - score / 100)

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="currentColor" strokeWidth="3"
            className="text-ink-100 dark:text-white/10"
          />
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={ring} strokeWidth="3" strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-ink-900 dark:text-ink-50">
          {score}
        </span>
      </div>
      {showLabel && (
        <span className="text-sm font-medium" style={{ color: ring }}>{label}</span>
      )}
    </div>
  )
}
