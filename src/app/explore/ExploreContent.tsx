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
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [petFriendlyOnly, setPetFriendlyOnly] = useState(false);
  const { t, locale } = useI18n();

  // Use sample data if no real data
  const places = initialPlaces.length > 0 ? initialPlaces : samplePlaces;

  // Get unique provinces from places
  const provinces = useMemo(() => {
    const set = new Set(places.map((p) => p.province));
    return Array.from(set).sort();
  }, [places]);

  const filteredPlaces = useMemo(() => {
    let filtered = places;
    if (activeFilter !== "all") {
      filtered = filtered.filter((p) => {
        if (activeFilter === "Cafe") return p.place_type === "Cafe" || p.place_type === "Restaurant";
        if (activeFilter === "Hospital") return p.place_type === "Hospital" || p.place_type === "Clinic";
        return p.place_type === activeFilter;
      });
    }
    if (selectedProvince !== "all") {
      filtered = filtered.filter((p) => p.province === selectedProvince);
    }
    if (petFriendlyOnly) {
      filtered = filtered.filter((p) => p.pet_friendly);
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
  }, [places, activeFilter, searchQuery, selectedProvince, petFriendlyOnly]);

  const clearFilters = () => {
    setActiveFilter("all");
    setSelectedProvince("all");
    setPetFriendlyOnly(false);
    setSearchQuery("");
  };

  const hasActiveFilters = activeFilter !== "all" || selectedProvince !== "all" || petFriendlyOnly || searchQuery;

  return (
    <>
      {/* Sidebar */}
      <aside className="w-full md:w-[420px] bg-surface flex flex-col z-20 shadow-xl md:shadow-none border-r border-outline-variant/10">
        <div className="p-4 md:p-6 space-y-3">
          <h1 className="text-xl md:text-2xl font-headline font-extrabold text-on-surface tracking-tight">
            {t("explore.nearbySpots")}
          </h1>

          {/* Search bar - always visible */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input
              className="w-full bg-surface-container-highest border-none rounded-full pl-10 pr-12 py-2.5 text-sm focus:ring-2 focus:ring-primary"
              placeholder={t("explore.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                showAdvancedFilters || hasActiveFilters
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              <span className="material-symbols-outlined text-sm">tune</span>
            </button>
          </div>

          {/* Filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
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

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="bg-surface-container-low rounded-xl p-4 space-y-4 border border-outline-variant/15 animate-in">
              <div className="flex items-center justify-between">
                <h3 className="font-headline font-bold text-sm">{t("explore.advancedFilters")}</h3>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="text-xs text-primary font-semibold hover:underline">
                    {t("explore.clearFilters")}
                  </button>
                )}
              </div>

              {/* Province filter */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-on-surface-variant">{t("explore.province")}</label>
                <select
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full h-10 px-3 bg-surface-container-highest border-none rounded-lg text-sm focus:ring-2 focus:ring-primary"
                >
                  <option value="all">{t("explore.allProvinces")}</option>
                  {provinces.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              {/* Pet-friendly toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setPetFriendlyOnly(!petFriendlyOnly)}
                  className={`w-10 h-6 rounded-full transition-colors flex items-center px-0.5 ${
                    petFriendlyOnly ? "bg-primary justify-end" : "bg-surface-container-highest justify-start"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full shadow-sm transition-colors ${
                    petFriendlyOnly ? "bg-on-primary" : "bg-on-surface-variant/50"
                  }`}></div>
                </div>
                <span className="text-sm font-medium">{t("explore.petFriendlyOnly")}</span>
              </label>
            </div>
          )}

          {/* Results count + active filter indicators */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-on-surface-variant">
              {t("explore.found")}: {filteredPlaces.length}
            </p>
            {hasActiveFilters && !showAdvancedFilters && (
              <button onClick={clearFilters} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">close</span>
                {t("explore.clearFilters")}
              </button>
            )}
          </div>
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
              <p>{t("explore.noResults")}</p>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="mt-3 text-primary font-semibold text-sm hover:underline">
                  {t("explore.clearFilters")}
                </button>
              )}
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
