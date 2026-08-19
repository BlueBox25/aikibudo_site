import { useEffect, useState } from 'react'

/** True once the page has scrolled past `threshold` pixels. */
export function useScrollPast(threshold = 24) {
  const [past, setPast] = useState(false)

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return past
}
