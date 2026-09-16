import * as React from "react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { Settings, Lock, CheckCircle, AlertCircle, Eye, EyeOff, Building2, Palette, Plug, Search } from "lucide-react"
import { customFetch } from "@workspace/api-client-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { hexToHslTriplet, hslTripletToHex } from "@/lib/color"

// ---------------------------------------------------------------------------
// Change password (existing behavior, unchanged)
// ---------------------------------------------------------------------------

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

function AccountTab() {
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
    <div className="max-w-lg">
      <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-muted/30 flex items-center gap-3">
          <Lock className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-primary">Change Password</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
                className="w-full border rounded-md px-3 py-2 pr-10 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Enter current password"
              />
              <button type="button" onClick={() => setShowCurrent(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
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
              <button type="button" onClick={() => setShowNew(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                className="w-full border rounded-md px-3 py-2 pr-10 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Repeat new password"
              />
              <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {validationError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {validationError}
            </div>
          )}
          {status === "error" && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {errorMsg || "Failed to change password."}
            </div>
          )}
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
  )
}

// ---------------------------------------------------------------------------
// Grouped site settings (General / Branding / Integrations / SEO)
// ---------------------------------------------------------------------------

interface SettingItem {
  key: string
  label: string
  secret: boolean
  value: string
  hasValue: boolean
}
type SettingsGroups = Record<"general" | "branding" | "integrations" | "seo", SettingItem[]>

function useSettingsGroups() {
  return useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => customFetch<SettingsGroups>("/api/admin/settings"),
  })
}

function useSaveSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (values: Record<string, string>) =>
      customFetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] })
      queryClient.invalidateQueries({ queryKey: ["site-settings-public"] })
    },
  })
}

function SaveBar({ pending, saved }: { pending: boolean; saved: boolean }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <button
        type="submit"
        disabled={pending}
        className="bg-primary text-primary-foreground font-semibold px-6 py-2.5 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
      {saved && (
        <span className="flex items-center gap-1.5 text-sm text-green-700">
          <CheckCircle className="h-4 w-4" /> Saved
        </span>
      )}
    </div>
  )
}

function fieldMap(items: SettingItem[]): Record<string, SettingItem> {
  return Object.fromEntries(items.map((i) => [i.key, i]))
}

function GeneralTab({ items }: { items: SettingItem[] }) {
  const fields = fieldMap(items)
  const [values, setValues] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(items.map((i) => [i.key, i.value])),
  )
  const save = useSaveSettings()
  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    save.mutate(values)
  }

  if (!fields.site_name) return null

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl bg-card border rounded-xl shadow-sm p-6 space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-1">{fields.site_name.label}</label>
          <input value={values.site_name} onChange={set("site_name")} className="w-full border rounded-md px-3 py-2 text-sm bg-background" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{fields.tagline.label}</label>
          <input value={values.tagline} onChange={set("tagline")} className="w-full border rounded-md px-3 py-2 text-sm bg-background" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{fields.company_blurb.label}</label>
        <textarea value={values.company_blurb} onChange={set("company_blurb")} rows={3} className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-y" />
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium mb-1">{fields.contact_email.label}</label>
          <input type="email" value={values.contact_email} onChange={set("contact_email")} className="w-full border rounded-md px-3 py-2 text-sm bg-background" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{fields.contact_email_secondary.label}</label>
          <input type="email" value={values.contact_email_secondary} onChange={set("contact_email_secondary")} className="w-full border rounded-md px-3 py-2 text-sm bg-background" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{fields.contact_phone.label}</label>
          <input value={values.contact_phone} onChange={set("contact_phone")} className="w-full border rounded-md px-3 py-2 text-sm bg-background" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{fields.contact_phone_secondary.label}</label>
          <input value={values.contact_phone_secondary} onChange={set("contact_phone_secondary")} className="w-full border rounded-md px-3 py-2 text-sm bg-background" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{fields.founding_year.label}</label>
          <input value={values.founding_year} onChange={set("founding_year")} className="w-full border rounded-md px-3 py-2 text-sm bg-background" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{fields.office_address.label}</label>
        <textarea value={values.office_address} onChange={set("office_address")} rows={2} className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-y" />
      </div>
      <div className="grid sm:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-medium mb-1">{fields.social_facebook.label}</label>
          <input value={values.social_facebook} onChange={set("social_facebook")} placeholder="https://facebook.com/…" className="w-full border rounded-md px-3 py-2 text-sm bg-background" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{fields.social_twitter.label}</label>
          <input value={values.social_twitter} onChange={set("social_twitter")} placeholder="https://x.com/…" className="w-full border rounded-md px-3 py-2 text-sm bg-background" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{fields.social_linkedin.label}</label>
          <input value={values.social_linkedin} onChange={set("social_linkedin")} placeholder="https://linkedin.com/…" className="w-full border rounded-md px-3 py-2 text-sm bg-background" />
        </div>
      </div>
      <SaveBar pending={save.isPending} saved={save.isSuccess} />
    </form>
  )
}

function BrandingTab({ items }: { items: SettingItem[] }) {
  const fields = fieldMap(items)
  const [values, setValues] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(items.map((i) => [i.key, i.value])),
  )
  const save = useSaveSettings()

  if (!fields.color_primary_hsl) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    save.mutate(values)
  }

  const colorField = (key: string, label: string) => (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={hslTripletToHex(values[key])}
          onChange={(e) => setValues((v) => ({ ...v, [key]: hexToHslTriplet(e.target.value) }))}
          className="h-11 w-16 rounded-md border cursor-pointer bg-background"
        />
        <input
          value={values[key]}
          onChange={(e) => setValues((v) => ({ ...v, [key]: e.target.value }))}
          className="flex-1 border rounded-md px-3 py-2 text-sm bg-background font-mono"
        />
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl bg-card border rounded-xl shadow-sm p-6 space-y-6">
      <p className="text-sm text-muted-foreground">
        Changes apply across the whole site immediately after saving — no redeploy needed.
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        {colorField("color_primary_hsl", fields.color_primary_hsl.label)}
        {colorField("color_accent_hsl", fields.color_accent_hsl.label)}
      </div>
      <SaveBar pending={save.isPending} saved={save.isSuccess} />
    </form>
  )
}

function SecretInput({
  item,
  value,
  onChange,
}: {
  item: SettingItem
  value: string
  onChange: (v: string) => void
}) {
  const [show, setShow] = React.useState(false)
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {item.label}
        {item.hasValue && <span className="ml-2 text-xs font-normal text-green-700">● configured</span>}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={item.hasValue ? "Leave blank to keep current value" : "Not set"}
          className="w-full border rounded-md px-3 py-2 pr-10 text-sm bg-background font-mono"
        />
        <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  )
}

function IntegrationsTab({ items }: { items: SettingItem[] }) {
  const fields = fieldMap(items)
  const [values, setValues] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(items.map((i) => [i.key, i.secret ? "" : i.value])),
  )
  const save = useSaveSettings()

  if (!fields.resend_api_key) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    save.mutate(values)
  }
  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [key]: e.target.value }))

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div className="bg-card border rounded-xl shadow-sm p-6 space-y-5">
        <h3 className="font-bold text-primary">Email — Resend</h3>
        <SecretInput item={fields.resend_api_key} value={values.resend_api_key} onChange={(v) => setValues((s) => ({ ...s, resend_api_key: v }))} />
        <div>
          <label className="block text-sm font-medium mb-1">{fields.from_email.label}</label>
          <input value={values.from_email} onChange={set("from_email")} className="w-full border rounded-md px-3 py-2 text-sm bg-background" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{fields.admin_email.label}</label>
          <input value={values.admin_email} onChange={set("admin_email")} className="w-full border rounded-md px-3 py-2 text-sm bg-background" />
        </div>
        <SecretInput item={fields.resend_webhook_secret} value={values.resend_webhook_secret} onChange={(v) => setValues((s) => ({ ...s, resend_webhook_secret: v }))} />
        <p className="text-xs text-muted-foreground leading-relaxed">
          To receive email in the Inbox: in Resend, set up a receiving domain (Emails → Receiving), then add a
          webhook (Webhooks → Add Webhook) for the <code className="bg-muted px-1 rounded">email.received</code> event
          pointing at <code className="bg-muted px-1 rounded">https://your-domain.com/api/webhooks/resend-inbound</code>,
          and paste its signing secret above.
        </p>
      </div>

      <div className="bg-card border rounded-xl shadow-sm p-6 space-y-5">
        <h3 className="font-bold text-primary">SMS — Termii (local) &amp; Twilio (international)</h3>
        <SecretInput item={fields.termii_api_key} value={values.termii_api_key} onChange={(v) => setValues((s) => ({ ...s, termii_api_key: v }))} />
        <div>
          <label className="block text-sm font-medium mb-1">{fields.termii_sender_id.label}</label>
          <input value={values.termii_sender_id} onChange={set("termii_sender_id")} className="w-full border rounded-md px-3 py-2 text-sm bg-background" />
        </div>
        <SecretInput item={fields.twilio_account_sid} value={values.twilio_account_sid} onChange={(v) => setValues((s) => ({ ...s, twilio_account_sid: v }))} />
        <SecretInput item={fields.twilio_auth_token} value={values.twilio_auth_token} onChange={(v) => setValues((s) => ({ ...s, twilio_auth_token: v }))} />
        <div>
          <label className="block text-sm font-medium mb-1">{fields.twilio_from_number.label}</label>
          <input value={values.twilio_from_number} onChange={set("twilio_from_number")} className="w-full border rounded-md px-3 py-2 text-sm bg-background" />
        </div>
      </div>

      <SaveBar pending={save.isPending} saved={save.isSuccess} />
    </form>
  )
}

function SeoTab({ items }: { items: SettingItem[] }) {
  const fields = fieldMap(items)
  const [values, setValues] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(items.map((i) => [i.key, i.value])),
  )
  const save = useSaveSettings()

  if (!fields.seo_title) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    save.mutate(values)
  }
  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setValues((v) => ({ ...v, [key]: e.target.value }))

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl bg-card border rounded-xl shadow-sm p-6 space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">{fields.seo_title.label}</label>
        <input value={values.seo_title} onChange={set("seo_title")} className="w-full border rounded-md px-3 py-2 text-sm bg-background" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">{fields.seo_description.label}</label>
        <textarea value={values.seo_description} onChange={set("seo_description")} rows={3} className="w-full border rounded-md px-3 py-2 text-sm bg-background resize-y" />
      </div>
      <div className="grid sm:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-medium mb-1">{fields.footer_text.label}</label>
          <input value={values.footer_text} onChange={set("footer_text")} className="w-full border rounded-md px-3 py-2 text-sm bg-background" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{fields.business_hours.label}</label>
          <input value={values.business_hours} onChange={set("business_hours")} className="w-full border rounded-md px-3 py-2 text-sm bg-background" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{fields.currency.label}</label>
          <input value={values.currency} onChange={set("currency")} className="w-full border rounded-md px-3 py-2 text-sm bg-background" />
        </div>
      </div>
      <SaveBar pending={save.isPending} saved={save.isSuccess} />
    </form>
  )
}

const TABS = [
  { id: "general", label: "General", icon: Building2 },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "seo", label: "SEO & Misc", icon: Search },
  { id: "account", label: "Account", icon: Lock },
] as const
type TabId = (typeof TABS)[number]["id"]

export default function SettingsPage() {
  const [tab, setTab] = React.useState<TabId>("general")
  const { data: groups, isLoading, isError } = useSettingsGroups()

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
          <Settings className="h-8 w-8" /> Settings
        </h1>
        <p className="text-muted-foreground mt-1">Manage everything about your site from here.</p>
      </div>

      {/* Tabs — horizontally scrollable on mobile instead of wrapping */}
      <div className="mb-6 border-b overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {TABS.map((t) => {
            const Icon = t.icon
            const active = tab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  active ? "border-accent text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {tab === "account" ? (
        <AccountTab />
      ) : isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : isError || !groups ? (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3 max-w-2xl">
          <AlertCircle className="h-4 w-4 shrink-0" /> Failed to load settings.
        </div>
      ) : (
        <>
          {tab === "general" && <GeneralTab items={groups.general} />}
          {tab === "branding" && <BrandingTab items={groups.branding} />}
          {tab === "integrations" && <IntegrationsTab items={groups.integrations} />}
          {tab === "seo" && <SeoTab items={groups.seo} />}
        </>
      )}
    </AdminLayout>
  )
}
