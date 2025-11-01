// src/components/Header.jsx
import React, { useState } from "react";

export default function Header({ setPage, page }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function handleNav(target) {
    setPage(target);
    setMenuOpen(false);
  }

  return (
    <div className="app-header">
      {page !== "home" && (
        <div className="menu-container">
          <button className="btn ghost" onClick={() => setMenuOpen(!menuOpen)}>
            ☰ Menu
          </button>

          {menuOpen && (
            <div className="dropdown-menu">
              <button onClick={() => handleNav("home")}>🏠 Home</button>
              <button onClick={() => handleNav("inventory")}>
                📦 Inventory
              </button>
              <button onClick={() => handleNav("showList")}>
                🎭 Show Specs
              </button>
              <button onClick={() => handleNav("venues")}>🏟️ Venues</button>
              <button onClick={() => handleNav("suppliers")}>
                📇 Suppliers
              </button>
              <button onClick={() => handleNav("rigCalc")}>
                🧮 Rigging Calc
              </button>
              <button onClick={() => handleNav("schedule")}>📅 Schedule</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
