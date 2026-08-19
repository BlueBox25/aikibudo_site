import InstructorCard from './InstructorCard'
import styles from './instructors.module.css'

export default function InstructorGrid({ instructors, locations }) {
  return (
    <div className={styles.grid}>
      {instructors.map((instructor) => (
        <InstructorCard key={instructor.id} instructor={instructor} locations={locations} />
      ))}
    </div>
  )
}
