import WhatsAppButton from '../../ui/WhatsAppButton'
import { telLink } from '../../lib/phone'
import styles from './locations.module.css'

export default function ContactList({ contacts }) {
  return (
    <div className={styles.contacts}>
      {contacts.map((contact) => (
        <div key={contact.number} className={styles.contact}>
          <span className={styles.contactName}>{contact.name}</span>
          <a className={styles.contactNumber} href={telLink(contact.number)}>
            {contact.number}
          </a>
          {contact.whatsapp && (
            <WhatsAppButton phone={contact.number} size="sm" className={styles.contactWa} />
          )}
        </div>
      ))}
    </div>
  )
}
