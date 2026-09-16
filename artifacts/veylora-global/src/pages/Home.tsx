import { Link, useLocation } from "wouter"
import { useTrackShipment } from "@workspace/api-client-react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plane, Ship, Truck, Globe2, ShieldCheck, Clock, ArrowRight } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function Home() {
  const [consNo, setConsNo] = useState("")
  const [, setLocation] = useLocation()
  
  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (!consNo.trim()) return
    setLocation(`/track?consNo=${encodeURIComponent(consNo)}`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative bg-primary text-primary-foreground py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8ed7c15902?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80" />
          
          <div className="container relative mx-auto px-4 md:px-6 z-10 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl leading-tight mb-6">
              Global Logistics & <br className="hidden md:block"/> 
              <span className="text-accent">Express Delivery</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mb-12">
              Fast, secure, and reliable freight forwarding across the globe. Track your cargo in real-time and experience logistics excellence.
            </p>

            {/* Tracking Widget */}
            <div className="w-full max-w-2xl bg-white p-6 md:p-8 rounded-xl shadow-2xl text-card-foreground">
              <div className="mb-4 text-left">
                <h3 className="font-bold text-xl text-primary mb-1">Track Your Shipment</h3>
                <p className="text-muted-foreground text-sm">Enter your consignment number to get real-time updates.</p>
              </div>
              <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3">
                <Input 
                  placeholder="e.g. SC-12345678" 
                  className="flex-1 h-12 text-lg px-4 bg-muted/50 border-muted-foreground/20 focus-visible:ring-accent"
                  value={consNo}
                  onChange={(e) => setConsNo(e.target.value)}
                  required
                />
                <Button type="submit" variant="accent" size="lg" className="h-12 px-8 font-bold text-lg">
                  Track Now
                </Button>
              </form>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Our Core Services</h2>
              <p className="text-muted-foreground text-lg">Comprehensive logistics solutions designed to meet the demands of modern supply chains.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-8 rounded-xl border border-card-border shadow-sm hover:shadow-md transition-shadow group">
                <div className="h-16 w-16 bg-primary/5 text-primary rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Plane className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Air Freight</h3>
                <p className="text-muted-foreground mb-6">
                  Expedited global air shipping for time-sensitive cargo with priority handling and guaranteed delivery times.
                </p>
                <Link href="/services" className="inline-flex items-center text-accent font-medium hover:underline">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              <div className="bg-card p-8 rounded-xl border border-card-border shadow-sm hover:shadow-md transition-shadow group">
                <div className="h-16 w-16 bg-primary/5 text-primary rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Ship className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Ocean Freight</h3>
                <p className="text-muted-foreground mb-6">
                  Cost-effective container shipping (FCL/LCL) for large volumes across international waters with full tracking.
                </p>
                <Link href="/services" className="inline-flex items-center text-accent font-medium hover:underline">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
              <div className="bg-card p-8 rounded-xl border border-card-border shadow-sm hover:shadow-md transition-shadow group">
                <div className="h-16 w-16 bg-primary/5 text-primary rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  <Truck className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-primary mb-3">Road Delivery</h3>
                <p className="text-muted-foreground mb-6">
                  Reliable door-to-door ground transportation network covering major domestic and cross-border routes.
                </p>
                <Link href="/services" className="inline-flex items-center text-accent font-medium hover:underline">
                  Learn more <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features / Why Us */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Veylora Global?</h2>
                <p className="text-primary-foreground/80 text-lg mb-8">
                  We don't just move boxes; we deliver promises. Our advanced infrastructure and dedicated team ensure your cargo reaches its destination safely and on schedule.
                </p>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="shrink-0 mt-1">
                      <Globe2 className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Global Network</h4>
                      <p className="text-primary-foreground/70">Partnerships with major airlines, shipping lines, and local carriers in over 150 countries.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="shrink-0 mt-1">
                      <ShieldCheck className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Secure Handling</h4>
                      <p className="text-primary-foreground/70">Rigorous security protocols and comprehensive insurance coverage for complete peace of mind.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="shrink-0 mt-1">
                      <Clock className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2">Real-Time Visibility</h4>
                      <p className="text-primary-foreground/70">Advanced tracking systems provide minute-by-minute updates on your shipment's journey.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop" 
                    alt="Warehouse operations" 
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute -bottom-8 -left-8 bg-accent text-accent-foreground p-8 rounded-xl shadow-xl hidden md:block">
                  <p className="text-4xl font-black mb-1">25+</p>
                  <p className="font-medium text-white/90">Years Experience</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 bg-accent text-accent-foreground text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-5xl font-black mb-6">Ready to ship with us?</h2>
            <p className="text-xl mb-10 max-w-2xl mx-auto text-white/90">
              Get a customized quote for your logistics needs and experience the Veylora Global difference today.
            </p>
            <Link href="/get-quote">
              <Button size="xl" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg px-10">
                Request a Quote
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
