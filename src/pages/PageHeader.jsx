import { Container } from '../ui'
import styles from './pages.module.css'

export default function PageHeader({ kicker, title, lede, children }) {
  return (
    <header className={styles.pageHead}>
      <Container>
        {kicker && <p className={styles.pageKicker}>{kicker}</p>}
        <h1 className={styles.pageTitle}>{title}</h1>
        {lede && <p className={styles.pageLede}>{lede}</p>}
        {children}
      </Container>
    </header>
  )
}
