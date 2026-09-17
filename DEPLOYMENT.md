# Deploying Folio

Folio is a Next.js 14 app backed by a **SQLite** file (`better-sqlite3`). It must
run on a host with a **persistent disk** and a **single instance**. This guide
targets **Render**, with optional **Sepolia** onchain anchoring.

## Prerequisites

- Repo pushed to GitHub (add `.gitignore` first — already included).
- Render account on a **paid plan** (persistent disks are not on free tier).
- Node >= 22 locally (required by `better-sqlite3@13`).
- For anchoring: a Sepolia RPC URL and a funded Sepolia wallet.

## Quickstart

### 1. Generate the three secrets

```bash
openssl rand -hex 32   # PHAROS_API_KEY
openssl rand -hex 32   # PHAROS_RECEIPT_SECRET
openssl rand -hex 32   # PHAROS_SESSION_SECRET
```

Save them in a password manager. `PHAROS_RECEIPT_SECRET` must never change after
launch or existing signatures stop validating.

### 2. Create and fund an issuer wallet (for anchoring)

```bash
npm run wallet:new
# address:     0x...
# privateKey:  0x...
```

Fund the **address** with Sepolia ETH from a faucet, then keep the private key
secret. This is a hot wallet — fund it with only what you need for gas.

### 3. Deploy the registry to Sepolia

Put the key and an RPC URL in a local `.env` (never committed):

```bash
PHAROS_ISSUER_PRIVATE_KEY=0x...
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/<project-id>
```

```bash
npm run deploy:sepolia
```

The script prints the network, deployer balance and the values to set in Render:

```
PHAROS_RECEIPT_REGISTRY_ADDRESS=0x...
PHAROS_ISSUER_ADDRESS=0x...
PHAROS_RPC_URL=<your Sepolia RPC url>
```

### 4. Deploy on Render

1. Render Dashboard → **New → Blueprint** → pick this repo.
2. Render reads `render.yaml` and creates the `folio` web service with a 1 GB
   disk mounted at `/var/data`.
3. Render prompts for the `sync: false` secrets. Fill in:

   | Key | Value |
   | --- | --- |
   | `PHAROS_API_KEY` | from step 1 |
   | `PHAROS_RECEIPT_SECRET` | from step 1 |
   | `PHAROS_SESSION_SECRET` | from step 1 |
   | `PHAROS_RPC_URL` | Sepolia RPC URL (step 3) |
   | `PHAROS_ISSUER_PRIVATE_KEY` | issuer key (step 2) |
   | `PHAROS_RECEIPT_REGISTRY_ADDRESS` | from step 3 |
   | `PHAROS_ISSUER_ADDRESS` | from step 3 |

   To run fully offchain, leave the last four blank.
4. Deploy. Render runs `npm ci --include=dev && npm run build`, then `npm start`.

## How `render.yaml` is wired

- **`plan: starter`** — required for the disk block.
- **`disk.mountPath: /var/data`** + **`PHAROS_DATA_DIR=/var/data`** — where
  `receipts.db` lives. It survives redeploys because it's outside the image.
- **`NODE_VERSION=22.11.0`** — `better-sqlite3` refuses to build on older Node.
- **`buildCommand` uses `--include=dev`** — Next's build needs TypeScript,
  Tailwind and PostCSS, which are devDependencies.
- **`healthCheckPath: /`** — Render marks the deploy live once `/` returns 200.
- **`sync: false`** — secrets are entered in the dashboard, never in git.

Keep the service at **one instance**. Two instances would open the same SQLite
file from separate disks and diverge.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `PHAROS_API_KEY` | yes | Business API key (`x-api-key`) |
| `PHAROS_RECEIPT_SECRET` | yes | HMAC key signing every receipt |
| `PHAROS_SESSION_SECRET` | yes | Signs the wallet session cookie |
| `PHAROS_DATA_DIR` | yes on host | Persistent path, e.g. `/var/data` |
| `PHAROS_ALLOW_CLIENT_ISSUE` | no | Leave unset (false) in production |
| `PHAROS_RPC_URL` | optional | Chain RPC the app anchors through |
| `PHAROS_ISSUER_PRIVATE_KEY` | optional | Hot wallet that writes anchors |
| `PHAROS_RECEIPT_REGISTRY_ADDRESS` | optional | Deployed `ReceiptRegistry` |
| `PHAROS_ISSUER_ADDRESS` | optional | Issuer wallet address |
| `SEPOLIA_RPC_URL` | deploy only | Used by `npm run deploy:sepolia`, not the app |

In production there is no fallback for the three secrets — the app throws if one
is missing rather than silently using a public default.

## Verify after deploy

- [ ] `https://<service>.onrender.com/` returns 200.
- [ ] Wallet connect → sign-in → dashboard loads.
- [ ] Issue a receipt through the SDK with `x-api-key`.
- [ ] Open `/receipt/<id>` — payload renders, verification shows valid.
- [ ] `GET /api/receipts/<id>/verify` returns `{ "valid": true }`.
- [ ] Restart the service; the receipt is still there (disk works).
- [ ] If anchoring: the receipt proof shows an `onchain.txHash`.

For a real SDK call against production, the client base URL is the Render URL:

```ts
import { FolioReceipts } from "./src/lib/folio-receipts-sdk";
const client = new FolioReceipts("https://<service>.onrender.com", process.env.PHAROS_API_KEY!);
```

## Backups

The entire dataset is one file. Back it up from a Render shell or cron job:

```bash
sqlite3 "$PHAROS_DATA_DIR/receipts.db" ".backup '/var/data/backup-$(date +%F).db'"
```

Store `PHAROS_RECEIPT_SECRET` with the backups — without the signing key the
database cannot validate its own receipts.

## Not recommended: Vercel / serverless

Vercel wipes the filesystem between requests, so receipts vanish on every
deploy and cold start, and `better-sqlite3` (a native module) is not supported.
If you must use serverless, the storage layer in `src/lib/db.ts` has to be
swapped for a hosted database first.
