import logo from '../assets/logo.png'
import styles from './layout.module.css'
import { cx } from '../ui/cx'

/**
 * The club's enso mark. The file is black ink on transparency, so on dark
 * surfaces it is inverted to white rather than shipped as a second image.
 */
export default function Logo({ onDark = false }) {
  return (
    <span className={styles.logo}>
      <img
        className={cx(styles.logoMark, onDark && styles.logoMarkDark)}
        src={logo}
        alt=""
        width="36"
        height="36"
      />
      <span className={styles.logoText}>
        Aiki<span className={styles.logoTextDim}>Budo</span>
      </span>
    </span>
  )
}
