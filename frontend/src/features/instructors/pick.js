/**
 * Who teaches at a given sala (and optionally a given discipline).
 *
 * The schedule is the source of truth: if classes exist for that slot, the list
 * is exactly the people teaching them, so the roster always explains the orar
 * shown above it. Only when nothing is scheduled do we fall back to the
 * instructor's own `dojos`/`disciplines` fields, so a sala without a published
 * schedule still shows its team rather than nothing.
 */
export function instructorsFor(instructors, schedule, { locationId = null, disciplineId = null }) {
  const scheduled = new Set(
    schedule
      .filter(
        (entry) =>
          (!locationId || entry.locationId === locationId) &&
          (!disciplineId || entry.disciplineId === disciplineId),
      )
      .map((entry) => entry.instructorId),
  )

  if (scheduled.size > 0) {
    return instructors.filter((person) => scheduled.has(person.id))
  }

  return instructors.filter((person) => {
    const atDojo = !locationId || person.dojos.includes(locationId)
    const teaches = !disciplineId || person.disciplines.includes(disciplineId)
    return atDojo && teaches
  })
}
