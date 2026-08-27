import { Button, Container } from '../ui'
import styles from './pages.module.css'

export default function CtaBand({ title, text, primary, secondary }) {
  return (
    <section className={styles.cta}>
      <Container>
        <div className={styles.ctaInner}>
          <div>
            <h2 className={styles.ctaTitle}>{title}</h2>
            {text && <p className={styles.ctaText}>{text}</p>}
          </div>
          <div className={styles.ctaActions}>
            {primary}
            {secondary}
          </div>
        </div>
      </Container>
    </section>
  )
}

export function DefaultCta() {
  return (
    <CtaBand
      title="Primul tău antrenament este gratuit"
      text="Vino să ne cunoști pe tatami. Fără abonament, fără obligații — doar o oră de antrenament."
      primary={
        <Button to="/contact" variant="accent" size="lg">
          Lecție gratuită
        </Button>
      }
      secondary={
        <Button to="/locatii" variant="onDark" size="lg">
          Locații
        </Button>
      }
    />
  )
}
