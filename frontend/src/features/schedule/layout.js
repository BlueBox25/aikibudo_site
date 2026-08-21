export const toMin = (hhmm) => Number(hhmm.slice(0, 2)) * 60 + Number(hhmm.slice(3, 5))
export const fmt = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

// Tall enough that a 60-minute class fits time + name + instructor without
// clipping; anything shorter has to drop the meta row instead.
const PX_PER_MIN = 1.35
const BREAK_PX = 38

/**
 * Vertical time axis for the timetable.
 *
 * Hours with nothing scheduled anywhere in the week are collapsed into a short
 * break instead of being drawn to scale — Itsushin trains 10:00–11:30 and then
 * not again until 17:00, and five empty hours of whitespace helps nobody.
 */
export function buildAxis(entries) {
  if (entries.length === 0) return { bands: [], height: 0, ticks: [] }

  const spans = entries
    .map((e) => [toMin(e.start), toMin(e.end)])
    .sort((a, b) => a[0] - b[0])

  // Merge to whole hours, joining runs that sit within an hour of each other.
  const merged = []
  for (const [s, e] of spans) {
    const from = Math.floor(s / 60) * 60
    const to = Math.ceil(e / 60) * 60
    const last = merged[merged.length - 1]
    if (last && from <= last[1] + 60) last[1] = Math.max(last[1], to)
    else merged.push([from, to])
  }

  let y = 0
  const bands = merged.map(([start, end], i) => {
    const band = { start, end, y, height: (end - start) * PX_PER_MIN }
    y += band.height + (i < merged.length - 1 ? BREAK_PX : 0)
    return band
  })

  const ticks = []
  for (const band of bands) {
    for (let m = band.start; m <= band.end; m += 60) {
      ticks.push({ minute: m, y: band.y + (m - band.start) * PX_PER_MIN, label: fmt(m) })
    }
  }

  return { bands, height: y, ticks, pxPerMin: PX_PER_MIN, breakPx: BREAK_PX }
}

export function minuteToY(axis, minute) {
  for (const band of axis.bands) {
    if (minute >= band.start && minute <= band.end) {
      return band.y + (minute - band.start) * axis.pxPerMin
    }
  }
  const last = axis.bands[axis.bands.length - 1]
  return last ? last.y + last.height : 0
}

/**
 * Places a day's classes into side-by-side lanes.
 *
 * Classes only lose width when they genuinely clash: Ju-Jitsu adulți and
 * Self-Defence both run 19:20–20:20 at Art Dojo, so those two split the column
 * while everything else stays full width.
 */
export function placeDay(dayEntries, axis) {
  const sorted = [...dayEntries]
    .map((entry) => ({ entry, start: toMin(entry.start), end: toMin(entry.end) }))
    .sort((a, b) => a.start - b.start || a.end - b.end)

  const clusters = []
  let current = []
  let reach = -Infinity

  for (const item of sorted) {
    if (current.length && item.start >= reach) {
      clusters.push(current)
      current = []
      reach = -Infinity
    }
    current.push(item)
    reach = Math.max(reach, item.end)
  }
  if (current.length) clusters.push(current)

  const placed = []
  for (const cluster of clusters) {
    const laneEnds = []
    for (const item of cluster) {
      let lane = laneEnds.findIndex((end) => end <= item.start)
      if (lane === -1) {
        lane = laneEnds.length
        laneEnds.push(item.end)
      } else {
        laneEnds[lane] = item.end
      }
      item.lane = lane
    }
    for (const item of cluster) {
      placed.push({
        ...item,
        lanes: laneEnds.length,
        top: minuteToY(axis, item.start),
        height: Math.max((item.end - item.start) * axis.pxPerMin, 34),
      })
    }
  }
  return placed
}

/** ISO-style weekday (Mon = 1) for "today" highlighting. */
export const todayId = () => ((new Date().getDay() + 6) % 7) + 1
