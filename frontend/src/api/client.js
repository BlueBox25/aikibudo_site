const BASE = import.meta.env.VITE_API_URL ?? '/api'

export async function get(path, params) {
  const url = new URL(`${BASE}${path}`, window.location.origin)
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value)
    }
  })

  const response = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}))
    throw new Error(detail.message ?? `Cererea a eșuat (${response.status})`)
  }
  return response.json()
}

/** Everything the site needs on first paint, in one round trip. */
export const fetchBootstrap = () => get('/bootstrap')
