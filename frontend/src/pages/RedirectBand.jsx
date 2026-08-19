import { Button, Container } from '../ui'
import { useContent } from '../context/useContent'
import styles from './pages.module.css'

/**
 * The "redirecționează 3.5%" call-out the original site carried on the home
 * and resources pages. Costs the donor nothing, so it says so.
 */
export default function RedirectBand() {
  const { data } = useContent()
  const redirect = data?.site?.contact?.redirect35
  if (!redirect) return null

  return (
    <section className={styles.redirect}>
      <Container>
        <div className={styles.redirectInner}>
          <div>
            <p className={styles.redirectPct}>
              3,5<span className={styles.redirectPctSign}>%</span>
            </p>
          </div>

          <div className={styles.redirectBody}>
            <h2 className={styles.redirectTitle}>Redirecționează 3,5% din impozit</h2>
            <p className={styles.redirectText}>
              Nu te costă nimic. Poți direcționa 3,5% din impozitul pe venit către
              Asociația Clubul Sportiv Aikibudo, iar banii se întorc în echipament,
              stagii și taberele copiilor. Formularul se completează online, în câteva minute.
            </p>
          </div>

          <div className={styles.redirectAction}>
            <Button
              href={redirect.url}
              target="_blank"
              rel="noreferrer noopener"
              variant="accent"
              size="lg"
            >
              Completează formularul ↗
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
