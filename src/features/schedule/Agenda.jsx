import { useMemo } from 'react'
import { todayId } from './layout'
import { toneFor } from './tones'
import { cx } from '../../ui/cx'
import styles from './timetable.module.css'

/** Narrow-screen view: a plain day-by-day agenda, no time axis to squeeze. */
export default function Agenda({ entries, days, lookups, showLocation }) {
  const grouped = useMemo(() => {
    const map = new Map()
    for (const entry of entries) {
      if (!map.has(entry.day)) map.set(entry.day, [])
      map.get(entry.day).push(entry)
    }
    for (const list of map.values()) list.sort((a, b) => a.start.localeCompare(b.start))
    return [...map.entries()]
      .sort(([a], [b]) => a - b)
      .map(([dayId, list]) => ({ day: days.find((d) => d.id === dayId), list }))
  }, [entries, days])

  const today = todayId()

  return (
    <div className={styles.agenda}>
      {grouped.map(({ day, list }) => (
        <section key={day.id} className={styles.agendaDay}>
          <header className={cx(styles.agendaHead, day.id === today && styles.isToday)}>
            <h3 className={styles.agendaDayName}>{day.name}</h3>
            {day.id === today && <span className={styles.todayTag}>azi</span>}
            <span className={styles.agendaCount}>{list.length}</span>
          </header>

          <ul className={styles.agendaList}>
            {list.map((entry) => {
              const instructor = lookups.instructorById[entry.instructorId]
              const location = lookups.locationById[entry.locationId]
              return (
                <li
                  key={entry.id}
                  className={styles.row}
                  style={{ '--tone': toneFor(entry.disciplineId, lookups.disciplineById) }}
                >
                  <span className={styles.rowTime}>
                    <strong>{entry.start}</strong>
                    <span className={styles.rowEnd}>{entry.end}</span>
                  </span>
                  <span className={styles.rowBody}>
                    <span className={styles.rowName}>{entry.className}</span>
                    <span className={styles.rowMeta}>
                      <span className={styles.blockAge}>{entry.ageGroup}</span>
                      {instructor && <span>{instructor.name}</span>}
                    </span>
                    {showLocation && location && (
                      <span className={styles.blockWhere}>{location.name}</span>
                    )}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
