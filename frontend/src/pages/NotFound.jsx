import { Button, Container, Section } from '../ui'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import styles from './pages.module.css'

export default function NotFound() {
  useDocumentTitle('Pagina nu a fost găsită')

  return (
    <Section>
      <Container>
        <div className={styles.notFound}>
          <p className={styles.notFoundCode}>404</p>
          <h1 className={styles.pageTitle}>Pagina nu există</h1>
          <p className={styles.pageLede}>
            Linkul pe care l-ai urmat nu duce nicăieri. Încearcă din meniul principal.
          </p>
          <Button to="/" variant="accent" size="lg">
            Pagina principală
          </Button>
        </div>
      </Container>
    </Section>
  )
}
