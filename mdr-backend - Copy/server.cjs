// server.cjs
console.log("🚀 Starting backend...");

const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

// ✅ CONFIRMED DATABASE PATH
const DB_PATH =
  "C:/DOORDIE/MDRR/.dart_tool/sqflite_common_ffi/databases/mdr_contact_tracing.db";

// ✅ Open SQLite DB
const db = new Database(DB_PATH, { readonly: true });

// 🔎 Test DB immediately
const testRows = db.prepare("SELECT * FROM patients").all();
console.log("🧪 DIRECT TEST ROWS:", testRows.length);

// 🔎 List tables
const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table'")
  .all()
  .map(t => t.name);

console.log("📦 Tables found:", tables);

const app = express();
app.use(cors());
app.use(express.json());

// 🟢 HEALTH CHECK
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// 🟢 DIGITAL TWIN API (CORRECT)
app.get("/api/twin/patients", (req, res) => {
  try {
    console.log("📡 /api/twin/patients called");

    const rows = db
      .prepare(`
        SELECT 
          id,
          name,
          age,
          ward,
          is_mdr_known
        FROM patients
      `)
      .all();

    console.log("📥 Patients fetched:", rows.length);
    res.json(rows);
  } catch (err) {
    console.error("❌ SQLite error:", err);
    res.status(500).json({ error: err.message });
  }
});

// 🟢 START SERVER
const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
