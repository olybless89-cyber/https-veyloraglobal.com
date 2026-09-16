import { Link } from "wouter"
import { Package, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react"
import { useSiteSettings } from "@/lib/site-settings"

export function Footer() {
  const { data: settings } = useSiteSettings()

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-accent p-2 rounded-md">
                <Package className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl tracking-tight leading-none">
                {settings.site_name}<br />
                <span className="text-accent text-sm uppercase tracking-wider">{settings.tagline}</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed max-w-xs">
              {settings.company_blurb}
            </p>
            <div className="flex items-center gap-4 pt-2">
              {settings.social_facebook && (
                <a href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {settings.social_twitter && (
                <a href={settings.social_twitter} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {settings.social_linkedin && (
                <a href={settings.social_linkedin} target="_blank" rel="noopener noreferrer" className="h-8 w-8 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Quick Links</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/services" className="hover:text-accent transition-colors">Our Services</Link></li>
              <li><Link href="/track" className="hover:text-accent transition-colors">Track Shipment</Link></li>
              <li><Link href="/get-quote" className="hover:text-accent transition-colors">Get a Quote</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Services</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li><Link href="/services" className="hover:text-accent transition-colors">Air Freight</Link></li>
              <li><Link href="/services" className="hover:text-accent transition-colors">Sea Shipping</Link></li>
              <li><Link href="/services" className="hover:text-accent transition-colors">Road Delivery</Link></li>
              <li><Link href="/services" className="hover:text-accent transition-colors">Logistics Solutions</Link></li>
              <li><Link href="/services" className="hover:text-accent transition-colors">Warehousing</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Contact Us</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-accent shrink-0" />
                <span className="whitespace-pre-line">{settings.office_address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-accent shrink-0" />
                <span>{settings.contact_phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-accent shrink-0" />
                <span>{settings.contact_email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
          <p>&copy; {new Date().getFullYear()} {settings.site_name}. {settings.footer_text}</p>
        </div>
      </div>
    </footer>
  )
}
