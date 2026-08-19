import { Container, Section } from '../ui'
import { useContent, useLookups } from '../context/useContent'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import DojoMap from '../features/locations/DojoMap'
import LocationCard from '../features/locations/LocationCard'
import PageHeader from './PageHeader'
import { DefaultCta } from './CtaBand'
import styles from '../features/locations/locations.module.css'

export default function Locations() {
  const { data } = useContent()
  const lookups = useLookups()
  useDocumentTitle('Locații')

  return (
    <>
      <PageHeader
        kicker="Unde ne găsești"
        title="Dojo-uri"
        lede="Trei săli în București, fiecare cu profilul ei: o sală boutique cu toate disciplinele, dojo-ul tradițional de unde a pornit clubul și un spațiu dedicat exclusiv copiilor."
      />

      <Section tight>
        <Container>
          <DojoMap locations={data.locations} height={400} />

          <div className={styles.grid} style={{ marginTop: '2.5rem' }}>
            {data.locations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                disciplines={lookups.disciplineById}
              />
            ))}
          </div>
        </Container>
      </Section>

      <DefaultCta />
    </>
  )
}
