import { Link } from 'react-router-dom'
import { Button, Container, Section } from '../ui'
import { useContent } from '../context/useContent'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import DojoMap from '../features/locations/DojoMap'
import WhatsAppButton from '../ui/WhatsAppButton'
import { telLink } from '../lib/phone'
import PageHeader from './PageHeader'
import RedirectBand from './RedirectBand'
import styles from './pages.module.css'

export default function Contact() {
  const { data } = useContent()
  useDocumentTitle('Contact')

  const { site, locations } = data
  const { contact } = site

  return (
    <>
      <PageHeader
        kicker="Ia legătura"
        title="Contact"
        lede="Sună, scrie sau treci pur și simplu pe la sală. Primul antrenament este gratuit."
      />

      <Section tight>
        <Container>
          <div className={styles.contactGrid}>
            <div>
              <div className={styles.block}>
                <h2 className={styles.blockTitle}>Telefon</h2>
                {contact.phones.map((phone) => (
                  <div key={phone.number} className={styles.bigContact}>
                    <span className={styles.bigContactName}>{phone.name}</span>
                    <a className={styles.bigContactValue} href={telLink(phone.number)}>
                      {phone.number}
                    </a>
                    {phone.whatsapp && (
                      <WhatsAppButton
                        phone={phone.number}
                        size="sm"
                        className={styles.bigContactWa}
                      />
                    )}
                  </div>
                ))}
                <div className={styles.bigContact}>
                  <span className={styles.bigContactName}>Email</span>
                  <a className={styles.bigContactValue} href={`mailto:${contact.email}`}>
                    {contact.email}
                  </a>
                </div>
              </div>

              <div className={styles.block}>
                <h2 className={styles.blockTitle}>Orele de lucru</h2>
                <div className={styles.hours}>
                  {contact.hours.map((row) => (
                    <div key={row.days} className={styles.hoursRow}>
                      <span className={styles.hoursDays}>{row.days}</span>
                      <span className={styles.hoursTime}>{row.time}</span>
                    </div>
                  ))}
                </div>
                <p className={styles.note}>{contact.hoursNote}</p>
              </div>

              <div className={styles.block}>
                <h2 className={styles.blockTitle}>Date de identificare</h2>
                <div className={styles.legal}>
                  <div className={styles.legalRow}>
                    <span className={styles.legalKey}>Denumire</span>
                    <span>{site.legalName}</span>
                  </div>
                  <div className={styles.legalRow}>
                    <span className={styles.legalKey}>C.I.F.</span>
                    <span className={styles.legalValue}>{site.cif}</span>
                  </div>
                  <div className={styles.legalRow}>
                    <span className={styles.legalKey}>Sediu</span>
                    <span>{contact.headquarters}</span>
                  </div>
                  <div className={styles.legalRow}>
                    <span className={styles.legalKey}>Bancă</span>
                    <span>{contact.bank.name}</span>
                  </div>
                  <div className={styles.legalRow}>
                    <span className={styles.legalKey}>IBAN</span>
                    <span className={styles.legalValue}>{contact.bank.iban}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className={styles.block}>
                <h2 className={styles.blockTitle}>Dojo-uri</h2>
                <DojoMap locations={locations} height={420} />
                <div className={styles.dojoLinks}>
                  {locations.map((location) => (
                    <Button key={location.id} as={Link} to={`/locatii/${location.slug}`}>
                      {location.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <RedirectBand />
    </>
  )
}
