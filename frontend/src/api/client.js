/**
 * The site is fully static: content lives in public/content.json and is fetched
 * once at start-up. No API, no server — the file is served straight from the CDN
 * alongside the rest of the build.
 */
const CONTENT_URL = import.meta.env.VITE_CONTENT_URL ?? '/content.json'

export async function fetchContent() {
  const response = await fetch(CONTENT_URL, { headers: { Accept: 'application/json' } })
  if (!response.ok) {
    throw new Error(`Nu am putut încărca conținutul (${response.status})`)
  }
  return response.json()
}

// Kept under the old name so the content provider needs no change.
export const fetchBootstrap = fetchContent
