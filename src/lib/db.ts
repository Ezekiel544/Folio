import Database from "better-sqlite3";
import { existsSync, mkdirSync, readFileSync } from "fs";
import path from "path";
import { env } from "./env.ts";

export type ReceiptRow = {
  id: string;
  receipt_json: string;
  buyer_id: string | null;
  buyer_wallet: string | null;
  current_owner: string | null;
  status: string | null;
  seller_name: string | null;
  product_name: string | null;
  purchased_at: string | null;
  amount: number | null;
  currency: string | null;
  payment_reference: string | null;
  onchain_tx_hash: string | null;
  created_at: string;
  updated_at: string;
};

let _db: Database.Database | null = null;

export function dataDir(): string {
  return env("PHAROS_DATA_DIR", path.join(process.cwd(), "data"));
}

function open(): Database.Database {
  mkdirSync(dataDir(), { recursive: true });
  const file = path.join(dataDir(), "receipts.db");
  const db = new Database(file);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.exec(`
    CREATE TABLE IF NOT EXISTS receipts (
      id TEXT PRIMARY KEY,
      receipt_json TEXT NOT NULL,
      buyer_id TEXT,
      buyer_wallet TEXT,
      current_owner TEXT,
      status TEXT NOT NULL DEFAULT 'owned',
      seller_name TEXT,
      product_name TEXT,
      purchased_at TEXT,
      amount REAL,
      currency TEXT,
      payment_reference TEXT,
      onchain_tx_hash TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_receipts_owner ON receipts(current_owner);
    CREATE INDEX IF NOT EXISTS idx_receipts_buyer ON receipts(buyer_id);
    CREATE INDEX IF NOT EXISTS idx_receipts_status ON receipts(status);
    CREATE INDEX IF NOT EXISTS idx_receipts_created ON receipts(created_at DESC);
  `);
  migrateLegacy(db);
  return db;
}

function migrateLegacy(db: Database.Database): void {
  const legacyFile = path.join(dataDir(), "receipts.json");
  if (!existsSync(legacyFile)) return;
  try {
    const parsed = JSON.parse(readFileSync(legacyFile, "utf8")) as Record<string, unknown>[];
    if (!Array.isArray(parsed) || parsed.length === 0) return;
    const { c } = db.prepare("SELECT COUNT(*) AS c FROM receipts").get() as { c: number };
    if (c > 0) return;
    const insert = db.prepare(`
      INSERT OR IGNORE INTO receipts
        (id, receipt_json, buyer_id, buyer_wallet, current_owner, status,
         seller_name, product_name, purchased_at, amount, currency,
         payment_reference, onchain_tx_hash, created_at, updated_at)
      VALUES
        (@id, @receipt_json, @buyer_id, @buyer_wallet, @current_owner, @status,
         @seller_name, @product_name, @purchased_at, @amount, @currency,
         @payment_reference, @onchain_tx_hash, @created_at, @updated_at)
    `);
    const tx = db.transaction((rows: Record<string, unknown>[]) => {
      for (const raw of rows) insert.run(columnsForRow(raw));
    });
    tx(parsed);
    console.info(
      `[folio] imported ${parsed.length} receipt(s) from legacy data/receipts.json`,
    );
  } catch (error) {
    console.warn("[folio] could not migrate legacy receipts.json", error);
  }
}

function columnsForRow(raw: Record<string, unknown>) {
  const time = new Date().toISOString();
  const buyer = (raw.buyer ?? {}) as Record<string, unknown>;
  const seller = (raw.seller ?? {}) as Record<string, unknown>;
  const product = (raw.product ?? {}) as Record<string, unknown>;
  const payment = (raw.payment ?? {}) as Record<string, unknown>;
  const ownership = (raw.ownership ?? {}) as Record<string, unknown>;
  return {
    id: String(raw.id ?? ""),
    receipt_json: JSON.stringify(raw),
    buyer_id: buyer.id ? String(buyer.id) : null,
    buyer_wallet: buyer.wallet ? String(buyer.wallet) : null,
    current_owner: ownership.currentOwner ? String(ownership.currentOwner) : null,
    status: ownership.status ? String(ownership.status) : "owned",
    seller_name: seller.name ? String(seller.name) : null,
    product_name: product.name ? String(product.name) : null,
    purchased_at: raw.purchasedAt ? String(raw.purchasedAt) : null,
    amount: typeof payment.amount === "number" ? payment.amount : null,
    currency: payment.currency ? String(payment.currency) : null,
    payment_reference: payment.reference ? String(payment.reference) : null,
    onchain_tx_hash: null,
    created_at: time,
    updated_at: time,
  };
}

export function getDb(): Database.Database {
  if (!_db) _db = open();
  return _db;
}

export function closeDb(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}