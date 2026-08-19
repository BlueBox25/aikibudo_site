import { Link } from 'react-router-dom'
import { Container } from '../ui'
import { useContent } from '../context/useContent'
import Logo from './Logo'
import styles from './layout.module.css'

export default function Footer() {
  const { data } = useContent()
  if (!data) return null

  const { site, locations, disciplines, resources } = data
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.footerGrid}>
          <div>
            <Logo />
            <p className={styles.footerTagline}>{site.tagline}</p>
          </div>

          <div>
            <h2 className={styles.footerHeading}>Discipline</h2>
            <ul className={styles.footerList}>
              {disciplines.map((discipline) => (
                <li key={discipline.id}>
                  <Link to={`/discipline/${discipline.slug}`}>{discipline.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={styles.footerHeading}>Dojo-uri</h2>
            <ul className={styles.footerList}>
              {locations.map((location) => (
                <li key={location.id}>
                  <Link to={`/locatii/${location.slug}`} className={styles.footerDojo}>
                    <span className={styles.footerDojoName}>{location.name}</span>
                    <span className={styles.footerDojoAddr}>{location.addressShort}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={styles.footerHeading}>Contact</h2>
            <ul className={styles.footerList}>
              {site.contact.phones.map((phone) => (
                <li key={phone.number}>
                  <a href={`tel:${phone.number.replace(/\s/g, '')}`}>{phone.number}</a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a>
              </li>
              {site.social.map((item) => (
                <li key={item.url}>
                  <a href={item.url} target="_blank" rel="noreferrer noopener">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.affiliations}>
          {resources.affiliations.map((item) => (
            <a
              key={item.abbr}
              href={item.url}
              target="_blank"
              rel="noreferrer noopener"
              title={item.name}
              className={styles.affiliation}
            >
              {item.abbr}
            </a>
          ))}
        </div>

        <div className={styles.colophon}>
          <p>
            © {year} {site.legalName} · C.I.F. {site.cif}
          </p>
          <p>{site.contact.headquarters}</p>
        </div>
      </Container>
    </footer>
  )
}
