import { Link } from 'react-router-dom'
import { Badge } from '../../ui'
import { toneFor } from '../schedule/tones'
import styles from './disciplines.module.css'

export default function DisciplineCard({ discipline }) {
  return (
    <Link
      to={`/discipline/${discipline.slug}`}
      className={styles.card}
      style={{ '--tone': discipline.tone || toneFor(discipline.id) }}
    >
      {discipline.kanji && (
        <span className={styles.cardKanji} aria-hidden="true">
          {discipline.kanji}
        </span>
      )}

      <h3 className={styles.cardName}>{discipline.name}</h3>
      {discipline.tagline && <p className={styles.cardTagline}>{discipline.tagline}</p>}
      <p className={styles.cardSummary}>{discipline.summary}</p>

      <div className={styles.cardFoot}>
        {discipline.ageGroups.slice(0, 3).map((group) => (
          <Badge key={group}>{group}</Badge>
        ))}
        {discipline.ageGroups.length > 3 && <Badge>+{discipline.ageGroups.length - 3}</Badge>}
      </div>

      <span className={styles.cardCta}>
        Detalii
        <span className={styles.cardArrow} aria-hidden="true">
          →
        </span>
      </span>
    </Link>
  )
}
