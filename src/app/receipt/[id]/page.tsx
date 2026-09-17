import { notFound } from "next/navigation";
import { verifyReceipt } from "@/lib/receipts";

export const dynamic = "force-dynamic";

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);

const date = (value: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));

export default async function ReceiptPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await verifyReceipt(params.id);
  if (!result.valid || !result.receipt) notFound();
  const r = result.receipt;
  const onchain = result.onchain;

  const statusColor =
    r.ownership.status === "owned"
      ? "bg-[#e4f7ef] text-[#11764a]"
      : r.ownership.status === "transferred"
        ? "bg-[#eeedff] text-[#1200cc]"
        : "bg-[#f1f1f3] text-[#757580]";

  return (
    <main className="min-h-screen bg-[#f7f7fa] text-[#0a0a14]">
      <header className="sticky top-0 z-10 border-b border-[#e7e7ee] bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-[73px] max-w-[980px] items-center justify-between px-5 sm:px-8">
          <a href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#1200cc] text-lg font-bold text-white">F</span>
            <span className="text-lg font-semibold tracking-[-.04em]">
              folio<span className="text-[#1200cc]">.</span>receipt
            </span>
          </a>
          <a
            href="/dashboard"
            className="text-sm font-medium text-[#5c5c68] hover:text-[#1200cc]"
          >
            Go to your dashboard
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-[980px] px-5 py-10 sm:px-8">
        <div className="rounded-2xl border border-[#e5e5ed] bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-[.16em] text-[#1200cc]">
              Portable proof of purchase
            </p>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize ${statusColor}`}>
              {r.ownership.status}
            </span>
          </div>

          <div className="mt-6 rounded-2xl bg-[#eeedff] p-6">
            <h1 className="text-3xl font-semibold tracking-[-.05em] sm:text-4xl">
              {r.product.name}
            </h1>
            <p className="mt-2 text-sm text-[#57506f]">
              Purchased from {r.seller.name} · {date(r.purchasedAt)}
            </p>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <section className="rounded-2xl border border-[#e5e5ed] p-5">
              <h2 className="text-xs font-bold uppercase tracking-[.13em] text-[#1200cc]">Purchase</h2>
              <div className="mt-4 space-y-3 text-sm">
                <Row label="Buyer" value={r.buyer.id} mono={r.buyer.wallet?.startsWith("0x")} />
                <Row label="Seller" value={`${r.seller.name} (${r.seller.id})`} />
                <Row label="Amount" value={money(r.payment.amount, r.payment.currency)} />
                <Row label="Payment reference" value={r.payment.reference} mono />
                {r.payment.transactionHash ? <Row label="Payment tx" value={r.payment.transactionHash} mono /> : null}
                {r.payment.chainId ? <Row label="Chain" value={`Chain ${r.payment.chainId}`} /> : null}
              </div>
            </section>

            <section className="rounded-2xl border border-[#e5e5ed] p-5">
              <h2 className="text-xs font-bold uppercase tracking-[.13em] text-[#1200cc]">Ownership</h2>
              <div className="mt-4 space-y-3 text-sm">
                <Row label="Current owner" value={r.ownership.currentOwner} mono />
                <Row label="Status" value={r.ownership.status} />
                <Row label="Transferable" value={r.ownership.transferable ? "Yes" : "No"} />
                <Row label="Receipt id" value={r.id} mono />
                {r.proof.onchain?.txHash ? <Row label="Anchor tx" value={r.proof.onchain.txHash} mono /> : null}
              </div>
            </section>
          </div>

          {(r.rights.length > 0 || r.warranty) && (
            <section className="mt-6 rounded-2xl border border-[#e5e5ed] p-5">
              <h2 className="text-xs font-bold uppercase tracking-[.13em] text-[#1200cc]">
                Rights {r.warranty ? "and warranty" : ""}
              </h2>
              {r.rights.length > 0 && (
                <ul className="mt-4 space-y-2 text-sm text-[#393063]">
                  {r.rights.map((right) => (
                    <li key={right.name} className="flex items-start justify-between gap-4">
                      <span>
                        <span className="font-medium">{right.name}</span>
                        {right.description ? <span className="text-[#7a748f]"> — {right.description}</span> : null}
                      </span>
                      {right.expiresAt ? <span className="text-xs text-[#8a849e]">{date(right.expiresAt)}</span> : null}
                    </li>
                  ))}
                </ul>
              )}
              {r.warranty && (
                <div className="mt-4 rounded-xl bg-[#f4f4f8] p-4 text-sm">
                  <p className="font-medium">Warranty / support</p>
                  <p className="mt-1 text-[#5c5c68]">
                    Provided by {r.warranty.provider}
                    {r.warranty.expiresAt ? ` · expires ${date(r.warranty.expiresAt)}` : ""}
                  </p>
                  {r.warranty.supportUrl ? (
                    <a className="mt-2 inline-block font-semibold text-[#1200cc]" href={r.warranty.supportUrl}>
                      Contact support ↗
                    </a>
                  ) : null}
                </div>
              )}
            </section>
          )}

          {r.transfers.length > 0 && (
            <section className="mt-6 rounded-2xl border border-[#e5e5ed] p-5">
              <h2 className="text-xs font-bold uppercase tracking-[.13em] text-[#1200cc]">Transfer history</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {r.transfers.map((transfer) => (
                  <li key={transfer.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eeeeF2] pb-3 last:border-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate font-medium">
                        {transfer.from.slice(0, 12)}… → {transfer.to.slice(0, 12)}…
                      </p>
                      {transfer.reference ? <p className="text-xs text-[#80808c]">{transfer.reference}</p> : null}
                    </div>
                    <span className="text-xs text-[#80808c]">{date(transfer.at)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-6 rounded-2xl bg-[#0a0a14] p-5 text-white">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold">Verification status</h2>
                <p className="mt-1 text-xs text-white/60">Checked at {new Date().toISOString()}</p>
              </div>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-[#22c55e] text-lg">✓</span>
            </div>
            <dl className="mt-4 grid gap-3 text-xs sm:grid-cols-3">
              <div className="rounded-xl bg-white/10 p-3">
                <dt className="text-white/50">Signature</dt>
                <dd className="mt-1 font-medium text-[#9ef0c0]">HMAC-SHA256 verified</dd>
              </div>
              <div className="rounded-xl bg-white/10 p-3">
                <dt className="text-white/50">Onchain anchor</dt>
                <dd className="mt-1 font-medium text-[#9ef0c0]">
                  {onchain.configured ? (onchain.matchesHash ? "Matches registry" : "Not anchored") : "Not configured"}
                </dd>
              </div>
              <div className="rounded-xl bg-white/10 p-3">
                <dt className="text-white/50">Receipt id</dt>
                <dd className="mt-1 break-all font-medium text-[#c9cbe5]">{r.id}</dd>
              </div>
            </dl>
          </section>
        </div>
      </section>
    </main>
  );
}

function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-5 border-b border-[#eeeeF2] pb-3 last:border-0 last:pb-0">
      <span className="text-xs text-[#858590]">{label}</span>
      <span className={`break-all text-right text-sm font-medium text-[#272732] ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </span>
    </div>
  );
}