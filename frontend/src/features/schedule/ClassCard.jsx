import { Link } from 'react-router-dom'
import { toneFor } from './tones'
import styles from './schedule.module.css'

export default function ClassCard({ entry, instructor, location, showLocation = false }) {
  return (
    <article className={styles.class} style={{ '--tone': toneFor(entry.disciplineId) }}>
      <p className={styles.classTime}>
        {entry.start}
        <span className={styles.classTimeEnd}>– {entry.end}</span>
      </p>

      <h3 className={styles.className}>{entry.className}</h3>

      <div className={styles.classMeta}>
        <span className={styles.classAge}>{entry.ageGroup}</span>
      </div>

      {instructor && (
        <Link to="/instructori" className={styles.classInstructor}>
          {instructor.displayName}
        </Link>
      )}

      {showLocation && location && (
        <p className={styles.classWhere}>{location.name}</p>
      )}
    </article>
  )
}
