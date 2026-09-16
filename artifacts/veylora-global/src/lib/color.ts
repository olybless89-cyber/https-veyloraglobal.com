// Conversions between the "H S% L%" triplet strings used by the CSS
// custom properties (e.g. "167 47% 11%") and #rrggbb hex, so the admin
// Branding tab can offer a native color picker while the rest of the app
// keeps using the HSL-triplet format it already relies on everywhere.

export function hslTripletToHex(triplet: string): string {
  const match = triplet.trim().match(/^(-?[\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/)
  if (!match) return "#000000"
  const h = Number(match[1]) / 360
  const s = Number(match[2]) / 100
  const l = Number(match[3]) / 100

  if (s === 0) {
    const v = Math.round(l * 255)
    return `#${[v, v, v].map((x) => x.toString(16).padStart(2, "0")).join("")}`
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const hue2rgb = (t: number) => {
    let tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1 / 6) return p + (q - p) * 6 * tt
    if (tt < 1 / 2) return q
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
    return p
  }
  const r = Math.round(hue2rgb(h + 1 / 3) * 255)
  const g = Math.round(hue2rgb(h) * 255)
  const b = Math.round(hue2rgb(h - 1 / 3) * 255)
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`
}

export function hexToHslTriplet(hex: string): string {
  const clean = hex.replace("#", "")
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
    }
    h /= 6
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}
