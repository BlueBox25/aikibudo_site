import { cx } from './cx'
import styles from './social.module.css'

const GLYPHS = {
  facebook: (
    <path
      fill="currentColor"
      d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.9h-2.34v7.03C18.34 21.24 22 17.08 22 12.06Z"
    />
  ),
  instagram: (
    <>
      <rect x="2.8" y="2.8" width="18.4" height="18.4" rx="5.2" fill="none" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.9" />
      <circle cx="17.1" cy="6.9" r="1.25" fill="currentColor" />
    </>
  ),
  linkedin: (
    <>
      <path
        fill="currentColor"
        d="M6.94 8.9H3.4V21h3.54V8.9ZM5.17 2.9a2.05 2.05 0 1 0 0 4.1 2.05 2.05 0 0 0 0-4.1Z"
      />
      <path
        fill="currentColor"
        d="M14.9 8.64c-1.83 0-3 .96-3.5 1.87h-.05V8.9H8v12.1h3.54v-5.99c0-1.58.3-3.1 2.25-3.1 1.93 0 1.95 1.8 1.95 3.2V21h3.54v-6.6c0-3.28-.71-5.76-4.38-5.76Z"
      />
    </>
  ),
}

const LABELS = { facebook: 'Facebook', instagram: 'Instagram', linkedin: 'LinkedIn' }

/**
 * A social link with its brand mark. The label stays visible — the icon alone
 * is not enough when several networks sit side by side.
 */
export default function SocialLink({ platform, url, label, tone = 'light', className }) {
  const glyph = GLYPHS[platform]
  const text = label ?? LABELS[platform] ?? platform

  return (
    <a
      className={cx(styles.link, styles[platform], tone === 'dark' && styles.onDark, className)}
      href={url}
      target="_blank"
      rel="noreferrer noopener"
    >
      {glyph && (
        <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          {glyph}
        </svg>
      )}
      {text}
    </a>
  )
}
