/**
 * Change detector for the content document — not a security control.
 *
 * Both the editor and the dev middleware hash `JSON.stringify(parsedDocument)`,
 * so indentation, key spacing and trailing newlines never matter: only the data
 * does. Used to notice that the file moved under an open editor tab.
 */
export function docHash(doc) {
  const text = JSON.stringify(doc)
  let h = 5381
  for (let i = 0; i < text.length; i += 1) h = ((h * 33) ^ text.charCodeAt(i)) >>> 0
  return h.toString(36)
}
