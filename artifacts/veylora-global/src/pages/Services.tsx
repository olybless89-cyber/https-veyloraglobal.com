import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Plane, Ship, Truck, PackageCheck, Warehouse, Activity } from "lucide-react"

export default function Services() {
  const services = [
    {
      id: "air-freight",
      title: "Air Freight",
      icon: Plane,
      description: "When time is critical, our air freight services offer the fastest transit times globally. We provide priority boarding, direct flights, and consolidated air shipping options to balance speed and cost.",
      features: ["Next Flight Out (NFO)", "Charter Services", "Consolidation", "Door-to-Door Delivery"]
    },
    {
      id: "sea-shipping",
      title: "Sea Shipping",
      icon: Ship,
      description: "The most cost-effective solution for large volumes. Our ocean freight network connects major global ports, handling everything from full containers to specialized break-bulk cargo.",
      features: ["Full Container Load (FCL)", "Less-than-Container Load (LCL)", "Roll-on/Roll-off (RoRo)", "Port-to-Port Operations"]
    },
    {
      id: "road-delivery",
      title: "Road Delivery",
      icon: Truck,
      description: "A robust ground network ensuring seamless domestic and cross-border connectivity. Our diverse fleet handles everything from small parcels to oversized industrial equipment.",
      features: ["Full Truckload (FTL)", "Less-than-Truckload (LTL)", "Express Courier", "Temperature Controlled"]
    },
    {
      id: "warehousing",
      title: "Warehousing & Distribution",
      icon: Warehouse,
      description: "Strategic storage solutions designed to optimize your supply chain. We offer secure, modern facilities with advanced inventory management systems.",
      features: ["Short & Long Term Storage", "Pick and Pack", "Cross-docking", "Inventory Management"]
    },
    {
      id: "customs",
      title: "Customs Brokerage",
      icon: PackageCheck,
      description: "Navigate complex international trade regulations with ease. Our licensed experts ensure compliance and expedite the clearance process to avoid delays.",
      features: ["Import/Export Clearance", "Tariff Classification", "Duty Optimization", "Trade Consulting"]
    },
    {
      id: "supply-chain",
      title: "Supply Chain Solutions",
      icon: Activity,
      description: "End-to-end logistics design and management. We analyze your operations and build custom frameworks to reduce costs and improve efficiency.",
      features: ["Route Optimization", "Vendor Management", "4PL Services", "Risk Management"]
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-muted/20">
        <section className="bg-primary py-16 md:py-24 text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-lg md:text-xl text-primary-foreground/80">
              Comprehensive freight and logistics solutions tailored to meet the unique demands of your business.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => {
                const Icon = service.icon
                return (
                  <div key={service.id} className="bg-card border border-card-border rounded-xl p-8 shadow-sm hover:shadow-lg transition-all group">
                    <div className="h-14 w-14 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent group-hover:text-white transition-colors">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-primary mb-4">{service.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm font-medium text-primary/80">
                          <div className="h-1.5 w-1.5 rounded-full bg-accent mr-3 shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
