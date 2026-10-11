import { useRoute, useLocation } from "wouter"
import { useGetCourier, getGetCourierQueryKey } from "@workspace/api-client-react"
import { AdminLayout } from "@/components/layout/AdminLayout"
import { Button } from "@/components/ui/button"
import { useSiteSettings } from "@/lib/site-settings"
import { ArrowLeft, Printer, Package } from "lucide-react"

// A clean, printable shipment receipt/waybill. Lives inside AdminLayout
// (for the auth check and nav) but AdminLayout's chrome — mobile header,
// sidebar — is hidden on print (see its print:hidden classes), so Cmd/Ctrl+P
// from here prints just the receipt itself, not the admin UI around it.
export default function ShipmentReceipt() {
  const [, params] = useRoute("/admin/shipments/:id/receipt")
  const [, setLocation] = useLocation()
  const { data: settings } = useSiteSettings()

  const id = params?.id
  const numericId = id ? parseInt(id, 10) : NaN

  const { data: shipment, isLoading } = useGetCourier(numericId, {
    query: { enabled: !isNaN(numericId), queryKey: getGetCourierQueryKey(numericId) },
  })

  if (isLoading || !shipment) {
    return (
      <AdminLayout>
        <div className="p-8 text-muted-foreground">
          {isLoading ? "Loading receipt…" : "Shipment not found."}
        </div>
      </AdminLayout>
    )
  }

  const generatedAt = new Date().toLocaleString()

  return (
    <AdminLayout>
      {/* Screen-only toolbar — hidden on print */}
      <div className="print:hidden flex items-center gap-3 mb-6">
        <Button variant="outline" size="icon" onClick={() => setLocation(`/admin/shipments/${numericId}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-primary flex-1">Shipment Receipt</h1>
        <Button onClick={() => window.print()} className="font-bold">
          <Printer className="h-4 w-4 mr-2" /> Print
        </Button>
      </div>

      {/* The receipt itself */}
      <div className="bg-white border rounded-xl shadow-sm max-w-3xl mx-auto p-8 sm:p-10 print:shadow-none print:border-0 print:rounded-none print:max-w-none print:mx-0 print:p-0 text-sm text-neutral-800">
        {/* Letterhead */}
        <div className="flex items-start justify-between border-b-2 border-neutral-800 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-md">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-black text-xl text-primary leading-tight">{settings.site_name}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider">{settings.tagline}</div>
            </div>
          </div>
          <div className="text-right text-xs text-muted-foreground whitespace-pre-line">
            {settings.office_address}
            {"\n"}
            {settings.contact_phone}
            {"\n"}
            {settings.contact_email}
          </div>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-bold uppercase tracking-wide">Shipment Receipt</h2>
          <div className="text-right">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Tracking Number</div>
            <div className="font-mono font-black text-xl text-primary">{shipment.consNo}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 border-b pb-1">
              Sender
            </div>
            <div className="space-y-0.5">
              <div className="font-semibold">{shipment.sName}</div>
              {shipment.sAdd && <div className="whitespace-pre-line text-neutral-600">{shipment.sAdd}</div>}
              {shipment.sPhone && <div className="text-neutral-600">{shipment.sPhone}</div>}
              {shipment.sMail && <div className="text-neutral-600">{shipment.sMail}</div>}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 border-b pb-1">
              Receiver
            </div>
            <div className="space-y-0.5">
              <div className="font-semibold">{shipment.rName}</div>
              {shipment.rAdd && <div className="whitespace-pre-line text-neutral-600">{shipment.rAdd}</div>}
              {shipment.rPhone && <div className="text-neutral-600">{shipment.rPhone}</div>}
              {shipment.rMail && <div className="text-neutral-600">{shipment.rMail}</div>}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 border-b pb-1">
            Shipment Details
          </div>
          <table className="w-full text-sm">
            <tbody>
              <ReceiptRow label="Origin" value={shipment.origin} />
              <ReceiptRow label="Destination" value={shipment.destination} />
              <ReceiptRow label="Status" value={shipment.status} />
              <ReceiptRow label="Product" value={shipment.product} />
              <ReceiptRow label="Type" value={shipment.type} />
              <ReceiptRow label="Weight" value={shipment.weight} />
              <ReceiptRow label="Quantity" value={shipment.qty != null ? String(shipment.qty) : undefined} />
              <ReceiptRow label="Mode" value={shipment.mode} />
              <ReceiptRow label="Payment Mode" value={shipment.pmode} />
              <ReceiptRow label="Freight" value={shipment.freight} />
              <ReceiptRow label="Invoice No" value={shipment.invoiceNo} />
              <ReceiptRow label="Pickup Date" value={shipment.pickDate} />
              <ReceiptRow label="Departure Date" value={shipment.deptDate} />
            </tbody>
          </table>
        </div>

        <div className="border-t pt-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Generated {generatedAt}</span>
          <span>{settings.site_name} — {settings.footer_text}</span>
        </div>
      </div>

      <style>{`
        @media print {
          @page { margin: 1.5cm; }
          body { background: white !important; }
        }
      `}</style>
    </AdminLayout>
  )
}

function ReceiptRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <tr className="border-b border-neutral-100 last:border-0">
      <td className="py-1.5 pr-4 font-medium text-muted-foreground w-1/3 align-top">{label}</td>
      <td className="py-1.5 text-neutral-800">{value}</td>
    </tr>
  )
}
