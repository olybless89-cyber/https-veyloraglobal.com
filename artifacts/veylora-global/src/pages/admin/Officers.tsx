import { AdminLayout } from "@/components/layout/AdminLayout"
import { useListOfficers, useCreateOfficer, useDeleteOfficer, getListOfficersQueryKey } from "@workspace/api-client-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Users, UserPlus } from "lucide-react"
import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"

export default function Officers() {
  const { data: officers, isLoading } = useListOfficers()
  const createMutation = useCreateOfficer()
  const deleteMutation = useDeleteOfficer()
  const queryClient = useQueryClient()
  
  const [isAdding, setIsAdding] = useState(false)
  const [formData, setFormData] = useState({
    officerName: "",
    offPwd: "",
    address: "",
    email: "",
    phNo: "",
    office: ""
  })

  const handleDelete = (id: number) => {
    if (confirm("Delete this officer?")) {
      deleteMutation.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getListOfficersQueryKey() })
      })
    }
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate({ data: formData }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListOfficersQueryKey() })
        setIsAdding(false)
        setFormData({ officerName: "", offPwd: "", address: "", email: "", phNo: "", office: "" })
      }
    })
  }

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary">Manage Officers</h1>
          <p className="text-muted-foreground mt-1">Staff accounts and branch assignments.</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="font-bold flex items-center gap-2">
            <UserPlus className="h-5 w-5" /> Add Officer
          </Button>
        )}
      </div>

      {isAdding && (
        <div className="bg-card border rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">New Officer Details</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input value={formData.officerName} onChange={e => setFormData({...formData, officerName: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Password</label>
                <Input type="password" value={formData.offPwd} onChange={e => setFormData({...formData, offPwd: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input value={formData.phNo} onChange={e => setFormData({...formData, phNo: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Branch/Office</label>
                <Input value={formData.office} onChange={e => setFormData({...formData, office: e.target.value})} required />
              </div>
              <div className="space-y-2 lg:col-span-3">
                <label className="text-sm font-medium">Address</label>
                <Input value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-4">
              <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Saving..." : "Save Officer"}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Reg Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading officers...</td></tr>
              ) : officers && officers.length > 0 ? (
                officers.map((officer) => (
                  <tr key={officer.id} className="hover:bg-muted/20">
                    <td className="px-6 py-4 font-medium">{officer.officerName}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-muted-foreground">{officer.email}</div>
                      <div>{officer.phNo}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold">{officer.office}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{officer.regDate}</td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => handleDelete(officer.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No officers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
