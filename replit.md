# Veylora Global

A logistics/freight-forwarding company site: public marketing pages + shipment tracking, backed by an admin dashboard for managing shipments, officers, offices, a two-way email inbox, SMS, and every editable site setting (company info, branding, SEO, integration keys).

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages (**always run this, not a per-package `tsc`** — see Gotchas)
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only). **Run this once after pulling the email-inbox feature** — it adds the new `emails` table that the admin Inbox depends on. Without it, `/admin/inbox` will 500.
- Required env: `DATABASE_URL` — Postgres connection string
- Admin login: `admin` / `admin` (hardcoded fallback in `auth.ts` — change it via Admin → Settings → Account once logged in).
- **Nearly everything else is configured from the admin dashboard now, not env vars.** Admin → Settings has four tabs:
  - **General** — company name, tagline, description, contact emails/phones, office address, social links.
  - **Branding** — primary/accent theme colors (applied live via CSS custom properties, no rebuild needed).
  - **Integrations** — Resend API key, from-address, admin notification email, Resend inbound webhook secret, Termii/Twilio SMS credentials.
  - **SEO & Misc** — page title/description, footer text, business hours, currency.
  - Secret fields (API keys, webhook secret, auth tokens) are masked after saving and never sent back in plaintext.
  - The matching env vars (`RESEND_API_KEY`, `FROM_EMAIL`, `ADMIN_EMAIL`, `RESEND_WEBHOOK_SECRET`, `TERMII_API_KEY`, `TERMII_SENDER_ID`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`) still work as a fallback if a setting is left blank in the admin panel — useful for local dev — but the admin panel value always wins when both are set.
- Live location map (Track page + admin shipment editor): no API key needed — uses Leaflet with OpenStreetMap tiles. An admin sets a shipment's current `lat`/`lon` by clicking the map in the shipment editor; the public tracking page shows it and polls for updates every 20s.

### Setting up two-way email (send + receive)

Sending already works once `resend_api_key` and `from_email` are set (Admin → Settings → Integrations). To also **receive** email into the admin Inbox (`/admin/inbox`):

1. In the Resend dashboard: **Emails → Receiving**, add/verify the domain (or address) you want to receive mail at.
2. **Webhooks → Add Webhook**, event `email.received`, URL `https://<your-deployed-domain>/api/webhooks/resend-inbound`.
3. Copy the signing secret (starts with `whsec_`) into Admin → Settings → Integrations → "Resend Inbound Webhook Secret".
4. Send a test email to the receiving address — it should appear in `/admin/inbox` within a few seconds. Replies sent from the Inbox thread view go out through the same `from_email`/Resend API key used for outbound mail, and are logged back into the same thread.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec) — note: the settings/inbox admin routes were hand-written and are intentionally *not* in the OpenAPI spec/codegen, matching the existing convention for other un-spec'd admin routes (e.g. send-email, send-sms).
- Build: esbuild (CJS bundle)
- Email: `resend` npm package (pinned to an exact version — see Gotchas)

## Where things live

- `lib/db/src/schema/` — Drizzle schema. `app_settings` (generic key/value table) backs every admin-editable setting; `emails` stores inbound + outbound message history for the admin Inbox.
- `artifacts/api-server/src/lib/settingsFields.ts` — single source of truth for every admin-editable setting: its group, whether it's a secret, its default value, and its label. Add a new setting here first; the admin UI and the public API pick it up automatically.
- `artifacts/api-server/src/lib/settings.ts` — read/write helpers over `app_settings`.
- `artifacts/api-server/src/routes/settings.ts` — public, unauthenticated `GET /api/settings/public` (general/branding/seo groups only, defaults merged in).
- `artifacts/api-server/src/routes/adminSettings.ts` — authenticated `GET`/`PUT /api/admin/settings` (all groups, secrets masked).
- `artifacts/api-server/src/routes/webhookResendInbound.ts` — the Resend inbound webhook receiver.
- `artifacts/api-server/src/routes/adminInbox.ts` — admin inbox list/thread/reply routes.
- `artifacts/veylora-global/src/lib/site-settings.ts` — `useSiteSettings()` hook the public site reads from; ships with `DEFAULT_SITE_SETTINGS` as `initialData` so pages never show a blank/loading flash.
- `artifacts/veylora-global/src/components/ApplyBranding.tsx` — applies the branding colors/title/meta at runtime (mounted once in `App.tsx`).
- `artifacts/veylora-global/src/pages/admin/Settings.tsx` — the admin settings UI (tabbed).
- `artifacts/veylora-global/src/pages/admin/Inbox.tsx` — the admin two-pane email client.

## Architecture decisions

- Site settings reuse the existing generic `app_settings` key/value table instead of a dedicated schema/migration per setting — adding a new setting is a one-line addition to `settingsFields.ts`, no DB migration required.
- Theme colors are stored as HSL triplets (e.g. `"167 47% 11%"`, matching the CSS custom property format already used in `index.css`/Tailwind) and applied at runtime via `document.documentElement.style.setProperty()` — no rebuild needed to re-theme, since Tailwind only *references* these vars (`hsl(var(--primary))`) rather than compiling them away.
- Resend's inbound email webhook only sends metadata in the event payload (sender/recipient/subject) — the full body is fetched separately via `resend.emails.receiving.get(id)` once the webhook is verified.
- Env vars remain a fallback under every setting that has a matching one, so local/CI environments that set env vars directly keep working without touching the DB.

## Product

- Public site: home, about, services, contact, get-a-quote, and a live shipment tracking page (with map).
- Admin dashboard: shipments (create/edit/delete + tracking-update timeline + live map pin), officers, offices, outbound "Send Email" and "Send SMS" one-off composer pages, a full two-way email **Inbox** (threaded, unread badges, reply-in-thread), and **Settings** (company info, branding, SEO, integration keys — everything editable live, no redeploy needed).
- Fully responsive: every public and admin page has been audited and fixed at mobile width (375px), including the admin sidebar, tabbed settings UI, and the two-pane inbox (which collapses to a single pane with a back button on mobile).

## User preferences

- Admin should be able to manage the entire site — content, branding, SEO, integrations — without touching code or env vars.
- Full mobile-responsive support is required across the entire site, admin included, not just public pages.

## Gotchas

- **Always run `pnpm run typecheck` from the repo root, not a per-package `tsc -p ... --noEmit` in isolation.** The root script runs `tsc --build` across the composite TS project references first (regenerating `lib/*/dist/*.d.ts`), then per-package checks. Skipping that first step reads stale `.d.ts` output from a previous build and produces confusing false-positive import errors.
- `resend` is pinned to an **exact** version (no `^`) in `artifacts/api-server/package.json`. pnpm's `minimumReleaseAge` install gate blocks any package version published in roughly the last 24h; if bumping this, pin to a version old enough to pass that gate rather than using a caret range.
- The inbound webhook route needs the raw request body for signature verification — `app.ts` captures it via a `verify` callback on `express.json()` (`req.rawBody`), since Express only exposes the parsed object by default.
- When testing pages locally against a static build with a SPA-fallback server (any unmatched path returns `index.html`, 200, `text/html`) and no real backend: an unmocked/mistyped API route silently "succeeds" with an HTML body instead of failing loudly, and if a component doesn't validate the shape of what it got back (e.g. assumes an array), it can crash. `ShipmentDetail`'s tracking-updates list and `Inbox`'s thread view both now guard with `Array.isArray(...)` before rendering, specifically because of this failure mode surfacing during the mobile audit — worth keeping that pattern for any new list/object consumer of an admin API response.
- The admin mobile sidebar is positioned `fixed` and slides in from the left; it must start *below* the sticky mobile header (`top-16`, matching the header's `h-16`) or the header will visually cover the sidebar's first nav item.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
