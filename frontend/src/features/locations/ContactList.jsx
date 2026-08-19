import styles from './locations.module.css'

export default function ContactList({ contacts }) {
  return (
    <div className={styles.contacts}>
      {contacts.map((contact) => (
        <div key={contact.number} className={styles.contact}>
          <span className={styles.contactName}>{contact.name}</span>
          <a className={styles.contactNumber} href={`tel:${contact.number.replace(/\s/g, '')}`}>
            {contact.number}
          </a>
          {contact.whatsapp && <span className={styles.contactWa}>WhatsApp disponibil</span>}
        </div>
      ))}
    </div>
  )
}
