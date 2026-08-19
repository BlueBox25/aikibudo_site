import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Badge, Container, Section, SectionHeading } from '../ui'
import { useContent, useLookups } from '../context/useContent'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import DisciplineArticle from '../features/disciplines/DisciplineArticle'
import InstructorGrid from '../features/instructors/InstructorGrid'
import DojoMap from '../features/locations/DojoMap'
import ScheduleTabs from '../features/schedule/ScheduleTabs'
import ScheduleGrid from '../features/schedule/ScheduleGrid'
import { toneFor } from '../features/schedule/tones'
import NotFound from './NotFound'
import { DefaultCta } from './CtaBand'
import styles from '../features/disciplines/disciplines.module.css'

/**
 * Schedule for one discipline. Aikido runs in all three dojos and gets a sala
 * selector; the rest run only at Art Dojo and are shown directly.
 */
function DisciplineSchedule({ discipline, data, lookups }) {
  const entries = useMemo(
    () => data.schedule.filter((entry) => entry.disciplineId === discipline.id),
    [data.schedule, discipline.id],
  )

  const dojos = useMemo(() => {
    const ids = new Set(entries.map((entry) => entry.locationId))
    return data.locations.filter((location) => ids.has(location.id))
  }, [entries, data.locations])

  const [locationId, setLocationId] = useState(() => dojos[0]?.id ?? null)

  if (dojos.length === 0) return null

  const active = dojos.some((dojo) => dojo.id === locationId) ? locationId : dojos[0].id
  const visible = entries.filter((entry) => entry.locationId === active)
  const activeDojo = lookups.locationById[active]

  return (
    <Section tight alt>
      <Container>
        <SectionHeading
          kicker="Program"
          title="Orar"
          lede={dojos.length > 1 ? 'Alege sala.' : `Se predă la ${activeDojo?.name}.`}
        />

        {dojos.length > 1 && (
          <ScheduleTabs
            items={dojos.map((dojo) => ({
              id: dojo.id,
              name: dojo.name,
              sub: dojo.addressShort,
            }))}
            value={active}
            onChange={setLocationId}
            label="Alege sala"
          />
        )}

        <ScheduleGrid entries={visible} days={data.days} lookups={lookups} showLegend={false} />

        {activeDojo && (
          <div style={{ marginTop: '2.5rem' }}>
            <DojoMap locations={activeDojo} height={320} />
          </div>
        )}
      </Container>
    </Section>
  )
}

export default function DisciplineDetail() {
  const { slug } = useParams()
  const { data } = useContent()
  const lookups = useLookups()

  const discipline = useMemo(
    () => data.disciplines.find((item) => item.slug === slug),
    [data.disciplines, slug],
  )

  useDocumentTitle(discipline?.name)

  if (!discipline) return <NotFound />

  const instructors = data.instructors.filter((person) =>
    person.disciplines.includes(discipline.id),
  )

  return (
    <div style={{ '--tone': toneFor(discipline.id) }}>
      <header className={styles.articleHead}>
        {discipline.kanji && (
          <span className={styles.articleKanji} aria-hidden="true">
            {discipline.kanji}
          </span>
        )}
        <Container>
          <h1 className={styles.articleTitle}>{discipline.name}</h1>
          {discipline.tagline && <p className={styles.articleTagline}>{discipline.tagline}</p>}
          <p className={styles.articleSummary}>{discipline.summary}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1.5rem' }}>
            {discipline.ageGroups.map((group) => (
              <Badge key={group}>{group}</Badge>
            ))}
          </div>
        </Container>
      </header>

      <DisciplineArticle discipline={discipline} />

      <DisciplineSchedule discipline={discipline} data={data} lookups={lookups} />

      {instructors.length > 0 && (
        <Section tight>
          <Container>
            <SectionHeading kicker="Cine predă" title="Instructori" />
            <InstructorGrid instructors={instructors} locations={lookups.locationById} />
          </Container>
        </Section>
      )}

      <DefaultCta />
    </div>
  )
}
