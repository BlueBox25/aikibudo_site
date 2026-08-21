import { Badge } from '../../ui'
import styles from './instructors.module.css'

const initials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')

const MAX_RANKS = 2

export default function InstructorCard({ instructor, locations, onOpen }) {
  const { name, title, specialty, ranks = [], dojos = [], photo } = instructor
  const hidden = ranks.length - MAX_RANKS

  return (
    <button type="button" className={styles.card} onClick={onOpen}>
      <div className={styles.head}>
        {photo ? (
          <img
            className={styles.photo}
            src={photo}
            alt={`${title} ${name}`}
            width="104"
            height="139"
            loading="lazy"
          />
        ) : (
          <span className={styles.avatar} aria-hidden="true">
            {initials(name)}
          </span>
        )}

        <span className={styles.headText}>
          <span className={styles.title}>{title}</span>
          <span className={styles.name}>{name}</span>
          {specialty && <span className={styles.specialty}>{specialty}</span>}
        </span>
      </div>

      {ranks.length > 0 && (
        <ul className={styles.ranks}>
          {ranks.slice(0, MAX_RANKS).map((rank) => (
            <li key={rank}>{rank}</li>
          ))}
          {hidden > 0 && (
            <li className={styles.ranksMore}>
              + încă {hidden} {hidden === 1 ? 'atestat' : 'atestate'}
            </li>
          )}
        </ul>
      )}

      {dojos.length > 0 && (
        <span className={styles.dojos}>
          {dojos.map((id) => (
            <Badge key={id}>{locations[id]?.name ?? id}</Badge>
          ))}
        </span>
      )}

      <span className={styles.cardCta}>
        Vezi detalii
        <span className={styles.cardArrow} aria-hidden="true">
          →
        </span>
      </span>
    </button>
  )
}
