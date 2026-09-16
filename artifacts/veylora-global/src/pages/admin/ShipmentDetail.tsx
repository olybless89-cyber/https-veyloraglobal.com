import { useState, useEffect } from "react"
import { useRoute, useLocation } from "wouter"
import { 
  useGetCourier, 
  useCreateCourier, 
  useUpdateCourier, 
  useListTrackUpdates, 
  useAddTrackUpdate, 
  useDeleteTrackUpdate,
  getGetCourierQueryKey,
  getListCouriersQueryKey,
  getListTrackUpdatesQueryKey
} from "@workspace/api-client-react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Save, Plus, Trash2, MapPin, Clock, History, Package } from "lucide-react"

export default function ShipmentDetail() {
  const [, params] = useRoute("/admin/shipments/:id")
  const [, setLocation] = useLocation()
  const queryClient = useQueryClient()
  
  const id = params?.id
  const isNew = !id || id === "new"
  const numericId = isNew ? 0 : parseInt(id, 10)

  // Fetch Shipment
  const { data: shipment, isLoading: isLoadingShipment } = useGetCourier(numericId, { 
    query: { enabled: !isNew && !isNaN(numericId), queryKey: getGetCourierQueryKey(numericId) } 
  })

  // Mutations
  const createMutation = useCreateCourier()
  const updateMutation = useUpdateCourier()

  // Form State
  const [formData, setFormData] = useState({
    consNo: "", sName: "", sMail: "", sPhone: "", sAdd: "",
    rName: "", rMail: "", rPhone: "", rAdd: "",
    type: "", weight: "", invoiceNo: "", qty: 1, freight: "",
    mode: "", pmode: "", pickDate: "", deptDate: "",
    status: "", product: "", origin: "", destination: ""
  })

  // Update form when data loads
  useEffect(() => {
    if (shipment && !isNew) {
      setFormData({
        consNo: shipment.consNo || "",
        sName: shipment.sName || "",
        sMail: shipment.sMail || "",
        sPhone: shipment.sPhone || "",
        sAdd: shipment.sAdd || "",
        rName: shipment.rName || "",
        rMail: shipment.rMail || "",
        rPhone: shipment.rPhone || "",
        rAdd: shipment.rAdd || "",
        type: shipment.type || "",
        weight: shipment.weight || "",
        invoiceNo: shipment.invoiceNo || "",
        qty: shipment.qty || 1,
        freight: shipment.freight || "",
        mode: shipment.mode || "",
        pmode: shipment.pmode || "",
        pickDate: shipment.pickDate || "",
        deptDate: shipment.deptDate || "",
        status: shipment.status || "",
        product: shipment.product || "",
        origin: shipment.origin || "",
        destination: shipment.destination || ""
      })
    }
  }, [shipment, isNew])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (isNew) {
      createMutation.mutate({ data: formData }, {
        onSuccess: (newShipment) => {
          queryClient.invalidateQueries({ queryKey: getListCouriersQueryKey() })
          setLocation(`/admin/shipments/${newShipment.id}`)
        }
      })
    } else {
      updateMutation.mutate({ id: numericId, data: formData }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCourierQueryKey(numericId) })
          queryClient.invalidateQueries({ queryKey: getListCouriersQueryKey() })
          alert("Shipment updated successfully")
        }
      })
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Tracking Updates Section
  const { data: trackUpdates, isLoading: isLoadingUpdates } = useListTrackUpdates(shipment?.consNo || "", {
    query: { enabled: !!shipment?.consNo, queryKey: getListTrackUpdatesQueryKey(shipment?.consNo || "") }
  })
  
  const addTrackMutation = useAddTrackUpdate()
  const deleteTrackMutation = useDeleteTrackUpdate()

  const [trackForm, setTrackForm] = useState({
    updateDate: "",
    currentCity: "",
    newStatus: "",
    comments: "",
    currentLocation: "",
    bkTime: ""
  })

  const handleAddTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (!shipment?.consNo) return
    addTrackMutation.mutate({ consNo: shipment.consNo, data: trackForm }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListTrackUpdatesQueryKey(shipment.consNo) })
        setTrackForm({
          updateDate: "", currentCity: "", newStatus: "", comments: "", currentLocation: "", bkTime: ""
        })
      }
    })
  }

  const handleDeleteTrack = (trackId: number) => {
    if (confirm("Delete this update?")) {
      deleteTrackMutation.mutate({ id: trackId }, {
        onSuccess: () => {
          if (shipment?.consNo) {
            queryClient.invalidateQueries({ queryKey: getListTrackUpdatesQueryKey(shipment.consNo) })
          }
        }
      })
    }
  }

  if (!isNew && (isLoadingShipment || !shipment)) {
    return (
      <AdminLayout>
        <div className="p-8 text-muted-foreground">
          {isLoadingShipment ? "Loading shipment details…" : "Shipment not found."}
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => setLocation("/admin/shipments")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-primary">{isNew ? "Create Shipment" : `Shipment: ${shipment?.consNo}`}</h1>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="bg-card border rounded-xl shadow-sm p-6 space-y-8">
            {/* Essential */}
            <div>
              <h3 className="text-lg font-bold border-b pb-2 mb-4 text-primary flex items-center gap-2">
                <Package className="h-5 w-5" /> Basic Info
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Consignment No</label>
                  <Input value={formData.consNo} onChange={(e) => handleChange("consNo", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Input value={formData.status} onChange={(e) => handleChange("status", e.target.value)} required placeholder="e.g. In Transit" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Origin</label>
                  <Input value={formData.origin} onChange={(e) => handleChange("origin", e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Destination</label>
                  <Input value={formData.destination} onChange={(e) => handleChange("destination", e.target.value)} required />
                </div>
              </div>
            </div>

            {/* Sender / Receiver */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold border-b pb-2 text-primary">Sender Details</h3>
                <Input placeholder="Name" value={formData.sName} onChange={(e) => handleChange("sName", e.target.value)} required />
                <Input placeholder="Email" type="email" value={formData.sMail} onChange={(e) => handleChange("sMail", e.target.value)} />
                <Input placeholder="Phone" value={formData.sPhone} onChange={(e) => handleChange("sPhone", e.target.value)} />
                <Textarea placeholder="Address" value={formData.sAdd} onChange={(e) => handleChange("sAdd", e.target.value)} />
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-bold border-b pb-2 text-primary">Receiver Details</h3>
                <Input placeholder="Name" value={formData.rName} onChange={(e) => handleChange("rName", e.target.value)} required />
                <Input placeholder="Email" type="email" value={formData.rMail} onChange={(e) => handleChange("rMail", e.target.value)} />
                <Input placeholder="Phone" value={formData.rPhone} onChange={(e) => handleChange("rPhone", e.target.value)} />
                <Textarea placeholder="Address" value={formData.rAdd} onChange={(e) => handleChange("rAdd", e.target.value)} />
              </div>
            </div>

            {/* Cargo Specs */}
            <div>
              <h3 className="text-lg font-bold border-b pb-2 mb-4 text-primary">Cargo Specs</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product</label>
                  <Input value={formData.product} onChange={(e) => handleChange("product", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Input value={formData.type} onChange={(e) => handleChange("type", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Weight</label>
                  <Input value={formData.weight} onChange={(e) => handleChange("weight", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quantity</label>
                  <Input type="number" value={formData.qty} onChange={(e) => handleChange("qty", parseInt(e.target.value))} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mode</label>
                  <Input value={formData.mode} onChange={(e) => handleChange("mode", e.target.value)} placeholder="Air/Sea/Road" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Mode</label>
                  <Input value={formData.pmode} onChange={(e) => handleChange("pmode", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pick Date</label>
                  <Input type="date" value={formData.pickDate} onChange={(e) => handleChange("pickDate", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dept Date</label>
                  <Input type="date" value={formData.deptDate} onChange={(e) => handleChange("deptDate", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Invoice No</label>
                  <Input value={formData.invoiceNo} onChange={(e) => handleChange("invoiceNo", e.target.value)} />
                </div>
              </div>
            </div>

            <Button type="submit" size="lg" className="font-bold w-full md:w-auto" disabled={createMutation.isPending || updateMutation.isPending}>
              <Save className="h-5 w-5 mr-2" />
              {isNew ? "Create Shipment" : "Save Changes"}
            </Button>
          </form>
        </div>

        {/* Tracking Updates Sidebar (Only if not new) */}
        {!isNew && (
          <div className="space-y-6">
            {/* Add Update Form */}
            <div className="bg-card border rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold border-b pb-2 mb-4 text-primary flex items-center gap-2">
                <Plus className="h-5 w-5" /> Add Tracking Update
              </h3>
              <form onSubmit={handleAddTrack} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Date</label>
                    <Input type="date" value={trackForm.updateDate} onChange={(e) => setTrackForm({...trackForm, updateDate: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Time</label>
                    <Input type="time" value={trackForm.bkTime} onChange={(e) => setTrackForm({...trackForm, bkTime: e.target.value})} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">New Status</label>
                  <Input value={trackForm.newStatus} onChange={(e) => setTrackForm({...trackForm, newStatus: e.target.value})} required placeholder="e.g. Arrived at Hub" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Location</label>
                    <Input value={trackForm.currentLocation} onChange={(e) => setTrackForm({...trackForm, currentLocation: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium">City</label>
                    <Input value={trackForm.currentCity} onChange={(e) => setTrackForm({...trackForm, currentCity: e.target.value})} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium">Comments</label>
                  <Textarea value={trackForm.comments} onChange={(e) => setTrackForm({...trackForm, comments: e.target.value})} className="h-20" />
                </div>
                <Button type="submit" variant="accent" className="w-full font-bold" disabled={addTrackMutation.isPending}>
                  Post Update
                </Button>
              </form>
            </div>

            {/* History List */}
            <div className="bg-card border rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold border-b pb-2 mb-4 text-primary flex items-center gap-2">
                <History className="h-5 w-5" /> Timeline
              </h3>
              
              <div className="space-y-4">
                {isLoadingUpdates ? (
                  <div className="text-center text-sm text-muted-foreground py-4">Loading updates...</div>
                ) : trackUpdates && trackUpdates.length > 0 ? (
                  <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-2 before:w-0.5 before:bg-muted-foreground/20">
                    {trackUpdates.map((update) => (
                      <div key={update.id} className="relative group">
                        <div className="absolute -left-6 mt-1.5 h-3 w-3 rounded-full border-2 border-primary bg-white" />
                        <div className="bg-muted/30 p-3 rounded border text-sm relative">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-white opacity-0 group-hover:opacity-100 hover:bg-destructive/90"
                            onClick={() => handleDeleteTrack(update.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <div className="font-bold text-primary mb-1">{update.newStatus}</div>
                          <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {update.updateDate} {update.bkTime}
                          </div>
                          <div className="flex items-center gap-1 text-xs font-medium">
                            <MapPin className="h-3 w-3 text-accent" /> {update.currentLocation}, {update.currentCity}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-4">No tracking history yet.</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
