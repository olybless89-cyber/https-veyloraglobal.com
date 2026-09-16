import { useState, useEffect, useRef } from "react"
import { useLocation } from "wouter"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LiveMap } from "@/components/map/LiveMap"
import { useTrackShipment } from "@workspace/api-client-react"
import { Package, Search, MapPin, Calendar, Box, Weight, Clock, Info, CheckCircle2, AlertCircle, Ship, Radio } from "lucide-react"
import { format } from "date-fns"

const LIVE_REFRESH_INTERVAL_MS = 20_000

export default function Track() {
  const [location] = useLocation()
  const searchParams = new URLSearchParams(window.location.search)
  const initialConsNo = searchParams.get("consNo") || ""
  
  const [consNo, setConsNo] = useState(initialConsNo)
  const trackMutation = useTrackShipment()

  useEffect(() => {
    if (initialConsNo) {
      trackMutation.mutate({ data: { consNo: initialConsNo } })
    }
  }, [initialConsNo])

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (!consNo.trim()) return

    // Update URL without full reload
    window.history.pushState({}, '', `/track?consNo=${encodeURIComponent(consNo)}`)
    trackMutation.mutate({ data: { consNo } })
  }

  const trackingData = trackMutation.data
  const isLoading = trackMutation.isPending
  const isError = trackMutation.isError

  // Live refresh: silently re-fetch the tracked shipment on an interval so
  // an admin-updated live location (or new status) shows up without the
  // visitor having to resubmit the form.
  const trackedConsNo = trackingData?.courier?.consNo
  const trackMutationRef = useRef(trackMutation)
  trackMutationRef.current = trackMutation
  useEffect(() => {
    if (!trackedConsNo) return
    const id = window.setInterval(() => {
      trackMutationRef.current.mutate({ data: { consNo: trackedConsNo } })
    }, LIVE_REFRESH_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [trackedConsNo])

  const lat = trackingData?.courier?.lat ? parseFloat(trackingData.courier.lat) : NaN
  const lng = trackingData?.courier?.lon ? parseFloat(trackingData.courier.lon) : NaN
  const hasLiveLocation = Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 bg-muted/20 pb-20">
        {/* Header */}
        <section className="bg-primary pt-16 pb-24 text-primary-foreground">
          <div className="container mx-auto px-4 md:px-6 text-center max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">Track Your Shipment</h1>
            <p className="text-primary-foreground/80 mb-8">
              Enter your consignment tracking number below to see real-time updates on your cargo.
            </p>
            
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-xl shadow-lg">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Enter Consignment No (e.g. SC-123456)" 
                  className="w-full h-14 pl-12 text-lg border-0 bg-transparent focus-visible:ring-0 text-foreground"
                  value={consNo}
                  onChange={(e) => setConsNo(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" variant="accent" size="lg" className="h-14 px-8 font-bold text-lg rounded-lg" disabled={isLoading}>
                {isLoading ? "Tracking..." : "Track"}
              </Button>
            </form>
          </div>
        </section>

        {/* Results */}
        <div className="container mx-auto px-4 md:px-6 -mt-10 relative z-10">
          
          {isError && (
            <div className="bg-destructive/10 border border-destructive/20 text-destructive p-6 rounded-xl max-w-3xl mx-auto flex items-start gap-4 shadow-sm bg-white">
              <AlertCircle className="h-6 w-6 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-lg mb-1">Tracking Not Found</h3>
                <p>We couldn't find any shipment matching the consignment number "{consNo}". Please check the number and try again.</p>
              </div>
            </div>
          )}

          {trackingData && trackingData.courier && hasLiveLocation && (
            <div className="bg-card border rounded-xl shadow-sm overflow-hidden mb-8 max-w-5xl mx-auto">
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="font-bold text-lg text-primary flex items-center gap-2">
                  <Radio className="h-5 w-5 text-accent" /> Live Location
                </h3>
                <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse" /> Auto-refreshing
                </span>
              </div>
              <div className="h-80">
                <LiveMap lat={lat} lng={lng} label={`${trackingData.courier.consNo} — ${trackingData.courier.status}`} />
              </div>
            </div>
          )}

          {trackingData && trackingData.courier && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Shipment Details Column */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b pb-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Consignment No</p>
                      <p className="text-xl font-bold text-primary font-mono">{trackingData.courier.consNo}</p>
                    </div>
                    <div className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wider">
                      {trackingData.courier.status}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Origin</p>
                        <p className="font-medium text-primary">{trackingData.courier.origin}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Destination</p>
                        <p className="font-medium text-primary">{trackingData.courier.destination}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border rounded-xl p-6 shadow-sm">
                  <h4 className="font-bold text-lg mb-4 text-primary flex items-center gap-2">
                    <Package className="h-5 w-5" /> Cargo Details
                  </h4>
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1 flex items-center gap-1"><Box className="h-3.5 w-3.5" /> Product</p>
                      <p className="font-medium">{trackingData.courier.product}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1 flex items-center gap-1"><Info className="h-3.5 w-3.5" /> Type</p>
                      <p className="font-medium">{trackingData.courier.type}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1 flex items-center gap-1"><Weight className="h-3.5 w-3.5" /> Weight</p>
                      <p className="font-medium">{trackingData.courier.weight}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1 flex items-center gap-1"><Box className="h-3.5 w-3.5" /> Qty</p>
                      <p className="font-medium">{trackingData.courier.qty} pieces</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Pick Date</p>
                      <p className="font-medium">{trackingData.courier.pickDate}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1 flex items-center gap-1"><Ship className="h-3.5 w-3.5" /> Mode</p>
                      <p className="font-medium">{trackingData.courier.mode}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tracking Timeline Column */}
              <div className="lg:col-span-2">
                <div className="bg-card border rounded-xl p-6 md:p-8 shadow-sm h-full">
                  <h3 className="text-2xl font-bold text-primary mb-8 border-b pb-4">Tracking History</h3>
                  
                  {trackingData.updates && trackingData.updates.length > 0 ? (
                    <div className="relative pl-8 space-y-10 before:absolute before:inset-y-0 before:left-[11px] before:w-0.5 before:bg-muted-foreground/20 pb-4">
                      {trackingData.updates.map((update, index) => {
                        const isLatest = index === 0;
                        return (
                          <div key={update.id} className="relative">
                            <div className={`absolute -left-10 mt-1.5 h-4 w-4 rounded-full border-2 bg-white ${isLatest ? 'border-accent shadow-[0_0_0_4px_rgba(242,106,33,0.2)]' : 'border-muted-foreground'}`} />
                            
                            <div className="bg-muted/30 p-5 rounded-lg border border-border">
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                <span className={`font-bold text-lg ${isLatest ? 'text-accent' : 'text-primary'}`}>
                                  {update.newStatus}
                                </span>
                                <div className="flex items-center text-sm font-medium text-muted-foreground bg-white px-3 py-1 rounded-md border">
                                  <Clock className="h-4 w-4 mr-2" />
                                  {update.updateDate} {update.bkTime}
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2 mb-3 text-primary font-medium">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                {update.currentLocation}, {update.currentCity}
                              </div>
                              
                              {update.comments && (
                                <p className="text-muted-foreground text-sm border-t pt-3 mt-3">
                                  {update.comments}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Clock className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p className="text-lg">No tracking updates available yet.</p>
                      <p className="text-sm">Please check back later for movement details.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
