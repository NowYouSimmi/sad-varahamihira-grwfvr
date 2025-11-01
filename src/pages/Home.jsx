// src/pages/Home.jsx
import React from "react";
import logo from "../assets/ShowVault_logo_white.png";

export default function Home({ setPage }) {
  return (
    <div className="home">
      <img
        src={logo}
        alt="ShowVault"
        className="home-logo"
        style={{
          maxWidth: "220px",
          margin: "32px auto 16px",
          display: "block",
        }}
      />

      <div
        className="home-actions"
        style={{
          display: "grid",
          gap: "14px",
          maxWidth: "280px",
          margin: "0 auto",
        }}
      >
        <button className="btn" onClick={() => setPage("inventory")}>
          🎛 Inventory
        </button>
        <button className="btn" onClick={() => setPage("showList")}>
          🎭 Show Specs
        </button>
        <button className="btn" onClick={() => setPage("venues")}>
          🏟 Venues Information
        </button>
        <button className="btn" onClick={() => setPage("suppliers")}>
          📇 Supplier Contacts
        </button>
        <button className="btn" onClick={() => setPage("rigCalc")}>
          🧮 Rigging Calculator
        </button>
        <button className="btn" onClick={() => setPage("schedule")}>
          📅 Schedule
        </button>
      </div>

      <p
        className="muted"
        style={{ textAlign: "center", marginTop: "28px", fontSize: "0.9em" }}
      >
        <span style={{ color: "#9ecfff" }}>ShowVault</span> — NYUAD Arts Center
        tools
      </p>
    </div>
  );
}
