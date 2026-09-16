import * as React from "react"

interface Slide {
  image: string
  label: string
  tag: string
}

const SLIDES: Slide[] = [
  {
    image: "https://images.unsplash.com/photo-1754959035256-8e42db4db9aa?q=80&w=2400&auto=format&fit=crop",
    label: "Air Freight",
    tag: "01",
  },
  {
    image: "https://images.unsplash.com/photo-1679183959103-e182446d6810?q=80&w=2400&auto=format&fit=crop",
    label: "Ocean Shipping",
    tag: "02",
  },
  {
    image: "https://images.unsplash.com/photo-1720811559395-3ed8d1b16649?q=80&w=2400&auto=format&fit=crop",
    label: "Road Delivery",
    tag: "03",
  },
  {
    image: "https://images.unsplash.com/photo-1645736315000-6f788915923b?q=80&w=2400&auto=format&fit=crop",
    label: "Warehousing & Fulfillment",
    tag: "04",
  },
]

const SLIDE_DURATION_MS = 6000

// Full-bleed, auto-advancing hero background: crossfades between slides with
// a slow Ken-Burns zoom on the active one, a branded gradient overlay for
// text legibility, and a minimal label + progress rail in the corner for a
// premium feel. Pauses on hover; dots/label are click-to-jump.
export function HeroSlider() {
  const [active, setActive] = React.useState(0)
  const [paused, setPaused] = React.useState(false)

  React.useEffect(() => {
    if (paused) return
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % SLIDES.length)
    }, SLIDE_DURATION_MS)
    return () => window.clearInterval(id)
  }, [paused])

  return (
    <div
      className="absolute inset-0 overflow-hidden bg-primary"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {SLIDES.map((slide, i) => (
        <div
          key={slide.image}
          className="absolute inset-0 transition-opacity duration-[1400ms] ease-in-out"
          style={{ opacity: i === active ? 1 : 0 }}
          aria-hidden={i !== active}
        >
          <div
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{
              backgroundImage: `url('${slide.image}')`,
              animation: i === active ? "veylora-kenburns 9s ease-out forwards" : undefined,
            }}
          />
        </div>
      ))}

      {/* Brand-tinted overlay for text legibility, consistent across all slides */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-primary/50" />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/60 via-transparent to-primary/60" />

      {/* Slide label + progress rail */}
      <div className="absolute bottom-6 left-0 right-0 z-20 flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-primary-foreground/90">
          <span className="text-accent font-mono text-xs tracking-[0.2em]">{SLIDES[active].tag}</span>
          <span className="h-px w-8 bg-accent/60" />
          <span className="text-xs font-semibold uppercase tracking-[0.25em]">{SLIDES[active].label}</span>
        </div>
        <div className="flex items-center gap-2">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.image}
              type="button"
              aria-label={`Show ${slide.label} slide`}
              onClick={() => setActive(i)}
              className="group h-1.5 rounded-full bg-primary-foreground/25 overflow-hidden transition-all duration-300"
              style={{ width: i === active ? 32 : 8 }}
            >
              <span
                className="block h-full bg-accent transition-transform duration-300 origin-left"
                style={{ transform: i === active ? "scaleX(1)" : "scaleX(0)" }}
              />
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes veylora-kenburns {
          from { transform: scale(1); }
          to { transform: scale(1.08); }
        }
      `}</style>
    </div>
  )
}
