// src/pages/ShowSpecs.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";

const DATA_URL =
  "https://script.google.com/macros/s/AKfycbw-LKx4-dCTaoSIaW0U8vbP2R8m8QCEgZpvvGS1JgVLUHWvwRzKJj-c7s6hCRd_NpA/exec";

/* =========================================================
   1. CANCELLATION DETECTOR (super forgiving)
   ========================================================= */
// This is the important bit 👇
// We DO NOT trust the API to give us { cancelled: true }.
// We scan ALL fields for the word "cancelled".
function isCancelledShow(s) {
  if (!s) return false;

  // preferred: backend did the work
  if (s.cancelled === true) return true;
  if (s.cancelled && String(s.cancelled).toLowerCase() === "cancelled")
    return true;

  // fallbacks
  if (s.status && String(s.status).toLowerCase() === "cancelled") return true;
  if (s.Status && String(s.Status).toLowerCase() === "cancelled") return true;

  return false;
}

/* =========================================================
   2. DATE/TIME HELPERS
   ========================================================= */
function extractStartDate(value) {
  if (!value) return null;
  const m = String(value).match(/\d{4}-\d{2}-\d{2}/);
  if (!m) return null;
  return new Date(`${m[0]}T12:00:00`);
}

function normalizeDates(raw) {
  if (!raw) return { start: null, label: "—" };

  if (Array.isArray(raw)) {
    const dates = raw
      .map(extractStartDate)
      .filter(Boolean)
      .sort((a, b) => a - b);
    if (!dates.length) return { start: null, label: raw.join(", ") };
    return {
      start: dates[0],
      label: dates
        .map((d) =>
          d.toLocaleDateString([], {
            year: "numeric",
            month: "short",
            day: "2-digit",
          })
        )
        .join(" • "),
    };
  }

  const d = extractStartDate(raw);
  return {
    start: d,
    label: d
      ? d.toLocaleDateString([], {
          year: "numeric",
          month: "short",
          day: "2-digit",
        })
      : String(raw),
  };
}

function formatDateLabel(v) {
  return normalizeDates(v).label;
}

function formatTimeValue(v) {
  if (!v) return "—";

  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v)) {
    const d = new Date(v);
    if (!isNaN(d)) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return v;
  }

  if (typeof v === "string") return v;

  if (v instanceof Date) {
    return v.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  if (typeof v === "number") {
    const ms = (v - 25569) * 86400 * 1000;
    const d = new Date(ms);
    if (!isNaN(d)) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
  }

  return String(v);
}

/* =========================================================
   3. RESPONSE PICKER
   ========================================================= */
function pickShowsFromResponse(json) {
  if (!json) return [];
  if (Array.isArray(json)) return json;
  if (Array.isArray(json.shows)) return json.shows;
  if (Array.isArray(json.data)) return json.data;
  if (Array.isArray(json.items)) return json.items;
  if (Array.isArray(json.result)) return json.result;
  return [];
}

function pickField(obj, keys, fmt) {
  for (const k of keys) {
    if (obj[k] != null && obj[k] !== "") {
      return fmt ? fmt(obj[k]) : obj[k];
    }
  }
  return "";
}

/* =========================================================
   4. SHARED STYLES
   ========================================================= */
const buttonStyle = {
  background: "#1d1d1f",
  border: "1px solid #333",
  color: "#fff",
  borderRadius: "6px",
  padding: "6px 10px",
  minWidth: "160px",
  textAlign: "left",
  cursor: "pointer",
  height: "34px",
};

/* =========================================================
   5. MULTI-SELECT DROPDOWN
   ========================================================= */
function MultiSelectDropdown({ label, options, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function toggleOption(value) {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  return (
    <div ref={ref} style={{ position: "relative", minWidth: "180px" }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{ ...buttonStyle, width: "100%" }}
      >
        {selected.length ? `${label}: ${selected.join(", ")}` : `${label}: All`}
        <span style={{ float: "right", opacity: 0.7 }}>▾</span>
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            right: 0,
            zIndex: 999,
            background: "#1d1d1f",
            border: "1px solid #333",
            borderRadius: "8px",
            padding: "6px 8px 8px",
            display: "grid",
            gap: "4px",
            maxHeight: "220px",
            overflowY: "auto",
            boxShadow: "0 12px 20px rgba(0,0,0,0.3)",
          }}
        >
          {options.map((opt) => (
            <label
              key={opt}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                color: "#fff",
                fontSize: "0.85rem",
              }}
            >
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => toggleOption(opt)}
              />
              {opt}
            </label>
          ))}
          <button
            type="button"
            style={{
              ...buttonStyle,
              background: "#222",
              fontSize: "0.75rem",
              padding: "4px 6px",
            }}
            onClick={() => {
              onChange([]);
              setOpen(false);
            }}
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

/* =========================================================
   6. MAIN COMPONENT
   ========================================================= */
export default function ShowSpecs() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // filters
  const [query, setQuery] = useState("");
  const [filterTypes, setFilterTypes] = useState([]);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterVenue, setFilterVenue] = useState("");
  const [futureOnly, setFutureOnly] = useState(true);
  const [hideUndated, setHideUndated] = useState(true);
  const [hideCancelled, setHideCancelled] = useState(true);

  // detail
  const [selectedShow, setSelectedShow] = useState(null);

  // load
  async function loadShows() {
    setLoading(true);
    setErr("");
    try {
      const r = await fetch(
        `${DATA_URL}?action=shows&includeCancelled=true&cb=${Date.now()}`,
        { cache: "no-store" }
      );

      const json = await r.json();
      const arr = pickShowsFromResponse(json);

      // store raw rows, so our detector can look at them if needed
      const cleaned = (Array.isArray(arr) ? arr : []).map((row, i) => {
        // if it's array, save as _row and basic fields
        if (Array.isArray(row)) {
          return {
            _row: row,
            dates: row[0],
            showName: row[1],
            venue: row[2],
            eventType: row[3],
            time: row[7],
            id: `ROW-${i + 2}`,
          };
        }
        // object
        return {
          ...row,
          id: row.id || `ROW-${i + 2}`,
        };
      });

      setShows(cleaned);
    } catch (e) {
      setErr(String(e.message || e));
      setShows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadShows();
  }, []);

  // options
  const eventTypes = useMemo(() => {
    const s = new Set();
    shows.forEach((sh) => sh.eventType && s.add(sh.eventType));
    return [...s].sort();
  }, [shows]);

  const venues = useMemo(() => {
    const s = new Set();
    shows.forEach((sh) => sh.venue && s.add(String(sh.venue).trim()));
    return [...s].sort((a, b) => a.localeCompare(b));
  }, [shows]);

  const months = useMemo(() => {
    const s = new Set();
    shows.forEach((sh) => {
      const { start } = normalizeDates(sh.dates);
      if (start)
        s.add(
          `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(
            2,
            "0"
          )}`
        );
    });
    return [...s].sort();
  }, [shows]);

  // filtered
  const filtered = useMemo(() => {
    const now = new Date();
    const q = query.trim().toLowerCase();

    return shows.filter((s) => {
      const { start } = normalizeDates(s.dates);
      const cancelled = isCancelledShow(s); // 👈 use the robust detector

      const matchQuery =
        !q ||
        [
          s.showName,
          s["Show Name"],
          s.venue,
          s.eventType,
          s.artist,
          s["Artist"],
        ]
          .filter(Boolean)
          .some((p) => String(p).toLowerCase().includes(q));

      const matchVenue =
        !filterVenue ||
        String(s.venue || "")
          .trim()
          .toLowerCase() === filterVenue.trim().toLowerCase();

      const showType = (s.eventType || "").toLowerCase();
      const matchType =
        filterTypes.length === 0 ||
        filterTypes.some((t) => t.toLowerCase() === showType);

      const matchMonth = !filterMonth
        ? true
        : (() => {
            if (!start) return false;
            const ym = `${start.getFullYear()}-${String(
              start.getMonth() + 1
            ).padStart(2, "0")}`;
            return ym === filterMonth;
          })();

      const matchFuture =
        !futureOnly || !start
          ? true
          : start >= new Date(now.getFullYear(), now.getMonth(), now.getDate());

      const matchUndated = !hideUndated || !!start;

      const matchCancelled = !hideCancelled || !cancelled;

      return (
        matchQuery &&
        matchVenue &&
        matchType &&
        matchMonth &&
        matchFuture &&
        matchUndated &&
        matchCancelled
      );
    });
  }, [
    shows,
    query,
    filterTypes,
    filterMonth,
    filterVenue,
    futureOnly,
    hideUndated,
    hideCancelled,
  ]);

  // detail view
  if (selectedShow) {
    const s = selectedShow;
    const cancelled = isCancelledShow(s);

    const DETAIL_FIELDS = [
      { label: "Dates", keys: ["dates", "Dates"], fmt: formatDateLabel },
      { label: "Show Name", keys: ["showName", "Show Name", "name"] },
      { label: "Venue", keys: ["venue", "Venue"] },
      { label: "Event Type", keys: ["eventType", "Event Type", "Type"] },
      { label: "Status", keys: ["status", "Status"] },
      { label: "Artist", keys: ["artist", "Artist"] },
      { label: "Q&A", keys: ["Q&A", "QandA", "Q & A", "qa"] },
      { label: "Time", keys: ["time", "Time"], fmt: formatTimeValue },
      { label: "Duration", keys: ["duration", "Duration"] },
      { label: "Interval", keys: ["interval", "Interval"] },
      { label: "Capacity", keys: ["capacity", "Capacity"] },
      { label: "Contact", keys: ["contact", "Contact"] },
      { label: "Pros Width", keys: ["prosWidth", "Pros Width"] },
      { label: "Legs Opening", keys: ["legsOpening", "Legs Opening"] },
      {
        label: "Stage Depth/Size",
        keys: [
          "stageDepthSize",
          "Stage Depth/Size",
          "Stage Depth",
          "Stage Size",
        ],
      },
      { label: "Pit lift", keys: ["pitLift", "Pit lift"] },
      {
        label: "Upstage Cross over",
        keys: ["upstageCrossOver", "Upstage Cross over", "Upstage Crossover"],
      },
      { label: "Floor Type", keys: ["floorType", "Floor Type"] },
      { label: "Masking", keys: ["masking", "Masking"] },
      { label: "House Tabs", keys: ["houseTabs", "House Tabs"] },
      {
        label: "Custom Stage Notes",
        keys: ["customStageNotes", "Custom Stage Notes", "Notes"],
      },
    ];

    return (
      <div className="page">
        <h1 style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {cancelled ? (
            <s>{pickField(s, ["showName", "Show Name"]) || "Untitled show"}</s>
          ) : (
            pickField(s, ["showName", "Show Name"]) || "Untitled show"
          )}
          {cancelled && (
            <span
              style={{
                background: "rgba(180,0,0,0.14)",
                border: "1px solid #a00",
                color: "#ffbcbc",
                borderRadius: "9999px",
                padding: "2px 10px",
                fontSize: "0.75rem",
              }}
            >
              Cancelled
            </span>
          )}
        </h1>

        <div
          style={{
            background: "#1d1d1f",
            border: "1px solid #333",
            color: "#fff",
            borderRadius: "12px",
            padding: "16px",
            display: "grid",
            gap: "10px",
          }}
        >
          {DETAIL_FIELDS.map((f) => {
            const val = pickField(s, f.keys, f.fmt);
            return <InfoRow key={f.label} label={f.label} value={val || "—"} />;
          })}
        </div>

        <button
          style={{ ...buttonStyle, marginTop: "14px", textAlign: "center" }}
          onClick={() => setSelectedShow(null)}
        >
          ← Back to list
        </button>
      </div>
    );
  }

  // list view
  return (
    <div className="page">
      <h1>Show Specs</h1>

      <div
        className="filter-bar"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search shows..."
          style={{ ...buttonStyle, width: "180px" }}
        />

        <select
          value={filterVenue}
          onChange={(e) => setFilterVenue(e.target.value)}
          style={{ ...buttonStyle }}
        >
          <option value="">All Venues</option>
          {venues.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <MultiSelectDropdown
          label="Types"
          options={eventTypes}
          selected={filterTypes}
          onChange={setFilterTypes}
        />

        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          style={{ ...buttonStyle }}
        >
          <option value="">All Months</option>
          {months.map((m) => {
            const [y, mo] = m.split("-");
            const label = new Date(y, mo - 1).toLocaleDateString([], {
              month: "short",
              year: "numeric",
            });
            return (
              <option key={m} value={m}>
                {label}
              </option>
            );
          })}
        </select>

        <button
          onClick={() => setFutureOnly((v) => !v)}
          style={{
            ...buttonStyle,
            background: futureOnly ? "#333" : "#1d1d1f",
            textAlign: "center",
            minWidth: "130px",
          }}
        >
          {futureOnly ? "✓ " : ""}Future only
        </button>

        <button
          onClick={() => setHideUndated((v) => !v)}
          style={{
            ...buttonStyle,
            background: hideUndated ? "#333" : "#1d1d1f",
            textAlign: "center",
            minWidth: "150px",
          }}
        >
          {hideUndated ? "✓ " : ""}Hide undated
        </button>

        <button
          onClick={() => setHideCancelled((v) => !v)}
          style={{
            ...buttonStyle,
            background: hideCancelled ? "#333" : "#1d1d1f",
            textAlign: "center",
            minWidth: "150px",
          }}
        >
          {hideCancelled ? "✓ " : ""}Hide cancelled
        </button>
      </div>

      {loading && <div className="center">Loading shows…</div>}
      {err && <div className="center error">{err}</div>}

      {!loading && !err && (
        <div style={{ marginBottom: "8px", fontSize: "0.85rem" }}>
          Loaded <strong>{shows.length}</strong> show(s)
        </div>
      )}

      {!loading && !err && (
        <div className="grid show-grid">
          {filtered.length ? (
            filtered.map((s, idx) => {
              const cancelled = isCancelledShow(s);
              return (
                <div
                  key={s.id || s.showName || s["Show Name"] || idx}
                  className="card clickable"
                  onClick={() => setSelectedShow(s)}
                  style={{
                    position: "relative",
                    border: cancelled ? "1px solid #a00" : "1px solid #333",
                    background: cancelled
                      ? "rgba(180,0,0,0.08)"
                      : "rgba(29,29,31,0.35)",
                    color: cancelled ? "#ffdddd" : "inherit",
                    overflow: "hidden",
                  }}
                >
                  {cancelled && (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        background: "rgba(160,0,0,0.85)",
                        color: "#ffecec",
                        fontSize: "0.65rem",
                        padding: "2px 8px 3px",
                        borderBottomLeftRadius: "6px",
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Cancelled
                    </div>
                  )}
                  <div
                    className="card-title"
                    style={{ display: "flex", gap: 6 }}
                  >
                    {cancelled ? (
                      <s>{s.showName || s["Show Name"] || "Untitled show"}</s>
                    ) : (
                      s.showName || s["Show Name"] || "Untitled show"
                    )}
                  </div>
                  <div className="card-sub">
                    {formatDateLabel(s.dates)} • {s.venue || "Venue TBC"} •{" "}
                    {s.eventType || "Type TBC"}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="muted">No shows match your filters.</div>
          )}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   7. INFO ROW
   ========================================================= */
function InfoRow({ label, value }) {
  return (
    <div
      className="info-row"
      style={{
        display: "grid",
        gridTemplateColumns: "170px 1fr",
        gap: "10px",
        alignItems: "start",
      }}
    >
      <div
        className="info-label"
        style={{
          opacity: 0.6,
          fontSize: "0.75rem",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div className="info-value" style={{ fontSize: "0.9rem" }}>
        {value || "—"}
      </div>
    </div>
  );
}
