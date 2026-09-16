import * as React from "react"
import { Link, useLocation } from "wouter"
import { useGetSession, useLogout } from "@workspace/api-client-react"
import { Package, LayoutDashboard, Truck, Users, Building, LogOut, Menu, X, Loader2, Settings, Mail, MessageSquare } from "lucide-react"

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation()
  const { data: session, isLoading } = useGetSession()
  const logout = useLogout()
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

  React.useEffect(() => {
    if (!isLoading && (!session || !session.authenticated)) {
      setLocation("/admin/login")
    }
  }, [session, isLoading, setLocation])

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        setLocation("/admin/login")
      }
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session?.authenticated) {
    return null
  }

  const links = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/shipments", label: "Shipments", icon: Truck },
    { href: "/admin/officers", label: "Officers", icon: Users },
    { href: "/admin/offices", label: "Offices", icon: Building },
    { href: "/admin/send-email", label: "Send Email", icon: Mail },
    { href: "/admin/send-sms", label: "Send SMS", icon: MessageSquare },
    { href: "/admin/settings", label: "Settings", icon: Settings },
  ]

  const isActive = (href: string) => {
    if (href === "/admin") return location === "/admin"
    return location.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden bg-primary text-primary-foreground p-4 flex items-center justify-between z-20 sticky top-0">
        <Link href="/admin" className="flex items-center gap-2">
          <Package className="h-6 w-6 text-accent" />
          <span className="font-bold">Veylora Admin</span>
        </Link>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-sidebar text-sidebar-foreground z-10 transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-6 hidden md:block">
          <Link href="/admin" className="flex items-center gap-2">
            <Package className="h-8 w-8 text-sidebar-primary" />
            <span className="font-bold tracking-tight text-xl">Veylora Admin</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6 md:py-0 space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            const active = isActive(link.href)
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-md transition-colors
                  ${active ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"}
                `}
              >
                <Icon className={`h-5 w-5 ${active ? "text-sidebar-primary" : ""}`} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border mt-auto">
          <div className="mb-4 px-3 text-sm text-sidebar-foreground/60">
            Logged in as <span className="font-medium text-sidebar-foreground">{session.username}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 w-full overflow-x-hidden">
        {children}
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-0 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}
