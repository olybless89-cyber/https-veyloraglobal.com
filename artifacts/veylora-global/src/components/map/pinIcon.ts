import L from "leaflet"

// A simple gold map pin, drawn inline so it matches the brand palette
// without depending on Leaflet's default marker image assets (which
// don't resolve correctly under Vite's bundling without extra config).
export const pinIcon = L.divIcon({
  className: "veylora-map-pin",
  html: `
    <svg width="34" height="44" viewBox="0 0 34 44" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 0C7.6 0 0 7.6 0 17c0 12.75 17 27 17 27s17-14.25 17-27C34 7.6 26.4 0 17 0z" fill="#0F2E23"/>
      <circle cx="17" cy="17" r="8" fill="#F0B429"/>
    </svg>
  `,
  iconSize: [34, 44],
  iconAnchor: [17, 44],
  popupAnchor: [0, -40],
})
