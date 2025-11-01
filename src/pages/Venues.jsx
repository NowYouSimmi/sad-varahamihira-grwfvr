import React, { useState } from "react";
import RedTheatreInfo from "../venues/RedTheatreInfo.jsx";
import BlackBoxInfo from "../venues/BlackBoxInfo.jsx";
import BlueHallInfo from "../venues/BlueHallInfo.jsx";

export default function Venues({ openPDF, openGallery, setPage }) {
  const [selectedVenue, setSelectedVenue] = useState(null);

  if (selectedVenue === "red") {
    return (
      <RedTheatreInfo
        openPDF={openPDF}
        openGallery={openGallery}
        onBack={() => setSelectedVenue(null)}
      />
    );
  }

  if (selectedVenue === "black") {
    return (
      <BlackBoxInfo
        openPDF={openPDF}
        openGallery={openGallery}
        onBack={() => setSelectedVenue(null)}
      />
    );
  }

  if (selectedVenue === "blue") {
    return (
      <BlueHallInfo
        openPDF={openPDF}
        openGallery={openGallery}
        onBack={() => setSelectedVenue(null)}
      />
    );
  }

  return (
    <div className="page">
      <h1>Venues</h1>
      <div
        className="home-actions"
        style={{
          display: "grid",
          gap: "12px",
          maxWidth: "360px",
          margin: "1rem auto",
        }}
      >
        <button className="btn dark" onClick={() => setSelectedVenue("red")}>
          Red Theatre
        </button>
        <button className="btn dark" onClick={() => setSelectedVenue("black")}>
          Black Box
        </button>
        <button className="btn dark" onClick={() => setSelectedVenue("blue")}>
          Blue Hall
        </button>
        <button
          className="btn dark"
          onClick={() => alert("East Plaza info coming soon!")}
        >
          East Plaza
        </button>
        <button
          className="btn dark"
          onClick={() => alert("Loading Dock info coming soon!")}
        >
          Loading Info
        </button>
      </div>

      <button
        className="btn ghost"
        style={{ marginTop: "1.5rem" }}
        onClick={() => setPage("home")}
      >
        ← Back to Home
      </button>
    </div>
  );
}
