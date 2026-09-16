import * as React from "react"
import { useSiteSettings } from "@/lib/site-settings"

// Applies admin-configured theme colors and SEO tags at runtime, so a
// branding change in Admin -> Settings takes effect without a rebuild.
// Renders nothing — just a side-effect hook mounted once near the app root.
export function ApplyBranding() {
  const { data: settings } = useSiteSettings()

  React.useEffect(() => {
    const root = document.documentElement
    // --sidebar/--sidebar-primary reuse the same brand colors (see
    // index.css) so the admin sidebar restyles along with the public site.
    root.style.setProperty("--primary", settings.color_primary_hsl)
    root.style.setProperty("--sidebar", settings.color_primary_hsl)
    root.style.setProperty("--accent", settings.color_accent_hsl)
    root.style.setProperty("--sidebar-primary", settings.color_accent_hsl)
    root.style.setProperty("--sidebar-ring", settings.color_accent_hsl)
  }, [settings.color_primary_hsl, settings.color_accent_hsl])

  React.useEffect(() => {
    document.title = settings.seo_title
    let meta = document.querySelector('meta[name="description"]')
    if (!meta) {
      meta = document.createElement("meta")
      meta.setAttribute("name", "description")
      document.head.appendChild(meta)
    }
    meta.setAttribute("content", settings.seo_description)
  }, [settings.seo_title, settings.seo_description])

  return null
}
