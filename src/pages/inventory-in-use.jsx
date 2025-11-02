// src/pages/inventory-in-use.jsx
import React, { useEffect, useMemo, useState } from "react";

const DATA_URL =
  "https://script.google.com/macros/s/AKfycbw-LKx4-dCTaoSIaW0U8vbP2R8m8QCEgZpvvGS1JgVLUHWvwRzKJj-c7s6hCRd_NpA/exec";

export default function InventoryInUse({ setPage }) {
  const [items, setItems] = useState([]);
  const [tx, setTx] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");

  async function loadAll() {
    setLoading(true);
    setErr("");
    try {
      const r = await fetch(`${DATA_URL}?action=all&cb=${Date.now()}`, {
        cache: "no-store",
      });
      const json = await r.json();
      setItems(json.items || []);
      setTx(Array.isArray(json.tx) ? json.tx : []);
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  const inUseList = useMemo(() => {
    const rows = [];
    for (const item of items) {
      const related = tx.filter((t) => t.id === item.id);
      const countOut = related
        .map((t) =>
          String(t.action || "").toLowerCase() === "checkout"
            ? Number(t.qty || 0)
            : -Number(t.qty || 0)
        )
        .reduce((a, b) => a + b, 0);
      if (countOut > 0) {
        rows.push({ ...item, inUse: countOut });
      }
    }

    const q = query.toLowerCase();
    return rows.filter(
      (r) =>
        !q ||
        (r.name || "").toLowerCase().includes(q) ||
        (r.category || "").toLowerCase().includes(q)
    );
  }, [items, tx, query]);

  return (
    <div className="page">
      <h1>Inventory – In Use</h1>
      <button className="btn ghost" onClick={() => setPage("inventory-hub")}>
        ← Back
      </button>

      <div className="field" style={{ marginTop: "1rem" }}>
        <label>Search</label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search items"
        />
      </div>

      {loading && <div className="center">Loading…</div>}
      {err && <div className="error">{err}</div>}

      {!loading &&
        !err &&
        inUseList.map((it) => (
          <div key={it.id} className="card">
            <div className="card-title">{it.name || "— no name —"}</div>
            <div className="card-sub">
              In use: {it.inUse} / {it.quantity}
            </div>
            {it.category && (
              <div className="muted" style={{ fontSize: "0.7rem" }}>
                {it.category}
              </div>
            )}
          </div>
        ))}

      {!loading && !err && inUseList.length === 0 && (
        <p className="muted" style={{ marginTop: "1rem" }}>
          Nothing is currently checked out.
        </p>
      )}
    </div>
  );
}
