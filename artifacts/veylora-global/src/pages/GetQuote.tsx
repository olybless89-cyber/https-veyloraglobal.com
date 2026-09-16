import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function GetQuote() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert("Quote request submitted! We will contact you shortly.")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-muted/20 py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-card border rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-primary p-8 text-primary-foreground text-center">
              <h1 className="text-3xl font-bold mb-2">Request a Freight Quote</h1>
              <p className="text-primary-foreground/80">Fill out the details below and our logistics experts will provide a competitive rate.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Personal Info */}
              <div>
                <h3 className="text-lg font-bold border-b pb-2 mb-4 text-primary">1. Contact Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <Input required placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Company (Optional)</label>
                    <Input placeholder="Acme Corp" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <Input type="email" required placeholder="john@example.com" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <Input required placeholder="+1 234 567 8900" />
                  </div>
                </div>
              </div>

              {/* Shipment Route */}
              <div>
                <h3 className="text-lg font-bold border-b pb-2 mb-4 text-primary">2. Route Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Origin City/Country</label>
                    <Input required placeholder="Shanghai, China" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Destination City/Country</label>
                    <Input required placeholder="Los Angeles, USA" />
                  </div>
                </div>
              </div>

              {/* Cargo Details */}
              <div>
                <h3 className="text-lg font-bold border-b pb-2 mb-4 text-primary">3. Cargo Details</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Service Type</label>
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required>
                      <option value="">Select Service</option>
                      <option value="air">Air Freight</option>
                      <option value="ocean">Ocean Freight (FCL/LCL)</option>
                      <option value="road">Road Delivery</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Total Weight (kg)</label>
                    <Input type="number" required placeholder="500" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Total Pieces</label>
                    <Input type="number" required placeholder="10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Commodity Description</label>
                  <Textarea required placeholder="E.g. Electronics, machinery parts..." />
                </div>
              </div>

              <Button type="submit" size="xl" variant="accent" className="w-full font-bold">
                Submit Request
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
