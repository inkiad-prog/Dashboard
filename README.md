# DW Import Dashboard

A live dashboard for Wheat, Coal, and Soybean import data, querying the SQL Server data warehouse **on every page load** — no static/cached numbers. When the underlying `dbo.tblImportData` table changes, the next page visit reflects it immediately.

## Architecture

- `src/lib/db.ts` — SQL Server connection pool (via `mssql`), configured entirely from environment variables. No credentials are ever hardcoded or sent to the browser.
- `src/lib/queries.ts` — parameterized queries for yearly volume, monthly price trend, top countries, and top importers, per commodity.
- `src/app/page.tsx` — a Server Component (`export const dynamic = "force-dynamic"`) that queries the DW live on every request and passes the result to the client UI.
- `src/app/api/commodity/[name]/route.ts` — REST endpoints (`/api/commodity/wheat`, `/coal`, `/soybean`) if you want to consume the same live data elsewhere.
- `src/components/` — the tab UI and SVG chart components (bar chart, price line chart, horizontal bar rankings).

## Local development

1. Copy `.env.example` to `.env.local` and fill in the real DB password:
   ```
   DW_SERVER=20.247.94.11
   DW_PORT=1433
   DW_DATABASE=SSISRND
   DW_USER=development
   DW_PASSWORD=your-password-here
   ```
2. Install dependencies and run:
   ```bash
   npm install
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000).

`.env.local` is gitignored by default — it will never be committed.

## Deploying to Vercel

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. Import the project in Vercel.
3. In the Vercel project's **Settings → Environment Variables**, add the same four variables (`DW_SERVER`, `DW_PORT`, `DW_DATABASE`, `DW_USER`, `DW_PASSWORD`) with the real values. Do this for both Production and Preview environments.
4. Deploy. Every page request on the live URL will run a fresh query against the data warehouse — the dashboard always reflects current DB state.

### Network access note

Vercel's serverless functions need outbound network access to `20.247.94.11:1433`. If your SQL Server has a firewall/IP allowlist, you'll need to allow Vercel's outbound IP ranges (or use a Vercel Secure Compute / VPC connection if the DW is not publicly reachable). If the server is only reachable from an internal network, a direct Vercel deployment won't be able to reach it at all — in that case you'd need a VPN/tunnel or an intermediary API that Vercel can reach.

## Data-quality note (Soybean)

The Soybean price trend excludes shipments under 100 MT — a small number of records (177 out of 2,636) tagged under the "SOYABEAN" category are actually non-bulk imports from pharmaceutical/industrial companies (soy lecithin, etc.), which otherwise distort the monthly average price by 5-10x in some months. Volume/value totals are unaffected (these rows are a negligible 0.02% of total volume).
