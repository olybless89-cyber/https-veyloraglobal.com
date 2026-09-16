import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { pinIcon } from "./pinIcon"

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

interface LocationPickerProps {
  lat: number | null
  lng: number | null
  onChange: (lat: number, lng: number) => void
}

// Click-to-set map for the admin panel. No geocoding provider is wired in
// (Leaflet/OpenStreetMap doesn't include one for free) — admins click the
// spot on the map, or type coordinates directly into the fields next to it.
export function LocationPicker({ lat, lng, onChange }: LocationPickerProps) {
  const hasPosition = lat !== null && lng !== null && !Number.isNaN(lat) && !Number.isNaN(lng)
  const center: [number, number] = hasPosition ? [lat as number, lng as number] : [9.082, 8.6753] // Nigeria-centered default
  const zoom = hasPosition ? 12 : 5

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: 280, width: "100%", borderRadius: 8 }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {hasPosition && <Marker position={[lat as number, lng as number]} icon={pinIcon} />}
      <ClickHandler onPick={onChange} />
    </MapContainer>
  )
}
