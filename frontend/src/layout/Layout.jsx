import { useEffect } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import WhatsAppFab from '../ui/WhatsAppFab'
import Header from './Header'
import Footer from './Footer'
import styles from './layout.module.css'

const DEV_EDIT_STYLE = {
  position: 'fixed',
  left: '1rem',
  bottom: '1rem',
  zIndex: 200,
  padding: '0.5rem 0.9rem',
  borderRadius: '999px',
  background: 'var(--inverse-bg)',
  color: 'var(--inverse-text)',
  fontSize: '0.8rem',
  fontWeight: 600,
  textDecoration: 'none',
  boxShadow: 'var(--shadow)',
  opacity: 0.6,
}

export default function Layout() {
  const { pathname } = useLocation()

  // Route changes should land at the top of the new page, not mid-scroll.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  return (
    <div className={styles.shell}>
      <a className="skip-link" href="#main">
        Sari la conținut
      </a>
      <Header />
      <main id="main" className={styles.main}>
        <Outlet />
      </main>
      <Footer />

      <WhatsAppFab />

      {/* Dev-only shortcut into the content editor. The styles are inline
          rather than a CSS-module class because unused classes survive the
          build, while everything inside this dead branch is dropped. */}
      {import.meta.env.DEV && (
        <Link to="/admin" style={DEV_EDIT_STYLE} title="Editor conținut (doar în dev)">
          Editează
        </Link>
      )}
    </div>
  )
}
