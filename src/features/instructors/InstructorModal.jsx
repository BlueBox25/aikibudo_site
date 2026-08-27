import Modal from '../../ui/Modal'
import WhatsAppButton from '../../ui/WhatsAppButton'
import SocialLink from '../../ui/SocialLink'
import { telLink } from '../../lib/phone'
import { Badge } from '../../ui'
import { toneFor } from '../schedule/tones'
import styles from './instructors.module.css'

const normalise = (text) =>
  text.toLowerCase().replace(/[^a-zà-ž0-9]+/gi, ' ').trim()

/**
 * Some bios imported from the old site simply repeat the rank list and then
 * trail off mid-word. Showing them would print the same lines twice, so a bio
 * that adds nothing beyond the ranks is dropped.
 */
function usefulBio(bio, ranks) {
  if (!bio) return null
  const haystack = normalise(ranks.join(' '))
  const rest = normalise(bio)
    .split(' ')
    .filter((word) => word.length > 3 && !haystack.includes(word))
  return rest.length >= 4 ? bio : null
}

export default function InstructorModal({ instructor, open, onClose, locations, disciplines }) {
  if (!instructor) return null

  const { name, title, specialty, ranks = [], bio, phone, phoneAlt,
          whatsapp, dojos = [], disciplines: taught = [], social = [], photo } = instructor

  const bioText = usefulBio(bio, ranks)
  const titleId = `instructor-${instructor.id}`

  // The discipline chips below already say this when the two match.
  const taughtNames = taught.map((id) => disciplines[id]?.name ?? id).join(', ')
  const showSpecialty = specialty && normalise(specialty) !== normalise(taughtNames)

  return (
    <Modal open={open} onClose={onClose} labelledBy={titleId}>
      <div className={styles.modalGrid}>
        {photo && (
          <img className={styles.modalPhoto} src={photo} alt={`${title} ${name}`} />
        )}

        <div className={styles.modalBody}>
          <p className={styles.modalTitle}>{title}</p>
          <h2 id={titleId} className={styles.modalName}>
            {name}
          </h2>
          {showSpecialty && <p className={styles.modalSpecialty}>{specialty}</p>}

          {taught.length > 0 && (
            <div className={styles.modalTags}>
              {taught.map((id) => (
                <span
                  key={id}
                  className={styles.modalTag}
                  style={{ '--tone': toneFor(id, disciplines) }}
                >
                  {disciplines[id]?.name ?? id}
                </span>
              ))}
            </div>
          )}

          {ranks.length > 0 && (
            <section className={styles.modalSection}>
              <h3 className={styles.modalHeading}>Grade și atestate</h3>
              <ul className={styles.ranks}>
                {ranks.map((rank) => (
                  <li key={rank}>{rank}</li>
                ))}
              </ul>
            </section>
          )}

          {bioText && (
            <section className={styles.modalSection}>
              <h3 className={styles.modalHeading}>Despre</h3>
              <p className={styles.modalText}>{bioText}</p>
            </section>
          )}

          {dojos.length > 0 && (
            <section className={styles.modalSection}>
              <h3 className={styles.modalHeading}>Săli</h3>
              <div className={styles.dojos}>
                {dojos.map((id) => (
                  <Badge key={id}>{locations[id]?.name ?? id}</Badge>
                ))}
              </div>
            </section>
          )}

          {(phone || social.length > 0) && (
            <section className={styles.modalSection}>
              <h3 className={styles.modalHeading}>Contact</h3>
              <div className={styles.modalContact}>
                {phone && (
                  <a className={styles.modalPhone} href={telLink(phone)}>
                    {phone}
                  </a>
                )}
                {phoneAlt && (
                  <a className={styles.modalPhone} href={telLink(phoneAlt)}>
                    {phoneAlt}
                  </a>
                )}
                {whatsapp && phone && <WhatsAppButton phone={phone} />}
                {social.map((item) => (
                  <SocialLink key={item.url} platform={item.platform} url={item.url} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </Modal>
  )
}
