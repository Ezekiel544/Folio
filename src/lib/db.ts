import { Pool, type QueryResultRow } from "pg";
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

let _pool: Pool | null = null;
let _init: Promise<void> | null = null;

/**
 * Table name. Defaults to `receipts`; tests override this so they never touch
 * production data.
 */
export function tableName(): string {
  return env("PHAROS_DB_TABLE", "receipts");
}

export function getPool(): Pool {
  if (_pool) return _pool;
  _pool = new Pool({
    connectionString: env("DATABASE_URL"),
    ssl: { rejectUnauthorized: false },
    max: 10,
  });
  _pool.on("error", (error) => {
    console.error("[folio] postgres pool error", error);
  });
  return _pool;
}

async function ensureSchema(): Promise<void> {
  const t = tableName();
  const sql = `
    CREATE TABLE IF NOT EXISTS ${t} (
      id TEXT PRIMARY KEY,
      receipt_json TEXT NOT NULL,
      buyer_id TEXT,
      buyer_wallet TEXT,
      current_owner TEXT,
      status TEXT NOT NULL DEFAULT 'owned',
      seller_name TEXT,
      product_name TEXT,
      purchased_at TEXT,
      amount DOUBLE PRECISION,
      currency TEXT,
      payment_reference TEXT,
      onchain_tx_hash TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_${t}_owner ON ${t}(current_owner);
    CREATE INDEX IF NOT EXISTS idx_${t}_buyer ON ${t}(buyer_id);
    CREATE INDEX IF NOT EXISTS idx_${t}_status ON ${t}(status);
    CREATE INDEX IF NOT EXISTS idx_${t}_created ON ${t}(created_at DESC);
  `;
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(sql);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

function init(): Promise<void> {
  if (!_init) _init = ensureSchema();
  return _init;
}

export async function queryAll<T extends QueryResultRow = ReceiptRow>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  await init();
  const result = await getPool().query<T>(sql, params);
  return result.rows;
}

export async function queryOne<T extends QueryResultRow = ReceiptRow>(
  sql: string,
  params: unknown[] = [],
): Promise<T | undefined> {
  const rows = await queryAll<T>(sql, params);
  return rows[0];
}

export async function run(sql: string, params: unknown[] = []): Promise<void> {
  await init();
  await getPool().query(sql, params);
}

/**
 * Thin alias kept for callers that previously used getDb(). Returns the pool.
 */
export function getDb(): Pool {
  return getPool();
}

export async function closeDb(): Promise<void> {
  if (_pool) {
    await _pool.end();
    _pool = null;
    _init = null;
  }
}