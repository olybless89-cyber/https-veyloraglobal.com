import { AdminLayout } from "@/components/layout/AdminLayout"
import { useListOffices, useCreateOffice, useDeleteOffice, getListOfficesQueryKey } from "@workspace/api-client-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Building2 } from "lucide-react"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

export default function Offices() {
  const { data: offices, isLoading } = useListOffices()
  const createMutation = useCreateOffice()
  const deleteMutation = useDeleteOffice()
  const queryClient = useQueryClient()
  
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    offName: "",
    address: "",
    city: "",
    phNo: "",
    officeTime: "",
    contactPerson: ""
  })

  const handleDelete = (id: number) => {
    if (confirm("Delete this office location?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListOfficesQueryKey() })
      })
    }
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({ data: formData }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOfficesQueryKey() })
        setIsAdding(false)
        setFormData({ offName: "", address: "", city: "", phNo: "", officeTime: "", contactPerson: "" })
      }
    })
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Manage Offices</h1>
          <p className="text-muted-foreground mt-1">Global branch locations and contact details.</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="font-bold flex items-center gap-2">
            <Building2 className="h-5 w-5" /> Add Office
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="bg-card border rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">New Office Location</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Branch Name</label>
                <Input value={formData.offName} onChange={e => setFormData({...formData, offName: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Person</label>
                <Input value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <Input value={formData.phNo} onChange={e => setFormData({...formData, phNo: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Office Hours</label>
                <Input placeholder="e.g. 09:00 AM - 06:00 PM" value={formData.officeTime} onChange={e => setFormData({...formData, officeTime: e.target.value})} required />
              </div>
              <div className="space-y-2 lg:col-span-3">
                <label className="text-sm font-medium">Full Address</label>
                <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Saving..." : "Save Office"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full p-12 text-center text-muted-foreground">Loading offices...</div>
        ) : offices && offices.length > 0 ? (
          offices.map((office) => (
            <div key={office.id} className="bg-card border rounded-xl shadow-sm p-6 relative group">
              <Button 
                variant="ghost" 
                size="icon"
                className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => handleDelete(office.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              
              <div className="h-10 w-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-4">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold mb-1">{office.offName}</h3>
              <p className="text-muted-foreground text-sm mb-4">{office.city}</p>
              
              <div className="space-y-2 text-sm border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contact:</span>
                  <span className="font-medium">{office.contactPerson}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone:</span>
                  <span className="font-medium">{office.phNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hours:</span>
                  <span className="font-medium">{office.officeTime}</span>
                </div>
                <div className="pt-2 text-muted-foreground">
                  {office.address}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full p-12 text-center text-muted-foreground bg-card border rounded-xl">
            No office locations found.
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
