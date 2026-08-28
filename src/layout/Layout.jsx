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
  const { pathname, hash } = useLocation()

  /**
   * Route changes land at the top of the new page, not mid-scroll — unless the
   * address carries an anchor, which redirects from the old site rely on.
   */
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return undefined
    }

    // On a cold load the content is still being fetched, so the target does not
    // exist yet. Keep looking until it appears, then give up rather than hunting
    // forever for an anchor that is not on this page.
    //
    // Timers rather than requestAnimationFrame: rAF does not fire in a
    // background tab, and a link opened in one would never scroll at all.
    const deadline = Date.now() + 2000
    let timer = 0

    const look = () => {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        target.scrollIntoView({ behavior: 'instant', block: 'start' })
        return
      }
      if (Date.now() < deadline) timer = setTimeout(look, 50)
      // An anchor that never turns up — a stale link, a renamed section — should
      // still leave the reader at the top of the page, not mid-way down it.
      else window.scrollTo({ top: 0, behavior: 'instant' })
    }

    look()
    return () => clearTimeout(timer)
  }, [pathname, hash])

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
