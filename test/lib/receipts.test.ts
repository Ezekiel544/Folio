import { after, before, test } from "node:test";
import assert from "node:assert/strict";

process.env.PHAROS_RECEIPT_SECRET = "pharos-test-receipt-secret";
process.env.PHAROS_SESSION_SECRET = "pharos-test-session-secret";
process.env.PHAROS_API_KEY = "pharos-test-api-key";
process.env.NODE_ENV = "test";
process.env.PHAROS_DB_TABLE = "receipts_test";

const { closeDb, run, queryOne, tableName } = await import("../../src/lib/db.ts");
const {
  issueReceipt,
  verifyReceipt,
  listReceipts,
  transferReceipt,
  revokeReceipt,
  identitiesMatch,
  normalizeIdentity,
} = await import("../../src/lib/receipts.ts");
const { signSession, verifySession } = await import("../../src/lib/auth.ts");
const { stableStringify, signObject } = await import("../../src/lib/canonical.ts");

const WALLET_A = "0x5AbC9A45e5C123456789012345678901234567890";
const WALLET_B = "0xDeF0987654321cBA987654321abcdef012345678";

function issueInput(overrides: Record<string, unknown> = {}) {
  return {
    product: { name: "Creator Pass" },
    buyer: { id: "ezekiel", wallet: WALLET_A },
    seller: { id: "studio", name: "Studio Inc." },
    purchasedAt: new Date().toISOString(),
    payment: { amount: 49, currency: "USD", reference: "order_123" },
    rights: [{ name: "Lifetime access" }],
    warranty: { provider: "support@studio.com" },
    ...overrides,
  };
}

before(async () => {
  await run(`DELETE FROM ${tableName()}`);
});

after(async () => {
  await closeDb();
});

test("issueReceipt creates a signed, owned receipt", async () => {
  const receipt = await issueReceipt(issueInput({ payment: { amount: 49, currency: "USD", reference: "order_123" } }) as never);
  assert.match(receipt.id, /^rcpt_[0-9a-f]+$/);
  assert.equal(receipt.version, "1.0");
  assert.equal(receipt.ownership.status, "owned");
  assert.equal(receipt.ownership.currentOwner, "ezekiel");
  assert.deepEqual(receipt.transfers, []);
  assert.equal(receipt.proof.algorithm, "HMAC-SHA256");
  assert.ok(receipt.proof.signature.length >= 64);
  assert.deepEqual(receipt.rights, [{ name: "Lifetime access" }]);
  assert.equal(receipt.warranty?.provider, "support@studio.com");
});

test("verifyReceipt passes for a freshly issued receipt", async () => {
  const receipt = await issueReceipt(issueInput() as never);
  const result = await verifyReceipt(receipt.id);
  assert.ok(result.valid, "should verify");
});

test("verifyReceipt fails when the stored receipt is tampered with", async () => {
  const receipt = await issueReceipt(issueInput() as never);
  const stored = JSON.parse(
    (await queryOne<{ receipt_json: string }>(
      `SELECT receipt_json FROM ${tableName()} WHERE id = $1`,
      [receipt.id],
    ))!.receipt_json,
  );
  stored.payment.amount = 999999;
  await run(
    `UPDATE ${tableName()} SET receipt_json = $1 WHERE id = $2`,
    [JSON.stringify(stored), receipt.id],
  );
  const result = await verifyReceipt(receipt.id);
  assert.equal(result.valid, false);
});

test("listReceipts filters by human-readable buyer id", async () => {
  await issueReceipt(issueInput({ buyer: { id: "alice", wallet: WALLET_A } }) as never);
  const mine = await listReceipts("alice");
  assert.ok(mine.every((r) => r.buyer.id === "alice" || r.ownership.currentOwner === "alice"));
  assert.ok(mine.length >= 1);
});

test("listReceipts matches wallet identities case-insensitively", async () => {
  await issueReceipt(
    issueInput({ buyer: { id: "bob", wallet: WALLET_B } }) as never,
  );
  const upper = await listReceipts(WALLET_B.toUpperCase());
  assert.ok(upper.some((r) => r.buyer.wallet === WALLET_B));
  const normalized = listReceipts;
  assert.equal(typeof normalized, "function");
  assert.ok(identitiesMatch(WALLET_B, WALLET_B.toUpperCase()));
});

test("transferReceipt moves ownership and appends history", async () => {
  const receipt = await issueReceipt(issueInput() as never);
  const updated = await transferReceipt(receipt.id, "mallory", {
    by: "ezekiel",
    reference: "gift",
  });
  assert.ok(updated);
  assert.equal(updated.ownership.currentOwner, "mallory");
  assert.equal(updated.ownership.status, "transferred");
  assert.equal(updated.transfers.length, 1);
  assert.equal(updated.transfers[0].from, "ezekiel");
  assert.equal(updated.transfers[0].to, "mallory");
  const verified = await verifyReceipt(receipt.id);
  assert.ok(verified.valid);
});

test("transferReceipt rejects when the caller does not own the receipt", async () => {
  const receipt = await issueReceipt(issueInput() as never);
  await assert.rejects(
    transferReceipt(receipt.id, "mallory", { by: "intruder" }),
    /Only the current owner/,
  );
});

test("transferReceipt rejects when the receipt is not transferable", async () => {
  const receipt = await issueReceipt(
    issueInput({ ownership: { transferable: false } }) as never,
  );
  await assert.rejects(
    transferReceipt(receipt.id, "mallory", { by: "ezekiel" }),
    /cannot be transferred/,
  );
});

test("revokeReceipt marks the receipt revoked and blocks transfers", async () => {
  const receipt = await issueReceipt(issueInput() as never);
  const revoked = await revokeReceipt(receipt.id, {
    by: "ezekiel",
    reason: "chargeback",
  });
  assert.equal(revoked?.ownership.status, "revoked");
  assert.equal(revoked?.ownership.revocationReason, "chargeback");
  assert.ok(revoked?.ownership.revokedAt);
  await assert.rejects(
    transferReceipt(receipt.id, "mallory", { by: "ezekiel" }),
    /revoked receipt cannot be transferred/,
  );
});

test("revokeReceipt rejects non-owners", async () => {
  const receipt = await issueReceipt(issueInput() as never);
  await assert.rejects(
    revokeReceipt(receipt.id, { by: "intruder" }),
    /Only the owner/,
  );
});

test("verifyReceipt is invalid for an unknown receipt", async () => {
  const result = await verifyReceipt("rcpt_does_not_exist");
  assert.equal(result.valid, false);
});

test("identitiesMatch handles wallet address casing", async () => {
  assert.equal(
    identitiesMatch(WALLET_A, WALLET_A.toLowerCase()),
    true,
  );
  assert.equal(identitiesMatch(WALLET_A, WALLET_B), false);
  assert.equal(identitiesMatch("acme#42", "acme#42"), true);
});

test("normalizeIdentity lowercases human ids", async () => {
  assert.equal(normalizeIdentity("Acme#42"), "acme#42");
});

test("sessions: sign and verify a wallet sidecar", async () => {
  const token = signSession(WALLET_A);
  assert.equal(verifySession(token), WALLET_A.toLowerCase());
  assert.equal(verifySession(`${token.slice(0, -4)}ffff`), null);
  assert.equal(verifySession(""), null);
});

test("signatures are stable regardless of object key order", async () => {
  const left = signObject({ a: 1, b: { c: 2 } });
  const right = signObject({ b: { c: 2 }, a: 1 });
  assert.equal(left, right);
  assert.equal(
    stableStringify({ b: 1, a: [1, { d: 2, c: 3 }] }),
    stableStringify({ a: [1, { c: 3, d: 2 }], b: 1 }),
  );
});

test("stableStringify drops undefined properties like JSON does", async () => {
  assert.equal(
    stableStringify({ a: 1, b: undefined, c: { d: 2, e: undefined } }),
    stableStringify({ a: 1, c: { d: 2 } }),
  );
  assert.equal(stableStringify({ a: undefined }), "{}");
  // A JSON round-trip (how receipts are stored) must not change the canonical
  // form, otherwise the stored signature can never verify again.
  const value = { a: 1, b: undefined, nested: { c: "x", d: undefined } };
  assert.equal(
    stableStringify(value),
    stableStringify(JSON.parse(JSON.stringify(value))),
  );
});

test("transferReceipt verifies when the optional reference is omitted", async () => {
  const receipt = await issueReceipt(issueInput() as never);
  const updated = await transferReceipt(receipt.id, "mallory", { by: "ezekiel" });
  assert.ok(updated);
  assert.equal(updated.transfers[0].reference, undefined);
  const verified = await verifyReceipt(receipt.id);
  assert.ok(verified.valid, "signature must survive a JSON round-trip");
});

test("revokeReceipt verifies when the optional reason is omitted", async () => {
  const receipt = await issueReceipt(issueInput() as never);
  const revoked = await revokeReceipt(receipt.id, { by: "ezekiel" });
  assert.equal(revoked?.ownership.status, "revoked");
  const verified = await verifyReceipt(receipt.id);
  assert.ok(verified.valid, "signature must survive a JSON round-trip");
});

test("a stored receipt with no rights key still verifies and normalizes to []", async () => {
  const receipt = await issueReceipt(issueInput() as never);
  const stored = JSON.parse(
    (await queryOne<{ receipt_json: string }>(
      `SELECT receipt_json FROM ${tableName()} WHERE id = $1`,
      [receipt.id],
    ))!.receipt_json,
  );

  // Simulate a record written before `rights` was persisted: remove the key and
  // re-sign so it is a genuinely valid legacy payload.
  const legacy = stored;
  delete legacy.rights;
  const { proof: _proof, ...unsigned } = legacy;
  legacy.proof.signature = signObject(unsigned);
  await run(
    `UPDATE ${tableName()} SET receipt_json = $1 WHERE id = $2`,
    [JSON.stringify(legacy), receipt.id],
  );

  const verified = await verifyReceipt(receipt.id);
  assert.ok(verified.valid, "the raw stored payload must still verify");
  if (verified.valid) {
    assert.deepEqual(verified.receipt.rights, []);
    assert.deepEqual(verified.receipt.transfers, []);
  }

  const listed = (await listReceipts("ezekiel")).find((r) => r.id === receipt.id);
  assert.ok(listed, "receipt should be listed");
  assert.deepEqual(listed!.rights, []);
  assert.deepEqual(listed!.transfers, []);
});

