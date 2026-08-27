import { Button, Container } from '../../ui'
import heroImage from '../../assets/dojo-hero.jpg'
import styles from './hero.module.css'

const FALLBACK = {
  title: 'Academia de Arte Marțiale',
  accent: 'AikiBudo',
  tagline: 'Tehnica se învață. Omul se formează.',
}

export default function Hero({ site }) {
  const hero = site.hero ?? FALLBACK

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
            {hero.title}
            <br />
            <span className={styles.titleAccent}>{hero.accent}</span>
          </h1>

          {hero.tagline && <p className={styles.tagline}>{hero.tagline}</p>}

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
