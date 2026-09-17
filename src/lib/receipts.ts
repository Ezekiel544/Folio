import { randomUUID } from "crypto";
import { getAddress } from "ethers";
import {
  legacySignObject,
  signaturesEqual,
  signObject,
} from "./canonical.ts";
import { getDb, type ReceiptRow } from "./db.ts";
import {
  anchorIssue,
  anchorRevoke,
  anchorTransfer,
  getOnchainProof,
  isOnchainConfigured,
} from "./onchain.ts";

export type ReceiptStatus = "owned" | "transferred" | "revoked";
export type Transfer = {
  id: string;
  from: string;
  to: string;
  at: string;
  reference?: string;
};
export type Right = { name: string; description?: string; expiresAt?: string };
export type Receipt = {
  id: string;
  version: "1.0";
  product: { name: string; description?: string; sku?: string; metadataUrl?: string };
  buyer: { id: string; wallet?: string; email?: string };
  seller: { id: string; name: string; website?: string };
  purchasedAt: string;
  payment: {
    amount: number;
    currency: string;
    reference: string;
    transactionHash?: string;
    chainId?: number;
  };
  ownership: {
    status: ReceiptStatus;
    currentOwner: string;
    transferable: boolean;
    revokedAt?: string;
    revocationReason?: string;
  };
  transfers: Transfer[];
  rights: Right[];
  warranty?: { provider: string; expiresAt?: string; supportUrl?: string };
  proof: {
    algorithm: "HMAC-SHA256";
    signature: string;
    issuedAt: string;
    /** Present only in API responses when an onchain anchor exists. Not part of the signed payload. */
    onchain?: { txHash: string };
  };
};

export type NewReceipt = Omit<Receipt, "id" | "version" | "transfers" | "proof"> & {
  ownership?: Partial<Receipt["ownership"]>;
};

export type VerifyResult =
  | { valid: true; receipt: Receipt; onchain: OnchainSummary }
  | { valid: false; reason: string };

type OnchainSummary = {
  configured: boolean;
  exists?: boolean;
  revoked?: boolean;
  matchesHash?: boolean;
  owner?: string;
  chainId?: number;
  registry?: string;
  txHash?: string;
  error?: string;
};

/**
 * Identity handling.
 *
 * Receipts reference buyers and owners that can be either a human-readable id
 * ("acme#20435") or a wallet address (0x…). Normalisation lets us compare them
 * consistently and makes sure the same wallet in different casings matches.
 */
export function normalizeIdentity(identity: string): string {
  const trimmed = identity.trim();
  if (/^0x[a-fA-F0-9]{40}$/.test(trimmed)) {
    try {
      return getAddress(trimmed).toLowerCase();
    } catch {
      return trimmed.toLowerCase();
    }
  }
  return trimmed.toLowerCase();
}

export function identitiesMatch(a: string, b: string): boolean {
  return normalizeIdentity(a) === normalizeIdentity(b);
}

export function receiptIdentifies(receipt: Receipt, identity: string): boolean {
  return (
    identitiesMatch(receipt.buyer.id, identity) ||
    (receipt.buyer.wallet ? identitiesMatch(receipt.buyer.wallet, identity) : false) ||
    identitiesMatch(receipt.ownership.currentOwner, identity)
  );
}

export function assertIssuePayload(value: unknown): asserts value is NewReceipt {
  const r = value as Partial<NewReceipt>;
  if (
    !r?.product?.name ||
    !r?.buyer?.id ||
    !r?.seller?.id ||
    !r?.seller?.name ||
    !r?.purchasedAt ||
    !r?.payment?.reference ||
    typeof r.payment.amount !== "number" ||
    !r.payment.currency
  ) {
    throw new Error(
      "product.name, buyer.id, seller.id, seller.name, purchasedAt, payment.amount, payment.currency and payment.reference are required.",
    );
  }
}

function rowFromReceipt(
  receipt: Receipt,
  extra?: { onchainTxHash?: string | null },
): Record<string, unknown> {
  const now = new Date().toISOString();
  return {
    id: receipt.id,
    receipt_json: JSON.stringify(receipt),
    buyer_id: receipt.buyer.id,
    buyer_wallet: receipt.buyer.wallet ?? null,
    current_owner: receipt.ownership.currentOwner,
    status: receipt.ownership.status,
    seller_name: receipt.seller.name,
    product_name: receipt.product.name,
    purchased_at: receipt.purchasedAt,
    amount: receipt.payment.amount,
    currency: receipt.payment.currency,
    payment_reference: receipt.payment.reference,
    onchain_tx_hash: extra?.onchainTxHash ?? null,
    created_at: now,
    updated_at: now,
  };
}

function receiptFromRow(row: ReceiptRow): Receipt {
  return JSON.parse(row.receipt_json) as Receipt;
}

/**
 * Presentation-only normalization.
 *
 * Must never run before signature or onchain-hash verification: those are
 * computed over the exact stored payload, and adding a missing array would
 * change the canonical bytes. `receiptFromRow` therefore stays raw, and callers
 * apply this only after all cryptographic checks pass.
 */
export function normalizeReceipt(receipt: Receipt): Receipt {
  return {
    ...receipt,
    transfers: receipt.transfers ?? [],
    rights: receipt.rights ?? [],
  };
}

async function anchor(
  receipt: Receipt,
): Promise<{ txHash: string; chainId: bigint } | null> {
  if (!isOnchainConfigured()) return null;
  try {
    return await anchorIssue(receipt);
  } catch (error) {
    throw new Error(
      `Receipt saved but onchain anchoring failed: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

function txHashFor(db: ReturnType<typeof getDb>, id: string): string | null {
  const row = db.prepare("SELECT onchain_tx_hash FROM receipts WHERE id = ?").get(id) as
    | { onchain_tx_hash: string | null }
    | undefined;
  return row?.onchain_tx_hash ?? null;
}

function withOnchain(receipt: Receipt, txHash: string | null): Receipt {
  if (!isOnchainConfigured()) return receipt;
  return {
    ...receipt,
    proof: {
      ...receipt.proof,
      onchain: txHash ? { txHash } : undefined,
    },
  };
}

export async function issueReceipt(input: NewReceipt): Promise<Receipt> {
  assertIssuePayload(input);
  const ownership = {
    status: "owned" as const,
    currentOwner: input.ownership?.currentOwner || input.buyer.id,
    transferable: input.ownership?.transferable ?? true,
  };
  const now = new Date().toISOString();
  const unsigned = {
    ...input,
    id: `rcpt_${randomUUID().replaceAll("-", "")}`,
    version: "1.0" as const,
    ownership,
    transfers: [],
    rights: input.rights ?? [],
  };
  const receipt: Receipt = {
    ...unsigned,
    proof: { algorithm: "HMAC-SHA256", signature: signObject(unsigned), issuedAt: now },
  };

  const db = getDb();
  db.prepare(
    `INSERT OR REPLACE INTO receipts
      (id, receipt_json, buyer_id, buyer_wallet, current_owner, status,
       seller_name, product_name, purchased_at, amount, currency,
       payment_reference, onchain_tx_hash, created_at, updated_at)
     VALUES
      (@id, @receipt_json, @buyer_id, @buyer_wallet, @current_owner, @status,
       @seller_name, @product_name, @purchased_at, @amount, @currency,
       @payment_reference, @onchain_tx_hash, @created_at, @updated_at)`,
  ).run(rowFromReceipt(receipt));

  const anchoring = await anchor(receipt);
  if (anchoring) {
    db.prepare(
      "UPDATE receipts SET onchain_tx_hash = ?, updated_at = ? WHERE id = ?",
    ).run(anchoring.txHash, now, receipt.id);
  }

  return withOnchain(receipt, anchoring?.txHash ?? null);
}

export async function listReceipts(identity?: string): Promise<Receipt[]> {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM receipts ORDER BY created_at DESC")
    .all() as unknown as ReceiptRow[];
  const all = rows.map((row) => normalizeReceipt(receiptFromRow(row)));
  if (!identity) return all;
  return all.filter((receipt) => receiptIdentifies(receipt, identity));
}

export async function getReceipt(id: string): Promise<Receipt | null> {
  const row = getDb().prepare("SELECT * FROM receipts WHERE id = ?").get(id) as
    | ReceiptRow
    | undefined;
  return row ? receiptFromRow(row) : null;
}

export async function verifyReceipt(id: string): Promise<VerifyResult> {
  const receipt = await getReceipt(id);
  if (!receipt) return { valid: false, reason: "Receipt not found" };

  const { proof, ...unsigned } = receipt;
  const signatureValid =
    signaturesEqual(proof.signature, signObject(unsigned)) ||
    signaturesEqual(proof.signature, legacySignObject(unsigned));

  let onchain: OnchainSummary = { configured: false };
  if (isOnchainConfigured()) {
    const proofResult = await getOnchainProof(id, receipt);
    onchain = {
      configured: true,
      exists: proofResult.exists,
      revoked: proofResult.revoked,
      matchesHash: proofResult.matchesHash,
      owner: proofResult.owner,
      chainId: proofResult.chainId,
      registry: proofResult.registry,
      txHash: txHashFor(getDb(), id) ?? undefined,
      error: proofResult.error,
    };
  }

  if (!signatureValid) return { valid: false, reason: "Receipt signature is invalid" };

  const onchainValid =
    !onchain.configured ||
    (Boolean(onchain.exists) && Boolean(onchain.matchesHash) && !onchain.error);
  if (!onchainValid) {
    return { valid: false, reason: "Receipt does not match its onchain anchor" };
  }

  return { valid: true, receipt: normalizeReceipt(receipt), onchain };
}

export async function transferReceipt(
  id: string,
  to: string,
  options: { by?: string; reference?: string } = {},
): Promise<Receipt | null> {
  if (!to || to.trim() === "") throw new Error("A destination identity is required.");
  const db = getDb();
  const row = db.prepare("SELECT * FROM receipts WHERE id = ?").get(id) as
    | ReceiptRow
    | undefined;
  if (!row) return null;
  const receipt = normalizeReceipt(receiptFromRow(row));

  if (!receipt.ownership.transferable) {
    throw new Error("This receipt cannot be transferred.");
  }
  if (receipt.ownership.status === "revoked") {
    throw new Error("A revoked receipt cannot be transferred.");
  }
  if (options.by && !receiptIdentifies(receipt, options.by)) {
    throw new Error("Only the current owner or the issuing business can transfer this receipt.");
  }

  const transfer: Transfer = {
    id: `tr_${randomUUID().replaceAll("-", "")}`,
    from: receipt.ownership.currentOwner,
    to,
    reference: options.reference,
    at: new Date().toISOString(),
  };
  const { proof: _oldProof, ...signedBody } = receipt;
  const unsigned = {
    ...signedBody,
    ownership: {
      ...receipt.ownership,
      currentOwner: to,
      status: "transferred" as const,
    },
    transfers: [...(receipt.transfers ?? []), transfer],
  };
  const updated: Receipt = {
    ...unsigned,
    proof: {
      algorithm: "HMAC-SHA256",
      signature: signObject(unsigned),
      issuedAt: new Date().toISOString(),
    },
  };

  db.prepare(
    `UPDATE receipts SET
      receipt_json = ?, buyer_id = ?, buyer_wallet = ?, current_owner = ?,
      status = ?, updated_at = ?
     WHERE id = ?`,
  ).run(
    JSON.stringify(updated),
    updated.buyer.id,
    updated.buyer.wallet ?? null,
    updated.ownership.currentOwner,
    updated.ownership.status,
    new Date().toISOString(),
    id,
  );

  let anchoring: { txHash: string; chainId: bigint } | null = null;
  const ownerAddress =
    updated.ownership.currentOwner &&
    /^0x[a-fA-F0-9]{40}$/.test(updated.ownership.currentOwner)
      ? updated.ownership.currentOwner
      : updated.buyer.wallet;
  if (isOnchainConfigured() && ownerAddress) {
    try {
      anchoring = await anchorTransfer(id, ownerAddress);
    } catch (error) {
      throw new Error(
        `Receipt transferred but onchain anchoring failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  if (anchoring) {
    db.prepare("UPDATE receipts SET onchain_tx_hash = ? WHERE id = ?").run(
      anchoring.txHash,
      id,
    );
  }

  return withOnchain(updated, anchoring?.txHash ?? txHashFor(db, id));
}

export async function revokeReceipt(
  id: string,
  options: { by?: string; reason?: string } = {},
): Promise<Receipt | null> {
  const db = getDb();
  const row = db.prepare("SELECT * FROM receipts WHERE id = ?").get(id) as
    | ReceiptRow
    | undefined;
  if (!row) return null;
  const receipt = normalizeReceipt(receiptFromRow(row));
  if (receipt.ownership.status === "revoked") {
    throw new Error("This receipt is already revoked.");
  }
  if (options.by && !receiptIdentifies(receipt, options.by)) {
    throw new Error("Only the owner or the issuing business can revoke this receipt.");
  }

  const { proof: _oldProof, ...signedBody } = receipt;
  const unsigned = {
    ...signedBody,
    ownership: {
      ...receipt.ownership,
      status: "revoked" as const,
      revokedAt: new Date().toISOString(),
      revocationReason: options.reason,
    },
  };
  const updated: Receipt = {
    ...unsigned,
    proof: {
      algorithm: "HMAC-SHA256",
      signature: signObject(unsigned),
      issuedAt: new Date().toISOString(),
    },
  };

  db.prepare(
    `UPDATE receipts SET
      receipt_json = ?, status = ?, current_owner = ?, updated_at = ?
     WHERE id = ?`,
  ).run(
    JSON.stringify(updated),
    updated.ownership.status,
    updated.ownership.currentOwner,
    new Date().toISOString(),
    id,
  );

  let anchoring: { txHash: string; chainId: bigint } | null = null;
  if (isOnchainConfigured()) {
    try {
      anchoring = await anchorRevoke(id);
    } catch (error) {
      throw new Error(
        `Receipt revoked but onchain anchoring failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
  if (anchoring) {
    db.prepare("UPDATE receipts SET onchain_tx_hash = ? WHERE id = ?").run(
      anchoring.txHash,
      id,
    );
  }

  return updated;
}