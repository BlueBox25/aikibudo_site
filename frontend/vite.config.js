import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { docHash } from './src/admin/docHash.js'

const CONTENT_PATH = fileURLToPath(new URL('./public/content.json', import.meta.url))
const UPLOAD_DIR = fileURLToPath(new URL('./public/imagini/', import.meta.url))

const ALLOWED_IMAGES = { '.jpg': 1, '.jpeg': 1, '.png': 1, '.webp': 1, '.avif': 1 }
const MAX_UPLOAD = 8 * 1024 * 1024

/**
 * Anything the browser sends is untrusted, so the name is reduced to a bare
 * slug and a known extension — no directories, no traversal, no surprises about
 * where the byte stream lands.
 */
function safeName(raw) {
  const base = String(raw || '').split(/[/\\]/).pop().toLowerCase()
  const dot = base.lastIndexOf('.')
  const ext = dot === -1 ? '' : base.slice(dot)
  if (!ALLOWED_IMAGES[ext]) return null

  const stem = base
    .slice(0, dot)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)

  return stem ? `${stem}${ext}` : null
}

/**
 * Dev-only write endpoint behind /admin.
 *
 * The site itself stays completely static — this middleware only exists while
 * `npm run dev` is running, so the editor can save straight into the source
 * file instead of the user hand-editing JSON. Nothing here reaches the build.
 */
function contentWriter() {
  return {
    name: 'aikibudo-content-writer',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/__content', async (req, res) => {
        if (req.method !== 'PUT') {
          res.statusCode = 405
          return res.end('Doar PUT')
        }

        const chunks = []
        for await (const chunk of req) chunks.push(chunk)

        try {
          const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8'))

          // A truncated or wrongly-shaped payload would wipe the site's only
          // data file, so sanity-check the top level before touching disk.
          for (const key of ['site', 'locations', 'disciplines', 'schedule']) {
            if (!(key in parsed)) throw new Error(`lipsește secțiunea "${key}"`)
          }

          const onDisk = await readFile(CONTENT_PATH, 'utf8')
          const current = docHash(JSON.parse(onDisk))
          const baseline = req.headers['x-baseline']

          // An editor tab holds a copy of the whole document from the moment it
          // loaded. If the file changed since — another tab, a script, a branch
          // switch — saving that copy would silently revert those changes, so
          // the write is refused instead.
          if (baseline && baseline !== current) {
            res.statusCode = 409
            res.setHeader('Content-Type', 'application/json')
            return res.end(JSON.stringify({
              ok: false,
              stale: true,
              error: 'Fișierul s-a schimbat de când l-ai deschis. Reîncarcă înainte să salvezi.',
            }))
          }

          // Keep a rollback copy of what was there before this save.
          await writeFile(`${CONTENT_PATH}.bak`, onDisk)
          await writeFile(CONTENT_PATH, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8')

          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({
            ok: true,
            savedAt: new Date().toISOString(),
            version: docHash(parsed),
          }))
        } catch (err) {
          res.statusCode = 400
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: err.message }))
        }
      })

      // Image upload for the editor: the bytes arrive raw, the name in a header.
      server.middlewares.use('/__upload', async (req, res) => {
        const reply = (code, body) => {
          res.statusCode = code
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        }

        if (req.method !== 'POST') return reply(405, { ok: false, error: 'Doar POST' })

        const name = safeName(req.headers['x-filename'])
        if (!name) {
          return reply(400, { ok: false, error: 'Doar .jpg, .jpeg, .png, .webp sau .avif' })
        }

        const chunks = []
        let size = 0
        for await (const chunk of req) {
          size += chunk.length
          if (size > MAX_UPLOAD) return reply(413, { ok: false, error: 'Imaginea depășește 8 MB' })
          chunks.push(chunk)
        }
        if (size === 0) return reply(400, { ok: false, error: 'Fișier gol' })

        try {
          await mkdir(UPLOAD_DIR, { recursive: true })
          await writeFile(new URL(name, `file://${UPLOAD_DIR}`), Buffer.concat(chunks))
          reply(200, { ok: true, path: `/imagini/${name}`, size })
        } catch (err) {
          reply(500, { ok: false, error: err.message })
        }
      })
    },
  }
}

// Site complet static: conținutul vine din public/content.json,
// deci nu mai există niciun proxy către un API.
export default defineConfig({
  plugins: [react(), contentWriter()],
})
