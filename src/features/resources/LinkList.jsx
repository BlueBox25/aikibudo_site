import { useMemo } from 'react'
import styles from './resources.module.css'

const hostOf = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

export default function LinkList({ links }) {
  const groups = useMemo(() => {
    const map = new Map()
    for (const link of links) {
      if (!map.has(link.group)) map.set(link.group, [])
      map.get(link.group).push(link)
    }
    return [...map.entries()]
  }, [links])

  return (
    <>
      {groups.map(([group, items]) => (
        <div key={group} className={styles.linkGroup}>
          <h3 className={styles.linkGroupTitle}>{group}</h3>
          <div className={styles.links}>
            {items.map((link) => (
              <a
                key={link.url}
                className={styles.link}
                href={link.url}
                target="_blank"
                rel="noreferrer noopener"
              >
                {link.label}
                <span className={styles.linkHost}>{hostOf(link.url)}</span>
              </a>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
