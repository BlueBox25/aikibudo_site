import { useId, useState } from 'react'
import { cx } from './cx'
import styles from './accordion.module.css'

/**
 * Collapsible block. Long-form reading is opt-in so the pages stay short.
 */
export function AccordionItem({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()

  return (
    <div className={cx(styles.item, open && styles.itemOpen)}>
      <button
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.title}>{title}</span>
        <span className={styles.chevron} aria-hidden="true">
          <svg viewBox="0 0 16 16">
            <path d="M3.5 6 8 10.5 12.5 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {open && (
        <div id={id} className={styles.panel}>
          {children}
        </div>
      )}
    </div>
  )
}

export function Accordion({ children }) {
  return <div className={styles.group}>{children}</div>
}
