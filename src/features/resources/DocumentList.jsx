import styles from './resources.module.css'

export default function DocumentList({ documents }) {
  return (
    <div className={styles.docs}>
      {documents.map((doc) => (
        <a
          key={doc.id}
          className={styles.doc}
          href={doc.url}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span className={styles.docType}>{doc.type}</span>

          <span className={styles.docBody}>
            <span className={styles.docTitle}>{doc.title}</span>
            <span className={styles.docDesc}>{doc.description}</span>
          </span>

          <span className={styles.docArrow} aria-hidden="true">
            <svg viewBox="0 0 16 16">
              <path
                d="M8 2.5v9m0 0L4.5 8M8 11.5 11.5 8M2.5 13.5h11"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </a>
      ))}
    </div>
  )
}
