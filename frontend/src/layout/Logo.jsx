import styles from './layout.module.css'

export default function Logo() {
  return (
    <span className={styles.logo}>
      <svg viewBox="0 0 32 32" aria-hidden="true" className={styles.logoMark}>
        {/* Enso — the open brush circle */}
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="63 12"
          transform="rotate(-40 16 16)"
        />
      </svg>
      <span className={styles.logoText}>
        Aiki<span className={styles.logoTextDim}>Budo</span>
      </span>
    </span>
  )
}
