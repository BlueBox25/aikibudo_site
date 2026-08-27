import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '../context/useContent'
import { RecordEditor } from './fields.jsx'
import ScheduleEditor from './ScheduleEditor'
import LayoutEditor from './LayoutEditor'
import { DEFAULT_HOME } from '../pages/homeBlocks'
import { docHash } from './docHash'
import styles from './admin.module.css'

/**
 * Dev-only content editor.
 *
 * It edits a draft copy of the whole document and PUTs the result to the Vite
 * middleware, which writes public/content.json. Nothing here is bundled — the
 * route is mounted behind import.meta.env.DEV in App.jsx.
 */

const SECTIONS = [
  { key: 'site', label: 'Site & hero', kind: 'record' },
  { key: 'home', label: 'Aranjare pagină', kind: 'layout' },
  { key: 'schedule', label: 'Orar', kind: 'schedule' },
  { key: 'disciplines', label: 'Discipline', kind: 'list', title: (d) => d.name },
  { key: 'locations', label: 'Săli', kind: 'list', title: (l) => l.name },
  { key: 'instructors', label: 'Instructori', kind: 'list', title: (p) => p.displayName ?? p.name },
  { key: 'pricing', label: 'Prețuri', kind: 'list', title: (p) => p.locationName },
  { key: 'resources', label: 'Resurse', kind: 'record' },
  { key: 'discounts', label: 'Reduceri', kind: 'record' },
  { key: 'cta', label: 'Îndemnuri', kind: 'record' },
  { key: 'days', label: 'Zile', kind: 'list', title: (d) => d.name },
]

/** A new list item keeps the shape of the existing ones, emptied out. */
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

export default function AdminPage() {
  const { data, reload } = useContent()
  // No draft until the first edit — otherwise a reload would leave this tab
  // holding a copy of the previous file and report phantom unsaved changes.
  const [draftState, setDraft] = useState(null)
  const draft = draftState ?? data
  const [section, setSection] = useState('site')
  const [selected, setSelected] = useState(0)
  const [status, setStatus] = useState(null)
  const [saving, setSaving] = useState(false)

  // What the file looked like when this tab last read it. Sent with every save
  // so the server can refuse to overwrite someone else's newer version.
  const baseline = useRef(docHash(data))
  useEffect(() => {
    baseline.current = docHash(data)
  }, [data])

  const dirty = useMemo(
    () => JSON.stringify(draft) !== JSON.stringify(data),
    [draft, data],
  )

  const save = useCallback(async () => {
    setSaving(true)
    setStatus(null)
    try {
      const res = await fetch('/__content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-baseline': baseline.current },
        body: JSON.stringify(draft),
      })
      const body = await res.json()

      if (res.status === 409 || body.stale) {
        setStatus({ ok: false, stale: true, text: body.error })
        return
      }
      if (!res.ok || !body.ok) throw new Error(body.error ?? `HTTP ${res.status}`)

      // Adopt the saved version straight away, so a second save in quick
      // succession is not rejected against a baseline that has not caught up.
      if (body.version) baseline.current = body.version
      reload()
      setStatus({ ok: true, text: 'Salvat în public/content.json' })
    } catch (err) {
      setStatus({ ok: false, text: `Nu am putut salva: ${err.message}` })
    } finally {
      setSaving(false)
    }
  }, [draft, reload])

  // Ctrl/Cmd+S, because that is what everyone presses anyway.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        if (dirty) save()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [dirty, save])

  useEffect(() => {
    const onFocus = () => {
      if (dirty) return
      setDraft(null)
      reload()
    }
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [dirty, reload])

  // Warn before losing unsaved edits to a refresh or a closed tab.
  useEffect(() => {
    if (!dirty) return undefined
    const warn = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  const meta = SECTIONS.find((s) => s.key === section)
  const value = draft[section]

  const setSection_ = (key) => {
    setSection(key)
    setSelected(0)
  }

  const patchSection = (next) => setDraft({ ...draft, [section]: next })

  const download = () => {
    const url = URL.createObjectURL(
      new Blob([`${JSON.stringify(draft, null, 2)}\n`], { type: 'application/json' }),
    )
    const a = document.createElement('a')
    a.href = url
    a.download = 'content.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.side}>
        <div className={styles.brand}>
          <strong>Editor conținut</strong>
          <span className={styles.devTag}>dev</span>
        </div>

        <nav className={styles.sideNav}>
          {SECTIONS.map((s) => (
            <button
              key={s.key}
              type="button"
              className={s.key === section ? styles.sideOn : styles.sideLink}
              onClick={() => setSection_(s.key)}
            >
              {s.label}
              {Array.isArray(draft[s.key]) && (
                <span className={styles.count}>{draft[s.key].length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className={styles.sideFoot}>
          <Link to="/" className={styles.backLink}>
            ← Înapoi pe site
          </Link>
          <button type="button" className={styles.ghostBtn} onClick={download}>
            Descarcă content.json
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.bar}>
          <h1 className={styles.barTitle}>{meta.label}</h1>
          <div className={styles.barRight}>
            {status && (
              <span className={status.ok ? styles.okMsg : styles.errMsg}>
                {status.text}
                {status.stale && (
                  <button
                    type="button"
                    className={styles.inlineBtn}
                    onClick={() => {
                      setStatus(null)
                      reload()
                      setDraft(null)
                    }}
                  >
                    Reîncarcă
                  </button>
                )}
              </span>
            )}
            <span className={dirty ? styles.dirty : styles.clean}>
              {dirty ? 'Modificări nesalvate' : 'La zi'}
            </span>
            <button
              type="button"
              className={styles.saveBtn}
              disabled={!dirty || saving}
              onClick={save}
            >
              {saving ? 'Salvez…' : 'Salvează  ⌘S'}
            </button>
          </div>
        </header>

        <div className={styles.body}>
          {meta.kind === 'schedule' && (
            <ScheduleEditor data={draft} onChange={patchSection} />
          )}

          {meta.kind === 'layout' && (
            <LayoutEditor sections={value ?? DEFAULT_HOME} onChange={patchSection} />
          )}

          {meta.kind === 'record' && (
            <RecordEditor record={value} onChange={patchSection} />
          )}

          {meta.kind === 'list' && (
            <div className={styles.split}>
              <div className={styles.picker}>
                {value.map((item, i) => (
                  <button
                    key={item.id ?? i}
                    type="button"
                    className={i === selected ? styles.pickOn : styles.pick}
                    onClick={() => setSelected(i)}
                  >
                    {meta.title(item) || '(fără nume)'}
                  </button>
                ))}
                <button
                  type="button"
                  className={styles.ghostBtn}
                  onClick={() => {
                    patchSection([...value, blankLike(value[0])])
                    setSelected(value.length)
                  }}
                >
                  + Adaugă
                </button>
              </div>

              <div className={styles.detail}>
                {value[selected] ? (
                  <>
                    <RecordEditor
                      record={value[selected]}
                      onChange={(next) =>
                        patchSection(value.map((item, i) => (i === selected ? next : item)))
                      }
                    />
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => {
                        if (!confirm(`Ștergi „${meta.title(value[selected])}”?`)) return
                        patchSection(value.filter((_, i) => i !== selected))
                        setSelected(0)
                      }}
                    >
                      Șterge din {meta.label.toLowerCase()}
                    </button>
                  </>
                ) : (
                  <p className={styles.hint}>Nimic selectat.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
