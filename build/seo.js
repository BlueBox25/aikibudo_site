import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'

export const SITE = 'https://www.aikibudo.ro'

const DAYS = {
  1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday',
  5: 'Friday', 6: 'Saturday', 7: 'Sunday',
}

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')

/** Meta descriptions are cut by search engines around 160 characters. */
const clamp = (text, max = 158) => {
  const t = String(text ?? '').replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return `${t.slice(0, t.lastIndexOf(' ', max - 1))}…`
}

/** One opening span per weekday: earliest class start to latest class end. */
function openingHours(schedule, locationId) {
  const byDay = new Map()
  for (const e of schedule) {
    if (e.locationId !== locationId) continue
    const cur = byDay.get(e.day) ?? { opens: e.start, closes: e.end }
    byDay.set(e.day, {
      opens: e.start < cur.opens ? e.start : cur.opens,
      closes: e.end > cur.closes ? e.end : cur.closes,
    })
  }
  return [...byDay.entries()]
    .sort(([a], [b]) => a - b)
    .map(([day, span]) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: DAYS[day],
      opens: span.opens,
      closes: span.closes,
    }))
}

/**
 * `site.intro` is optional — the hero carries a tagline instead — but a meta
 * description never may be empty, so one is composed from the data.
 */
function siteDescription(content) {
  const { site, disciplines, locations } = content
  if (site.intro?.trim()) return site.intro
  return `${disciplines.map((d) => d.name).join(', ')} în ${locations.length} dojo-uri din `
    + `${site.city}. Grupe de copii și adulți, primul antrenament gratuit. Din ${site.founded}.`
}

function organization(site) {
  return {
    '@type': 'SportsOrganization',
    '@id': `${SITE}/#organizatie`,
    name: site.fullName,
    alternateName: site.name,
    legalName: site.legalName,
    url: SITE,
    foundingDate: String(site.founded),
    email: site.contact.email,
    telephone: site.contact.phones.map((p) => p.number),
    areaServed: site.city,
    sameAs: site.social.map((s) => s.url),
  }
}

function locationNode(loc, content) {
  const { site, schedule } = content
  return {
    '@type': 'SportsActivityLocation',
    '@id': `${SITE}/locatii/${loc.slug}#dojo`,
    name: `${loc.name} · ${site.name}`,
    url: `${SITE}/locatii/${loc.slug}`,
    description: clamp(loc.blurb ?? loc.kicker, 300),
    address: {
      '@type': 'PostalAddress',
      streetAddress: loc.address,
      addressLocality: site.city,
      addressCountry: 'RO',
    },
    geo: { '@type': 'GeoCoordinates', latitude: loc.coords.lat, longitude: loc.coords.lng },
    hasMap: loc.mapsUrl,
    telephone: site.contact.phones.map((p) => p.number),
    openingHoursSpecification: openingHours(schedule, loc.id),
    parentOrganization: { '@id': `${SITE}/#organizatie` },
  }
}

const breadcrumb = (trail) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map(([name, path], i) => ({
    '@type': 'ListItem', position: i + 1, name, item: `${SITE}${path}`,
  })),
})

const p = (text) => `<p>${esc(text)}</p>`

/** Every route the site answers on, with the head and the crawler-visible copy. */
export function routesFor(content) {
  const { site, disciplines, locations, instructors, days, schedule } = content
  const dayName = Object.fromEntries(days.map((d) => [d.id, d.name]))
  const discName = Object.fromEntries(disciplines.map((d) => [d.id, d.name]))
  const list = disciplines.map((d) => d.name).join(', ')

  const routes = [{
    path: '/',
    title: `${site.name} — Academia de Arte Marțiale București`,
    description: clamp(siteDescription(content)),
    graph: [
      organization(site),
      ...locations.map((l) => locationNode(l, content)),
    ],
    body: [
      `<h1>${esc(site.fullName)}</h1>`,
      p(siteDescription(content)),
      p(site.tagline),
      `<h2>Discipline</h2><ul>${disciplines.map((d) =>
        `<li><a href="/discipline/${d.slug}">${esc(d.name)}</a> — ${esc(d.summary)}</li>`).join('')}</ul>`,
      `<h2>Dojo-uri în ${esc(site.city)}</h2><ul>${locations.map((l) =>
        `<li><a href="/locatii/${l.slug}">${esc(l.name)}</a> — ${esc(l.address)}</li>`).join('')}</ul>`,
      `<p>Primul antrenament este gratuit. Telefon: ${site.contact.phones
        .map((x) => `${esc(x.name)} ${esc(x.number)}`).join(', ')}.</p>`,
    ].join(''),
  }]

  routes.push({
    path: '/discipline',
    title: `Discipline — ${list}`,
    description: clamp(`Disciplinele predate la ${site.name} în ${site.city}: ${list}. Grupe de copii și adulți, primul antrenament gratuit.`),
    graph: [{
      '@type': 'ItemList',
      itemListElement: disciplines.map((d, i) => ({
        '@type': 'ListItem', position: i + 1, name: d.name, url: `${SITE}/discipline/${d.slug}`,
      })),
    }, breadcrumb([['Acasă', '/'], ['Discipline', '/discipline']])],
    body: `<h1>Discipline</h1><ul>${disciplines.map((d) =>
      `<li><a href="/discipline/${d.slug}"><strong>${esc(d.name)}</strong></a> — ${esc(d.tagline)}. ${esc(d.summary)} Grupe: ${esc(d.ageGroups.join(', '))}.</li>`).join('')}</ul>`,
  })

  for (const d of disciplines) {
    const classes = schedule.filter((e) => e.disciplineId === d.id)
    const where = [...new Set(classes.map((e) => e.locationId))]
      .map((id) => locations.find((l) => l.id === id)).filter(Boolean)
    routes.push({
      path: `/discipline/${d.slug}`,
      title: `${d.name} în ${site.city} — ${site.name}`,
      description: clamp(d.summary),
      graph: [
        { '@type': 'WebPage', name: d.name, description: clamp(d.summary, 300),
          url: `${SITE}/discipline/${d.slug}`, about: { '@id': `${SITE}/#organizatie` } },
        breadcrumb([['Acasă', '/'], ['Discipline', '/discipline'], [d.name, `/discipline/${d.slug}`]]),
      ],
      body: [
        `<h1>${esc(d.name)}${d.kanji ? ` (${esc(d.kanji)})` : ''}</h1>`,
        d.tagline ? p(d.tagline) : '',
        p(d.summary),
        `<p>Grupe de vârstă: ${esc(d.ageGroups.join(', '))}.</p>`,
        where.length ? `<h2>Unde se predă</h2><ul>${where.map((l) =>
          `<li><a href="/locatii/${l.slug}">${esc(l.name)}</a>, ${esc(l.address)}</li>`).join('')}</ul>` : '',
        classes.length ? `<h2>Orar</h2><ul>${classes.map((e) =>
          `<li>${esc(dayName[e.day])} ${esc(e.start)}–${esc(e.end)} · ${esc(e.className)} · ${esc(e.ageGroup)}</li>`).join('')}</ul>` : '',
        ...(d.sections ?? []).map((s) => `<h2>${esc(s.heading)}</h2>${s.body.map(p).join('')}`),
      ].join(''),
    })
  }

  routes.push({
    path: '/locatii',
    title: `Dojo-uri în ${site.city} — ${site.name}`,
    description: clamp(`Cele ${locations.length} săli ${site.name} din ${site.city}: ${locations.map((l) => `${l.name} (${l.addressShort})`).join(', ')}.`),
    graph: [...locations.map((l) => locationNode(l, content)),
      breadcrumb([['Acasă', '/'], ['Locații', '/locatii']])],
    body: `<h1>Dojo-uri în ${esc(site.city)}</h1><ul>${locations.map((l) =>
      `<li><a href="/locatii/${l.slug}"><strong>${esc(l.name)}</strong></a> — ${esc(l.address)}. ${esc(l.kicker)}</li>`).join('')}</ul>`,
  })

  for (const l of locations) {
    const classes = schedule.filter((e) => e.locationId === l.id)
    const taught = [...new Set(classes.map((e) => e.disciplineId))].map((id) => discName[id]).filter(Boolean)
    routes.push({
      path: `/locatii/${l.slug}`,
      title: `${l.name} — arte marțiale pe ${l.addressShort}, ${site.city}`,
      description: clamp(`${l.name}, ${l.address}, ${site.city}. ${taught.join(', ')}. Primul antrenament gratuit.`),
      graph: [locationNode(l, content),
        breadcrumb([['Acasă', '/'], ['Locații', '/locatii'], [l.name, `/locatii/${l.slug}`]])],
      body: [
        `<h1>${esc(l.name)}</h1>`,
        p(l.kicker),
        `<p>Adresă: ${esc(l.address)}, ${esc(site.city)}. <a href="${esc(l.mapsUrl)}">Vezi pe hartă</a></p>`,
        p(l.blurb),
        taught.length ? `<p>Se predă aici: ${esc(taught.join(', '))}.</p>` : '',
        classes.length ? `<h2>Orar</h2><ul>${classes
          .slice().sort((a, b) => a.day - b.day || a.start.localeCompare(b.start))
          .map((e) => `<li>${esc(dayName[e.day])} ${esc(e.start)}–${esc(e.end)} · ${esc(e.className)} · ${esc(e.ageGroup)}</li>`).join('')}</ul>` : '',
        `<p>Primul antrenament este gratuit.</p>`,
      ].join(''),
    })
  }

  routes.push({
    path: '/instructori',
    title: `Instructori — ${site.name}`,
    description: clamp(`Instructorii ${site.name}: ${instructors.slice(0, 4).map((i) => i.displayName ?? i.name).join(', ')} și alții.`),
    graph: [{
      '@type': 'ItemList',
      itemListElement: instructors.map((i, n) => ({
        '@type': 'ListItem', position: n + 1,
        item: {
          '@type': 'Person', name: i.name, jobTitle: i.title,
          description: i.specialty, worksFor: { '@id': `${SITE}/#organizatie` },
        },
      })),
    }, breadcrumb([['Acasă', '/'], ['Instructori', '/instructori']])],
    body: `<h1>Instructori</h1><ul>${instructors.map((i) =>
      `<li><strong>${esc(i.displayName ?? i.name)}</strong> — ${esc(i.specialty ?? '')} ${esc((i.ranks ?? []).join('; '))}</li>`).join('')}</ul>`,
  })

  routes.push({
    path: '/contact',
    title: `Contact — ${site.name}`,
    description: clamp(`Contact ${site.fullName}: ${site.contact.phones.map((x) => x.number).join(', ')}, ${site.contact.email}.`),
    graph: [organization(site), breadcrumb([['Acasă', '/'], ['Contact', '/contact']])],
    body: [
      '<h1>Contact</h1>',
      `<ul>${site.contact.phones.map((x) => `<li>${esc(x.name)}: ${esc(x.number)}</li>`).join('')}</ul>`,
      `<p>Email: ${esc(site.contact.email)}</p>`,
      `<p>Sediu: ${esc(site.contact.headquarters)}</p>`,
      `<ul>${locations.map((l) => `<li>${esc(l.name)} — ${esc(l.address)}</li>`).join('')}</ul>`,
    ].join(''),
  })

  routes.push({
    path: '/resurse',
    title: `Resurse — documente și legături — ${site.name}`,
    description: clamp('Fișe de înscriere, programe de examinare, glosar de termeni și legături către federații și școli partenere.'),
    graph: [breadcrumb([['Acasă', '/'], ['Resurse', '/resurse']])],
    body: `<h1>Resurse</h1><ul>${(content.resources.documents ?? []).map((doc) =>
      `<li><a href="${esc(doc.url)}">${esc(doc.title)}</a> — ${esc(doc.description ?? '')}</li>`).join('')}</ul>`,
  })

  return routes
}

/**
 * Writes one real HTML file per route.
 *
 * The app is a client-rendered SPA, so the built index.html carries no text at
 * all: a crawler that does not run JavaScript — which includes most AI agents
 * fetching a URL — sees an empty document on every address. These files give
 * each route its own title, description and structured data, plus the page's
 * actual copy inside <noscript>, which React never touches.
 */
export async function emitStaticPages({ dist, template, content }) {
  const routes = routesFor(content)

  for (const route of routes) {
    if (!route.description?.trim()) {
      throw new Error(`Ruta ${route.path} nu are meta description`)
    }
    const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@graph': route.graph })
    const canonical = `${SITE}${route.path === '/' ? '/' : route.path}`

    const head = [
      `<title>${esc(route.title)}</title>`,
      `<meta name="description" content="${esc(route.description)}" />`,
      `<link rel="canonical" href="${canonical}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:site_name" content="${esc(content.site.name)}" />`,
      `<meta property="og:title" content="${esc(route.title)}" />`,
      `<meta property="og:description" content="${esc(route.description)}" />`,
      `<meta property="og:url" content="${canonical}" />`,
      `<meta property="og:locale" content="ro_RO" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<script type="application/ld+json">${jsonLd.replace(/</g, '\\u003c')}</script>`,
    ].join('\n    ')

    const html = template
      .replace(/<title>[\s\S]*?<\/title>/, '')
      .replace(/<meta name="description"[^>]*\/?>/, '')
      .replace('</head>', `  ${head}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root"></div>\n    <noscript>${route.body}</noscript>`)

    // `<path>.html` rather than `<path>/index.html`: Vercel documents that
    // cleanUrls serves about.html at /about, while directory-index resolution
    // for a bare /path is not documented anywhere.
    const file = route.path === '/'
      ? join(dist, 'index.html')
      : join(dist, `${route.path.replace(/^\//, '')}.html`)
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, html, 'utf8')
  }

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">'.replace('www.sitemap.org', 'www.sitemaps.org'),
    ...routes.map((r) => `  <url><loc>${SITE}${r.path}</loc><changefreq>monthly</changefreq>`
      + `<priority>${r.path === '/' ? '1.0' : '0.8'}</priority></url>`),
    '</urlset>',
  ].join('\n')
  await writeFile(join(dist, 'sitemap.xml'), `${sitemap}\n`, 'utf8')

  await writeFile(join(dist, 'robots.txt'),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`, 'utf8')

  return routes.map((r) => r.path)
}
