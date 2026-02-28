import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

let db: Database.Database;

export function getDb(): Database.Database {
  if (db) return db;

  const dbPath = process.env.DATABASE_URL || './data/avantika.db';
  const dir = path.dirname(path.resolve(dbPath));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(path.resolve(dbPath));
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  initSchema();
  return db;
}

function initSchema(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      email       TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at  INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS plans (
      id            TEXT PRIMARY KEY,
      name          TEXT NOT NULL,
      level         TEXT NOT NULL DEFAULT 'free',
      amount        INTEGER NOT NULL,
      currency      TEXT NOT NULL DEFAULT 'INR',
      duration_days INTEGER NOT NULL,
      features_json TEXT NOT NULL DEFAULT '[]',
      limits_json   TEXT NOT NULL DEFAULT '{}',
      active        INTEGER NOT NULL DEFAULT 1,
      created_at    INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS payments (
      id          TEXT PRIMARY KEY,
      user_id     TEXT NOT NULL,
      plan_id     TEXT NOT NULL,
      order_id    TEXT UNIQUE NOT NULL,
      payment_id  TEXT UNIQUE,
      signature   TEXT,
      amount      INTEGER NOT NULL,
      status      TEXT NOT NULL DEFAULT 'created',
      app_name    TEXT NOT NULL DEFAULT 'avantika',
      created_at  INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (plan_id) REFERENCES plans(id)
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id          TEXT PRIMARY KEY,
      user_id     TEXT UNIQUE NOT NULL,
      plan_id     TEXT NOT NULL,
      payment_id  TEXT NOT NULL,
      status      TEXT NOT NULL DEFAULT 'active',
      started_at  INTEGER NOT NULL,
      expires_at  INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (plan_id) REFERENCES plans(id)
    );
  `);
}
