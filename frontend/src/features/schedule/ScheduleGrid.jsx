import { useMemo } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import Timetable from './Timetable'
import Agenda from './Agenda'
import { toneFor } from './tones'
import styles from './timetable.module.css'

export default function ScheduleGrid({
  entries,
  days,
  lookups,
  showLocation = false,
  showLegend = true,
}) {
  const narrow = useMediaQuery('(max-width: 900px)')

  const used = useMemo(
    () => [...new Set(entries.map((entry) => entry.disciplineId))],
    [entries],
  )

  if (entries.length === 0) {
    return <p className={styles.empty}>Nu există clase care să corespundă selecției.</p>
  }

  const View = narrow ? Agenda : Timetable

  return (
    <>
      <View entries={entries} days={days} lookups={lookups} showLocation={showLocation} />

      {showLegend && used.length > 1 && (
        <div className={styles.legend}>
          {used.map((id) => (
            <span key={id} className={styles.legendItem}>
              <span className={styles.legendSwatch} style={{ '--tone': toneFor(id, lookups.disciplineById) }} />
              {lookups.disciplineById[id]?.name ?? id}
            </span>
          ))}
        </div>
      )}
    </>
  )
}
