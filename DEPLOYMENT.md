# Deploying Folio

Folio is a Next.js 14 app that stores receipts in **Supabase Postgres** (via
`pg`). It can run on **Vercel** (recommended) or any Node host — no persistent
disk required anymore.

## Prerequisites

- Repo pushed to GitHub.
- A Supabase project (free tier is fine).
- Vercel account (free Hobby tier is fine).

## 1. Database — Supabase

1. Create a project at https://supabase.com.
2. Open **Settings → Database → Connection string → Transaction pooler** and copy
   it. It looks like:

   ```
   postgresql://postgres.<project-ref>:<password>@aws-1-<region>.pooler.supabase.com:6543/postgres
   ```

3. That string is `DATABASE_URL`. The app creates the `receipts` table and its
   indexes automatically on first use — no SQL to run.

> Use the **Transaction pooler** (port `6543`). Vercel functions are ephemeral,
> so direct connections exhaust the limited Postgres connection slots.

## 2. Secrets

Generate three long random values:

```bash
openssl rand -hex 32   # PHAROS_API_KEY
openssl rand -hex 32   # PHAROS_RECEIPT_SECRET
openssl rand -hex 32   # PHAROS_SESSION_SECRET
```

`PHAROS_RECEIPT_SECRET` must never change after launch or existing signatures
stop validating.

## 3. Deploy on Vercel

1. **Add New → Project** → import the `Ezekiel544/Folio` repo.
2. Framework preset: **Next.js** (auto-detected). Leave build/install defaults.
3. Under **Environment Variables**, add the required ones:

   | Key | Value |
   | --- | --- |
   | `PHAROS_API_KEY` | from step 2 |
   | `PHAROS_RECEIPT_SECRET` | from step 2 |
   | `PHAROS_SESSION_SECRET` | from step 2 |
   | `DATABASE_URL` | from step 1 |

4. Deploy. Vercel runs `next build` and hosts the app serverlessly.

## 4. Optional — onchain anchoring (Sepolia)

Leave these unset to run fully offchain (`onchain.configured: false`). To anchor
each receipt onchain:

```bash
npm run wallet:new
# fund the address with Sepolia ETH, then:
SEPOLIA_RPC_URL=<provider url> PHAROS_ISSUER_PRIVATE_KEY=<key> npm run deploy:sepolia
```

Add the printed values as Vercel env vars: `PHAROS_RPC_URL`,
`PHAROS_ISSUER_PRIVATE_KEY`, `PHAROS_RECEIPT_REGISTRY_ADDRESS`,
`PHAROS_ISSUER_ADDRESS`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | yes | Supabase Postgres **transaction pooler** URL |
| `PHAROS_API_KEY` | yes | Business API key (`x-api-key`) |
| `PHAROS_RECEIPT_SECRET` | yes | HMAC key signing every receipt |
| `PHAROS_SESSION_SECRET` | yes | Signs the wallet session cookie |
| `PHAROS_ALLOW_CLIENT_ISSUE` | no | Leave unset (false) in production |
| `PHAROS_RPC_URL` | optional | Chain RPC the app anchors through |
| `PHAROS_ISSUER_PRIVATE_KEY` | optional | Hot wallet that writes anchors |
| `PHAROS_RECEIPT_REGISTRY_ADDRESS` | optional | Deployed `ReceiptRegistry` |
| `PHAROS_ISSUER_ADDRESS` | optional | Issuer wallet address |
| `SEPOLIA_RPC_URL` | deploy only | Used by `npm run deploy:sepolia`, not the app |
| `PHAROS_DB_TABLE` | no | Table name; defaults to `receipts` (tests use `receipts_test`) |

In production there is no fallback for the four required values — the app throws
if one is missing rather than silently using a public default.

## Local development

```bash
cp .env.example .env     # fill in the values
npm install
npm run dev
```

## Tests

```bash
npm run test:lib     # API/domain tests — hit DATABASE_URL, isolated table
npm run test:contract
```

The lib tests write to a `receipts_test` table and delete its rows on each run,
so they never touch production data.

## Verify after deploy

- [ ] `https://<app>.vercel.app/` returns 200.
- [ ] Wallet connect → sign-in → dashboard loads.
- [ ] Issue a receipt through the SDK with `x-api-key`.
- [ ] Open `/receipt/<id>` — payload renders, verification shows valid.
- [ ] `GET /api/receipts/<id>/verify` returns `{ "valid": true }`.
- [ ] Data persists across a redeploy (it lives in Supabase, not the host).

For a real SDK call against production:

```ts
import { FolioReceipts } from "./src/lib/folio-receipts-sdk";
const client = new FolioReceipts("https://<app>.vercel.app", process.env.PHAROS_API_KEY!);
```

## Backups

Supabase takes automated backups (daily on paid plans; use **Database → Backups**
or `pg_dump` on free tier):

```bash
pg_dump "$DATABASE_URL" > folio-$(date +%F).sql
```

Store `PHAROS_RECEIPT_SECRET` with the backups — without the signing key the
database cannot validate its own receipts.
