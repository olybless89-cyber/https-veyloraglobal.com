import { Link } from "wouter"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Target, Users, MapPin, Award } from "lucide-react"

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-primary py-16 md:py-24 text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Veylora Global</h1>
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl">
              Delivering excellence across borders since 1998. We are your trusted partner in global logistics.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold text-primary mb-6">Our Story</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                  <p>
                    Founded in 1998, Veylora Global began with a single truck and a vision to provide reliable local deliveries. Today, we have evolved into a global logistics powerhouse, managing complex supply chains for some of the world's most demanding industries.
                  </p>
                  <p>
                    Our journey has been defined by a relentless commitment to innovation and customer service. By investing heavily in modern fleets, advanced tracking technology, and rigorous training, we ensure that every parcel, pallet, and container is handled with the utmost care.
                  </p>
                  <p>
                    We believe that logistics is more than just moving goods—it's about empowering businesses to grow, connecting communities, and delivering on promises.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=1000&auto=format&fit=crop" alt="Cargo Ship" className="rounded-xl object-cover h-64 w-full shadow-md" />
                <img src="https://images.unsplash.com/photo-1542296332-2e4473faf563?q=80&w=1000&auto=format&fit=crop" alt="Logistics worker" className="rounded-xl object-cover h-64 w-full shadow-md translate-y-8" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30 border-y">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-card p-8 rounded-xl shadow-sm text-center">
                <Target className="h-10 w-10 text-accent mx-auto mb-4" />
                <h3 className="text-4xl font-black text-primary mb-2">99.8%</h3>
                <p className="text-muted-foreground font-medium">On-Time Delivery</p>
              </div>
              <div className="bg-card p-8 rounded-xl shadow-sm text-center">
                <MapPin className="h-10 w-10 text-accent mx-auto mb-4" />
                <h3 className="text-4xl font-black text-primary mb-2">150+</h3>
                <p className="text-muted-foreground font-medium">Countries Served</p>
              </div>
              <div className="bg-card p-8 rounded-xl shadow-sm text-center">
                <Users className="h-10 w-10 text-accent mx-auto mb-4" />
                <h3 className="text-4xl font-black text-primary mb-2">5,000+</h3>
                <p className="text-muted-foreground font-medium">Dedicated Staff</p>
              </div>
              <div className="bg-card p-8 rounded-xl shadow-sm text-center">
                <Award className="h-10 w-10 text-accent mx-auto mb-4" />
                <h3 className="text-4xl font-black text-primary mb-2">2M+</h3>
                <p className="text-muted-foreground font-medium">Shipments Annually</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
            <h2 className="text-3xl font-bold text-primary mb-6">Our Mission</h2>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light italic">
              "To provide innovative, reliable, and sustainable logistics solutions that connect businesses to global markets, ensuring every shipment reaches its destination safely, securely, and on time."
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
