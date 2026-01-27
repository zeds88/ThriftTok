const Database = require('better-sqlite3');
const path = require('path');

class ThriftTokDB {
  constructor(dbPath = './thrifttok.db') {
    this.db = new Database(dbPath);
    this.initTables();
  }

  initTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        phone TEXT NOT NULL,
        url TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        payment_intent_id TEXT,
        analysis_result TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME
      );

      CREATE INDEX IF NOT EXISTS idx_phone ON requests(phone);
      CREATE INDEX IF NOT EXISTS idx_status ON requests(status);
      CREATE INDEX IF NOT EXISTS idx_payment_intent ON requests(payment_intent_id);
    `);
  }

  createRequest(phone, url) {
    const stmt = this.db.prepare(`
      INSERT INTO requests (phone, url, status)
      VALUES (?, ?, 'pending_payment')
    `);
    const result = stmt.run(phone, url);
    return result.lastInsertRowid;
  }

  findPendingByPhone(phone) {
    const stmt = this.db.prepare(`
      SELECT * FROM requests
      WHERE phone = ? AND status = 'pending_payment'
      ORDER BY created_at DESC
      LIMIT 1
    `);
    return stmt.get(phone);
  }

  updatePaymentIntent(id, paymentIntentId) {
    const stmt = this.db.prepare(`
      UPDATE requests
      SET payment_intent_id = ?, status = 'paid'
      WHERE id = ?
    `);
    return stmt.run(paymentIntentId, id);
  }

  completeAnalysis(id, analysis) {
    const stmt = this.db.prepare(`
      UPDATE requests
      SET analysis_result = ?, status = 'completed', completed_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(analysis, id);
  }

  findByPaymentIntent(paymentIntentId) {
    const stmt = this.db.prepare(`
      SELECT * FROM requests WHERE payment_intent_id = ?
    `);
    return stmt.get(paymentIntentId);
  }

  getStats() {
    const total = this.db.prepare('SELECT COUNT(*) as count FROM requests').get();
    const completed = this.db.prepare('SELECT COUNT(*) as count FROM requests WHERE status = "completed"').get();
    const revenue = completed.count * 2; // $2 per analysis

    return {
      totalRequests: total.count,
      completedAnalyses: completed.count,
      revenue: revenue
    };
  }
}

module.exports = ThriftTokDB;
