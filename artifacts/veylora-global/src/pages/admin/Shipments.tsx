import { AdminLayout } from "@/components/layout/AdminLayout"
import { useListCouriers, useDeleteCourier, getListCouriersQueryKey } from "@workspace/api-client-react"
import { Link } from "wouter"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, Eye, Search } from "lucide-react"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

export default function Shipments() {
  const { data: shipments, isLoading } = useListCouriers()
  const deleteMutation = useDeleteCourier()
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState("")

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this shipment? This cannot be undone.")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCouriersQueryKey() })
        }
      })
    }
  }

  const filteredShipments = shipments?.filter(s => 
    s.consNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.sName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Manage Shipments</h1>
          <p className="text-muted-foreground mt-1">View, track, and manage all cargo operations.</p>
        </div>
        <Link href="/admin/shipments/new">
          <Button className="font-bold flex items-center gap-2">
            <Plus className="h-5 w-5" /> Create Shipment
          </Button>
        </Link>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b bg-muted/20">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search by Consignment No, Sender, or Receiver..."
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4">Cons. No</th>
                <th className="px-6 py-4">Sender</th>
                <th className="px-6 py-4">Receiver</th>
                <th className="px-6 py-4">Route</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Loading shipments...</td></tr>
              ) : filteredShipments.length > 0 ? (
                filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium">{shipment.consNo}</td>
                    <td className="px-6 py-4">{shipment.sName}</td>
                    <td className="px-6 py-4">{shipment.rName}</td>
                    <td className="px-6 py-4 text-xs">
                      <span className="text-muted-foreground">{shipment.origin}</span>
                      <span className="mx-1">→</span>
                      <span className="text-primary">{shipment.destination}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 rounded bg-accent/10 text-accent text-xs font-bold uppercase tracking-wider">
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/admin/shipments/${shipment.id}`}>
                        <Button variant="outline" size="sm" className="h-8">
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                      </Link>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="h-8"
                        onClick={() => handleDelete(shipment.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No shipments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
