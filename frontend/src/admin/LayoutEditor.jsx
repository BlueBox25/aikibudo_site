import { HOME_BLOCKS } from '../pages/homeBlocks'
import styles from './admin.module.css'

/**
 * Order of the home page's blocks.
 *
 * The hero is not listed: it is the page's identity and always sits first.
 * Everything else can be moved, hidden, or given its heading here.
 */
export default function LayoutEditor({ sections, onChange }) {
  const move = (from, to) => {
    if (to < 0 || to >= sections.length) return
    const next = [...sections]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  const patch = (i, key, value) =>
    onChange(sections.map((s, j) => (j === i ? { ...s, [key]: value } : s)))

  const missing = Object.keys(HOME_BLOCKS).filter(
    (id) => !sections.some((s) => s.id === id),
  )

  return (
    <>
      <p className={styles.lede}>
        Trage blocurile în ordinea dorită cu săgețile. Zona de sus a paginii
        (numele clubului, motto-ul, butoanele) rămâne mereu prima — o editezi din
        „Site &amp; hero”.
      </p>

      <ol className={styles.blocks}>
        {sections.map((section, i) => {
          const block = HOME_BLOCKS[section.id]
          const hidden = section.visible === false

          return (
            <li
              key={`${section.id}-${i}`}
              className={hidden ? styles.blockRowOff : styles.blockRow}
            >
              <div className={styles.blockMove}>
                <button
                  type="button"
                  className={styles.iconBtn}
                  title="Mută mai sus"
                  disabled={i === 0}
                  onClick={() => move(i, i - 1)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  className={styles.iconBtn}
                  title="Mută mai jos"
                  disabled={i === sections.length - 1}
                  onClick={() => move(i, i + 1)}
                >
                  ↓
                </button>
              </div>

              <div className={styles.blockBody}>
                <div className={styles.blockHead}>
                  <span className={styles.blockPos}>{i + 1}</span>
                  <strong className={styles.blockName}>
                    {block ? block.label : `${section.id} (bloc necunoscut)`}
                  </strong>

                  <label className={styles.check}>
                    <input
                      type="checkbox"
                      checked={!hidden}
                      onChange={(e) => patch(i, 'visible', e.target.checked)}
                    />
                    Vizibil
                  </label>

                  {block?.headings && (
                    <label className={styles.check}>
                      <input
                        type="checkbox"
                        checked={Boolean(section.alt)}
                        onChange={(e) => patch(i, 'alt', e.target.checked)}
                      />
                      Fundal gri
                    </label>
                  )}
                </div>

                {block?.headings && (
                  <div className={styles.blockFields}>
                    {['kicker', 'title', 'lede'].map((key) => (
                      <label key={key} className={styles.field}>
                        <span className={styles.fieldLabel}>
                          {{ kicker: 'Supratitlu', title: 'Titlu', lede: 'Descriere' }[key]}
                        </span>
                        <input
                          className={styles.input}
                          value={section[key] ?? ''}
                          placeholder="— lasă gol pentru a ascunde —"
                          onChange={(e) => patch(i, key, e.target.value)}
                        />
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      {missing.length > 0 && (
        <div className={styles.missing}>
          <span className={styles.fieldLabel}>Blocuri neincluse</span>
          {missing.map((id) => (
            <button
              key={id}
              type="button"
              className={styles.ghostBtnDark}
              onClick={() => onChange([...sections, { id, visible: true }])}
            >
              + {HOME_BLOCKS[id].label}
            </button>
          ))}
        </div>
      )}
    </>
  )
}
