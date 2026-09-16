import { Switch, Route, Router as WouterRouter } from "wouter"
import { QueryClient, QueryClientProvider, MutationCache } from "@tanstack/react-query"
import { Toaster } from "@/components/ui/toaster"
import { toast } from "@/hooks/use-toast"
import { TooltipProvider } from "@/components/ui/tooltip"

import Home from "@/pages/Home"
import About from "@/pages/About"
import Services from "@/pages/Services"
import Track from "@/pages/Track"
import Contact from "@/pages/Contact"
import GetQuote from "@/pages/GetQuote"
import NotFound from "@/pages/not-found"

import AdminLogin from "@/pages/admin/Login"
import Dashboard from "@/pages/admin/Dashboard"
import Shipments from "@/pages/admin/Shipments"
import ShipmentDetail from "@/pages/admin/ShipmentDetail"
import Officers from "@/pages/admin/Officers"
import Offices from "@/pages/admin/Offices"
import SettingsPage from "@/pages/admin/Settings"
import SendEmail from "@/pages/admin/SendEmail"
import SendSms from "@/pages/admin/SendSms"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
  // Global safety net: every mutation across the admin panel (create/update/
  // delete shipment, officer, office, tracking update, etc.) previously had
  // no onError handler at all — failures (401s, 500s, validation errors)
  // happened completely silently with zero feedback. This shows a toast for
  // ANY mutation failure app-wide, so a broken action is now always visible
  // instead of just doing nothing. A page can still add its own onError for
  // a more specific message; this is just the fallback.
  mutationCache: new MutationCache({
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Action failed",
        description: error?.message || "Something went wrong. Please try again.",
      })
    },
  }),
})

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/track" component={Track} />
      <Route path="/contact" component={Contact} />
      <Route path="/get-quote" component={GetQuote} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={Dashboard} />
      <Route path="/admin/shipments" component={Shipments} />
      <Route path="/admin/shipments/:id" component={ShipmentDetail} />
      <Route path="/admin/officers" component={Officers} />
      <Route path="/admin/offices" component={Offices} />
      <Route path="/admin/settings" component={SettingsPage} />
      <Route path="/admin/send-email" component={SendEmail} />
      <Route path="/admin/send-sms" component={SendSms} />

      <Route component={NotFound} />
    </Switch>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
