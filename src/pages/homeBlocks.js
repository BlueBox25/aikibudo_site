import { DefaultCta } from './CtaBand'
import RedirectBand from './RedirectBand'
import { DisciplinesSection, LocationsSection, MissionSection } from './homeSections'

/**
 * The blocks the home page can be built from. Adding an entry here is what
 * makes a block appear in the editor's "Aranjare pagină" list.
 *
 * `headings: true` means the block renders kicker/title/lede from the section
 * record, so the editor offers those three inputs for it.
 */
export const HOME_BLOCKS = {
  mission: { label: 'Misiune („scopul final”)', Component: MissionSection, headings: true },
  disciplines: { label: 'Discipline', Component: DisciplinesSection, headings: true },
  locations: { label: 'Săli', Component: LocationsSection, headings: true },
  redirect: { label: 'Bandă 3,5% din impozit', Component: RedirectBand, headings: false },
  cta: { label: 'Îndemn final (lecție gratuită)', Component: DefaultCta, headings: false },
}

/** Order used when content.json carries no `home` list at all. */
export const DEFAULT_HOME = [
  { id: 'disciplines', visible: true, alt: false },
  { id: 'locations', visible: true, alt: true },
  { id: 'mission', visible: true, alt: false },
  { id: 'redirect', visible: true },
  { id: 'cta', visible: true },
]
