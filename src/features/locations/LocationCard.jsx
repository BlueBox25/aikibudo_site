import { Link } from 'react-router-dom'
import { Badge } from '../../ui'
import styles from './locations.module.css'

function Pin() {
  return (
    <svg viewBox="0 0 24 24" className={styles.pin} aria-hidden="true">
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

/** The whole card is the link — no small target to hunt for. */
export default function LocationCard({ location, disciplines }) {
  return (
    <Link to={`/locatii/${location.slug}`} className={styles.card}>
      <div className={styles.cardTop}>
        <div>
          <h3 className={styles.cardName}>{location.name}</h3>
          <p className={styles.cardKicker}>{location.kicker}</p>
        </div>
        {location.founded && <Badge>Din {location.founded}</Badge>}
      </div>

      <p className={styles.cardAddress}>
        <Pin />
        <span>{location.address}</span>
      </p>

      <p className={styles.cardBlurb}>{location.blurb}</p>

      <div className={styles.cardTags}>
        {location.disciplines.map((id) => (
          <Badge key={id} solid>
            {disciplines[id]?.name ?? id}
          </Badge>
        ))}
      </div>

      <span className={styles.cardCta}>
        Vezi sala
        <span className={styles.cardArrow} aria-hidden="true">
          →
        </span>
      </span>
    </Link>
  )
}
