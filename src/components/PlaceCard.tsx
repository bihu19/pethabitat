"use client";

import Link from "next/link";
import type { Place } from "@/lib/types";

const typeColors: Record<string, { bg: string; text: string }> = {
  Hotel: { bg: "bg-tertiary-container", text: "text-on-tertiary-container" },
  "Pet Hotel": { bg: "bg-primary-container", text: "text-on-primary-container" },
  Cafe: { bg: "bg-secondary-container", text: "text-on-secondary-container" },
  Restaurant: { bg: "bg-secondary-container", text: "text-on-secondary-container" },
  Hospital: { bg: "bg-error-container", text: "text-on-error-container" },
  Clinic: { bg: "bg-error-container", text: "text-on-error-container" },
  "Pet Supplier": { bg: "bg-surface-container-highest", text: "text-on-surface-variant" },
};

const typeIcons: Record<string, string> = {
  Hotel: "hotel",
  "Pet Hotel": "pets",
  Cafe: "local_cafe",
  Restaurant: "restaurant",
  Hospital: "local_hospital",
  Clinic: "medical_services",
  "Pet Supplier": "storefront",
};

export default function PlaceCard({ place }: { place: Place }) {
  const colors = typeColors[place.place_type] || typeColors["Pet Supplier"];
  const icon = typeIcons[place.place_type] || "place";

  return (
    <Link href={`/places/${place.id}`}>
      <div className="bg-surface-container-low p-4 rounded-lg group hover:bg-surface-container-lowest transition-all cursor-pointer border border-transparent hover:border-outline-variant/20">
        <div className="flex gap-4">
          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/30" style={{ fontVariationSettings: "'FILL' 1" }}>
              {icon}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-headline font-bold text-on-surface truncate">{place.name}</h3>
              <span className={`${colors.bg} ${colors.text} text-[10px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap`}>
                {place.place_type.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">location_on</span>
              {place.province}
            </p>
            <p className="text-xs text-on-surface-variant mt-2 line-clamp-2">
              {place.description || "Pet-friendly location"}
            </p>
            {place.google_maps_url && (
              <div className="flex items-center gap-3 mt-2 text-[11px] font-medium text-tertiary">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">map</span>
                  Google Maps
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
