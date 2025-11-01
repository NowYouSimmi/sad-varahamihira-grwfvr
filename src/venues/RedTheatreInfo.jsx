// src/pages/venues/RedTheatreInfo.jsx
import React, { useState } from "react";

export default function RedTheatreInfo({ openPDF, openGallery }) {
  const [openSections, setOpenSections] = useState({
    location: false,
    access: false,
    stage: false,
    pit: false,
    seating: false,
    rigging: false,
    loose: false,
    masking: false,
    accessEquip: false,
    backstage: false,
    flybars: false,
    photos: false,
    docs: false,
  });

  const toggleSection = (key) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const labelColor = "#a78bfa";
  const valueColor = "#ffffff";
  const smallColor = "#d1d5db";

  const label = { color: labelColor, fontWeight: 600 };
  const value = { color: valueColor };

  // main photo gallery (works already)
  const redTheatrePhotos = [
    "Shilpa Ananth - The Red Theater - By Waleed Shah.jpg",
    "Balimaya Project - The Red Theater - By Waleed Shah.jpg",
    "18RED_THEATER_LIGHTS.jpg",
    "Red Theatre-2.jpg",
    "Red Theater.jpg",
    "Red Theatre.jpg",
    "IMG_3964.jpg",
  ];

  // 👇 NEW: info-doc images – use the REAL filenames you just showed me
  // folder: /public/Photos/RedTheatreDocs/
  const redTheatreDocImages = [
    {
      title: "Red Theatre 1Apr17 PLAN",
      imgFile: "Red Theatre 1Apr17 PLAN.pdf.jpg",
      pdf: "/docs/Red Theatre 1Apr17 PLAN.pdf",
    },
    {
      title: "Red Theatre 1Apr17 SECTION",
      imgFile: "Red Theatre 1Apr17 SECTION.pdf.jpg",
      pdf: "/docs/Red Theatre 1Apr17 SECTION.pdf",
    },
    {
      title: "Red Theatre with Concert Shell",
      imgFile: "Red Theatre with Concert Shell.pdf.jpg",
      pdf: "/docs/Red Theatre with Concert Shell.pdf",
    },
  ];

  // fallback if parent didn’t pass openGallery
  const openGalleryFallback = (path) => {
    window.open(path, "_blank", "noopener,noreferrer");
  };

  const Section = ({ id, title, children }) => (
    <div
      style={{
        marginBottom: "1rem",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        paddingBottom: "1rem",
      }}
    >
      <button
        onClick={() => toggleSection(id)}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          color: "#ffffff",
          fontSize: "1.05rem",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          padding: "0.3rem 0",
        }}
      >
        <span>{title}</span>
        <span style={{ fontSize: "0.85rem", opacity: 0.8 }}>
          {openSections[id] ? "▾" : "▸"}
        </span>
      </button>

      {openSections[id] && (
        <div
          style={{
            marginTop: "0.75rem",
            paddingLeft: "0.5rem",
            display: "grid",
            gap: "0.35rem",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div
      style={{
        maxWidth: "70rem",
        margin: "0 auto",
        padding: "1.5rem 2rem 3rem",
        color: "#ffffff",
        backgroundColor: "transparent",
        lineHeight: 1.6,
      }}
    >
      <h1
        style={{
          fontSize: "1.9rem",
          fontWeight: 700,
          marginBottom: "1.5rem",
          color: "#ffffff",
        }}
      >
        Red Theatre — Technical Specification
      </h1>

      {/* 1. LOCATION */}
      <Section id="location" title="Location">
        <p>
          <span style={label}>Venue:</span>{" "}
          <span style={value}>New York University Abu Dhabi (NYUAD)</span>
        </p>
        <p>
          <span style={label}>Campus:</span>{" "}
          <span style={value}>Saadiyat Island, Abu Dhabi, UAE</span>
        </p>
      </Section>

      {/* 2. ACCESS & LOADING */}
      <Section id="access" title="Access & Loading">
        <p>
          <span style={label}>Loading Bay:</span>{" "}
          <span style={value}>Underground, vehicles under 3.3 m</span>
        </p>
        <p>
          <span style={label}>Truck Access:</span>{" "}
          <span style={value}>10 t trucks can reach Loading Dock 1</span>
        </p>
        <p>
          <span style={label}>Access Pass:</span>{" "}
          <span style={value}>
            Vehicle access pass required prior to arrival
          </span>
        </p>
        <p>
          <span style={label}>Load Route:</span>{" "}
          <span style={value}>Truck → cargo lift → workshop → stage</span>
        </p>
        <p
          style={{
            color: smallColor,
            fontSize: "0.85rem",
            marginTop: "0.4rem",
          }}
        >
          <span style={label}>Cargo Lift:</span> 7,500 kg; door 2.9 m × 2.9 m;
          internal 5.24 m L × 2.56 m H × 2.55 m D
        </p>
        <p style={{ color: smallColor, fontSize: "0.85rem" }}>
          <span style={label}>Workshop → Stage Door:</span> 3.19 m (W) × 3.10 m
          (H)
        </p>
        <p style={{ color: smallColor, fontSize: "0.85rem" }}>
          <span style={label}>Stage L/R Load-in Doors:</span> 2.9 m (W) × 2.8 m
          (H)
        </p>
      </Section>

      {/* 3. STAGE */}
      <Section id="stage" title="Stage">
        <p>
          <span style={label}>Type:</span> <span style={value}>Proscenium</span>
        </p>
        <p>
          <span style={label}>Depth to Rear Wall:</span>{" "}
          <span style={value}>15.7 m</span>
        </p>
        <p>
          <span style={label}>Depth incl. Pit Lift:</span>{" "}
          <span style={value}>17.5 m</span>
        </p>
        <p>
          <span style={label}>Depth to Most Upstage Bar:</span>{" "}
          <span style={value}>14 m</span>
        </p>
        <p>
          <span style={label}>Proscenium Width:</span>{" "}
          <span style={value}>Adjustable 14–18 m</span>
        </p>
        <p>
          <span style={label}>Proscenium Height:</span>{" "}
          <span style={value}>8 m</span>
        </p>
        <p>
          <span style={label}>Stage Width (Black Floor):</span>{" "}
          <span style={value}>22 m</span>
        </p>
        <p>
          <span style={label}>Fly Bar Width:</span>{" "}
          <span style={value}>22.5 m</span>
        </p>
        <p>
          <span style={label}>Height to Grid:</span>{" "}
          <span style={value}>20 m</span>
        </p>
        <p>
          <span style={label}>Natural Floor:</span>{" "}
          <span style={value}>Blonde beech wood</span>
        </p>
        <p
          style={{
            color: smallColor,
            fontSize: "0.85rem",
            marginTop: "0.5rem",
          }}
        >
          <span style={label}>Dance Floors:</span> Blonde Harlequin Liberty
          Sprung, Black Harlequin Liberty HD Sprung (both 360 kg pt / 1000 kg
          UDL); black vinyl available on request.
        </p>
        <p style={{ color: smallColor, fontSize: "0.85rem" }}>
          <span style={label}>Concert Shell:</span> Stored in wings when not in
          use.
        </p>
      </Section>

      {/* 4. ORCHESTRA PIT / STAGE LIFT */}
      <Section id="pit" title="Orchestra Pit / Stage Lift">
        <p>
          <span style={label}>Lift Type:</span>{" "}
          <span style={value}>Serapid rigid-chain forestage lift</span>
        </p>
        <p>
          <span style={label}>Stage Extension:</span>{" "}
          <span style={value}>At highest point, acts as extension</span>
        </p>
        <p>
          <span style={label}>Pit Mode:</span>{" "}
          <span style={value}>
            Drops 3 m (10 ft) to orchestra pit with substage entrance
          </span>
        </p>
        <p>
          <span style={label}>Cargo Mode:</span>{" "}
          <span style={value}>
            Can lower to B2 / loading dock to act as cargo lift to stage
          </span>
        </p>
        <p>
          <span style={label}>Approx. Size:</span>{" "}
          <span style={value}>3 m (D) × 14 m (W), curved front</span>
        </p>
      </Section>

      {/* 5. SEATING */}
      <Section id="seating" title="Seating">
        <p>
          <span style={label}>Total Capacity:</span>{" "}
          <span style={value}>700</span>
        </p>
        <p>
          <span style={label}>Stalls:</span> <span style={value}>524</span>
        </p>
        <p>
          <span style={label}>Balcony:</span> <span style={value}>174</span>
        </p>
        <p>
          <span style={label}>Pit Seats:</span> <span style={value}>37</span>
        </p>
        <p>
          <span style={label}>Sound Position:</span>{" "}
          <span style={value}>Removes 7 chairs (permanent)</span>
        </p>
        <p>
          <span style={label}>LX Position (auditorium):</span>{" "}
          <span style={value}>Removes O16–O19, N19–N32 (14 chairs)</span>
        </p>
        <p>
          <span style={label}>Usual LX Position:</span>{" "}
          <span style={value}>Control room to rear of stalls</span>
        </p>
        <p>
          <span style={label}>Auditorium Treads:</span>{" "}
          <span style={value}>Remove 16 seats from pit (8 per side)</span>
        </p>
      </Section>

      {/* 6. RIGGING & FLYING */}
      <Section id="rigging" title="Rigging & Flying">
        <p>
          <span style={label}>Control System:</span>{" "}
          <span style={value}>
            Raynok Imperium operator console (in-house operator)
          </span>
        </p>
        <p>
          <span style={label}>Motorised Fly Bars:</span>{" "}
          <span style={value}>35, incl. flown acoustic ceiling</span>
        </p>
        <p>
          <span style={label}>Point Hoists:</span>{" "}
          <span style={value}>18 × 250 kg</span>
        </p>
        <p>
          <span style={label}>Hoist Layout:</span>{" "}
          <span style={value}>
            3 per SL/SR per track (US, MS, DS), move horizontally
          </span>
        </p>
        <p>
          <span style={label}>Unavailable Bars:</span>{" "}
          <span style={value}>1, 2, 6, 12, 18, 20, 28</span>
        </p>
        <p>
          <span style={label}>By Arrangement (due to LX):</span>{" "}
          <span style={value}>3, 10, 16, 23, 30</span>
        </p>
        <p>
          <span style={label}>Fly Bar Speed:</span>{" "}
          <span style={value}>0.2 – 0.5 m/s</span>
        </p>
        <p>
          <span style={label}>Fly Bar Capacity:</span>{" "}
          <span style={value}>600 – 1400 kg (varies per bar)</span>
        </p>
      </Section>

      {/* 7. LOOSE EQUIPMENT */}
      <Section id="loose" title="Loose Equipment">
        <p>
          <span style={label}>Note:</span>{" "}
          <span style={value}>
            Must be requested in advance and is dependent on availability.
          </span>
        </p>

        <p style={{ marginTop: "0.4rem" }}>
          <span style={label}>Truss:</span>{" "}
          <span style={value}>Prolyte X30V: 3 m, 2 m, 1.5 m, 1 m (silver)</span>
        </p>
        <p>
          <span style={value}>Prolyte X30D Trilyte: 3 m, 1 m (silver)</span>
        </p>
        <p>
          <span style={value}>Prolyte H30L ladder truss: 3 m (black)</span>
        </p>
        <p>
          <span style={value}>
            Thomas GP12: 3 m, 2 m, 1.5 m, 1 m box sections (silver)
          </span>
        </p>

        <p style={{ marginTop: "0.4rem" }}>
          <span style={label}>Chain Hoist:</span>{" "}
          <span style={value}>
            320 kg D8+ (silver or black chain) + control unit
          </span>
        </p>

        <p style={{ marginTop: "0.4rem" }}>
          <span style={label}>LiteDeck:</span>{" "}
          <span style={value}>
            4 ft × 8 ft (1.2 m × 2.4 m), 4 ft × 4 ft (1.2 m × 1.2 m), 1 m × 2 m
          </span>
        </p>
        <p style={{ color: smallColor, fontSize: "0.85rem" }}>
          Selection of handrails, pre-cut legs, steps available on request.
        </p>

        <p style={{ marginTop: "0.4rem" }}>
          <span style={label}>Wenger Deck:</span>{" "}
          <span style={value}>
            4 ft × 8 ft Versalite, 3 ft × 6 ft Versalite
          </span>
        </p>

        <p style={{ marginTop: "0.4rem" }}>
          <span style={label}>Orchestra Chairs:</span>{" "}
          <span style={value}>Wenger Symphony or Nota</span>
        </p>

        <p>
          <span style={label}>Conductor:</span>{" "}
          <span style={value}>Wenger conductor riser & music stand</span>
        </p>
      </Section>

      {/* 8. MASKING */}
      <Section id="masking" title="Masking">
        <p>
          <span style={label}>Legs:</span>{" "}
          <span style={value}>5 m × 9.5 m — 12 pcs</span>
        </p>
        <p>
          <span style={label}>Borders:</span>{" "}
          <span style={value}>22 m × 5 m — 6 pcs</span>
        </p>
        <p>
          <span style={label}>Bar Borders:</span>{" "}
          <span style={value}>23.5 m × 2 m — 5 pcs</span>
        </p>
        <p>
          <span style={label}>Full Black:</span>{" "}
          <span style={value}>22 m × 9.5 m — 3 pcs</span>
        </p>
        <p>
          <span style={label}>Cyc / BP Screen:</span>{" "}
          <span style={value}>22 m × 9.5 m — 1 pc</span>
        </p>
        <p>
          <span style={label}>White Gauze:</span>{" "}
          <span style={value}>22 m × 8 m — 1 pc</span>
        </p>
        <p>
          <span style={label}>Black Gauze:</span>{" "}
          <span style={value}>22.8 m × 8 m — 1 pc</span>
        </p>
        <p
          style={{
            color: smallColor,
            fontSize: "0.85rem",
            marginTop: "0.6rem",
          }}
        >
          <span style={label}>Note:</span> All touring scenic elements must be
          non-combustible / inherently flame-retardant. Timber scenery to Class
          1 (BS 476 Pt 7) and stamped / certified.
        </p>
      </Section>

      {/* 9. ACCESS EQUIPMENT */}
      <Section id="accessEquip" title="Access Equipment">
        <p>
          <span style={label}>Genie DPL-35s:</span>{" "}
          <span style={value}>Lifts 2 people to 40 ft (12 m)</span>
        </p>
        <p>
          <span style={label}>Genie AWP-40s:</span>{" "}
          <span style={value}>Lifts 1 person to 46 ft (14 m)</span>
        </p>
        <p>
          <span style={label}>Ladders:</span>{" "}
          <span style={value}>6 ft – 16 ft (1.8 m – 4.8 m)</span>
        </p>
        <p style={{ color: smallColor, fontSize: "0.85rem" }}>
          <span style={label}>Operators:</span> In-house operators unless
          touring techs are IPAF certified.
        </p>
      </Section>

      {/* 10. BACKSTAGE ACCOMMODATIONS */}
      <Section id="backstage" title="Backstage Accommodations">
        <p>
          <span style={label}>Dressing Rooms (2 pax):</span>{" "}
          <span style={value}>Rooms 37, 38</span>
        </p>
        <p>
          <span style={label}>Dressing Rooms (8 pax):</span>{" "}
          <span style={value}>Rooms 11, 16, 17, 44</span>
        </p>
        <p>
          <span style={label}>Dressing Rooms (12 pax):</span>{" "}
          <span style={value}>Rooms 22, 23, 34, 35</span>
        </p>
        <p style={{ marginTop: "0.4rem" }}>
          <span style={label}>Wardrobe:</span>{" "}
          <span style={value}>
            2 × washing machines, 2 × dryers, ironing & steaming equipment,
            sewing machines
          </span>
        </p>
        <p style={{ color: smallColor, fontSize: "0.85rem" }}>
          <span style={label}>Wardrobe Tech:</span> Can be arranged if requested
          in advance.
        </p>
        <p style={{ marginTop: "0.4rem" }}>
          <span style={label}>Company Office:</span>{" "}
          <span style={value}>
            13 A power, desk, sofa, printer, fridge/freezer, sink
          </span>
        </p>
        <p>
          <span style={label}>Green Room:</span>{" "}
          <span style={value}>Available</span>
        </p>
      </Section>

      {/* 11. FLY BAR SPECS */}
      <Section id="flybars" title="Fly Bar Specs">
        <p style={{ color: smallColor, fontSize: "0.85rem" }}>
          Fly bars vary in speed and UDL capacity. Confirm on site before
          loading.
        </p>

        <div
          style={{
            display: "grid",
            gap: "0.4rem",
            marginTop: "0.6rem",
          }}
        >
          {/* keeping your list unchanged */}
          <SpecLine
            n={1}
            dist="725 mm"
            speed="0.5 m/s"
            load="600 kg"
            item="Valance"
            label={label}
            value={value}
          />
          <SpecLine
            n={2}
            dist="1025 mm"
            speed="0.5 m/s"
            load="1000 kg"
            item="Drape"
            label={label}
            value={value}
          />
          <SpecLine
            n={3}
            dist="1475 mm"
            speed="0.2 m/s"
            load="1300 kg"
            item="LX1"
            label={label}
            value={value}
          />
          <SpecLine
            n={4}
            dist="1925 mm"
            speed="0.5 m/s"
            load="600 kg"
            item=""
            label={label}
            value={value}
          />
          <SpecLine
            n={5}
            dist="2225 mm"
            speed="0.2 m/s"
            load="1400 kg"
            item=""
            label={label}
            value={value}
          />
          <SpecLine
            n={6}
            dist="2525 mm"
            speed="0.2 m/s"
            load="1400 kg"
            item="Canopy"
            label={label}
            value={value}
          />
          <SpecLine
            n={7}
            dist="2825 mm"
            speed="0.2 m/s"
            load="900 kg"
            item=""
            label={label}
            value={value}
          />
          <SpecLine
            n={8}
            dist="3125 mm"
            speed="0.2 m/s"
            load="600 kg"
            item=""
            label={label}
            value={value}
          />
          <SpecLine
            n={9}
            dist="3425 mm"
            speed="0.2 m/s"
            load="600 kg"
            item=""
            label={label}
            value={value}
          />
          <SpecLine
            n={10}
            dist="3875 mm"
            speed="0.2 m/s"
            load="1400 kg"
            item="LX2"
            label={label}
            value={value}
          />
          <p style={{ color: smallColor, fontSize: "0.8rem" }}>
            <span style={label}>Counterweight / CM:</span> 250 kg each (stage
            tracks)
          </p>
          <SpecLine
            n={11}
            dist="4675 mm"
            speed="0.2 m/s"
            load="600 kg"
            item=""
            label={label}
            value={value}
          />
          <SpecLine
            n={12}
            dist="4975 mm"
            speed="0.2 m/s"
            load="1400 kg"
            item="Canopy"
            label={label}
            value={value}
          />
          <SpecLine
            n={13}
            dist="5275 mm"
            speed="0.2 m/s"
            load="600 kg"
            item=""
            label={label}
            value={value}
          />
          <SpecLine
            n={14}
            dist="5575 mm"
            speed="0.5 m/s"
            load="600 kg"
            item=""
            label={label}
            value={value}
          />
          <SpecLine
            n={15}
            dist="5875 mm"
            speed="0.2 m/s"
            load="600 kg"
            item=""
            label={label}
            value={value}
          />
          <SpecLine
            n={16}
            dist="6325 mm"
            speed="0.2 m/s"
            load="1400 kg"
            item="LX3"
            label={label}
            value={value}
          />
          <SpecLine
            n={17}
            dist="6775 mm"
            speed="0.2 m/s"
            load="600 kg"
            item=""
            label={label}
            value={value}
          />
          <SpecLine
            n={18}
            dist="7075 mm"
            speed="0.5 m/s"
            load="600 kg"
            item="Projection Screen"
            label={label}
            value={value}
          />
          <SpecLine
            n={19}
            dist="7375 mm"
            speed="0.2 m/s"
            load="600 kg"
            item=""
            label={label}
            value={value}
          />
          <p style={{ color: smallColor, fontSize: "0.8rem" }}>
            <span style={label}>Counterweight / CM:</span> 250 kg each
          </p>
          <SpecLine
            n={20}
            dist="7675 mm"
            speed="0.2 m/s"
            load="1400 kg"
            item="Canopy"
            label={label}
            value={value}
          />
          <SpecLine
            n={21}
            dist="8325 mm"
            speed="0.2 m/s"
            load="600 kg"
            item=""
            label={label}
            value={value}
          />
          <SpecLine
            n={22}
            dist="8625 mm"
            speed="0.2 m/s"
            load="600 kg"
            item=""
            label={label}
            value={value}
          />
          <SpecLine
            n={23}
            dist="9075 mm"
            speed="0.2 m/s"
            load="1400 kg"
            item="LX4"
            label={label}
            value={value}
          />
          <SpecLine
            n={24}
            dist="9525 mm"
            speed="0.5 m/s"
            load="600 kg"
            item=""
            label={label}
            value={value}
          />
          <SpecLine
            n={25}
            dist="9825 mm"
            speed="0.2 m/s"
            load="600 kg"
            item=""
            label={label}
            value={value}
          />
          <SpecLine
            n={26}
            dist="10125 mm"
            speed="0.2 m/s"
            load="900 kg"
            item=""
            label={label}
            value={value}
          />
          <SpecLine
            n={27}
            dist="10425 mm"
            speed="0.2 m/s"
            load="600 kg"
            item=""
            label={label}
            value={value}
          />
          <SpecLine
            n={28}
            dist="10725 mm"
            speed="0.2 m/s"
            load="1400 kg"
            item="Canopy"
            label={label}
            value={value}
          />
          <SpecLine
            n={29}
            dist="11025 mm"
            speed="0.2 m/s"
            load="600 kg"
            item=""
            label={label}
            value={value}
          />
          <p style={{ color: smallColor, fontSize: "0.8rem" }}>
            <span style={label}>Counterweight / CM:</span> 250 kg each
          </p>
          <SpecLine
            n={30}
            dist="11675 mm"
            speed="0.2 m/s"
            load="1400 kg"
            item="LX5"
            label={label}
            value={value}
          />
          <SpecLine
            n={31}
            dist="12225 mm"
            speed="0.5 m/s"
            load="600 kg"
            item=""
            label={label}
            value={value}
          />
          <SpecLine
            n={32}
            dist="12525 mm"
            speed="0.2 m/s"
            load="900 kg"
            item=""
            label={label}
            value={value}
          />
          <SpecLine
            n={33}
            dist="12825 mm"
            speed="0.5 m/s"
            load="600 kg"
            item=""
            label={label}
            value={value}
          />
          <SpecLine
            n={34}
            dist="13125 mm"
            speed="0.5 m/s"
            load="600 kg"
            item=""
            label={label}
            value={value}
          />
          <SpecLine
            n={35}
            dist="13425 mm"
            speed="0.5 m/s"
            load="600 kg"
            item=""
            label={label}
            value={value}
          />
        </div>
      </Section>

      {/* 12. PHOTO LIBRARY */}
      <Section id="photos" title="Photo Library">
        <p style={{ color: "#d1d5db", fontSize: "0.85rem" }}>
          Reference photos of Red Theatre — performances, auditorium, and
          concert shell setup.
        </p>

        <div
          style={{
            marginTop: "0.8rem",
            display: "grid",
            gap: "0.9rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          }}
        >
          {redTheatrePhotos.map((filename) => {
            const encoded = encodeURIComponent(filename);
            const src = `/Photos/RedTheatre/${encoded}`;
            return (
              <figure
                key={filename}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                }}
              >
                <img
                  src={src}
                  alt={filename}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    display: "block",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    const all = redTheatrePhotos.map(
                      (f) => `/Photos/RedTheatre/${encodeURIComponent(f)}`
                    );
                    if (openGallery) {
                      openGallery(all, "Red Theatre – Photo Library");
                    } else {
                      openGalleryFallback(src);
                    }
                  }}
                />
                <figcaption
                  style={{
                    fontSize: "0.7rem",
                    color: "#d1d5db",
                    padding: "0 0.4rem 0.4rem",
                    wordBreak: "break-word",
                  }}
                >
                  {filename}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </Section>

      {/* 13. INFO DOCUMENTS (same style as gallery, using .pdf.jpg) */}
      <Section id="docs" title="Info Documents">
        <p style={{ color: "#d1d5db", fontSize: "0.85rem" }}>
          Plan, section, and concert shell as image previews. Click to enlarge.
        </p>

        <div
          style={{
            marginTop: "0.8rem",
            display: "grid",
            gap: "0.9rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          }}
        >
          {redTheatreDocImages.map((doc) => {
            const encoded = encodeURIComponent(doc.imgFile);
            const src = `/Photos/RedTheatreDocs/${encoded}`;
            return (
              <figure
                key={doc.title}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.03)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                }}
              >
                <img
                  src={src}
                  alt={doc.title}
                  style={{
                    width: "100%",
                    height: "160px",
                    objectFit: "cover",
                    display: "block",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    // open all info-doc images as a gallery, just like photos
                    const all = redTheatreDocImages.map((d) => {
                      const e2 = encodeURIComponent(d.imgFile);
                      return `/Photos/RedTheatreDocs/${e2}`;
                    });
                    if (openGallery) {
                      openGallery(all, "Red Theatre – Info Documents");
                    } else {
                      openGalleryFallback(src);
                    }
                  }}
                />
                <figcaption
                  style={{
                    fontSize: "0.7rem",
                    color: "#d1d5db",
                    padding: "0 0.4rem 0.4rem",
                    wordBreak: "break-word",
                  }}
                >
                  {doc.title}
                </figcaption>
              </figure>
            );
          })}
        </div>

        {/* optional: PDF links */}
        <div style={{ marginTop: "1rem" }}>
          <p
            style={{
              color: "#9ca3af",
              fontSize: "0.75rem",
              marginBottom: "0.35rem",
            }}
          >
            Original PDFs:
          </p>
          {redTheatreDocImages.map((doc) =>
            doc.pdf ? (
              <div key={doc.title}>
                <a
                  href={doc.pdf}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "#a78bfa",
                    fontSize: "0.75rem",
                    textDecoration: "underline",
                  }}
                >
                  {doc.title}
                </a>
              </div>
            ) : null
          )}
        </div>
      </Section>

      <p
        style={{
          color: "#9ca3af",
          fontSize: "0.75rem",
          marginTop: "1.25rem",
          fontStyle: "italic",
        }}
      >
        *All technical data subject to confirmation with Director of Production
        and Head of Stage.*
      </p>
    </div>
  );
}

// flybar line
function SpecLine({ n, dist, speed, load, item, label, value }) {
  const isFast = speed === "0.5 m/s";
  const permanentItems = [
    "Canopy",
    "Projection Screen",
    "LX1",
    "LX2",
    "LX3",
    "LX4",
    "LX5",
  ];
  const isPermanent = permanentItems.includes(item);

  let bgColor = "rgba(255,255,255,0.015)";
  let borderColor = "rgba(167,139,250,0.08)";

  if (isPermanent) {
    bgColor = "rgba(239, 68, 68, 0.15)";
    borderColor = "rgba(239, 68, 68, 0.7)";
  }

  return (
    <div
      style={{
        backgroundColor: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: "8px",
        padding: "0.45rem 0.7rem",
        display: "flex",
        flexWrap: "wrap",
        gap: "0.75rem",
        alignItems: "center",
      }}
    >
      <span style={{ ...label, minWidth: "72px" }}>Line {n}</span>
      <span style={value}>
        <strong style={label}>Dist:</strong> {dist}
      </span>
      <span
        style={{
          backgroundColor: isFast ? "rgba(16, 185, 129, 0.2)" : "transparent",
          border: isFast ? "1px solid rgba(16, 185, 129, 0.6)" : "none",
          borderRadius: isFast ? "6px" : "0",
          padding: isFast ? "0.05rem 0.5rem" : "0",
          color: isFast ? "#d1fae5" : value.color,
          fontWeight: isFast ? 600 : 400,
        }}
      >
        <strong style={isFast ? { color: "#a7f3d0" } : label}>Speed:</strong>{" "}
        {speed}
      </span>
      <span style={value}>
        <strong style={label}>Load:</strong> {load}
      </span>
      {item ? (
        <span style={value}>
          <strong style={label}>Item:</strong> {item}
        </span>
      ) : null}
    </div>
  );
}

const docButtonStyle = {
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(167,139,250,0.35)",
  borderRadius: "10px",
  padding: "0.5rem 0.9rem",
  textAlign: "left",
  color: "#ffffff",
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.15s ease",
};
