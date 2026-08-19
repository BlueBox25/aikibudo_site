import { useMemo, useState } from 'react'
import { Container, Section } from '../ui'
import { cx } from '../ui/cx'
import { useContent, useLookups } from '../context/useContent'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import InstructorGrid from '../features/instructors/InstructorGrid'
import PageHeader from './PageHeader'
import { DefaultCta } from './CtaBand'
import scheduleStyles from '../features/schedule/schedule.module.css'

export default function Instructors() {
  const { data } = useContent()
  const lookups = useLookups()
  useDocumentTitle('Instructori')

  const [disciplineId, setDisciplineId] = useState(null)

  const instructors = useMemo(
    () =>
      disciplineId
        ? data.instructors.filter((person) => person.disciplines.includes(disciplineId))
        : data.instructors,
    [data.instructors, disciplineId],
  )

  return (
    <>
      <PageHeader
        kicker="Cine predă"
        title="Instructori"
        lede="Opt instructori, de la 1 la 6 Dan, cu atestări Aikikai, World Ju Jitsu Federation, FRAM și Pankration Athlima."
      />

      <Section tight>
        <Container>
          <div className={scheduleStyles.filters}>
            <div className={scheduleStyles.filterRow}>
              <span className={scheduleStyles.filterLabel}>Disciplină</span>
              <button
                type="button"
                className={cx(scheduleStyles.chip, disciplineId === null && scheduleStyles.on)}
                onClick={() => setDisciplineId(null)}
              >
                Toți
              </button>
              {data.disciplines.map((discipline) => (
                <button
                  key={discipline.id}
                  type="button"
                  className={cx(
                    scheduleStyles.chip,
                    disciplineId === discipline.id && scheduleStyles.on,
                  )}
                  onClick={() => setDisciplineId(discipline.id)}
                >
                  {discipline.name}
                </button>
              ))}
            </div>
          </div>

          <InstructorGrid instructors={instructors} locations={lookups.locationById} />
        </Container>
      </Section>

      <DefaultCta />
    </>
  )
}
