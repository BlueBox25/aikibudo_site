import { useMemo } from 'react'
import { toneFor } from './tones'
import ClassCard from './ClassCard'
import styles from './schedule.module.css'

/**
 * One row per day that actually has classes, so the whole week reads
 * top-to-bottom without any horizontal scrolling. Days with nothing
 * scheduled are dropped — the club never trains seven days a week.
 */
export default function ScheduleGrid({
  entries,
  days,
  lookups,
  showLocation = false,
  showLegend = true,
}) {
  const byDay = useMemo(() => {
    const groups = new Map()
    for (const entry of entries) {
      if (!groups.has(entry.day)) groups.set(entry.day, [])
      groups.get(entry.day).push(entry)
    }
    for (const list of groups.values()) {
      list.sort((a, b) => a.start.localeCompare(b.start))
    }
    return [...groups.entries()]
      .sort(([a], [b]) => a - b)
      .map(([dayId, list]) => ({ day: days.find((d) => d.id === dayId), entries: list }))
  }, [entries, days])

  const usedDisciplines = useMemo(
    () => [...new Set(entries.map((entry) => entry.disciplineId))],
    [entries],
  )

  if (byDay.length === 0) {
    return (
      <p className={styles.empty}>Nu există clase care să corespundă filtrelor selectate.</p>
    )
  }

  return (
    <>
      <div className={styles.week}>
        {byDay.map(({ day, entries: dayEntries }) => (
          <div key={day.id} className={styles.day}>
            <div className={styles.dayHead}>
              <span className={styles.dayName}>{day.name}</span>
              <span className={styles.dayCount}>
                {dayEntries.length} {dayEntries.length === 1 ? 'clasă' : 'clase'}
              </span>
            </div>

            <div className={styles.dayClasses}>
              {dayEntries.map((entry) => (
                <ClassCard
                  key={entry.id}
                  entry={entry}
                  instructor={lookups.instructorById[entry.instructorId]}
                  location={lookups.locationById[entry.locationId]}
                  showLocation={showLocation}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {showLegend && usedDisciplines.length > 1 && (
        <div className={styles.legend}>
          {usedDisciplines.map((id) => (
            <span key={id} className={styles.legendItem}>
              <span className={styles.legendSwatch} style={{ '--tone': toneFor(id) }} />
              {lookups.disciplineById[id]?.name ?? id}
            </span>
          ))}
        </div>
      )}
    </>
  )
}
