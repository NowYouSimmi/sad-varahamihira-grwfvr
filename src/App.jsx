// src/App.js
import React, { useState } from "react";
import Header from "./components/Header.jsx";

import Home from "./pages/Home.jsx";
import InventoryHub from "./pages/InventoryHub.jsx";
import InventoryEquipment from "./pages/InventoryEquipment.jsx";
// 👇 change THIS line
import InventoryInUse from "./pages/inventory-in-use.jsx";
import ShowSpecs from "./pages/ShowSpecs.jsx";
import Venues from "./pages/Venues.jsx";
import Suppliers from "./pages/Suppliers.jsx";
import RiggingCalc from "./pages/RiggingCalc.jsx";
import Schedule from "./pages/Schedule.jsx";
import PDFViewer from "./components/PDFViewer.jsx";
import PhotoGallery from "./pages/PhotoGallery.jsx";

export default function App() {
  const [page, setPage] = useState("home");
  const [pdfData, setPdfData] = useState(null);
  const [galleryData, setGalleryData] = useState(null);

  const openPDF = (url, title = "Document") => {
    setPdfData({ url, title });
    setPage("pdf");
  };

  const openGallery = (images, title = "Gallery") => {
    setGalleryData({ images, title });
    setPage("gallery");
  };

  return (
    <div className="app">
      <Header setPage={setPage} page={page} />

      {page === "home" && <Home setPage={setPage} />}
    {page === "inventory-hub" && <InventoryHub setPage={setPage} />}
{page === "inventory-equipment" && <InventoryEquipment setPage={setPage} />}
{page === "inventory-inuse" && <InventoryInUse setPage={setPage} />}

      {page === "showList" && <ShowSpecs />}
      {page === "venues" && (
        <Venues openPDF={openPDF} openGallery={openGallery} setPage={setPage} />
      )}
      {page === "suppliers" && <Suppliers setPage={setPage} />}
      {page === "rigCalc" && <RiggingCalc />}
      {page === "schedule" && <Schedule />}

      {page === "pdf" && pdfData && (
        <PDFViewer
          src={pdfData.url}
          title={pdfData.title}
          onBack={() => setPage("venues")}
        />
      )}

      {page === "gallery" && galleryData && (
        <PhotoGallery
          images={galleryData.images}
          title={galleryData.title}
          onBack={() => setPage("venues")}
        />
      )}
    </div>
  );
}
