"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import PlaceCard from "@/components/PlaceCard";
import MapView from "@/components/MapView";
import type { Place } from "@/lib/types";
import { samplePlaces } from "@/lib/sampleData";

const filterTypes = [
  { key: "all", icon: "all_inclusive", labelEn: "All", labelTh: "ทั้งหมด" },
  { key: "Hotel", icon: "hotel", labelEn: "Hotels", labelTh: "โรงแรม" },
  { key: "Pet Hotel", icon: "pets", labelEn: "Pet Hotels", labelTh: "โรงแรมสัตว์เลี้ยง" },
  { key: "Cafe", icon: "local_cafe", labelEn: "Cafes", labelTh: "คาเฟ่" },
  { key: "Hospital", icon: "medical_services", labelEn: "Clinics", labelTh: "คลินิก" },
  { key: "Pet Supplier", icon: "storefront", labelEn: "Pet Shops", labelTh: "ร้านสัตว์เลี้ยง" },
];

export default function ExploreContent({ initialPlaces }: { initialPlaces: Place[] }) {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "all";
  const [activeFilter, setActiveFilter] = useState(initialType);
  const [selectedPlace, setSelectedPlace] = useState<string>();
  const [searchQuery, setSearchQuery] = useState("");
  const { t, locale } = useI18n();

  // Use sample data if no real data
  const places = initialPlaces.length > 0 ? initialPlaces : samplePlaces;

  const filteredPlaces = useMemo(() => {
    let filtered = places;
    if (activeFilter !== "all") {
      filtered = filtered.filter((p) => {
        if (activeFilter === "Cafe") return p.place_type === "Cafe" || p.place_type === "Restaurant";
        if (activeFilter === "Hospital") return p.place_type === "Hospital" || p.place_type === "Clinic";
        return p.place_type === activeFilter;
      });
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.province.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [places, activeFilter, searchQuery]);

  return (
    <>
      {/* Sidebar */}
      <aside className="w-full md:w-[420px] bg-surface flex flex-col z-20 shadow-xl md:shadow-none border-r border-outline-variant/10">
        <div className="p-4 md:p-6 space-y-4">
          <h1 className="text-xl md:text-2xl font-headline font-extrabold text-on-surface tracking-tight">
            {t("explore.nearbySpots")}
          </h1>
          {/* Search on mobile */}
          <div className="sm:hidden relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input
              className="w-full bg-surface-container-highest border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary"
              placeholder={t("nav.search")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {filterTypes.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={`px-3 md:px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-colors ${
                  activeFilter === f.key
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container"
                }`}
              >
                <span className="material-symbols-outlined text-sm">{f.icon}</span>
                {locale === "en" ? f.labelEn : f.labelTh}
              </button>
            ))}
          </div>
          <p className="text-xs text-on-surface-variant">
            {t("explore.found")}: {filteredPlaces.length}
          </p>
        </div>
        {/* Place list */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-24 md:pb-8 space-y-3 custom-scrollbar">
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              onClick={() => setSelectedPlace(place.id)}
              className={selectedPlace === place.id ? "ring-2 ring-primary rounded-lg" : ""}
            >
              <PlaceCard place={place} />
            </div>
          ))}
          {filteredPlaces.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
              <p>No places found</p>
            </div>
          )}
        </div>
      </aside>

      {/* Map */}
      <section className="hidden md:flex flex-1 relative bg-surface-container">
        <MapView
          places={filteredPlaces}
          selectedPlace={selectedPlace}
          onSelectPlace={setSelectedPlace}
        />
      </section>
    </>
  );
}
