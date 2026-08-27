import { useContent, useLookups } from '../context/useContent'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import Hero from '../features/hero/Hero'
import { DEFAULT_HOME, HOME_BLOCKS } from './homeBlocks'

export default function Home() {
  const { data } = useContent()
  const lookups = useLookups()
  useDocumentTitle(null)

  // The hero is the page's identity, so it stays pinned at the top; everything
  // below it is ordered by content.json.
  const sections = data.home ?? DEFAULT_HOME

  return (
    <>
      <Hero site={data.site} />

      {sections.map((section, index) => {
        const block = HOME_BLOCKS[section.id]
        // An id left over from a renamed block should drop out quietly rather
        // than take the whole page down.
        if (!block || section.visible === false) return null
        const { Component } = block
        return (
          <Component
            key={`${section.id}-${index}`}
            section={section}
            data={data}
            lookups={lookups}
          />
        )
      })}
    </>
  )
}
