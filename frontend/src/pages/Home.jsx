import { Container, Prose, Section, SectionHeading } from '../ui'
import { useContent, useLookups } from '../context/useContent'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import Hero from '../features/hero/Hero'
import DisciplineGrid from '../features/disciplines/DisciplineGrid'
import LocationCard from '../features/locations/LocationCard'
import { DefaultCta } from './CtaBand'
import RedirectBand from './RedirectBand'
import styles from './pages.module.css'
import locationStyles from '../features/locations/locations.module.css'

export default function Home() {
  const { data } = useContent()
  const lookups = useLookups()
  useDocumentTitle(null)

  const { site, disciplines, locations } = data

  return (
    <>
      <Hero site={site} />

      <Section alt>
        <Container>
          <div className={styles.mission}>
            <div>
              <p className={styles.missionQuote}>{site.mission[0]}</p>
              <div className={styles.missionRule} />
            </div>
            <Prose>
              {site.mission.slice(1).map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </Prose>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            kicker="Ce practicăm"
            title="Patru discipline, un singur principiu"
            lede="Nu forța brută, ci mișcarea, distanța și controlul. Fiecare disciplină abordează asta din alt unghi."
          />
          <DisciplineGrid disciplines={disciplines} />
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            kicker="Unde ne găsești"
            title="Trei dojo-uri în București"
            lede="De la sala boutique din nord la dojo-ul tradițional unde a început totul în 1997."
          />
          <div className={locationStyles.grid}>
            {locations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                disciplines={lookups.disciplineById}
              />
            ))}
          </div>
        </Container>
      </Section>

      <RedirectBand />

      <DefaultCta />
    </>
  )
}
