import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { cx } from '../ui/cx'
import styles from './layout.module.css'

export default function NavDropdown({ link, items }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const closeTimer = useRef(null)
  const { pathname } = useLocation()

  const active = pathname === link.to || pathname.startsWith(`${link.to}/`)

  // Close when the route changes, on Escape, or on an outside click.
  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (event) => event.key === 'Escape' && setOpen(false)
    const onClick = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onClick)
    }
  }, [open])

  // A small close delay keeps the menu usable while the pointer crosses the gap.
  const cancelClose = () => clearTimeout(closeTimer.current)
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = setTimeout(() => setOpen(false), 140)
  }
  useEffect(() => cancelClose, [])

  return (
    <div
      ref={wrapRef}
      className={styles.navItem}
      onMouseEnter={() => {
        cancelClose()
        setOpen(true)
      }}
      onMouseLeave={scheduleClose}
    >
      <NavLink
        to={link.to}
        className={cx(styles.navLink, active && styles.active)}
        aria-expanded={open}
        aria-haspopup="true"
        onFocus={() => setOpen(true)}
      >
        {link.label}
        <span className={cx(styles.navCaret, open && styles.navCaretOpen)} aria-hidden="true">
          <svg viewBox="0 0 12 12">
            <path
              d="M3 4.5 6 7.5 9 4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </NavLink>

      {open && (
        <div className={styles.dropdown} onMouseEnter={cancelClose}>
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => cx(styles.dropdownLink, isActive && styles.active)}
            >
              <span className={styles.dropdownLabel}>{item.label}</span>
              {item.sub && <span className={styles.dropdownSub}>{item.sub}</span>}
            </NavLink>
          ))}
          <NavLink to={link.to} className={styles.dropdownAll}>
            {link.allLabel} →
          </NavLink>
        </div>
      )}
    </div>
  )
}
