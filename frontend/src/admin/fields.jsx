import { useState } from 'react'
import styles from './admin.module.css'

/** Long prose wants a textarea; a name or a time does not. */
const isLong = (value) => value.includes('\n') || value.length > 70

const label = (key) =>
  String(key)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^./, (c) => c.toUpperCase())

const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
const isStringList = (v) => Array.isArray(v) && v.every((i) => typeof i === 'string')
const isObjectList = (v) => Array.isArray(v) && v.length > 0 && v.every(isPlainObject)

/** Fields whose string value is a path to an image in public/. */
const IMAGE_KEYS = new Set(['photo', 'image', 'poster', 'cover'])

/** A new entry in a repeating group keeps the shape of its siblings, emptied. */
function blankLike(sample) {
  const out = {}
  for (const [key, value] of Object.entries(sample)) {
    if (typeof value === 'string') out[key] = ''
    else if (typeof value === 'number') out[key] = 0
    else if (typeof value === 'boolean') out[key] = false
    else if (Array.isArray(value)) out[key] = []
    else out[key] = null
  }
  return out
}

/** Something recognisable to head a card in a repeating group. */
const cardTitle = (item, i) =>
  item.name ?? item.title ?? item.label ?? item.heading ?? item.term ?? item.period ??
  item.displayName ?? item.id ?? `Element ${i + 1}`

/**
 * One form control, chosen from the value that is already there.
 *
 * The content document is deeply irregular — every discipline carries a
 * different set of blocks — so the editor reads the shape at runtime instead of
 * hard-coding a schema. Past `maxDepth` it stops recursing and hands over a
 * validated JSON box, which keeps the exotic corners editable without trying to
 * render a form for them.
 */
export function Field({ name, value, onChange, depth = 0, maxDepth = 4 }) {
  if (typeof value === 'boolean') {
    return (
      <label className={styles.check}>
        <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} />
        {label(name)}
      </label>
    )
  }

  if (typeof value === 'number') {
    return (
      <label className={styles.field}>
        <span className={styles.fieldLabel}>{label(name)}</span>
        <input
          className={styles.inputShort}
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value === '' ? null : Number(e.target.value))}
        />
      </label>
    )
  }

  if (typeof value === 'string' && IMAGE_KEYS.has(name)) {
    return <ImageField name={name} value={value} onChange={onChange} />
  }

  if (typeof value === 'string') {
    return (
      <label className={styles.field}>
        <span className={styles.fieldLabel}>{label(name)}</span>
        {isLong(value) ? (
          <textarea
            className={styles.textarea}
            rows={Math.min(12, value.split('\n').length + 2)}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <input className={styles.input} value={value} onChange={(e) => onChange(e.target.value)} />
        )}
        {name === 'tagline' && <span className={styles.hint}>Enter face rând nou.</span>}
      </label>
    )
  }

  // A list of plain strings edits far better as one line per item than as JSON.
  if (isStringList(value)) {
    return (
      <label className={styles.field}>
        <span className={styles.fieldLabel}>
          {label(name)} <span className={styles.fieldNote}>· un rând = un element</span>
        </span>
        <textarea
          className={styles.textarea}
          rows={Math.min(16, value.length + 2)}
          value={value.join('\n')}
          onChange={(e) =>
            onChange(e.target.value.split('\n').filter((line) => line.trim() !== ''))
          }
        />
      </label>
    )
  }

  if (depth < maxDepth && isPlainObject(value)) {
    return (
      <fieldset className={styles.group}>
        <legend className={styles.groupLabel}>{label(name)}</legend>
        <div className={styles.groupBody}>
          {Object.entries(value).map(([key, inner]) => (
            <Field
              key={key}
              name={key}
              value={inner}
              depth={depth + 1}
              maxDepth={maxDepth}
              onChange={(next) => onChange({ ...value, [key]: next })}
            />
          ))}
        </div>
      </fieldset>
    )
  }

  if (depth < maxDepth && isObjectList(value)) {
    const patch = (i, next) => onChange(value.map((item, j) => (j === i ? next : item)))
    return (
      <fieldset className={styles.group}>
        <legend className={styles.groupLabel}>
          {label(name)} <span className={styles.fieldNote}>· {value.length}</span>
        </legend>
        <div className={styles.cards}>
          {value.map((item, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.cardHead}>
                <span className={styles.cardName}>{cardTitle(item, i)}</span>
                <div className={styles.rowActions}>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    title="Mută mai sus"
                    disabled={i === 0}
                    onClick={() => {
                      const next = [...value]
                      ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
                      onChange(next)
                    }}
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={styles.iconBtnDanger}
                    title="Șterge"
                    onClick={() => onChange(value.filter((_, j) => j !== i))}
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className={styles.groupBody}>
                {Object.entries(item).map(([key, inner]) => (
                  <Field
                    key={key}
                    name={key}
                    value={inner}
                    depth={depth + 1}
                    maxDepth={maxDepth}
                    onChange={(nextValue) => patch(i, { ...item, [key]: nextValue })}
                  />
                ))}
              </div>
            </div>
          ))}
          <button
            type="button"
            className={styles.ghostBtnDark}
            onClick={() => onChange([...value, blankLike(value[0])])}
          >
            + Adaugă la {label(name).toLowerCase()}
          </button>
        </div>
      </fieldset>
    )
  }

  return <JsonField name={name} value={value} onChange={onChange} />
}

/**
 * Picks an image for a path field. The file is uploaded into public/imagini/ by
 * the dev middleware, which hands back the public path to store in the JSON —
 * so the value stays a plain string and nothing about the site changes.
 */
export function ImageField({ name, value, onChange }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const upload = async (file) => {
    if (!file) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/__upload', {
        method: 'POST',
        headers: { 'x-filename': encodeURIComponent(file.name), 'Content-Type': file.type },
        body: file,
      })
      const body = await res.json()
      if (!res.ok || !body.ok) throw new Error(body.error ?? `HTTP ${res.status}`)
      onChange(body.path)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={styles.field}>
      <span className={styles.fieldLabel}>
        {label(name)} <span className={styles.fieldNote}>· imagine</span>
      </span>

      <div className={styles.imageRow}>
        <div className={styles.thumb}>
          {value ? (
            <img src={value} alt="" onError={(e) => { e.currentTarget.style.opacity = 0.15 }} />
          ) : (
            <span className={styles.thumbEmpty}>fără</span>
          )}
        </div>

        <div className={styles.imageControls}>
          <input
            className={styles.input}
            value={value}
            placeholder="/imagini/nume-fisier.jpg"
            onChange={(e) => onChange(e.target.value)}
          />
          <div className={styles.imageButtons}>
            <label className={styles.ghostBtnDark}>
              {busy ? 'Încarc…' : 'Încarcă imagine'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                hidden
                disabled={busy}
                onChange={(e) => {
                  upload(e.target.files?.[0])
                  e.target.value = ''
                }}
              />
            </label>
            {value && (
              <button type="button" className={styles.ghostBtnDark} onClick={() => onChange('')}>
                Scoate
              </button>
            )}
          </div>
          {error ? (
            <span className={styles.error}>{error}</span>
          ) : (
            <span className={styles.hint}>JPG, PNG, WebP sau AVIF · max 8 MB</span>
          )}
        </div>
      </div>
    </div>
  )
}

/** Escape hatch for empty lists, nulls and anything past the depth limit. */
export function JsonField({ name, value, onChange }) {
  const [draft, setDraft] = useState(() => JSON.stringify(value, null, 2))
  const [error, setError] = useState(null)

  const handle = (text) => {
    setDraft(text)
    try {
      onChange(JSON.parse(text))
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <label className={styles.field}>
      <span className={styles.fieldLabel}>
        {label(name)} <span className={styles.fieldNote}>· JSON</span>
      </span>
      <textarea
        className={styles.code}
        spellCheck={false}
        rows={Math.min(20, draft.split('\n').length + 1)}
        value={draft}
        onChange={(e) => handle(e.target.value)}
      />
      {error ? (
        <span className={styles.error}>JSON invalid — {error}</span>
      ) : (
        <span className={styles.hint}>Valid</span>
      )}
    </label>
  )
}

/** Every field of one record, in the order the document already uses. */
export function RecordEditor({ record, onChange, skip = [] }) {
  return (
    <div className={styles.form}>
      {Object.entries(record)
        .filter(([key]) => !skip.includes(key))
        .map(([key, value]) => (
          <Field
            key={key}
            name={key}
            value={value}
            onChange={(next) => onChange({ ...record, [key]: next })}
          />
        ))}
    </div>
  )
}
