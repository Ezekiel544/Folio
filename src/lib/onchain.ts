import {
  Contract,
  JsonRpcProvider,
  encodeBytes32String,
  getAddress,
  keccak256,
  toUtf8Bytes,
  Wallet,
} from "ethers";
import { stableStringify } from "./canonical.ts";
import { env } from "./env.ts";

/**
 * On-chain anchoring for Folio receipts.
 *
 * The full receipt lives offchain; only a hash of the complete signed receipt is
 * anchored in the ReceiptRegistry so it cannot be rewritten or repudiated.
 *
 * Everything degrades gracefully when onchain env vars are not configured
 * (development). When configured, anchoring failures are surfaced loudly.
 */

export const RECEIPT_REGISTRY_ABI = [
  "function issue(bytes32 receiptId, bytes32 receiptHash, address owner)",
  "function transfer(bytes32 receiptId, address to)",
  "function revoke(bytes32 receiptId)",
  "function get(bytes32 receiptId) view returns (tuple(bytes32 receiptHash, address issuer, address owner, uint64 issuedAt, bool exists, bool revoked))",
] as const;

export function isOnchainConfigured(): boolean {
  return Boolean(
    env("PHAROS_RPC_URL", "") &&
      env("PHAROS_RECEIPT_REGISTRY_ADDRESS", "") &&
      env("PHAROS_ISSUER_PRIVATE_KEY", ""),
  );
}

/**
 * Map a receipt id (e.g. "rcpt_abc…") to a bytes32 anchor id.
 * Short ASCII ids are packed directly; anything else is keccak-hashed.
 */
export function receiptIdToBytes32(receiptId: string): string {
  if (receiptId.length <= 31 && /^[\x20-\x7e]*$/.test(receiptId)) {
    return encodeBytes32String(receiptId);
  }
  return keccak256(toUtf8Bytes(receiptId));
}

/**
 * The hash of the full signed receipt that becomes the on-chain proof.
 */
export function computeReceiptHash(receipt: unknown): string {
  return keccak256(toUtf8Bytes(stableStringify(receipt)));
}

export type Anchored = {
  txHash: string;
  chainId: bigint;
};

let _provider: JsonRpcProvider | null = null;
let _account: Contract | null = null;

function registry(): { account: Contract } | null {
  if (!isOnchainConfigured()) return null;
  if (!_provider) {
    _provider = new JsonRpcProvider(env("PHAROS_RPC_URL", ""));
  }
  if (!_account) {
    const wallet = new Wallet(env("PHAROS_ISSUER_PRIVATE_KEY", ""), _provider);
    _account = new Contract(
      getAddress(env("PHAROS_RECEIPT_REGISTRY_ADDRESS", "")),
      RECEIPT_REGISTRY_ABI,
      wallet,
    );
  }
  return { account: _account as unknown as Contract };
}

function ownerAddressFor(receipt: {
  ownership?: { currentOwner?: string };
  buyer?: { wallet?: string };
}): string | null {
  const candidate =
    receipt.ownership?.currentOwner ?? receipt.buyer?.wallet ?? "";
  if (/^0x[a-fA-F0-9]{40}$/.test(candidate.trim())) {
    try {
      return getAddress(candidate.trim());
    } catch {
      return null;
    }
  }
  return null;
}

export async function anchorIssue(receipt: { id: string }): Promise<Anchored | null> {
  const ctx = registry();
  if (!ctx) return null;
  const owner = ownerAddressFor(receipt as ReceiptLike);
  if (!owner) return null; // buyer has no onchain address to anchor to
  const chainId = (await ctx.account.getChainId());
  const tx = await ctx.account.issue(
    receiptIdToBytes32(receipt.id),
    computeReceiptHash(receipt),
    owner,
  );
  const mined = await tx.wait();
  if (!mined) throw new Error("Onchain issue transaction was not mined");
  return { txHash: mined.hash, chainId };
}

export type ReceiptLike = {
  id?: string;
  ownership?: { currentOwner?: string };
  buyer?: { wallet?: string };
};

export async function anchorTransfer(
  receiptId: string,
  toAddress: string,
): Promise<Anchored | null> {
  const ctx = registry();
  if (!ctx) return null;
  const chainId = (await ctx.account.getChainId());
  const tx = await ctx.account.transfer(receiptIdToBytes32(receiptId), getAddress(toAddress));
  const mined = await tx.wait();
  if (!mined) throw new Error("Onchain transfer transaction was not mined");
  return { txHash: mined.hash, chainId };
}

export async function anchorRevoke(receiptId: string): Promise<Anchored | null> {
  const ctx = registry();
  if (!ctx) return null;
  const chainId = (await ctx.account.getChainId());
  const tx = await ctx.account.revoke(receiptIdToBytes32(receiptId));
  const mined = await tx.wait();
  if (!mined) throw new Error("Onchain revoke transaction was not mined");
  return { txHash: mined.hash, chainId };
}

export type OnchainProofResult = {
  configured: boolean;
  registry?: string;
  chainId?: number;
  exists?: boolean;
  revoked?: boolean;
  owner?: string;
  issuer?: string;
  issuedAt?: number;
  receiptHash?: string;
  matchesHash?: boolean;
  error?: string;
};

export async function getOnchainProof(
  receiptId: string,
  receipt?: { id: string },
): Promise<OnchainProofResult> {
  const ctx = registry();
  if (!ctx) return { configured: false };
  try {
    const chainId = (await ctx.account.getChainId());
    const proof = await ctx.account.get(receiptIdToBytes32(receiptId));
    return {
      configured: true,
      registry: (ctx.account as unknown as { target: string }).target,
      chainId: Number(chainId),
      exists: proof.exists as boolean,
      revoked: proof.revoked as boolean,
      owner: proof.owner as string,
      issuer: proof.issuer as string,
      issuedAt: Number(proof.issuedAt as bigint),
      receiptHash: proof.receiptHash as string,
      matchesHash: receipt
        ? (proof.receiptHash as string) === computeReceiptHash(receipt)
        : undefined,
    };
  } catch (error) {
    return {
      configured: true,
      registry: (ctx.account as unknown as { target: string }).target,
      chainId: Number((await ctx.account.getChainId())),
      error: error instanceof Error ? error.message : "Onchain read failed",
    };
  }
}