import * as React from "react"
import { Link, useLocation } from "wouter"
import { Plane, Ship, Truck, Menu, X, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [location] = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/track", label: "Track Shipment" },
    { href: "/contact", label: "Contact" },
  ]

  const isActive = (href: string) => location === href

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-primary text-primary-foreground shadow-sm">
      <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-accent p-2 rounded-md group-hover:bg-white group-hover:text-accent transition-colors">
            <Package className="h-6 w-6" />
          </div>
          <span className="font-bold text-xl tracking-tight leading-none">
            Veylora Global<br />
            <span className="text-accent text-sm uppercase tracking-wider">Express Delivery</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6 text-sm font-medium">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`hover:text-accent transition-colors ${
                    isActive(link.href) ? "text-accent" : "text-primary-foreground/90"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <Link href="/get-quote">
              <Button variant="accent" className="font-bold">Get a Quote</Button>
            </Link>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/10 absolute w-full left-0">
          <div className="px-4 py-6 space-y-4">
            <ul className="flex flex-col gap-4 text-base font-medium">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block hover:text-accent transition-colors ${
                      isActive(link.href) ? "text-accent" : "text-primary-foreground/90"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-primary-foreground/10">
              <Link href="/get-quote" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="accent" className="w-full font-bold">Get a Quote</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
