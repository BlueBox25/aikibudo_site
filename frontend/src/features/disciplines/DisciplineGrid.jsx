import DisciplineCard from './DisciplineCard'
import styles from './disciplines.module.css'

export default function DisciplineGrid({ disciplines }) {
  return (
    <div className={styles.grid}>
      {disciplines.map((discipline) => (
        <DisciplineCard key={discipline.id} discipline={discipline} />
      ))}
    </div>
  )
}
