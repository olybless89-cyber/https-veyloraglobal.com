import { useState } from "react"
import { useLocation } from "wouter"
import { useLogin, useGetSession } from "@workspace/api-client-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Package, Lock, AlertCircle } from "lucide-react"
import { useSiteSettings } from "@/lib/site-settings"

export default function AdminLogin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const [, setLocation] = useLocation()
  const loginMutation = useLogin()
  const { data: settings } = useSiteSettings()
  
  // If already logged in, redirect
  const { data: session } = useGetSession()
  if (session?.authenticated) {
    setLocation("/admin")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    loginMutation.mutate(
      { data: { username, password } },
      {
        onSuccess: (data) => {
          if (data.success) {
            setLocation("/admin")
          } else {
            setError("Invalid credentials")
          }
        },
        onError: (err: any) => {
          // Surface the real error (network/server failure vs actual bad
          // credentials) instead of always showing a generic message —
          // this was previously masking real 500s as "wrong password".
          if (err?.status === 401) {
            setError("Invalid username or password")
          } else if (err?.message) {
            setError(err.message)
          } else {
            setError("Something went wrong — please try again")
          }
        }
      }
    )
  }

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-2xl overflow-hidden border border-card-border">
        <div className="p-8 pb-6 text-center border-b">
          <div className="bg-accent/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Package className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-primary">Admin Portal</h1>
          <p className="text-muted-foreground text-sm mt-1">{settings.site_name} Operations Management</p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-6 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary">Username</label>
              <Input 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-12 bg-muted/50"
                placeholder="Enter admin username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-primary">Password</label>
              <div className="relative">
                <Input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-muted/50 pr-10"
                  placeholder="Enter password"
                />
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 font-bold mt-2" 
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Authenticating..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>Default credentials:</p>
            <p className="font-mono mt-1 bg-muted inline-block px-3 py-1 rounded">admin / admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}
