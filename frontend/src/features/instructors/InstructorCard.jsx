import { Badge, Card } from '../../ui'
import styles from './instructors.module.css'

const initials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')

export default function InstructorCard({ instructor, locations }) {
  const { name, title, specialty, ranks, bio, phone, whatsapp, dojos, social } = instructor

  return (
    <Card interactive className={styles.card}>
      <div className={styles.head}>
        <span className={styles.avatar} aria-hidden="true">
          {initials(name)}
        </span>
        <div>
          <p className={styles.title}>{title}</p>
          <h3 className={styles.name}>{name}</h3>
        </div>
      </div>

      {specialty && <p className={styles.specialty}>{specialty}</p>}

      <ul className={styles.ranks}>
        {ranks.map((rank) => (
          <li key={rank}>{rank}</li>
        ))}
      </ul>

      {bio && <p className={styles.bio}>{bio}</p>}

      {dojos.length > 0 && (
        <div className={styles.dojos}>
          {dojos.map((id) => (
            <Badge key={id}>{locations[id]?.name ?? id}</Badge>
          ))}
        </div>
      )}

      <div className={styles.foot}>
        {phone && (
          <a className={styles.phone} href={`tel:${phone.replace(/\s/g, '')}`}>
            {phone}
            {whatsapp && ' · WhatsApp'}
          </a>
        )}
        {social.length > 0 && (
          <span className={styles.social}>
            {social.map((item) => (
              <a key={item.url} href={item.url} target="_blank" rel="noreferrer noopener">
                {item.platform === 'facebook' && 'Facebook'}
                {item.platform === 'instagram' && 'Instagram'}
                {item.platform === 'linkedin' && 'LinkedIn'}
              </a>
            ))}
          </span>
        )}
      </div>
    </Card>
  )
}
