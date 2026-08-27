import { useState } from 'react'
import { useLookups } from '../../context/useContent'
import InstructorCard from './InstructorCard'
import InstructorModal from './InstructorModal'
import styles from './instructors.module.css'

export default function InstructorGrid({ instructors, locations }) {
  const lookups = useLookups()
  const [openId, setOpenId] = useState(null)

  const selected = instructors.find((person) => person.id === openId) ?? null

  return (
    <>
      <div className={styles.grid}>
        {instructors.map((instructor) => (
          <InstructorCard
            key={instructor.id}
            instructor={instructor}
            locations={locations}
            onOpen={() => setOpenId(instructor.id)}
          />
        ))}
      </div>

      <InstructorModal
        instructor={selected}
        open={Boolean(selected)}
        onClose={() => setOpenId(null)}
        locations={lookups.locationById}
        disciplines={lookups.disciplineById}
      />
    </>
  )
}
