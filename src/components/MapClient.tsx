"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet with Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function MapClient() {
  const position: [number, number] = [41.7151, 44.8271]; // Tbilisi, Georgia (replace with exact venue later)

  useEffect(() => {
    // Ensuring window is defined for some Leaflet plugins if needed
  }, []);

  return (
    <div className="h-[400px] w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={position}
        zoom={14}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        className="z-0 relative"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={icon}>
          <Popup>
            <div className="font-serif text-center">
              <strong>Main Venue</strong>
              <br />
              Tbilisi, Georgia
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
