// src/pages/InventoryEquipment.jsx
import React, { useEffect, useMemo, useState } from "react";

const DATA_URL =
  "https://script.google.com/macros/s/AKfycbw-LKx4-dCTaoSIaW0U8vbP2R8m8QCEgZpvvGS1JgVLUHWvwRzKJj-c7s6hCRd_NpA/exec";
const SHOWS_URL = `${DATA_URL}?action=shows`;

export default function InventoryEquipment({ setPage }) {
  const [items, setItems] = useState([]);
  const [tx, setTx] = useState([]);
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showCategories, setShowCategories] = useState(true);

  // see-in-use modal
  const [inUseModal, setInUseModal] = useState(null);

  // checkout/checkin modal state
  const [txItem, setTxItem] = useState(null);
  const [txMode, setTxMode] = useState("checkout");
  const [txQty, setTxQty] = useState("1");
  const [txEvent, setTxEvent] = useState("");
  const [txLocation, setTxLocation] = useState("");
  const [txPerson, setTxPerson] = useState("");
  const [busy, setBusy] = useState(false);

  // shows for dropdown
  const [shows, setShows] = useState([]);
  const [loadingShows, setLoadingShows] = useState(false);
  const [errorShows, setErrorShows] = useState("");

  // 1) load inventory
  async function loadAll() {
    setLoading(true);
    setErr("");
    try {
      const r = await fetch(`${DATA_URL}?action=all&cb=${Date.now()}`, {
        cache: "no-store",
      });
      const json = await r.json();

      const rawItems = Array.isArray(json) ? json : json.items || [];
      const normItems = rawItems.map((row, i) => ({
        id: row.id || `ROW-${i + 2}`,
        name: row.name ?? row.item ?? row.Item ?? "",
        category: row.category ?? row.Category ?? "",
        type: row.type ?? row.Type ?? "",
        quantity:
          typeof row.quantity === "number"
            ? row.quantity
            : Number(row.quantity || row.Qty || row.qty || 0),
      }));

      const nextTx = Array.isArray(json.tx) ? json.tx : [];
      const nextAvail =
        json.availability && typeof json.availability === "object"
          ? json.availability
          : computeAvailability(normItems, nextTx);

      setItems(normItems);
      setTx(nextTx);
      setAvailability(nextAvail);
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  // 2) load shows
  async function loadShows() {
    setLoadingShows(true);
    setErrorShows("");
    try {
      const r = await fetch(`${SHOWS_URL}&cb=${Date.now()}`, {
        cache: "no-store",
      });
      const json = await r.json();
      if (Array.isArray(json.shows)) {
        setShows(json.shows);
      } else if (Array.isArray(json.data)) {
        setShows(json.data);
      } else {
        setShows([]);
      }
    } catch (e) {
      setErrorShows(e.message || String(e));
    } finally {
      setLoadingShows(false);
    }
  }

  useEffect(() => {
    loadAll();
    loadShows();
  }, []);

  // recompute availability if needed
  useEffect(() => {
    if (!items.length) return;
    setAvailability((prev) => {
      if (prev && Object.keys(prev).length) return prev;
      return computeAvailability(items, tx);
    });
  }, [items, tx]);

  // active usage per item → lets search pick up locations
  const usageByItem = useMemo(() => buildActiveUsageMap(tx), [tx]);

  // categories
  const categories = useMemo(() => {
    const s = new Set();
    items.forEach((it) => {
      const hasAny =
        (it.name && it.name.trim()) ||
        (it.type && it.type.trim()) ||
        (it.category && it.category.trim());
      if (!hasAny) return;
      const c = (it.category || "").trim();
      if (c) s.add(c);
    });
    return Array.from(s).sort((a, b) => a.localeCompare(b));
  }, [items]);

  // filtered items
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items
      .filter((it) => {
        const hasAny =
          (it.name && it.name.trim()) ||
          (it.type && it.type.trim()) ||
          (it.category && it.category.trim()) ||
          Number(it.quantity || 0) > 0;
        return hasAny;
      })
      .filter((it) => {
        if (categoryFilter && (it.category || "").trim() !== categoryFilter) {
          return false;
        }
        return true;
      })
      .filter((it) => {
        if (!q) return true;

        const baseHay = `${it.name || ""} ${it.type || ""} ${
          it.category || ""
        }`.toLowerCase();
        if (baseHay.includes(q)) return true;

        const usages = usageByItem[it.id] || [];
        const locHay = usages
          .map((u) =>
            `${u.location || ""} ${u.eventTitle || ""}`.toLowerCase().trim()
          )
          .join(" ");
        if (locHay && locHay.includes(q)) return true;

        return false;
      })
      .sort((a, b) => {
        const at = (a.type || "").toLowerCase();
        const bt = (b.type || "").toLowerCase();
        if (at && bt && at !== bt) return at.localeCompare(bt);
        return (a.name || "").localeCompare(b.name || "");
      });
  }, [items, query, categoryFilter, usageByItem]);

  // leave category view when user searches or filters
  useEffect(() => {
    if (query.trim() !== "" || categoryFilter.trim() !== "") {
      setShowCategories(false);
    }
  }, [query, categoryFilter]);

  // submit checkout/checkin
  async function submitTx(e) {
    e.preventDefault();
    if (!txItem) return;

    const av = availability[txItem.id] || {
      available: txItem.quantity || 0,
      inUse: 0,
      total: txItem.quantity || 0,
    };
    const qty = Number(txQty || 0);

    if (!qty || qty < 1) {
      setErr("Quantity must be at least 1.");
      return;
    }
    if (txMode === "checkout" && qty > av.available) {
      setErr(`Only ${av.available} available.`);
      return;
    }
    if (txMode === "checkin" && qty > av.inUse) {
      setErr(`Only ${av.inUse} currently out.`);
      return;
    }

    try {
      setBusy(true);
      const params = new URLSearchParams({
        action: txMode,
        id: txItem.id,
        name: txItem.name || "",
        category: txItem.category || "",
        qty: String(qty),
        eventTitle: txEvent || "",
        location: txLocation || "",
        personName: txPerson || "",
      });
      const r = await fetch(`${DATA_URL}?${params.toString()}`, {
        cache: "no-store",
      });
      const json = await r.json();

      const rawItems = Array.isArray(json) ? json : json.items || [];
      const normItems = rawItems.map((row, i) => ({
        id: row.id || `ROW-${i + 2}`,
        name: row.name ?? row.item ?? row.Item ?? "",
        category: row.category ?? row.Category ?? "",
        type: row.type ?? row.Type ?? "",
        quantity:
          typeof row.quantity === "number"
            ? row.quantity
            : Number(row.quantity || row.Qty || row.qty || 0),
      }));
      const nextTx = Array.isArray(json.tx) ? json.tx : [];
      const nextAvail =
        json.availability && typeof json.availability === "object"
          ? json.availability
          : computeAvailability(normItems, nextTx);

      setItems(normItems);
      setTx(nextTx);
      setAvailability(nextAvail);

      setTxItem(null);
      setTxQty("1");
      setTxEvent("");
      setTxLocation("");
      setTxPerson("");
      setErr("");
    } catch (er) {
      setErr(String(er.message || er));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <h1>Inventory – Equipment</h1>
      <button className="btn ghost" onClick={() => setPage("inventory-hub")}>
        ← Back
      </button>

      {/* search + category */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginTop: "1.25rem",
          flexWrap: "wrap",
        }}
      >
        <div className="field" style={{ minWidth: 200 }}>
          <label>Search</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="name, type, category, venue..."
          />
        </div>
        <div className="field" style={{ minWidth: 160 }}>
          <label>Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        {!showCategories && (
          <button
            className="btn ghost"
            onClick={() => {
              setCategoryFilter("");
              setQuery("");
              setShowCategories(true);
            }}
          >
            ← Back to categories
          </button>
        )}
      </div>

      {loading && (
        <div className="center" style={{ marginTop: 16 }}>
          Loading…
        </div>
      )}
      {err && !txItem && (
        <div className="error" style={{ marginTop: 12 }}>
          {err}
        </div>
      )}

      {/* CATEGORY VIEW */}
      {!loading && showCategories && (
        <div className="grid" style={{ marginTop: 16 }}>
          <div
            className="card clickable"
            onClick={() => {
              setCategoryFilter("");
              setShowCategories(false);
            }}
          >
            <div className="card-title">All equipment</div>
            <div className="card-sub">
              {
                items.filter(
                  (it) =>
                    (it.name && it.name.trim()) ||
                    (it.type && it.type.trim()) ||
                    (it.category && it.category.trim())
                ).length
              }{" "}
              items
            </div>
          </div>
          {categories.map((cat) => {
            const count = items.filter(
              (i) => (i.category || "").trim() === cat
            ).length;
            return (
              <div
                key={cat}
                className="card clickable"
                onClick={() => {
                  setCategoryFilter(cat);
                  setShowCategories(false);
                }}
              >
                <div className="card-title">{cat}</div>
                <div className="card-sub">{count} items</div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST VIEW */}
      {!loading &&
        !showCategories &&
        filtered.map((it) => {
          const av = availability[it.id] || {
            available: it.quantity || 0,
            inUse: 0,
            total: it.quantity || 0,
          };

          const main =
            it.type && it.type.trim()
              ? it.type.trim()
              : it.name && it.name.trim()
              ? it.name.trim()
              : "— no name —";

          const activeUsages = usageByItem[it.id] || [];

          return (
            <div key={it.id} className="card" style={{ marginTop: "0.75rem" }}>
              <div className="card-title">{main}</div>

              <div className="card-sub">
                {it.category ? it.category : "Uncategorised"}
                {it.name && it.name.trim() && it.name.trim() !== main ? (
                  <span className="muted"> • {it.name}</span>
                ) : null}
              </div>

              <div className="card-sub" style={{ marginTop: 4 }}>
                Available: {av.available} / {av.total}{" "}
                {av.inUse ? (
                  <span className="muted">({av.inUse} out)</span>
                ) : null}
              </div>

              {activeUsages.length > 0 && (
                <div className="muted" style={{ marginTop: 4, fontSize: 12 }}>
                  Out at:{" "}
                  {activeUsages
                    .map((u) => u.location || u.eventTitle || "—")
                    .join(", ")}
                </div>
              )}

              <div className="card-actions">
                <button
                  className="btn sm"
                  onClick={() => {
                    setTxItem(it);
                    setTxMode("checkout");
                    setTxQty("1");
                    setTxEvent("");
                    setTxLocation("");
                    setTxPerson("");
                    setErr("");
                  }}
                >
                  Check out
                </button>
                <button
                  className="btn sm ghost"
                  onClick={() => {
                    setTxItem(it);
                    setTxMode("checkin");
                    setTxQty("1");
                    setTxEvent("");
                    setTxLocation("");
                    setTxPerson("");
                    setErr("");
                  }}
                >
                  Check in
                </button>
                <button
                  className="btn sm ghost"
                  onClick={() => {
                    const list = buildInUseForItem(it, tx);
                    setInUseModal({ item: it, list });
                  }}
                >
                  See in use
                </button>
              </div>
            </div>
          );
        })}

      {/* checkout / checkin modal */}
      {txItem && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
          onClick={() => setTxItem(null)}
        >
          <div
            style={{
              background: "#0f172a",
              border: "1px solid rgba(148,163,184,0.32)",
              borderRadius: 14,
              width: "min(420px, 92vw)",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "1.05rem 1rem 1rem",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginTop: 0, marginBottom: "0.75rem" }}>
              {txMode === "checkout" ? "Check out" : "Check in"}
            </h2>
            <div className="muted" style={{ marginBottom: "0.5rem" }}>
              {txItem.type ? txItem.type : txItem.name}{" "}
              {txItem.category ? `(${txItem.category})` : ""}
            </div>

            <div className="field">
              <label>Quantity</label>
              <input
                type="number"
                min="1"
                value={txQty}
                onChange={(e) => setTxQty(e.target.value)}
              />
            </div>

            {txMode === "checkout" && (
              <>
                <div className="field">
                  <label>Assign to show (optional)</label>
                  <select
                    value={txEvent}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTxEvent(val);
                      const chosen = shows.find((s) => s.showName === val);
                      if (chosen) {
                        setTxLocation(chosen.venue || "");
                      }
                    }}
                  >
                    <option value="">— Select show —</option>
                    {loadingShows && <option>Loading shows…</option>}
                    {errorShows && <option>Could not load shows</option>}
                    {!loadingShows &&
                      !errorShows &&
                      shows.map((s, i) => (
                        <option key={i} value={s.showName}>
                          {s.showName}
                          {s.venue ? ` • ${s.venue}` : ""}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="field">
                  <label>Event / Show (optional)</label>
                  <input
                    value={txEvent}
                    onChange={(e) => setTxEvent(e.target.value)}
                    placeholder="e.g. Chicago, RT rehearsal"
                  />
                </div>

                <div className="field">
                  <label>Location</label>
                  <input
                    value={txLocation}
                    onChange={(e) => setTxLocation(e.target.value)}
                    placeholder="e.g. Red Theatre"
                  />
                </div>

                <div className="field">
                  <label>Your name (optional)</label>
                  <input
                    value={txPerson}
                    onChange={(e) => setTxPerson(e.target.value)}
                    placeholder="e.g. Josie / Stage / MM"
                  />
                </div>
              </>
            )}

            {err && (
              <div className="error" style={{ marginBottom: "0.5rem" }}>
                {err}
              </div>
            )}

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button className="btn" disabled={busy} onClick={submitTx}>
                {busy ? "Saving…" : "Confirm"}
              </button>
              <button className="btn ghost" onClick={() => setTxItem(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* in-use modal */}
      {inUseModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setInUseModal(null)}
        >
          <div
            style={{
              background: "#1c1c1e",
              border: "1px solid #333",
              borderRadius: "14px",
              width: "min(420px, 92vw)",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "1.1rem 1.2rem 1.2rem",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "0.75rem",
              }}
            >
              <h2 style={{ fontSize: "1rem" }}>
                In use – {inUseModal.item.type || inUseModal.item.name}
              </h2>
              <button
                onClick={() => setInUseModal(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#aaa",
                  fontSize: "1.25rem",
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            {inUseModal.list.length === 0 ? (
              <div className="muted">No current checkouts for this item.</div>
            ) : (
              inUseModal.list.map((u, i) => (
                <div key={i} className="row" style={{ marginBottom: 6 }}>
                  <div>
                    <div className="row-title">{u.eventTitle || "—"}</div>
                    <div className="row-notes">{u.location || "—"}</div>
                  </div>
                  <div className="chip">Qty: {u.qty}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * build availability locally
 */
function computeAvailability(nextItems, nextTx) {
  const totalsById = Object.create(null);
  for (const it of nextItems) {
    const total = Number(it.quantity || 0);
    totalsById[it.id] = { total, delta: 0 };
  }
  for (const t of nextTx || []) {
    const id = t.id;
    const qty = Number(t.qty || 0);
    if (!totalsById[id]) totalsById[id] = { total: 0, delta: 0 };
    const action = String(t.action || "").toLowerCase();
    if (action === "checkout") totalsById[id].delta += qty;
    if (action === "checkin") totalsById[id].delta -= qty;
  }
  const out = {};
  for (const id of Object.keys(totalsById)) {
    const { total, delta } = totalsById[id];
    const inUse = Math.max(0, delta);
    const available = Math.max(0, total - inUse);
    out[id] = { total, inUse, available };
  }
  return out;
}

/**
 * build “where is it now” per item
 * returns { [itemId]: [{eventTitle, location, qty}, ...] }
 */
function buildActiveUsageMap(tx) {
  const byItem = {};
  for (const t of tx || []) {
    const id = t.id;
    if (!id) continue;
    const action = String(t.action || "").toLowerCase();
    const key = `${t.eventTitle || "-"}|||${t.location || "-"}`;
    const qty = Number(t.qty || 0);
    if (!byItem[id]) byItem[id] = new Map();
    const m = byItem[id];

    const prev = m.get(key) || 0;
    if (action === "checkout") {
      m.set(key, prev + qty);
    } else if (action === "checkin") {
      m.set(key, prev - qty);
    }
  }

  const out = {};
  for (const [itemId, m] of Object.entries(byItem)) {
    const list = Array.from(m.entries())
      .map(([k, q]) => {
        const [eventTitle, location] = k.split("|||");
        return { eventTitle, location, qty: q };
      })
      .filter((r) => r.qty > 0);
    out[itemId] = list;
  }
  return out;
}

function buildInUseForItem(item, tx) {
  const map = new Map();
  for (const t of tx) {
    if (t.id !== item.id) continue;
    const action = String(t.action || "").toLowerCase();
    const key = `${t.eventTitle || "-"}|||${t.location || "-"}`;
    const sign = action === "checkout" ? 1 : action === "checkin" ? -1 : 0;
    if (!sign) continue;
    const prev = map.get(key) || 0;
    map.set(key, prev + sign * Number(t.qty || 0));
  }
  return Array.from(map.entries())
    .map(([k, qty]) => {
      const [eventTitle, location] = k.split("|||");
      return { eventTitle, location, qty };
    })
    .filter((r) => r.qty > 0);
}
