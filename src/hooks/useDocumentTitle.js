import { useEffect } from 'react'

const SUFFIX = 'AikiBudo'

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — ${SUFFIX}` : `${SUFFIX} — Academia de Arte Marțiale București`
  }, [title])
}
