import { useMemo, useState } from 'react'
import styles from './admin.module.css'

const DAYS = [1, 2, 3, 4, 5, 6, 7]

/** `art-aikido-tue-1700` — the convention already in the file. */
const SHORT_DAY = { 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat', 7: 'sun' }

function makeId(entry, taken) {
  const base = [
    entry.locationId || 'sala',
    entry.disciplineId || 'clasa',
    SHORT_DAY[entry.day] ?? 'zi',
    (entry.start || '0000').replace(':', ''),
  ].join('-')
  let id = base
  let n = 2
  while (taken.has(id)) id = `${base}-${n++}`
  return id
}

/**
 * The timetable is the part that actually changes every term, so it gets a real
 * table instead of the generic record form: one row per class, dropdowns bound
 * to the ids that exist, so a typo in a locationId is not possible.
 */
export default function ScheduleEditor({ data, onChange }) {
  const { schedule, locations, disciplines, instructors, days } = data
  const [filter, setFilter] = useState('')

  const dayName = useMemo(
    () => Object.fromEntries(days.map((d) => [d.id, d.name])),
    [days],
  )

  const rows = useMemo(() => {
    const withIndex = schedule.map((entry, index) => ({ entry, index }))
    const visible = filter
      ? withIndex.filter(({ entry }) => entry.locationId === filter)
      : withIndex
    return [...visible].sort(
      (a, b) => a.entry.day - b.entry.day || a.entry.start.localeCompare(b.entry.start),
    )
  }, [schedule, filter])

  const patch = (index, key, value) => {
    const next = [...schedule]
    next[index] = { ...next[index], [key]: value }
    onChange(next)
  }

  const remove = (index) => {
    if (!confirm('Ștergi această clasă din orar?')) return
    onChange(schedule.filter((_, i) => i !== index))
  }

  const duplicate = (index) => {
    const source = schedule[index]
    const taken = new Set(schedule.map((e) => e.id))
    const copy = { ...source, id: makeId(source, taken) }
    const next = [...schedule]
    next.splice(index + 1, 0, copy)
    onChange(next)
  }

  const add = () => {
    const taken = new Set(schedule.map((e) => e.id))
    const blank = {
      id: '',
      locationId: filter || locations[0]?.id || '',
      disciplineId: disciplines[0]?.id || '',
      day: 1,
      start: '18:00',
      end: '19:00',
      className: disciplines[0]?.name || '',
      ageGroup: 'Adulți',
      instructorId: instructors[0]?.id || '',
    }
    onChange([...schedule, { ...blank, id: makeId(blank, taken) }])
  }

  return (
    <>
      <div className={styles.toolbar}>
        <select
          className={styles.select}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">Toate sălile ({schedule.length} clase)</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name} ({schedule.filter((e) => e.locationId === l.id).length})
            </option>
          ))}
        </select>
        <button type="button" className={styles.btn} onClick={add}>
          + Clasă nouă
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Zi</th>
              <th>Ora</th>
              <th>Sala</th>
              <th>Disciplina</th>
              <th>Nume afișat</th>
              <th>Grupa</th>
              <th>Instructor</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map(({ entry, index }) => (
              <tr key={entry.id || index}>
                <td>
                  <select
                    className={styles.cell}
                    value={entry.day}
                    onChange={(e) => patch(index, 'day', Number(e.target.value))}
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {dayName[d] ?? d}
                      </option>
                    ))}
                  </select>
                </td>
                <td className={styles.timeCell}>
                  <input
                    className={styles.cell}
                    type="time"
                    value={entry.start}
                    onChange={(e) => patch(index, 'start', e.target.value)}
                  />
                  <input
                    className={styles.cell}
                    type="time"
                    value={entry.end}
                    onChange={(e) => patch(index, 'end', e.target.value)}
                  />
                </td>
                <td>
                  <select
                    className={styles.cell}
                    value={entry.locationId}
                    onChange={(e) => patch(index, 'locationId', e.target.value)}
                  >
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className={styles.cell}
                    value={entry.disciplineId}
                    onChange={(e) => patch(index, 'disciplineId', e.target.value)}
                  >
                    {disciplines.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    className={styles.cell}
                    value={entry.className}
                    onChange={(e) => patch(index, 'className', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    className={styles.cell}
                    value={entry.ageGroup}
                    onChange={(e) => patch(index, 'ageGroup', e.target.value)}
                  />
                </td>
                <td>
                  <select
                    className={styles.cell}
                    value={entry.instructorId}
                    onChange={(e) => patch(index, 'instructorId', e.target.value)}
                  >
                    {instructors.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.displayName ?? p.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className={styles.rowActions}>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    title="Dublează"
                    onClick={() => duplicate(index)}
                  >
                    ⧉
                  </button>
                  <button
                    type="button"
                    className={styles.iconBtnDanger}
                    title="Șterge"
                    onClick={() => remove(index)}
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
