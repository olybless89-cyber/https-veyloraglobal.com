import * as React from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { Mail, Send, CheckCircle, AlertCircle } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { customFetch } from "@workspace/api-client-react"

type Status = "idle" | "loading" | "success" | "error"

export default function SendEmail() {
  const [to, setTo] = React.useState("")
  const [subject, setSubject] = React.useState("")
  const [message, setMessage] = React.useState("")
  const [status, setStatus] = React.useState<Status>("idle")
  const [feedback, setFeedback] = React.useState("")

  const { data: adminSettings } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => customFetch<{ integrations: Array<{ key: string; value: string }> }>("/api/admin/settings"),
    staleTime: 60 * 1000,
  })
  const fromDisplay =
    adminSettings?.integrations.find((f) => f.key === "from_email")?.value || "your configured sender address"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setFeedback("")

    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to, subject, message }),
      })

      const data = await res.json()

      if (!res.ok) {
        setStatus("error")
        setFeedback(data.error || "Failed to send email.")
      } else {
        setStatus("success")
        setFeedback(`Email sent successfully to ${to}`)
        setTo("")
        setSubject("")
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
          <Mail className="h-8 w-8" /> Send Email
        </h1>
        <p className="text-muted-foreground mt-1">
          Compose and send emails to clients from{" "}
          <span className="font-medium text-foreground">{fromDisplay}</span>
        </p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          {/* Header bar */}
          <div className="p-4 border-b bg-muted/30 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">From:</span>
            {fromDisplay}
          </div>

          <form onSubmit={handleSubmit} className="divide-y">
            {/* To */}
            <div className="flex items-center gap-3 px-5 py-3">
              <span className="text-sm font-medium text-muted-foreground w-16 shrink-0">To</span>
              <input
                type="email"
                value={to}
                onChange={e => setTo(e.target.value)}
                required
                placeholder="recipient@example.com"
                className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Subject */}
            <div className="flex items-center gap-3 px-5 py-3">
              <span className="text-sm font-medium text-muted-foreground w-16 shrink-0">Subject</span>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                required
                placeholder="Email subject"
                className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-muted-foreground/50"
              />
            </div>

            {/* Message body */}
            <div className="px-5 py-4">
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                required
                rows={12}
                placeholder="Write your message here..."
                className="w-full text-sm bg-transparent focus:outline-none resize-y placeholder:text-muted-foreground/50 leading-relaxed"
              />
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
                {status === "loading" ? "Sending…" : "Send Email"}
              </button>
              <span className="text-xs text-muted-foreground">
                Sent via Resend · veyloraglobal.com
              </span>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  )
}
