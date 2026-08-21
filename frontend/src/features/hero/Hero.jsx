import { Button, Container } from '../../ui'
import heroImage from '../../assets/dojo-hero.jpg'
import styles from './hero.module.css'

export default function Hero({ site }) {
  return (
    <section className={styles.hero}>
      <div className={styles.bg}>
        <img
          className={styles.bgImage}
          src={heroImage}
          alt="Proiecție simultană a doi parteneri, în dojo"
          fetchPriority="high"
        />
      </div>

      <Container>
        <div className={styles.inner}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            Din {site.founded} · {site.city}
          </p>

          <h1 className={styles.title}>
            Arte marțiale
            <br />
            tradiționale, <span className={styles.titleAccent}>practicate serios</span>
          </h1>

          <p className={styles.lede}>{site.intro}</p>

          <div className={styles.actions}>
            <Button to="/contact" variant="accent" size="lg">
              Lecție gratuită
            </Button>
            <Button to="/discipline" variant="onDark" size="lg">
              Discipline
            </Button>
          </div>
        </div>

        <dl className={styles.stats}>
          {site.stats.map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <dt className={styles.statLabel}>{stat.label}</dt>
              <dd className={styles.statValue}>{stat.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
