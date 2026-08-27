import styles from './schedule.module.css'
import { cx } from '../../ui/cx'

/**
 * Selector shown above a schedule — salas on a discipline page, disciplines on
 * a sala page. Only rendered when there is more than one thing to choose from.
 */
export default function ScheduleTabs({ items, value, onChange, label }) {
  return (
    <div className={styles.tabs} role="tablist" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="tab"
          aria-selected={value === item.id}
          className={cx(styles.tab, value === item.id && styles.tabOn)}
          onClick={() => onChange(item.id)}
        >
          <span className={styles.tabName}>{item.name}</span>
          {item.sub && <span className={styles.tabAddr}>{item.sub}</span>}
        </button>
      ))}
    </div>
  )
}
