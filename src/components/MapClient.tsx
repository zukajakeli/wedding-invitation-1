"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export type VenueMapProps = {
  position: [number, number];
  zoom?: number;
  markerTitle: string;
  markerSubtitle?: string;
  mapContainerProps?: { id?: string };
};

export default function MapClient({
  position,
  zoom = 14,
  markerTitle,
  markerSubtitle,
  mapContainerProps,
}: VenueMapProps) {
  useEffect(() => {
    // Leaflet client-only
  }, []);

  return (
    <div className="h-[400px] w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-md border border-stone-200/80">
      <MapContainer
        {...mapContainerProps}
        center={position}
        zoom={zoom}
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
              <strong>{markerTitle}</strong>
              {markerSubtitle ? (
                <>
                  <br />
                  {markerSubtitle}
                </>
              ) : null}
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
