import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Badge, Container, Prose, Section, SectionHeading } from '../ui'
import { useContent, useLookups } from '../context/useContent'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import ContactList from '../features/locations/ContactList'
import DojoMap from '../features/locations/DojoMap'
import InstructorGrid from '../features/instructors/InstructorGrid'
import { instructorsFor } from '../features/instructors/pick'
import ScheduleTabs from '../features/schedule/ScheduleTabs'
import ScheduleGrid from '../features/schedule/ScheduleGrid'
import PlanCard from '../features/pricing/PlanCard'
import NotFound from './NotFound'
import { DefaultCta } from './CtaBand'
import styles from '../features/locations/locations.module.css'
import pricingStyles from '../features/pricing/pricing.module.css'

export default function LocationDetail() {
  const { slug } = useParams()
  const { data } = useContent()
  const lookups = useLookups()

  const location = useMemo(
    () => data.locations.find((item) => item.slug === slug),
    [data.locations, slug],
  )

  const entries = useMemo(
    () => (location ? data.schedule.filter((e) => e.locationId === location.id) : []),
    [data.schedule, location],
  )

  // Disciplines actually taught in this sala.
  const disciplines = useMemo(() => {
    const ids = new Set(entries.map((entry) => entry.disciplineId))
    return data.disciplines.filter((discipline) => ids.has(discipline.id))
  }, [entries, data.disciplines])

  const [disciplineId, setDisciplineId] = useState(null)

  useDocumentTitle(location?.name)

  if (!location) return <NotFound />

  const multi = disciplines.length > 1
  const active = disciplines.some((d) => d.id === disciplineId) ? disciplineId : null
  const visible = active ? entries.filter((entry) => entry.disciplineId === active) : entries

  // The discipline selection narrows the instructor list too.
  const instructors = instructorsFor(data.instructors, data.schedule, {
    locationId: location.id,
    disciplineId: active,
  })

  const pricing = data.pricing.find((group) => group.locationId === location.id)
  const activeName = active ? lookups.disciplineById[active]?.name : null

  return (
    <>
      <header className={styles.detailHead}>
        <Container>
          <h1 className={styles.detailTitle}>{location.name}</h1>
          <p className={styles.detailKicker}>{location.kicker}</p>

          <div className={styles.detailMeta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Adresă</span>
              <span className={styles.metaValue}>{location.address}</span>
            </div>
            {location.founded && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Înființat</span>
                <span className={styles.metaValue}>{location.founded}</span>
              </div>
            )}
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Clase / săptămână</span>
              <span className={styles.metaValue}>{entries.length}</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1.5rem' }}>
            {location.disciplines.map((id) => (
              <Badge key={id} solid>
                {lookups.disciplineById[id]?.name ?? id}
              </Badge>
            ))}
          </div>
        </Container>
      </header>

      {entries.length > 0 && (
        <Section tight>
          <Container>
            <SectionHeading
              kicker="Program"
              title="Orar"
              lede={multi ? 'Alege disciplina.' : undefined}
            />

            {multi && (
              <ScheduleTabs
                items={[
                  { id: null, name: 'Toate', sub: `${entries.length} clase` },
                  ...disciplines.map((discipline) => ({
                    id: discipline.id,
                    name: discipline.name,
                    sub: `${entries.filter((e) => e.disciplineId === discipline.id).length} clase`,
                  })),
                ]}
                value={active}
                onChange={setDisciplineId}
                label="Alege disciplina"
              />
            )}

            <ScheduleGrid entries={visible} days={data.days} lookups={lookups} />
          </Container>
        </Section>
      )}

      {instructors.length > 0 && (
        <Section tight alt>
          <Container>
            <SectionHeading
              kicker="Cine predă"
              title={activeName ? `Instructori · ${activeName}` : 'Instructori'}
            />
            <InstructorGrid instructors={instructors} locations={lookups.locationById} />
          </Container>
        </Section>
      )}

      <Section tight>
        <Container>
          <SectionHeading kicker="Unde ne găsești" title="Hartă și contact" />
          <DojoMap locations={location} height={400} />
          <div style={{ marginTop: '2rem' }}>
            <ContactList contacts={location.contacts} />
          </div>
        </Container>
      </Section>

      {pricing && (
        <Section tight alt>
          <Container>
            <SectionHeading kicker="Abonamente" title="Prețuri" />
            <div className={pricingStyles.plans}>
              {pricing.plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} currency={pricing.currency} />
              ))}
            </div>

            {pricing.custom && (
              <p className={pricingStyles.customNote}>
                <strong>{pricing.custom.name}:</strong> {pricing.custom.text}
              </p>
            )}

            <div className={pricingStyles.discounts}>
              <div>
                <p className={pricingStyles.discountsTitle}>{data.discounts.title}</p>
                <p className={pricingStyles.discountsNote}>{data.discounts.note}</p>
              </div>
              <div className={pricingStyles.tiers}>
                {data.discounts.tiers.map((tier) => (
                  <div key={tier.period} className={pricingStyles.tier}>
                    <span className={pricingStyles.tierPeriod}>{tier.period}</span>
                    <span className={pricingStyles.tierValue}>−{tier.discount}</span>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>
      )}

      <Section tight>
        <Container>
          <SectionHeading kicker="Despre sală" title={location.highlightsTitle ?? 'Ce te așteaptă'} />
          <div className={styles.highlights}>
            {location.highlights.map((item, index) => (
              <div key={item} className={styles.highlight}>
                <span className={styles.highlightIndex}>{String(index + 1).padStart(2, '0')}</span>
                <span>{item}</span>
              </div>
            ))}
          </div>

          <Prose style={{ marginTop: '2.5rem' }}>
            {location.description.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </Prose>
        </Container>
      </Section>

      <DefaultCta />
    </>
  )
}
