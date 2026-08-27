import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Button, Container } from '../ui'
import { cx } from '../ui/cx'
import { useContent } from '../context/useContent'
import Logo from './Logo'
import { NAV_LINKS, itemsFor } from './nav'
import styles from './layout.module.css'

export default function MobileNav({ onClose }) {
  const { data } = useContent()

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className={styles.drawer} role="dialog" aria-modal="true" aria-label="Meniu">
      <Container>
        <div className={styles.drawerHead}>
          <NavLink to="/" onClick={onClose}>
            <Logo />
          </NavLink>
          <button
            type="button"
            className={styles.burger}
            aria-expanded="true"
            aria-label="Închide meniul"
            onClick={onClose}
          >
            <span className={styles.burgerBars}>
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>

        <nav className={styles.drawerBody} aria-label="Navigare mobilă">
          {NAV_LINKS.map((link, index) => {
            const items = itemsFor(link, data)
            return (
              <div key={link.to} className={styles.drawerGroup}>
                <NavLink
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) => cx(styles.drawerLink, isActive && styles.active)}
                >
                  <span className={styles.drawerIndex}>{String(index + 1).padStart(2, '0')}</span>
                  {link.label}
                </NavLink>

                {items?.length > 0 && (
                  <div className={styles.drawerSubList}>
                    {items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={onClose}
                        className={({ isActive }) =>
                          cx(styles.drawerSubLink, isActive && styles.active)
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          <div className={styles.drawerFoot}>
            <Button to="/contact" variant="accent" size="lg" onClick={onClose}>
              Lecție gratuită
            </Button>
          </div>
        </nav>
      </Container>
    </div>
  )
}
