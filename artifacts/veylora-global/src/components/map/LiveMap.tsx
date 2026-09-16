import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { pinIcon } from "./pinIcon"

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([lat, lng], map.getZoom(), { animate: true })
  }, [lat, lng])
  return null
}

interface LiveMapProps {
  lat: number
  lng: number
  label?: string
  className?: string
}

// Read-only live-location map for the public tracking page. Re-centers
// smoothly whenever lat/lng change (e.g. after a polling refresh picks up
// a new admin-set location).
export function LiveMap({ lat, lng, label, className }: LiveMapProps) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={12}
      scrollWheelZoom={false}
      className={className}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={pinIcon}>
        {label && <Popup>{label}</Popup>}
      </Marker>
      <Recenter lat={lat} lng={lng} />
    </MapContainer>
  )
}
