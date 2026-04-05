import React, { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function Dashboard() {
  const [reports, setReports] = useState([]);

  // 🟢 FORM STATES
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("Medium");
  const [type, setType] = useState("danger");

  // 🔴 MAP ICONS
  const redIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
    iconSize: [25, 25],
  });

  const greenIcon = new L.Icon({
    iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
    iconSize: [25, 25],
  });

  // 🚨 SOS FUNCTION (WITH SHARE)
  const handleSOS = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      await addDoc(collection(db, "sos_alerts"), {
        lat,
        lng,
        createdAt: new Date(),
      });

      const message = `🚨 EMERGENCY! I need help.\nLocation: https://www.google.com/maps?q=${lat},${lng}`;

      alert(message);

      if (navigator.share) {
        navigator.share({
          title: "Emergency SOS",
          text: message,
        });
      }
    });
  };

  // 📍 REPORT FUNCTION
  const handleReport = async () => {
    navigator.geolocation.getCurrentPosition(async (pos) => {
      await addDoc(collection(db, "incidents"), {
        title: title || "No Title",
        description: description || "No Description",
        severity,
        type,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        createdAt: new Date(),
      });

      alert("Report submitted 🚨");

      setTitle("");
      setDescription("");
    });
  };

  // 🔄 LIVE DATA
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "incidents"), (snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setReports(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <h2>Safe Zones Dashboard</h2>

      {/* 🚨 SOS */}
      <button
        onClick={handleSOS}
        style={{
          background: "red",
          color: "white",
          padding: "15px",
          margin: "10px",
          borderRadius: "10px",
        }}
      >
        SOS
      </button>

      {/* 📍 REPORT FORM */}
      <h3>Report Incident</h3>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Incident Title"
        style={{ display: "block", margin: "10px", padding: "10px" }}
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        style={{ display: "block", margin: "10px", padding: "10px" }}
      />

      <div>
        <button onClick={() => setType("danger")}>Dangerous</button>
        <button onClick={() => setType("safe")}>Safe</button>
      </div>

      <div>
        <button onClick={() => setSeverity("Low")}>Low</button>
        <button onClick={() => setSeverity("Medium")}>Medium</button>
        <button onClick={() => setSeverity("High")}>High</button>
      </div>

      <button
        onClick={handleReport}
        style={{
          background: "purple",
          color: "white",
          padding: "15px",
          marginTop: "10px",
          borderRadius: "10px",
        }}
      >
        Submit Report
      </button>

      {/* 🗺️ MAP */}
      <h3>Safety Map</h3>

      <MapContainer
        center={[17.385, 78.4867]}
        zoom={5}
        style={{ height: "400px", width: "100%", marginTop: "20px" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {reports.map((item: any, index) => (
          <Marker
            key={index}
            position={[item.lat, item.lng]}
            icon={item.type === "danger" ? redIcon : greenIcon}
          >
            <Popup>
              <b>{item.title}</b><br />
              {item.description}<br />
              Severity: {item.severity}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}