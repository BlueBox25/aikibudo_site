import { Link } from 'react-router-dom'
import styles from './ui.module.css'
import { cx } from './cx'

export function Container({ narrow = false, className, children }) {
  return <div className={cx(styles.container, narrow && styles.narrow, className)}>{children}</div>
}

export function Section({ id, alt = false, tight = false, className, children }) {
  return (
    <section
      id={id}
      className={cx(styles.section, alt && styles.alt, tight && styles.tight, className)}
    >
      {children}
    </section>
  )
}

export function SectionHeading({ kicker, title, lede, centered = false, children }) {
  return (
    <header className={cx(styles.heading, centered && styles.centered)}>
      {kicker && <p className={styles.kicker}>{kicker}</p>}
      {title && <h2 className={styles.title}>{title}</h2>}
      {lede && <p className={styles.lede}>{lede}</p>}
      {children}
    </header>
  )
}

export function Button({
  as = 'button',
  to,
  href,
  variant = 'default',
  size = 'md',
  className,
  children,
  ...rest
}) {
  const cls = cx(styles.btn, styles[variant], styles[size], className)

  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {children}
      </a>
    )
  }

  const Tag = as
  return (
    <Tag className={cls} {...rest}>
      {children}
    </Tag>
  )
}

export function Card({ as = 'div', interactive = false, className, children, ...rest }) {
  const Tag = as
  return (
    <Tag className={cx(styles.card, interactive && styles.interactive, className)} {...rest}>
      {children}
    </Tag>
  )
}

export function Badge({ solid = false, className, children }) {
  return <span className={cx(styles.badge, solid && styles.solid, className)}>{children}</span>
}

export function Stat({ value, label }) {
  return (
    <div className={styles.stat}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

export function Prose({ className, children, ...rest }) {
  return (
    <div className={cx(styles.prose, className)} {...rest}>
      {children}
    </div>
  )
}

export function Rule() {
  return <hr className={styles.rule} />
}

export function LoadingState({ label = 'Se încarcă…' }) {
  return (
    <div className={styles.state} role="status" aria-live="polite">
      <div className={styles.spinner} />
      <p className={styles.stateText}>{label}</p>
    </div>
  )
}

export function ErrorState({ title = 'Ceva nu a mers bine', message, onRetry }) {
  return (
    <div className={styles.state} role="alert">
      <h2 className={styles.stateTitle}>{title}</h2>
      {message && <p className={styles.stateText}>{message}</p>}
      {onRetry && (
        <Button variant="accent" onClick={onRetry}>
          Reîncearcă
        </Button>
      )}
    </div>
  )
}
