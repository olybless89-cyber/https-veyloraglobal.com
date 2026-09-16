import { useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSubmitContact } from "@workspace/api-client-react"
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const contactMutation = useSubmitContact()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    contactMutation.mutate({ data: formData }, {
      onSuccess: () => {
        setFormData({ name: "", email: "", subject: "", message: "" })
      }
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-muted/20 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions about our services or need support with an existing shipment? Our team is here to help 24/7.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Contact Info */}
            <div className="md:col-span-1 space-y-8">
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="h-12 w-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Global Headquarters</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  1200 Logistics Way, Suite 400<br/>
                  New York, NY 10001, USA
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="h-12 w-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-4">
                  <Phone className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Call Us</h3>
                <p className="text-muted-foreground text-sm mb-1">+1 (800) 555-0199 (Toll-Free)</p>
                <p className="text-muted-foreground text-sm">+1 (212) 555-0188 (Intl)</p>
              </div>

              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <div className="h-12 w-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">Email Us</h3>
                <p className="text-muted-foreground text-sm mb-1">support@veyloraglobal.com</p>
                <p className="text-muted-foreground text-sm">sales@veyloraglobal.com</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2 bg-card p-8 rounded-xl border shadow-sm">
              <h3 className="text-2xl font-bold text-primary mb-6">Send us a message</h3>
              
              {contactMutation.isSuccess ? (
                <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h4 className="text-xl font-bold mb-2">Message Sent!</h4>
                  <p>Thank you for reaching out. A member of our support team will get back to you shortly.</p>
                  <Button 
                    variant="outline" 
                    className="mt-6"
                    onClick={() => contactMutation.reset()}
                  >
                    Send another message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Your Name</label>
                      <Input 
                        placeholder="John Doe" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        className="bg-muted/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email Address</label>
                      <Input 
                        type="email" 
                        placeholder="john@example.com" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        className="bg-muted/50"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Subject</label>
                    <Input 
                      placeholder="How can we help?" 
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                      className="bg-muted/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message</label>
                    <Textarea 
                      placeholder="Provide details about your inquiry..." 
                      className="min-h-[150px] bg-muted/50 resize-y"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-bold" 
                    disabled={contactMutation.isPending}
                  >
                    {contactMutation.isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
