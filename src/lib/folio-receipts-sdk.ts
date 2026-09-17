/**
 * Folio receipts server-side SDK.
 *
 * Use from your backend service to issue portable receipts right after a
 * successful checkout. The receipt is signed, stored, independently
 * verifiable and transfer-ready.
 *
 * ```ts
 * import { FolioReceipts } from "@folio/sdk";
 *
 * const folio = new FolioReceipts(
 *   process.env.PHAROS_BASE_URL!,
 *   process.env.PHAROS_API_KEY!,
 * );
 *
 * const { receipt } = await folio.issue({
 *   product: { name: "Creator Pass" },
 *   buyer: { id: buyerId },
 *   seller: { id: "studio", name: "Studio Inc." },
 *   purchasedAt: new Date().toISOString(),
 *   payment: { amount: 49, currency: "USD", reference: orderId },
 *   rights: [{ name: "Lifetime access" }],
 *   warranty: { provider: "support@studio.com" },
 * });
 * ```
 */

export type IssueReceiptInput = {
  product: {
    name: string;
    description?: string;
    sku?: string;
    metadataUrl?: string;
  };
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
  rights?: { name: string; description?: string; expiresAt?: string }[];
  warranty?: { provider: string; expiresAt?: string; supportUrl?: string };
};

export type Receipt = {
  id: string;
  version: "1.0";
  product: IssueReceiptInput["product"];
  buyer: IssueReceiptInput["buyer"];
  seller: IssueReceiptInput["seller"];
  purchasedAt: string;
  payment: IssueReceiptInput["payment"];
  ownership: {
    status: "owned" | "transferred" | "revoked";
    currentOwner: string;
    transferable: boolean;
    revokedAt?: string;
    revocationReason?: string;
  };
  transfers: {
    id: string;
    from: string;
    to: string;
    at: string;
    reference?: string;
  }[];
  rights: IssueReceiptInput["rights"] extends infer T
    ? T extends undefined
      ? { name: string; description?: string; expiresAt?: string }[]
      : T
    : never;
  warranty?: IssueReceiptInput["warranty"];
  proof: {
    algorithm: "HMAC-SHA256";
    signature: string;
    issuedAt: string;
    onchain?: { txHash: string };
  };
};

type RequestInitLike = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
};

export class FolioReceipts {
  constructor(
    private baseUrl: string,
    private apiKey: string,
  ) {}

  async request<T>(
    path: string,
    init: RequestInitLike = {},
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl.replace(/\/$/, "")}${path}`, {
      method: init.method ?? "GET",
      headers: {
        "content-type": "application/json",
        ...(this.apiKey
          ? { "x-api-key": this.apiKey }
          : {}),
        ...(init.headers ?? {}),
      },
      ...(init.body ? { body: init.body } : {}),
    });
    const payload = (await response.json().catch(() => ({ error: "Invalid response" }))) as {
      error?: string;
      [key: string]: unknown;
    };
    if (!response.ok) {
      throw new Error(payload.error || `Folio request failed (${response.status})`);
    }
    return payload as T;
  }

  /** Issue a portable receipt after a successful purchase. */
  issue(input: IssueReceiptInput): Promise<{ receipt: Receipt }> {
    return this.request("/api/receipts", {
      method: "POST",
      body: JSON.stringify(input),
    });
  }

  /** Fetch a single receipt (public). */
  get(receiptId: string): Promise<{ receipt: Receipt }> {
    return this.request(`/api/receipts/${encodeURIComponent(receiptId)}`);
  }

  /** List receipts, optionally filtered by a buyer/owner identity. */
  list(buyer?: string): Promise<{ receipts: Receipt[] }> {
    const query = buyer
      ? `?buyer=${encodeURIComponent(buyer)}`
      : "";
    return this.request(`/api/receipts${query}`);
  }

  /** Independently verify a receipt's signature and onchain anchor. */
  verify(receiptId: string): Promise<{ valid: boolean; reason?: string; receipt?: Receipt }> {
    return this.request(`/api/receipts/${encodeURIComponent(receiptId)}/verify`);
  }

  /** Transfer ownership to a new buyer id or wallet address. */
  transfer(
    receiptId: string,
    to: string,
    reference?: string,
  ): Promise<{ receipt: Receipt }> {
    return this.request(`/api/receipts/${encodeURIComponent(receiptId)}/transfer`, {
      method: "POST",
      body: JSON.stringify({ to, reference }),
    });
  }

  /** Revoke a receipt (e.g. chargeback, cancelled access). */
  revoke(
    receiptId: string,
    reason?: string,
  ): Promise<{ receipt: Receipt }> {
    return this.request(`/api/receipts/${encodeURIComponent(receiptId)}/revoke`, {
      method: "POST",
      body: JSON.stringify(reason ? { reason } : {}),
    });
  }
}