import { AdminLayout } from "@/components/layout/AdminLayout"
import { useGetDashboardStats } from "@workspace/api-client-react"
import { Package, Truck, MapPin, Users, Building, Activity, ArrowRight } from "lucide-react"
import { Link } from "wouter"

export default function Dashboard() {
  const { data: stats, isLoading } = useGetDashboardStats()

  if (isLoading || !stats) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="h-32 bg-muted rounded-xl"></div>)}
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Real-time logistics statistics and operations.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
              <Package className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground">Total Shipments</p>
          <h3 className="text-3xl font-black text-primary mt-1">{stats.totalShipments}</h3>
        </div>

        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-accent/10 text-accent rounded-lg flex items-center justify-center">
              <Truck className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground">In Transit</p>
          <h3 className="text-3xl font-black text-primary mt-1">{stats.inTransit}</h3>
        </div>

        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 bg-green-500/10 text-green-600 rounded-lg flex items-center justify-center">
              <MapPin className="h-6 w-6" />
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground">Delivered</p>
          <h3 className="text-3xl font-black text-primary mt-1">{stats.delivered}</h3>
        </div>

        <div className="bg-card border rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex space-x-2">
              <div className="h-12 w-12 bg-blue-500/10 text-blue-600 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6" />
              </div>
              <div className="h-12 w-12 bg-purple-500/10 text-purple-600 rounded-lg flex items-center justify-center">
                <Building className="h-6 w-6" />
              </div>
            </div>
          </div>
          <p className="text-sm font-medium text-muted-foreground">Staff & Offices</p>
          <h3 className="text-3xl font-black text-primary mt-1">{stats.totalOfficers} / {stats.totalOffices}</h3>
        </div>
      </div>

      {/* Recent Shipments */}
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between bg-muted/30">
          <h3 className="text-lg font-bold text-primary flex items-center gap-2">
            <Activity className="h-5 w-5" /> Recent Shipments
          </h3>
          <Link href="/admin/shipments" className="text-sm font-medium text-accent hover:underline flex items-center">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-4">Consignment No</th>
                <th className="px-6 py-4">Sender</th>
                <th className="px-6 py-4">Receiver</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.recentShipments && stats.recentShipments.length > 0 ? (
                stats.recentShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-primary">
                      <Link href={`/admin/shipments/${shipment.id}`} className="hover:text-accent hover:underline">
                        {shipment.consNo}
                      </Link>
                    </td>
                    <td className="px-6 py-4">{shipment.sName}</td>
                    <td className="px-6 py-4">{shipment.rName}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 rounded bg-muted text-xs font-bold uppercase tracking-wider text-muted-foreground border">
                        {shipment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{shipment.pickDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No recent shipments found.
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
