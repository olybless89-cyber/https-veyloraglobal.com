import * as React from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { Settings, Lock, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"
import { customFetch } from "@workspace/api-client-react"

function useChangePassword() {
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = React.useState("")

  const mutate = async (data: { currentPassword: string; newPassword: string }) => {
    setStatus("loading")
    setErrorMsg("")
    try {
      await customFetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      setStatus("success")
    } catch (err: unknown) {
      setStatus("error")
      if (err && typeof err === "object" && "message" in err) {
        setErrorMsg((err as { message: string }).message)
      } else {
        setErrorMsg("Failed to change password.")
      }
    }
  }

  const reset = () => { setStatus("idle"); setErrorMsg("") }

  return { mutate, status, errorMsg, reset }
}

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showCurrent, setShowCurrent] = React.useState(false)
  const [showNew, setShowNew] = React.useState(false)
  const [showConfirm, setShowConfirm] = React.useState(false)
  const [validationError, setValidationError] = React.useState("")
  const { mutate, status, errorMsg, reset } = useChangePassword()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError("")
    reset()

    if (newPassword.length < 6) {
      setValidationError("New password must be at least 6 characters.")
      return
    }
    if (newPassword !== confirmPassword) {
      setValidationError("New passwords do not match.")
      return
    }
    mutate({ currentPassword, newPassword })
  }

  React.useEffect(() => {
    if (status === "success") {
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }
  }, [status])

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <Settings className="h-8 w-8" /> Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage your account settings.</p>
      </div>

      <div className="max-w-lg">
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-muted/30 flex items-center gap-3">
            <Lock className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-primary">Change Password</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                  className="w-full border rounded-md px-3 py-2 pr-10 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full border rounded-md px-3 py-2 pr-10 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="At least 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  className="w-full border rounded-md px-3 py-2 pr-10 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Repeat new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Validation error */}
            {validationError && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {validationError}
              </div>
            )}

            {/* API error */}
            {status === "error" && (
              <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {errorMsg || "Failed to change password."}
              </div>
            )}

            {/* Success */}
            {status === "success" && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                <CheckCircle className="h-4 w-4 shrink-0" />
                Password changed successfully!
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-primary text-primary-foreground font-semibold py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
