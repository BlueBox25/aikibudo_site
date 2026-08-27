import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { fetchBootstrap } from '../api/client'
import { ContentContext } from './useContent'

export function ContentProvider({ children }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  // A reload with content already on screen must not flip back to the loading
  // state: doing so unmounts the tree, which would throw away whatever the
  // editor had open every time it saved.
  const hasData = useRef(false)

  const load = useCallback(() => {
    let cancelled = false
    if (!hasData.current) setLoading(true)
    setError(null)

    fetchBootstrap()
      .then((payload) => {
        if (cancelled) return
        hasData.current = true
        setData(payload)
      })
      .catch((err) => {
        if (!cancelled) setError(err)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(load, [load])

  const value = useMemo(() => ({ data, error, loading, reload: load }), [data, error, loading, load])

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}
