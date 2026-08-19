/** Join truthy class names. Kept separate so ui/index.jsx exports only components. */
export const cx = (...names) => names.filter(Boolean).join(' ')
