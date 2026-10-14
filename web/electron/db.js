const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

class LocalPOSDatabase {
  constructor(dbFilePath) {
    this.dbPath = dbFilePath || path.join(process.cwd(), 'pulsops-pos-local.sqlite');
    this.init();
  }

  init() {
    this.db = new DatabaseSync(this.dbPath);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS cached_members (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT,
        membership_status TEXT NOT NULL,
        qr_secret TEXT,
        valid_until TEXT,
        plan TEXT
      );

      CREATE TABLE IF NOT EXISTS cached_products (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        barcode TEXT UNIQUE,
        price REAL NOT NULL,
        stock_quantity INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY,
        action_type TEXT NOT NULL,
        payload TEXT NOT NULL,
        created_at TEXT NOT NULL,
        is_synced INTEGER NOT NULL DEFAULT 0
      );
    `);
  }

  // ─── Members ──────────────────────────────────────────────
  upsertMembers(members) {
    const stmt = this.db.prepare(`
      INSERT INTO cached_members (id, name, phone, membership_status, qr_secret, valid_until, plan)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        phone = excluded.phone,
        membership_status = excluded.membership_status,
        qr_secret = excluded.qr_secret,
        valid_until = excluded.valid_until,
        plan = excluded.plan;
    `);

    for (const m of members) {
      stmt.run(m.id, m.name, m.phone || '', m.membership_status || 'نشط', m.qr_secret || m.id, m.valid_until || '2027-12-31', m.plan || 'الباقة الأساسية');
    }
  }

  getMemberByQuery(query) {
    const q = (query || '').trim();
    if (!q) return null;
    const stmt = this.db.prepare(`
      SELECT * FROM cached_members
      WHERE id = ? OR qr_secret = ? OR phone = ? OR name LIKE ?
      LIMIT 1
    `);
    return stmt.get(q, q, q, `%${q}%`);
  }

  getAllMembers() {
    return this.db.prepare('SELECT * FROM cached_members ORDER BY name ASC').all();
  }

  // ─── Products ─────────────────────────────────────────────
  upsertProducts(products) {
    const stmt = this.db.prepare(`
      INSERT INTO cached_products (id, title, barcode, price, stock_quantity)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        barcode = excluded.barcode,
        price = excluded.price,
        stock_quantity = excluded.stock_quantity;
    `);

    for (const p of products) {
      stmt.run(p.id, p.title, p.barcode || p.id, Number(p.price) || 0, Number(p.stock_quantity) || 0);
    }
  }

  getProductByBarcode(barcodeOrId) {
    const q = (barcodeOrId || '').trim();
    if (!q) return null;
    const stmt = this.db.prepare(`
      SELECT * FROM cached_products
      WHERE barcode = ? OR id = ?
      LIMIT 1
    `);
    return stmt.get(q, q);
  }

  getAllProducts() {
    return this.db.prepare('SELECT * FROM cached_products ORDER BY title ASC').all();
  }

  decrementProductStock(id, count = 1) {
    const stmt = this.db.prepare(`
      UPDATE cached_products
      SET stock_quantity = MAX(0, stock_quantity - ?)
      WHERE id = ?
    `);
    stmt.run(Number(count), id);
  }

  // ─── Sync Queue ───────────────────────────────────────────
  enqueueAction(actionType, payloadObj) {
    const id = 'sync-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const payloadJson = typeof payloadObj === 'string' ? payloadObj : JSON.stringify(payloadObj);

    const stmt = this.db.prepare(`
      INSERT INTO sync_queue (id, action_type, payload, created_at, is_synced)
      VALUES (?, ?, ?, ?, 0)
    `);
    stmt.run(id, actionType, payloadJson, createdAt);

    return { id, actionType, payload: payloadObj, createdAt, is_synced: 0 };
  }

  getPendingSyncQueue() {
    const rows = this.db.prepare(`
      SELECT * FROM sync_queue WHERE is_synced = 0 ORDER BY created_at ASC
    `).all();
    return rows.map((r) => ({
      ...r,
      payload: typeof r.payload === 'string' ? JSON.parse(r.payload) : r.payload,
    }));
  }

  markSynced(ids) {
    if (!ids || !ids.length) return;
    const stmt = this.db.prepare(`
      UPDATE sync_queue SET is_synced = 1 WHERE id = ?
    `);
    for (const id of ids) {
      stmt.run(id);
    }
  }

  getPendingCount() {
    const res = this.db.prepare(`
      SELECT COUNT(*) as count FROM sync_queue WHERE is_synced = 0
    `).get();
    return res ? res.count : 0;
  }
}

module.exports = { LocalPOSDatabase };
