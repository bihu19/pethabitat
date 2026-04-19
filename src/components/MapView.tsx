"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Place } from "@/lib/types";

let L: typeof import("leaflet") | null = null;

const typeMarkerColors: Record<string, string> = {
  Hotel: "#0060ac",
  "Pet Hotel": "#ff8c42",
  Cafe: "#2c6a3b",
  Restaurant: "#2c6a3b",
  Hospital: "#ba1a1a",
  Clinic: "#ba1a1a",
  "Pet Supplier": "#897266",
  "Shopping Mall": "#7c4dff",
  Park: "#4caf50",
  Pool: "#03a9f4",
  "Pet School": "#ff9800",
};

function makeMarkerHtml(color: string, iconName: string, isSelected: boolean): string {
  const size = isSelected ? 40 : 32;
  const fontSize = isSelected ? 20 : 16;
  const shadow = isSelected ? "0.5" : "0.3";
  return `<div style="background:${color};width:${size}px;height:${size}px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,${shadow});display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.2s;"><span class="material-symbols-outlined" style="color:white;font-size:${fontSize}px;font-variation-settings:'FILL' 1;">${iconName}</span></div>`;
}

function getIconName(type: string) {
  if (type === "Hotel" || type === "Pet Hotel") return "hotel";
  if (type === "Cafe" || type === "Restaurant") return "restaurant";
  if (type === "Hospital" || type === "Clinic") return "medical_services";
  if (type === "Park") return "park";
  if (type === "Pool") return "pool";
  if (type === "Shopping Mall") return "shopping_bag";
  if (type === "Pet School") return "school";
  return "storefront";
}

export default function MapView({
  places,
  selectedPlace,
  onSelectPlace,
}: {
  places: Place[];
  selectedPlace?: string;
  onSelectPlace?: (id: string) => void;
}) {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [leafletReady, setLeafletReady] = useState(false);
  const [clickedPlace, setClickedPlace] = useState<Place | null>(null);

  // Load Leaflet once
  useEffect(() => {
    if (typeof window === "undefined") return;
    import("leaflet").then((leaflet) => {
      L = leaflet;
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
      });
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
        document.head.appendChild(link);
      }
      setLeafletReady(true);
    });
  }, []);

  // Initialize map once
  useEffect(() => {
    if (!leafletReady || !L) return;
    const container = document.getElementById("map-container");
    if (!container || mapRef.current) return;

    mapRef.current = L.map(container).setView([13.7563, 100.5018], 6);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [leafletReady]);

  // Update markers when places change (but don't recreate the map)
  useEffect(() => {
    if (!mapRef.current || !L) return;

    // Remove old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    places.forEach((place) => {
      const firstType = place.place_type.split(",")[0].trim();
      const color = typeMarkerColors[firstType] || "#897266";
      const iconName = getIconName(firstType);
      const isSelected = selectedPlace === place.id;

      const size = isSelected ? 40 : 32;
      const icon = L!.divIcon({
        className: "custom-marker",
        html: makeMarkerHtml(color, iconName, isSelected),
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      const marker = L!.marker([place.latitude, place.longitude], { icon }).addTo(mapRef.current);

      marker.on("click", () => {
        setClickedPlace(place);
        if (onSelectPlace) onSelectPlace(place.id);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds only when places list changes (not on selection)
    if (places.length > 0) {
      const bounds = L.latLngBounds(places.map((p) => [p.latitude, p.longitude]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }
  }, [leafletReady, places]);

  // Update marker styles when selectedPlace changes (without recreating)
  useEffect(() => {
    if (!mapRef.current || !L || markersRef.current.length === 0) return;

    markersRef.current.forEach((marker, i) => {
      const place = places[i];
      if (!place) return;
      const firstType = place.place_type.split(",")[0].trim();
      const color = typeMarkerColors[firstType] || "#897266";
      const iconName = getIconName(firstType);
      const isSelected = selectedPlace === place.id;

      const size = isSelected ? 40 : 32;
      const icon = L!.divIcon({
        className: "custom-marker",
        html: makeMarkerHtml(color, iconName, isSelected),
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });

      marker.setIcon(icon);
    });
  }, [selectedPlace, places]);

  // Close detail card when clicking outside
  const handleMapClick = () => {
    setClickedPlace(null);
  };

  const types = clickedPlace ? clickedPlace.place_type.split(",").map((t) => t.trim()) : [];

  return (
    <div className="relative w-full h-full">
      <div id="map-container" className="w-full h-full" style={{ minHeight: "400px" }} onClick={handleMapClick} />

      {/* Place detail card overlay */}
      {clickedPlace && (
        <div
          className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-2xl shadow-2xl border border-outline-variant/10 overflow-hidden z-[1000]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Cover image */}
          {clickedPlace.cover_image && (
            <div className="w-full h-32 overflow-hidden">
              <img src={clickedPlace.cover_image} alt={clickedPlace.name} className="w-full h-full object-cover" />
            </div>
          )}

          <div className="p-4 space-y-3">
            {/* Type badges */}
            <div className="flex flex-wrap gap-1">
              {types.map((tp) => {
                const color = typeMarkerColors[tp] || "#897266";
                return (
                  <span key={tp} style={{ background: color }} className="text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {tp.toUpperCase()}
                  </span>
                );
              })}
            </div>

            {/* Name & province */}
            <div>
              <h3 className="font-headline font-bold text-lg leading-tight">{clickedPlace.name}</h3>
              <p className="text-sm text-on-surface-variant flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-xs">location_on</span>
                {clickedPlace.province}
              </p>
            </div>

            {/* Description */}
            {clickedPlace.description && (
              <p className="text-xs text-on-surface-variant line-clamp-2">{clickedPlace.description}</p>
            )}

            {/* Pet info chips */}
            <div className="flex flex-wrap gap-2">
              {clickedPlace.pet_friendly && (
                <span className="inline-flex items-center gap-1 bg-secondary-container/50 text-on-secondary-container px-2 py-1 rounded-full text-[11px] font-medium">
                  <span className="material-symbols-outlined text-xs">pets</span>
                  {clickedPlace.pet_friendly}
                </span>
              )}
              {clickedPlace.pet_fee && (
                <span className="inline-flex items-center gap-1 bg-primary-container/30 text-on-primary-container px-2 py-1 rounded-full text-[11px] font-medium">
                  <span className="material-symbols-outlined text-xs">payments</span>
                  {clickedPlace.pet_fee}
                </span>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-1">
              <Link
                href={`/places/${clickedPlace.id}`}
                className="flex-1 py-2 bg-primary text-on-primary rounded-full font-bold text-sm text-center hover:opacity-90 transition-colors"
              >
                View Details
              </Link>
              {clickedPlace.google_maps_url && (
                <a
                  href={clickedPlace.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-4 border-2 border-primary text-primary rounded-full font-bold text-sm flex items-center gap-1 hover:bg-primary-container/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">directions</span>
                </a>
              )}
              <button
                onClick={() => setClickedPlace(null)}
                className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-surface-container transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-sm text-on-surface-variant">close</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
