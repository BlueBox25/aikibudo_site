import { waLink } from '../lib/phone'
import { useContent } from '../context/useContent'
import styles from './whatsapp.module.css'

function Glyph() {
  return (
    <svg className={styles.fabGlyph} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.24-.64.8-.78.97-.15.16-.29.18-.53.06-.25-.13-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.71-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.09-.17.04-.31-.02-.43-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.42l-.48-.01c-.16 0-.43.06-.65.31-.23.24-.86.84-.86 2.05s.88 2.38 1 2.54c.13.17 1.74 2.65 4.2 3.72.59.25 1.05.4 1.4.52.59.18 1.13.16 1.55.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29Z"
      />
    </svg>
  )
}

/**
 * Floating WhatsApp button, present on every page of the site.
 *
 * Which number it dials is data: the phone flagged `floatingButton` in
 * site.contact.phones wins, so it can be pointed at someone else — or turned
 * off entirely — from the content editor, without touching this file.
 */
export default function WhatsAppFab() {
  const { data } = useContent()

  const contact = data?.site?.contact
  const phone = contact?.phones?.find((entry) => entry.floatingButton && entry.whatsapp)
  if (!phone) return null

  const href = waLink(phone.number, contact.whatsappMessage)
  if (!href) return null

  return (
    <a
      className={styles.fab}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={`Scrie pe WhatsApp lui ${phone.name}`}
      title={`WhatsApp · ${phone.name}`}
    >
      <span className={styles.fabPulse} aria-hidden="true" />
      <Glyph />
    </a>
  )
}
