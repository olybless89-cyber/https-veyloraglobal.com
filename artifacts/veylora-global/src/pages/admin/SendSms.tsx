import * as React from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { MessageSquare, Send, CheckCircle, AlertCircle } from "lucide-react"

type Status = "idle" | "loading" | "success" | "error"

const MAX_LENGTH = 480 // ~3 SMS segments

export default function SendSms() {
  const [to, setTo] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [status, setStatus] = React.useState<Status>("idle")
  const [feedback, setFeedback] = React.useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setFeedback("")

    try {
      const res = await fetch("/api/admin/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, message }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus("error")
        setFeedback(data.error || "Failed to send SMS.")
      } else {
        setStatus("success")
        setFeedback(data.message || `SMS sent to ${to}`)
        setTo("")
        setMessage("")
      }
    } catch {
      setStatus("error")
      setFeedback("Network error. Please try again.")
    }
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <MessageSquare className="h-8 w-8" /> Send SMS
        </h1>
        <p className="text-muted-foreground mt-1">
          Send a text notification to any recipient — Nigerian numbers route through{" "}
          <span className="font-medium text-foreground">Termii</span>, everything else through{" "}
          <span className="font-medium text-foreground">Twilio</span>, automatically.
        </p>
      </div>

      <div className="max-w-xl">
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <form onSubmit={handleSubmit} className="divide-y">
            {/* To */}
            <div className="flex items-center gap-3 px-5 py-3">
              <span className="text-sm font-medium text-muted-foreground w-16 shrink-0">To</span>
              <input
                type="tel"
                value={to}
                onChange={e => setTo(e.target.value)}
                required
                placeholder="+234 801 234 5678"
                className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Message body */}
            <div className="px-5 py-4">
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value.slice(0, MAX_LENGTH))}
                required
                rows={6}
                placeholder="Write your message here..."
                className="w-full text-sm bg-transparent focus:outline-none resize-y placeholder:text-muted-foreground/50 leading-relaxed"
              />
              <div className="text-right text-xs text-muted-foreground mt-1">
                {message.length} / {MAX_LENGTH}
              </div>
            </div>

            {/* Feedback */}
            {status === "success" && (
              <div className="mx-5 mb-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-4 py-3">
                <CheckCircle className="h-4 w-4 shrink-0" />
                {feedback}
              </div>
            )}
            {status === "error" && (
              <div className="mx-5 mb-4 flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {feedback}
              </div>
            )}

            {/* Actions */}
            <div className="px-5 py-4 bg-muted/20 flex items-center justify-between">
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" />
                {status === "loading" ? "Sending…" : "Send SMS"}
              </button>
              <span className="text-xs text-muted-foreground">
                Termii (local) · Twilio (international)
              </span>
            </div>
          </form>
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Shipment status updates also trigger this automatically to the receiver's phone on file, when one is configured.
        </p>
      </div>
    </AdminLayout>
  )
}
