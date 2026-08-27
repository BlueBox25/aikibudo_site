/**
 * `children` turns an entry into a dropdown. The child items are filled in at
 * render time from the API data, so the menu always matches what exists.
 */
export const NAV_LINKS = [
  { to: '/discipline', label: 'Discipline', allLabel: 'Toate disciplinele', source: 'disciplines' },
  { to: '/locatii', label: 'Locații', allLabel: 'Toate sălile', source: 'locations' },
  { to: '/instructori', label: 'Instructori' },
  { to: '/resurse', label: 'Resurse' },
  { to: '/contact', label: 'Contact' },
]

/** Builds the dropdown items for a nav entry from the bootstrap payload. */
export function itemsFor(link, data) {
  if (!data) return null
  if (link.source === 'disciplines') {
    return data.disciplines.map((d) => ({
      to: `/discipline/${d.slug}`,
      label: d.name,
      sub: d.tagline,
    }))
  }
  if (link.source === 'locations') {
    return data.locations.map((l) => ({
      to: `/locatii/${l.slug}`,
      label: l.name,
      sub: l.addressShort,
    }))
  }
  return null
}
