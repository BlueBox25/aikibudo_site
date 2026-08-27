import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Button, Container } from '../ui'
import { cx } from '../ui/cx'
import { useContent } from '../context/useContent'
import { useScrollPast } from '../hooks/useScrollPast'
import Logo from './Logo'
import MobileNav from './MobileNav'
import NavDropdown from './NavDropdown'
import { NAV_LINKS, itemsFor } from './nav'
import styles from './layout.module.css'

export default function Header() {
  const [open, setOpen] = useState(false)
  const stuck = useScrollPast(24)
  const { data } = useContent()

  return (
    <>
      <header className={cx(styles.header, stuck && styles.stuck)}>
        <Container>
          <div className={styles.headerInner}>
            <NavLink to="/" aria-label="AikiBudo — pagina principală">
              <Logo />
            </NavLink>

            <nav className={styles.nav} aria-label="Navigare principală">
              {NAV_LINKS.map((link) => {
                const items = itemsFor(link, data)
                return items?.length ? (
                  <NavDropdown key={link.to} link={link} items={items} />
                ) : (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) => cx(styles.navLink, isActive && styles.active)}
                  >
                    {link.label}
                  </NavLink>
                )
              })}
            </nav>

            <div className={styles.headerActions}>
              <Button to="/contact" variant="accent" className={styles.headerCta}>
                Contact
              </Button>
              <button
                type="button"
                className={styles.burger}
                aria-expanded={open}
                aria-label={open ? 'Închide meniul' : 'Deschide meniul'}
                onClick={() => setOpen((value) => !value)}
              >
                <span className={styles.burgerBars}>
                  <span />
                  <span />
                  <span />
                </span>
              </button>
            </div>
          </div>
        </Container>
      </header>

      {open && <MobileNav onClose={() => setOpen(false)} />}
    </>
  )
}
