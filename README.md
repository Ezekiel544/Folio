# Folio — portable receipt layer for digital commerce

Folio turns a purchase into a **portable, signed receipt**: product, buyer,
seller, purchase date, payment reference, transfer history, rights and warranty
— wrapped in a tamper-evident signature, optionally anchored onchain in an
issuer-controlled registry. It is a receipt layer for digital commerce, not a
block explorer.

## What you get

- **Signed receipts** — every receipt carries an HMAC-SHA256 signature over a
  deterministic canonical JSON payload. Re-signing on transfer/revoke keeps the
  provenance chain intact and exposes any tampering on verification.
- **Ownership & transfer history** — receipts can move between buyers; each hop
  appends a signed history entry that new issuers, buyers and verifiers can read.
- **API + SDK** — a JSON API (`/api/receipts`) and a TypeScript SDK
  (`FolioReceipts`) issue, list, verify, transfer and revoke receipts with an
  API key.
- **Wallet session** — buyers verify, view and transfer what they own from the
  dashboard without touching the business API key.
- **Portable proof page** — every receipt has a public `/receipt/[id]` page that
  renders the signed payload and its verification status.
- **Onchain anchoring** (optional) — a lightweight `ReceiptRegistry.sol` proves
  issuance, transfer and revocation onchain; the receipt only points at the
  anchor, keeping the full payload portable and readable without a chain lookup.

## Stack

Next.js 14 (App Router), ethers v6, better-sqlite3, Hardhat 2. Node 18+.

## Setup

### 1. Install

```bash
npm install
```

### 2. Configure secrets

Copy `.env.example` to `.env` and set the three required secrets:

| Variable | Purpose |
| --- | --- |
| `PHAROS_RECEIPT_SECRET` | HMAC key that signs every receipt |
| `PHAROS_SESSION_SECRET` | Signs the wallet session cookie |
| `PHAROS_API_KEY` | Business API key for issuing/transferring/revoking from your server |

Optional: `PHAROS_DATA_DIR` (default `./data`), `PHAROS_ALLOW_CLIENT_ISSUE`
(demo-only, lets the dashboard issue from the browser).

### 3. Run

```bash
npm run dev        # http://localhost:3000
npm run build      # type-check + production build
npm test           # contract tests + lib tests
```

## Receipt shape

```ts
type Receipt = {
  id: string;                    // "rec_<uuid>"
  version: "1.0";
  product: { name: string; description?: string; sku?: string };
  buyer: { id: string; wallet?: string; email?: string };
  seller: { id: string; name: string };
  purchasedAt: string;           // ISO 8601
  payment: { amount: number; currency: string; reference: string; transactionHash?: string };
  ownership: { status: "owned" | "transferred" | "revoked"; currentOwner: string; transferable: boolean };
  transfers: { id: string; from: string; to: string; at: string; reference?: string }[];
  rights: { name: string; description?: string; expiresAt?: string }[];
  warranty?: { provider: string; expiresAt?: string; supportUrl?: string };
  proof: { signature: string; issuedAt: string; onchain?: { txHash: string; chainId: number } };
};
```

The signature covers the stable canonical serialization (sorted keys, no
whitespace) of the signed payload — **excluding** `proof` itself, which is
recomputed after every mutation (transfer/revoke).

## SDK

```ts
import { FolioReceipts } from "./src/lib/folio-receipts-sdk";

const client = new FolioReceipts(
  "http://localhost:3000",
  process.env.PHAROS_API_KEY!,
);

const { receipt } = await client.issue({
  product: { name: "Fjord Carbon R7", sku: "FJ-CARBON-R7" },
  buyer: { id: "alex@example.com", wallet: "0xAbC..." },
  seller: { id: "shop_416", name: "Fjord Cycles" },
  purchasedAt: new Date().toISOString(),
  payment: { amount: 3299, currency: "USD", reference: "PAY-48211" },
  rights: [{ name: "Software license", expiresAt: "2027-09-17" }],
  warranty: { provider: "Fjord Support", expiresAt: "2027-09-17", supportUrl: "https://..." },
});

const info = await client.get(receipt.id);
const { valid, reason } = await client.verify(receipt.id);
const after = await client.transfer(receipt.id, "0x0d..."); // new owner
await client.revoke(receipt.id, "chargeback");
const theirs = await client.list("alex@example.com");
```

## API

All receipt routes are rate-limited. Write ops require either an `x-api-key`
header equal to `PHAROS_API_KEY` (server-to-server) or an active wallet session
(browser); `GET /api/receipts` (own receipts) works with a session or API key.

| Method | Route | Body | Description |
| --- | --- | --- | --- |
| `POST` | `/api/receipts` | ReceiptInput (no `id`/`proof`) | Issue a signed receipt |
| `GET` | `/api/receipts?id=` | | Get one receipt by id |
| `GET` | `/api/receipts?buyer=` | | List receipts for a buyer (session or API key) |
| `GET` | `/api/receipts/:id` | | Full receipt + onchain summary |
| `GET` | `/api/receipts/:id/verify` | | Verification result `{ valid, reason, onchain }` |
| `POST` | `/api/receipts/:id/transfer` | `{ to }` | Transfer ownership |
| `POST` | `/api/receipts/:id/revoke` | | Revoke a receipt (issuer/admin) |

Auth endpoints: `POST /api/auth/nonce` → `POST /api/auth/wallet` (EIP-191
signature) → session set via `Set-Cookie`; `GET /api/auth/session` reads it back.

## Onchain anchoring (optional)

Deploy the registry once from the issuer wallet:

```bash
npm run deploy   # local hardhat network: prints PHAROS_RECEIPT_REGISTRY_ADDRESS
npm run deploy:pharos   # custom network (see hardhat.config.ts "pharos")
```

Then set in `.env`: `PHAROS_RPC_URL`, `PHAROS_ISSUER_PRIVATE_KEY`,
`PHAROS_RECEIPT_REGISTRY_ADDRESS`. When configured, issuing/transferring/revoking
also writes a proof to the registry; `verify` compares the receipt hash to the
onchain record. When these vars are unset, anchoring is skipped and void
(`onchain.configured: false`).

`ReceiptRegistry.sol` stores `keccak256(receiptPayload)` keyed by receipt id
and tracks `owner`, `transferredAt` and `revoked`. See
`test/contract/ReceiptRegistry.spec.ts` for contract behavior.

## Identity & auth model

- A buyer can be a human id (`alex@example.com`) and/or a wallet address.
- Ownership checks compare **normalized** identities (checksummed, case-folded)
  so a wallet is matched regardless of casing.
- The dashboard defaults the buyer to the connected wallet, so issued receipts
  are immediately owned by the signer.

## Tests

```bash
npm run test:contract   # hardhat test — contract behavior
npm run test:lib        # node --test 'test/lib/**/*.test.ts'
npm test                # both
```