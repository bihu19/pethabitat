"use client";

import { useEffect, useState } from "react";
import type { Place } from "@/lib/types";

// Leaflet must be imported dynamically on client side
let L: typeof import("leaflet") | null = null;

const typeMarkerColors: Record<string, string> = {
  Hotel: "#0060ac",
  "Pet Hotel": "#ff8c42",
  Cafe: "#2c6a3b",
  Restaurant: "#2c6a3b",
  Hospital: "#ba1a1a",
  Clinic: "#ba1a1a",
  "Pet Supplier": "#897266",
};

export default function MapView({
  places,
  selectedPlace,
  onSelectPlace,
}: {
  places: Place[];
  selectedPlace?: string;
  onSelectPlace?: (id: string) => void;
}) {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    import("leaflet").then((leaflet) => {
      L = leaflet;

      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });

      // Add leaflet CSS
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
        document.head.appendChild(link);
      }

      setMapReady(true);
    });
  }, []);

  useEffect(() => {
    if (!mapReady || !L) return;

    const container = document.getElementById("map-container");
    if (!container) return;

    // Clear existing map
    container.innerHTML = "";

    const map = L.map(container).setView([13.7563, 100.5018], 6);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    places.forEach((place) => {
      const color = typeMarkerColors[place.place_type] || "#897266";

      const icon = L!.divIcon({
        className: "custom-marker",
        html: `<div style="background:${color};width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;cursor:pointer;transform:${selectedPlace === place.id ? 'scale(1.3)' : 'scale(1)'};transition:transform 0.2s;">
          <span class="material-symbols-outlined" style="color:white;font-size:16px;font-variation-settings:'FILL' 1;">${
            place.place_type === "Hotel" || place.place_type === "Pet Hotel" ? "hotel" :
            place.place_type === "Cafe" || place.place_type === "Restaurant" ? "restaurant" :
            place.place_type === "Hospital" || place.place_type === "Clinic" ? "medical_services" :
            "storefront"
          }</span>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L!.marker([place.latitude, place.longitude], { icon }).addTo(map);

      marker.bindPopup(`
        <div style="font-family:'Plus Jakarta Sans',sans-serif;min-width:180px;">
          <h3 style="font-weight:700;font-size:14px;margin:0 0 4px;">${place.name}</h3>
          <p style="color:#564338;font-size:12px;margin:0 0 4px;">${place.province}</p>
          <span style="background:${color};color:white;font-size:10px;padding:2px 8px;border-radius:12px;font-weight:700;">${place.place_type}</span>
          ${place.google_maps_url ? `<br/><a href="${place.google_maps_url}" target="_blank" rel="noopener" style="color:#0060ac;font-size:11px;display:inline-block;margin-top:6px;">Open in Google Maps &rarr;</a>` : ''}
        </div>
      `);

      marker.on("click", () => {
        if (onSelectPlace) onSelectPlace(place.id);
      });
    });

    // Fit bounds if places exist
    if (places.length > 0) {
      const bounds = L.latLngBounds(places.map((p) => [p.latitude, p.longitude]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }

    return () => {
      map.remove();
    };
  }, [mapReady, places, selectedPlace]);

  return (
    <div id="map-container" className="w-full h-full" style={{ minHeight: "400px" }} />
  );
}
