import { useMemo, useState } from 'react'
import { Container, Section, SectionHeading } from '../ui'
import { cx } from '../ui/cx'
import { useContent } from '../context/useContent'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import DocumentList from '../features/resources/DocumentList'
import LinkList from '../features/resources/LinkList'
import PageHeader from './PageHeader'
import RedirectBand from './RedirectBand'
import styles from '../features/resources/resources.module.css'

const TABS = [
  { id: 'aikido', label: 'Aikido' },
  { id: 'ju-jitsu', label: 'Ju-Jutsu' },
]

export default function Resources() {
  const { data } = useContent()
  useDocumentTitle('Resurse')

  const [category, setCategory] = useState('aikido')

  const { documents, links } = useMemo(
    () => ({
      documents: data.resources.documents.filter((doc) => doc.category === category),
      links: data.resources.links.filter((link) => link.category === category),
    }),
    [data.resources, category],
  )

  return (
    <>
      <PageHeader
        kicker="Documente și legături"
        title="Resurse"
        lede="Fișe de înscriere, programe de examinare, glosar de termeni și site-urile federațiilor și cluburilor cu care lucrăm."
      />

      <Section tight>
        <Container>
          <div className={styles.tabs}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={cx(styles.tab, category === tab.id && styles.on)}
                onClick={() => setCategory(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <SectionHeading kicker="Descarcă" title="Documente" />
          <DocumentList documents={documents} />
        </Container>
      </Section>

      <Section tight alt>
        <Container>
          <SectionHeading kicker="Legături utile" title="Federații, cluburi și publicații" />
          <LinkList links={links} />
        </Container>
      </Section>

      <RedirectBand />
    </>
  )
}
