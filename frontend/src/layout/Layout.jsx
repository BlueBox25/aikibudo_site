import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import styles from './layout.module.css'

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
    </div>
  )
}
