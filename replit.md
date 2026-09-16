# [Project name]

_Replace the heading above with the project's name, and this line with one sentence describing what this app does for users._

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Email (optional, admin "Send Email" + contact form replies): `RESEND_API_KEY`, `FROM_EMAIL`, `ADMIN_EMAIL`
- SMS (optional, admin "Send SMS" + automatic status-update texts): `TERMII_API_KEY`, `TERMII_SENDER_ID` for Nigerian numbers; `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER` for everything else. A send is routed automatically by the recipient's number — a local Nigerian number (`+234…` / `0…`) goes through Termii, any other number goes through Twilio. Either provider can be left unconfigured if you only need the other; sends to that provider will fail loudly with a clear error until its env vars are set.
- Live location map (Track page + admin shipment editor): no API key needed — uses Leaflet with OpenStreetMap tiles. An admin sets a shipment's current `lat`/`lon` by clicking the map in the shipment editor; the public tracking page shows it and polls for updates every 20s.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

_Populate as you build — short repo map plus pointers to the source-of-truth file for DB schema, API contracts, theme files, etc._

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
