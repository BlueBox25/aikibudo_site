import { Container, Prose, Section, SectionHeading } from '../ui'
import DisciplineGrid from '../features/disciplines/DisciplineGrid'
import LocationCard from '../features/locations/LocationCard'
import styles from './pages.module.css'
import locationStyles from '../features/locations/locations.module.css'

/**
 * The home page as an ordered list of blocks rather than a fixed JSX sequence.
 *
 * `content.json` holds the order, the on/off switch and the headings, so the
 * page can be rearranged from the editor without touching this file. Each block
 * below receives the whole section record, so a block that wants a heading can
 * read it and one that does not can ignore it.
 *
 * The registry that names these blocks lives in ./homeBlocks so this file
 * exports components only, which is what keeps fast refresh working.
 */

function Heading({ section }) {
  if (!section.kicker && !section.title && !section.lede) return null
  return <SectionHeading kicker={section.kicker} title={section.title} lede={section.lede} />
}

export function MissionSection({ section, data }) {
  const { mission = [] } = data.site
  if (mission.length === 0) return null

  return (
    <Section alt={section.alt}>
      <Container>
        <Heading section={section} />
        <div className={styles.mission}>
          <div>
            <p className={styles.missionQuote}>{mission[0]}</p>
            <div className={styles.missionRule} />
          </div>
          <Prose>
            {mission.slice(1).map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </Prose>
        </div>
      </Container>
    </Section>
  )
}

export function DisciplinesSection({ section, data }) {
  return (
    <Section alt={section.alt}>
      <Container>
        <Heading section={section} />
        <DisciplineGrid disciplines={data.disciplines} />
      </Container>
    </Section>
  )
}

export function LocationsSection({ section, data, lookups }) {
  return (
    <Section alt={section.alt}>
      <Container>
        <Heading section={section} />
        <div className={locationStyles.grid}>
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
  )
}
