import { createContext, useContext, useMemo } from 'react'

export const ContentContext = createContext(null)

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent trebuie folosit în interiorul <ContentProvider>')
  return ctx
}

/** Id-keyed lookups derived from the single bootstrap payload. */
export function useLookups() {
  const { data } = useContent()

  return useMemo(() => {
    if (!data) return null
    const index = (list) => Object.fromEntries(list.map((item) => [item.id, item]))
    return {
      locationById: index(data.locations),
      disciplineById: index(data.disciplines),
      instructorById: index(data.instructors),
      dayById: index(data.days),
    }
  }, [data])
}
