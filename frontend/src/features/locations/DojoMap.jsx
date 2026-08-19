import { useEffect, useMemo } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import styles from './map.module.css'

/** Red pin drawn inline — avoids Leaflet's bundler-hostile default icon assets. */
const pinIcon = (active) =>
  L.divIcon({
    className: styles.pinWrap,
    html: `<svg viewBox="0 0 24 32" class="${styles.pin} ${active ? styles.pinActive : ''}">
             <path d="M12 31C12 31 22 19.5 22 11.5A10 10 0 0 0 2 11.5C2 19.5 12 31 12 31Z"/>
             <circle cx="12" cy="11.5" r="3.6" fill="#fff"/>
           </svg>`,
    iconSize: [30, 40],
    iconAnchor: [15, 38],
    popupAnchor: [0, -34],
  })

/** Keeps the viewport framed on whatever markers are currently shown. */
function Frame({ locations }) {
  const map = useMap()

  useEffect(() => {
    if (locations.length === 1) {
      const { lat, lng } = locations[0].coords
      map.setView([lat, lng], 16, { animate: false })
    } else if (locations.length > 1) {
      const bounds = L.latLngBounds(locations.map((l) => [l.coords.lat, l.coords.lng]))
      map.fitBounds(bounds, { padding: [56, 56], animate: false })
    }
    // The map is often mounted inside a tab panel that was zero-width at
    // creation time; recalculating once settled avoids grey tiles.
    const id = setTimeout(() => map.invalidateSize(), 120)
    return () => clearTimeout(id)
  }, [map, locations])

  return null
}

export default function DojoMap({ locations, activeId = null, height = 380 }) {
  const list = useMemo(
    () => (Array.isArray(locations) ? locations : [locations]).filter(Boolean),
    [locations],
  )

  if (list.length === 0) return null

  const first = list[0]

  return (
    <div className={styles.wrap} style={{ '--map-h': `${height}px` }}>
      <MapContainer
        className={styles.map}
        center={[first.coords.lat, first.coords.lng]}
        zoom={15}
        scrollWheelZoom={false}
        attributionControl
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />
        <Frame locations={list} />

        {list.map((location) => (
          <Marker
            key={location.id}
            position={[location.coords.lat, location.coords.lng]}
            icon={pinIcon(activeId === location.id || list.length === 1)}
          >
            <Popup>
              <span className={styles.popupName}>{location.name}</span>
              <span className={styles.popupAddr}>{location.address}</span>
              <a
                className={styles.popupLink}
                href={location.mapsUrl}
                target="_blank"
                rel="noreferrer noopener"
              >
                Google Maps ↗
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <p className={styles.hint}>
        Trage de hartă pentru a naviga. Apasă pe un marcaj pentru rută în Google Maps.
      </p>
    </div>
  )
}
