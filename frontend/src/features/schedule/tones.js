/**
 * One tone per discipline, kept strictly inside the white / red / black
 * palette: red, deep red, black and a warm grey.
 */
export const DISCIPLINE_TONES = {
  aikido: '#c41e2a',
  'ju-jitsu': '#1c1918',
  'self-defence': '#8d1a20',
  'combat-mma': '#7d736c',
}

export const toneFor = (disciplineId) => DISCIPLINE_TONES[disciplineId] ?? 'var(--accent)'
