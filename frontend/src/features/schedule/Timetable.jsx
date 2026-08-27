import { useMemo } from 'react'
import { buildAxis, placeDay, todayId } from './layout'
import { toneFor } from './tones'
import { cx } from '../../ui/cx'
import styles from './timetable.module.css'

export default function Timetable({ entries, days, lookups, showLocation }) {
  const axis = useMemo(() => buildAxis(entries), [entries])

  const columns = useMemo(() => {
    const groups = new Map()
    for (const entry of entries) {
      if (!groups.has(entry.day)) groups.set(entry.day, [])
      groups.get(entry.day).push(entry)
    }
    return [...groups.entries()]
      .sort(([a], [b]) => a - b)
      .map(([dayId, list]) => ({
        day: days.find((d) => d.id === dayId),
        items: placeDay(list, axis),
      }))
  }, [entries, days, axis])

  const today = todayId()

  return (
    <div className={styles.board} style={{ '--cols': columns.length }}>
      <div className={styles.headRow}>
        <div className={styles.railHead} />
        {columns.map(({ day, items }) => (
          <div key={day.id} className={cx(styles.dayHead, day.id === today && styles.isToday)}>
            <span className={styles.dayName}>{day.name}</span>
            <span className={styles.dayCount}>
              {items.length} {items.length === 1 ? 'clasă' : 'clase'}
            </span>
            {day.id === today && <span className={styles.todayTag}>azi</span>}
          </div>
        ))}
      </div>

      <div className={styles.body} style={{ height: `${axis.height}px` }}>
        <div className={styles.rail}>
          {axis.ticks.map((tick) => (
            <span key={tick.y} className={styles.tick} style={{ top: `${tick.y}px` }}>
              {tick.label}
            </span>
          ))}
        </div>

        <div className={styles.grid}>
          {axis.ticks.map((tick) => (
            <span key={tick.y} className={styles.gridLine} style={{ top: `${tick.y}px` }} />
          ))}

          {/* Collapsed empty hours get a visible seam so the jump is honest. */}
          {axis.bands.slice(0, -1).map((band) => (
            <span
              key={`break-${band.y}`}
              className={styles.seam}
              style={{ top: `${band.y + band.height}px`, height: `${axis.breakPx}px` }}
            />
          ))}

          {columns.map(({ day, items }) => (
            <div key={day.id} className={cx(styles.col, day.id === today && styles.colToday)}>
              {items.map(({ entry, top, height, lane, lanes }) => {
                const instructor = lookups.instructorById[entry.instructorId]
                const location = lookups.locationById[entry.locationId]
                // Splitting a column halves the width, so the class name wraps
                // and there is no longer room for the meta row underneath.
                const compact = height < 78 || lanes > 1
                const veryShort = height < 58
                const full = [
                  `${entry.start}–${entry.end}`,
                  entry.className,
                  entry.ageGroup,
                  instructor?.displayName,
                  showLocation ? location?.name : null,
                ].filter(Boolean).join(' · ')
                return (
                  <article
                    key={entry.id}
                    className={cx(
                      styles.block,
                      compact && styles.blockCompact,
                      veryShort && styles.blockVeryShort,
                    )}
                    title={full}
                    style={{
                      '--tone': toneFor(entry.disciplineId, lookups.disciplineById),
                      top: `${top}px`,
                      height: `${height - 4}px`,
                      left: `${(lane / lanes) * 100}%`,
                      width: `calc(${100 / lanes}% - 4px)`,
                    }}
                  >
                    <span className={styles.blockTime}>
                      {entry.start}<span className={styles.blockDash}>–</span>{entry.end}
                    </span>
                    <span className={styles.blockName}>{entry.className}</span>
                    {compact ? (
                      // Half-width: the age badge does not fit beside the name,
                      // but the name itself wraps onto two lines rather than
                      // being cut down to a surname.
                      instructor && !veryShort && (
                        <span className={styles.blockWhoCompact}>{instructor.name}</span>
                      )
                    ) : (
                      <span className={styles.blockMeta}>
                        <span className={styles.blockAge}>{entry.ageGroup}</span>
                        {instructor && (
                          <span className={styles.blockWho}>{instructor.name}</span>
                        )}
                      </span>
                    )}
                    {showLocation && location && !compact && (
                      <span className={styles.blockWhere}>{location.name}</span>
                    )}
                  </article>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
