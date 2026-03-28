"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { provinces } from "@/lib/provinces";
import type { Place, PlaceType } from "@/lib/types";

const allPlaceTypes: PlaceType[] = [
  "Hotel", "Pet Hotel", "Cafe", "Restaurant", "Hospital", "Clinic",
  "Pet Supplier", "Shopping Mall", "Park", "Pool", "Pet School",
];

const typeIconMap: Record<string, string> = {
  Hotel: "hotel", "Pet Hotel": "pets", Cafe: "local_cafe", Restaurant: "restaurant",
  Hospital: "medical_services", Clinic: "medical_services", "Pet Supplier": "storefront",
  "Shopping Mall": "shopping_bag", Park: "park", Pool: "pool", "Pet School": "school",
};

const amenityOptions = [
  { key: "pet_bed", labelTh: "เบาะสัตว์เลี้ยง", labelEn: "Pet Bed" },
  { key: "food_tray", labelTh: "ถาดรองกินอาหาร", labelEn: "Food Tray" },
  { key: "pee_pad", labelTh: "แผ่นรองฉี่", labelEn: "Pee Pad" },
];

const emptyForm = {
  name: "",
  place_types: [] as string[],
  province: "",
  description: "",
  google_maps_url: "",
  website_url: "",
  pet_fee: "",
  pet_condition: "",
  pet_friendly: "",
  cover_image: "",
  has_pet_amenities: false,
  pet_amenities: [] as string[],
  pet_amenities_other: "",
  latitude: "13.7563",
  longitude: "100.5018",
};

function parseTypes(placeType: string): string[] {
  return placeType.split(",").map((t) => t.trim()).filter(Boolean);
}

export default function AdminContent({ initialPlaces }: { initialPlaces: Place[] }) {
  const { t, locale } = useI18n();
  const [places, setPlaces] = useState<Place[]>(initialPlaces);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
    setMessage("");
  };

  const openEditForm = (place: Place) => {
    setEditingId(place.id);
    const existingAmenities = place.pet_amenities ? place.pet_amenities.split(",").map((a) => a.trim()) : [];
    const knownKeys = amenityOptions.map((a) => a.key);
    const knownSelected = existingAmenities.filter((a) => knownKeys.includes(a));
    const otherItems = existingAmenities.filter((a) => !knownKeys.includes(a));
    setForm({
      name: place.name,
      place_types: parseTypes(place.place_type),
      province: place.province,
      description: place.description || "",
      google_maps_url: place.google_maps_url || "",
      website_url: place.website_url || "",
      pet_fee: place.pet_fee || "",
      pet_condition: place.pet_condition || "",
      pet_friendly: place.pet_friendly || "",
      cover_image: place.cover_image || "",
      has_pet_amenities: existingAmenities.length > 0,
      pet_amenities: knownSelected,
      pet_amenities_other: otherItems.join(", "),
      latitude: String(place.latitude),
      longitude: String(place.longitude),
    });
    setShowForm(true);
    setMessage("");
  };

  const toggleType = (type: string) => {
    setForm((f) => ({
      ...f,
      place_types: f.place_types.includes(type)
        ? f.place_types.filter((t) => t !== type)
        : [...f.place_types, type],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.place_types.length === 0) {
      setMessage("Please select at least one place type");
      return;
    }
    setSaving(true);
    setMessage("");

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Build pet_amenities string
      let pet_amenities: string | null = null;
      if (form.has_pet_amenities) {
        const items = [...form.pet_amenities];
        if (form.pet_amenities_other.trim()) {
          items.push(...form.pet_amenities_other.split(",").map((s) => s.trim()).filter(Boolean));
        }
        pet_amenities = items.length > 0 ? items.join(",") : null;
      }

      const placeData = {
        name: form.name,
        place_type: form.place_types.join(","),
        province: form.province,
        description: form.description || null,
        google_maps_url: form.google_maps_url || null,
        website_url: form.website_url || null,
        pet_fee: form.pet_fee || null,
        pet_condition: form.pet_condition || null,
        pet_friendly: form.pet_friendly || null,
        cover_image: form.cover_image || null,
        pet_amenities,
        latitude: parseFloat(form.latitude) || 13.7563,
        longitude: parseFloat(form.longitude) || 100.5018,
      };

      if (editingId) {
        const { data, error } = await supabase
          .from("places")
          .update(placeData)
          .eq("id", editingId)
          .select()
          .single();
        if (error) throw error;
        setPlaces((prev) => prev.map((p) => (p.id === editingId ? data : p)));
        setMessage(t("admin.saved"));
      } else {
        const { data, error } = await supabase
          .from("places")
          .insert(placeData)
          .select()
          .single();
        if (error) throw error;
        setPlaces((prev) => [data, ...prev]);
        setMessage(t("admin.saved"));
      }

      setShowForm(false);
    } catch (err: any) {
      setMessage(err.message || "Error saving place");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (place: Place) => {
    if (!confirm(t("admin.deletePlaceConfirm"))) return;
    try {
      const supabase = createClient();
      const { error } = await supabase.from("places").delete().eq("id", place.id);
      if (error) throw error;
      setPlaces((prev) => prev.filter((p) => p.id !== place.id));
      setMessage(t("admin.deleted"));
    } catch (err: any) {
      setMessage(err.message || "Error deleting place");
    }
  };

  const filteredPlaces = searchQuery
    ? places.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.province.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : places;

  const getFirstTypeIcon = (placeType: string) => {
    const first = parseTypes(placeType)[0];
    return typeIconMap[first] || "place";
  };

  return (
    <>
      <header className="mb-8">
        <span className="inline-flex items-center px-4 py-1 rounded-full bg-error-container text-on-error-container text-xs font-bold tracking-widest uppercase mb-3">
          <span className="material-symbols-outlined text-sm mr-1">admin_panel_settings</span>
          {t("nav.admin")}
        </span>
        <h1 className="text-3xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">
          {t("admin.managePlaces")}
        </h1>
      </header>

      {message && (
        <div className="mb-4 bg-secondary-container text-on-secondary-container p-3 rounded-lg text-sm font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          {message}
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input
            className="w-full bg-surface-container-highest border-none rounded-full pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-primary"
            placeholder={t("admin.searchPlaces")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={openCreateForm}
          className="px-6 py-2.5 rounded-full bg-primary text-on-primary font-bold text-sm flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          {t("admin.addPlace")}
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-20 px-4 overflow-y-auto">
          <div className="bg-surface rounded-2xl w-full max-w-2xl p-6 md:p-8 shadow-2xl mb-20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline font-bold text-xl">
                {editingId ? t("admin.editPlace") : t("admin.addPlace")}
              </h2>
              <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Cover Image URL */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-on-surface-variant">{t("admin.coverImage")}</label>
                <div className="flex gap-3 items-start">
                  <div className="w-24 h-24 rounded-xl border-2 border-outline-variant/20 overflow-hidden bg-surface-container flex items-center justify-center shrink-0">
                    {form.cover_image ? (
                      <img src={form.cover_image} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-2xl text-on-surface-variant/30">image</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary text-sm"
                      placeholder={t("admin.imageUrlPlaceholder")}
                      value={form.cover_image}
                      onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
                    />
                    <p className="text-xs text-on-surface-variant/60 mt-1">{t("admin.imageUrlHint")}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 flex flex-col gap-1">
                  <label className="text-sm font-bold text-on-surface-variant">{t("admin.placeName")}</label>
                  <input
                    className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="md:col-span-2 flex flex-col gap-1">
                  <label className="text-sm font-bold text-on-surface-variant">{t("admin.placeType")} *</label>
                  <div className="flex flex-wrap gap-2">
                    {allPlaceTypes.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleType(type)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1 transition-all ${
                          form.place_types.includes(type)
                            ? "bg-primary text-on-primary"
                            : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container"
                        }`}
                      >
                        <span className="material-symbols-outlined text-xs">{typeIconMap[type] || "place"}</span>
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-on-surface-variant">{t("admin.province")}</label>
                  <select
                    className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary"
                    value={form.province}
                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                    required
                  >
                    <option value="">{t("explore.allProvinces")}</option>
                    {provinces.map((p) => (
                      <option key={p.th} value={p.th}>{locale === "th" ? p.th : `${p.en} (${p.th})`}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-bold text-on-surface-variant">{t("admin.description")}</label>
                <textarea
                  className="w-full p-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-on-surface-variant">{t("admin.googleMapsUrl")}</label>
                  <input
                    className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary text-sm"
                    placeholder="https://maps.app.goo.gl/..."
                    value={form.google_maps_url}
                    onChange={(e) => setForm({ ...form, google_maps_url: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-on-surface-variant">{t("admin.websiteUrl")}</label>
                  <input
                    className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary text-sm"
                    placeholder="https://..."
                    value={form.website_url}
                    onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-on-surface-variant">{t("admin.petFee")}</label>
                  <input className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary text-sm" value={form.pet_fee} onChange={(e) => setForm({ ...form, pet_fee: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-on-surface-variant">{t("admin.petCondition")}</label>
                  <input className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary text-sm" value={form.pet_condition} onChange={(e) => setForm({ ...form, pet_condition: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-on-surface-variant">{t("admin.petFriendly")}</label>
                  <input className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary text-sm" value={form.pet_friendly} onChange={(e) => setForm({ ...form, pet_friendly: e.target.value })} />
                </div>
              </div>

              {/* Pet Amenities - shown when Hotel or Pet Hotel is selected */}
              {(form.place_types.includes("Hotel") || form.place_types.includes("Pet Hotel")) && (
                <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/15 space-y-4">
                  <label className="text-sm font-bold text-on-surface-variant">{t("admin.petAmenities")}</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, has_pet_amenities: true })}
                      className={`flex-1 py-2.5 rounded-full font-bold text-xs transition-all ${
                        form.has_pet_amenities ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container-highest text-on-surface-variant"
                      }`}
                    >
                      {t("admin.yes")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, has_pet_amenities: false, pet_amenities: [], pet_amenities_other: "" })}
                      className={`flex-1 py-2.5 rounded-full font-bold text-xs transition-all ${
                        !form.has_pet_amenities ? "bg-surface-container text-on-surface-variant" : "bg-surface-container-highest text-on-surface-variant"
                      }`}
                    >
                      {t("admin.no")}
                    </button>
                  </div>
                  {form.has_pet_amenities && (
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {amenityOptions.map((a) => (
                          <button
                            key={a.key}
                            type="button"
                            onClick={() => setForm((f) => ({
                              ...f,
                              pet_amenities: f.pet_amenities.includes(a.key)
                                ? f.pet_amenities.filter((k) => k !== a.key)
                                : [...f.pet_amenities, a.key],
                            }))}
                            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                              form.pet_amenities.includes(a.key)
                                ? "bg-primary text-on-primary"
                                : "bg-surface-container-highest text-on-surface-variant hover:bg-surface-container"
                            }`}
                          >
                            {locale === "th" ? a.labelTh : a.labelEn}
                          </button>
                        ))}
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-on-surface-variant">{t("admin.otherAmenities")}</label>
                        <input
                          className="w-full h-10 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary text-sm"
                          placeholder={t("admin.otherAmenitiesPlaceholder")}
                          value={form.pet_amenities_other}
                          onChange={(e) => setForm({ ...form, pet_amenities_other: e.target.value })}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-on-surface-variant">{t("admin.latitude")}</label>
                  <input type="number" step="any" className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary text-sm" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-on-surface-variant">{t("admin.longitude")}</label>
                  <input type="number" step="any" className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary text-sm" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/10">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-full font-bold text-on-surface-variant hover:bg-surface-container transition-colors">
                  {t("pet.cancel")}
                </button>
                <button type="submit" disabled={saving} className="px-8 py-2.5 rounded-full font-bold bg-primary text-on-primary shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50">
                  {saving ? t("admin.saving") : t("common.save")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Places list */}
      <div className="space-y-3">
        <p className="text-sm text-on-surface-variant mb-2">
          {filteredPlaces.length} {filteredPlaces.length === 1 ? "place" : "places"}
        </p>

        {filteredPlaces.map((place) => (
          <div key={place.id} className="bg-surface-container-low rounded-xl p-4 md:p-5 flex items-center gap-4 border border-outline-variant/10 hover:shadow-sm transition-shadow">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-surface-container overflow-hidden shrink-0 flex items-center justify-center">
              {place.cover_image ? (
                <img src={place.cover_image} alt={place.name} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-2xl text-on-surface-variant/20">{getFirstTypeIcon(place.place_type)}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-headline font-bold text-base truncate">{place.name}</h3>
                {parseTypes(place.place_type).map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded-full bg-surface-container-highest text-xs font-medium text-on-surface-variant whitespace-nowrap">{t}</span>
                ))}
              </div>
              <p className="text-sm text-on-surface-variant truncate">
                <span className="material-symbols-outlined text-xs align-middle mr-1">location_on</span>
                {place.province}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => openEditForm(place)} className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-primary-container transition-colors" title={t("common.edit")}>
                <span className="material-symbols-outlined text-sm text-on-surface-variant">edit</span>
              </button>
              <button onClick={() => handleDelete(place)} className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-error-container transition-colors" title={t("common.delete")}>
                <span className="material-symbols-outlined text-sm text-error">delete</span>
              </button>
            </div>
          </div>
        ))}

        {filteredPlaces.length === 0 && (
          <div className="text-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-3 text-on-surface-variant/20">store</span>
            <p className="font-medium">{searchQuery ? t("explore.noResults") : t("admin.noPlaces")}</p>
            <button onClick={openCreateForm} className="mt-4 px-6 py-2 rounded-full bg-primary text-on-primary font-bold text-sm">
              {t("admin.addPlace")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
