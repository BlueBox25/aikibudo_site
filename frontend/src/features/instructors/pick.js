/**
 * Who to show under a schedule.
 *
 * With a discipline selected, the schedule is the source of truth: the list is
 * exactly the people teaching those classes, so it always explains the orar
 * above it. With no discipline selected ("Toate"), the sala's whole roster is
 * shown as well — a Shihan who runs the dojo belongs on its page even in a term
 * where he has no class of his own on the timetable.
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

  const onRoster = (person) =>
    (!locationId || person.dojos.includes(locationId)) &&
    (!disciplineId || person.disciplines.includes(disciplineId))

  if (!disciplineId) {
    return instructors.filter((person) => scheduled.has(person.id) || onRoster(person))
  }

  if (scheduled.size > 0) {
    return instructors.filter((person) => scheduled.has(person.id))
  }
  return instructors.filter(onRoster)
}
