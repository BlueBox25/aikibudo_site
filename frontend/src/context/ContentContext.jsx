import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchBootstrap } from '../api/client'
import { ContentContext } from './useContent'

export function ContentProvider({ children }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetchBootstrap()
      .then((payload) => {
        if (!cancelled) setData(payload)
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
