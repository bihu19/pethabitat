"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import type { Place } from "@/lib/types";

const typeColors: Record<string, { bg: string; text: string }> = {
  Hotel: { bg: "bg-tertiary-container", text: "text-on-tertiary-container" },
  "Pet Hotel": { bg: "bg-primary-container", text: "text-on-primary-container" },
  Cafe: { bg: "bg-secondary-container", text: "text-on-secondary-container" },
  Restaurant: { bg: "bg-secondary-container", text: "text-on-secondary-container" },
  Hospital: { bg: "bg-error-container", text: "text-on-error-container" },
  Clinic: { bg: "bg-error-container", text: "text-on-error-container" },
  "Pet Supplier": { bg: "bg-surface-container-highest", text: "text-on-surface-variant" },
  "Shopping Mall": { bg: "bg-tertiary-container", text: "text-on-tertiary-container" },
  Park: { bg: "bg-secondary-container", text: "text-on-secondary-container" },
  Pool: { bg: "bg-primary-container", text: "text-on-primary-container" },
  "Pet School": { bg: "bg-primary-container", text: "text-on-primary-container" },
};

const typeIcons: Record<string, string> = {
  Hotel: "hotel", "Pet Hotel": "pets", Cafe: "local_cafe", Restaurant: "restaurant",
  Hospital: "local_hospital", Clinic: "medical_services", "Pet Supplier": "storefront",
  "Shopping Mall": "shopping_bag", Park: "park", Pool: "pool", "Pet School": "school",
};

function parseTypes(placeType: string): string[] {
  return placeType.split(",").map((t) => t.trim()).filter(Boolean);
}

export default function PlaceCard({ place, savedPlaceIds }: { place: Place; savedPlaceIds?: Set<string> }) {
  const types = parseTypes(place.place_type);
  const firstType = types[0] || "Pet Supplier";
  const colors = typeColors[firstType] || typeColors["Pet Supplier"];
  const icon = typeIcons[firstType] || "place";

  const [saved, setSaved] = useState(savedPlaceIds?.has(place.id) ?? false);

  useEffect(() => {
    if (savedPlaceIds) setSaved(savedPlaceIds.has(place.id));
  }, [savedPlaceIds, place.id]);

  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (saved) {
      await supabase.from("saved_places").delete().eq("user_id", user.id).eq("place_id", place.id);
      setSaved(false);
    } else {
      await supabase.from("saved_places").insert({ user_id: user.id, place_id: place.id });
      setSaved(true);
    }
  };

  return (
    <Link href={`/places/${place.id}`}>
      <div className="bg-surface-container-low p-4 rounded-lg group hover:bg-surface-container-lowest transition-all cursor-pointer border border-transparent hover:border-outline-variant/20">
        <div className="flex gap-4">
          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container flex items-center justify-center">
            {place.cover_image ? (
              <img src={place.cover_image} alt={place.name} className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/30" style={{ fontVariationSettings: "'FILL' 1" }}>
                {icon}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-headline font-bold text-on-surface truncate">{place.name}</h3>
              <button
                onClick={handleToggleSave}
                className="flex-shrink-0 p-1 rounded-full hover:bg-surface-container-highest transition-colors"
                aria-label={saved ? "Unsave" : "Save"}
              >
                <span
                  className={`material-symbols-outlined text-xl ${saved ? "text-primary" : "text-on-surface-variant/40"}`}
                  style={{ fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}
                >
                  bookmark
                </span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {types.map((t) => {
                const c = typeColors[t] || typeColors["Pet Supplier"];
                return (
                  <span key={t} className={`${c.bg} ${c.text} text-[10px] px-2 py-0.5 rounded-full font-bold whitespace-nowrap`}>
                    {t.toUpperCase()}
                  </span>
                );
              })}
            </div>
            <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">location_on</span>
              {place.province}
            </p>
            <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
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
