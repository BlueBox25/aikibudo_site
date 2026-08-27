/**
 * One tone per discipline, kept inside the white / red / black palette.
 * Disciplines created in the admin panel carry their own `tone`, which wins.
 */
export const DISCIPLINE_TONES = {
  aikido: '#c41e2a',
  'ju-jitsu': '#1c1918',
  'self-defence': '#8d1a20',
  'combat-mma': '#7d736c',
}

export const TONE_CHOICES = [
  { value: '#c41e2a', label: 'Roșu' },
  { value: '#8d1a20', label: 'Roșu închis' },
  { value: '#1c1918', label: 'Negru' },
  { value: '#7d736c', label: 'Gri cald' },
  { value: '#a8562a', label: 'Cărămiziu' },
]

export const toneFor = (disciplineId, disciplineById) =>
  disciplineById?.[disciplineId]?.tone ||
  DISCIPLINE_TONES[disciplineId] ||
  'var(--accent)'
