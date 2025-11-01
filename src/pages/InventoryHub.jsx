// src/pages/InventoryHub.jsx
import React from "react";

export default function InventoryHub({ setPage }) {
  return (
    <div className="page">
      <h1>Inventory</h1>
      <p className="muted" style={{ marginBottom: "1rem" }}>
        Choose what you want to see.
      </p>

      <div className="home-actions" style={{ maxWidth: "360px" }}>
        <button className="btn dark" onClick={() => setPage("inventory-eq")}>
          Equipment
        </button>
        <button className="btn dark" onClick={() => setPage("inventory-inuse")}>
          In use
        </button>
      </div>

      <button
        className="btn ghost"
        style={{ marginTop: "1.25rem" }}
        onClick={() => setPage("home")}
      >
        ← Back to Home
      </button>
    </div>
  );
}
