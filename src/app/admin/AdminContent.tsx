"use client";

import { useState, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/uploadImage";
import type { Place, PlaceType } from "@/lib/types";

const placeTypes: PlaceType[] = ["Hotel", "Pet Hotel", "Cafe", "Restaurant", "Hospital", "Clinic", "Pet Supplier"];

const emptyForm = {
  name: "",
  place_type: "Hotel" as PlaceType,
  province: "",
  description: "",
  google_maps_url: "",
  website_url: "",
  pet_fee: "",
  pet_condition: "",
  pet_friendly: "",
  latitude: "13.7563",
  longitude: "100.5018",
};

export default function AdminContent({ initialPlaces }: { initialPlaces: Place[] }) {
  const { t } = useI18n();
  const [places, setPlaces] = useState<Place[]>(initialPlaces);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const openCreateForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setCoverFile(null);
    setCoverPreview(null);
    setShowForm(true);
    setMessage("");
  };

  const openEditForm = (place: Place) => {
    setEditingId(place.id);
    setForm({
      name: place.name,
      place_type: place.place_type,
      province: place.province,
      description: place.description || "",
      google_maps_url: place.google_maps_url || "",
      website_url: place.website_url || "",
      pet_fee: place.pet_fee || "",
      pet_condition: place.pet_condition || "",
      pet_friendly: place.pet_friendly || "",
      latitude: String(place.latitude),
      longitude: String(place.longitude),
    });
    setCoverFile(null);
    setCoverPreview(place.cover_image || null);
    setShowForm(true);
    setMessage("");
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      let cover_image: string | null = coverPreview;

      if (coverFile) {
        // Upload to place-covers bucket using the general upload helper pattern
        const ext = coverFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `covers/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("place-covers")
          .upload(fileName, coverFile, { upsert: true });

        if (!uploadError) {
          const { data: urlData } = supabase.storage.from("place-covers").getPublicUrl(fileName);
          cover_image = urlData.publicUrl;
        }
      }

      const placeData = {
        name: form.name,
        place_type: form.place_type,
        province: form.province,
        description: form.description || null,
        google_maps_url: form.google_maps_url || null,
        website_url: form.website_url || null,
        pet_fee: form.pet_fee || null,
        pet_condition: form.pet_condition || null,
        pet_friendly: form.pet_friendly || null,
        cover_image,
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

  const typeIcon = (type: PlaceType) => {
    const icons: Record<PlaceType, string> = {
      Hotel: "hotel",
      "Pet Hotel": "pets",
      Cafe: "local_cafe",
      Restaurant: "restaurant",
      Hospital: "medical_services",
      Clinic: "medical_services",
      "Pet Supplier": "storefront",
    };
    return icons[type] || "place";
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

      {/* Form modal/overlay */}
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
              {/* Cover Image */}
              <div>
                <label className="text-sm font-bold text-on-surface-variant block mb-2">{t("admin.coverImage")}</label>
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => fileRef.current?.click()}
                    className="w-24 h-24 rounded-xl border-2 border-dashed border-outline-variant/30 hover:border-primary/50 flex items-center justify-center cursor-pointer overflow-hidden bg-surface-container"
                  >
                    {coverPreview ? (
                      <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-2xl text-on-surface-variant/30">add_photo_alternate</span>
                    )}
                  </div>
                  <div>
                    <button type="button" onClick={() => fileRef.current?.click()} className="text-sm text-primary font-semibold">
                      {t("admin.uploadImage")}
                    </button>
                    {coverPreview && (
                      <button
                        type="button"
                        onClick={() => { setCoverFile(null); setCoverPreview(null); }}
                        className="block text-xs text-error mt-1"
                      >
                        {t("common.delete")}
                      </button>
                    )}
                  </div>
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
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
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-on-surface-variant">{t("admin.placeType")}</label>
                  <select
                    className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary"
                    value={form.place_type}
                    onChange={(e) => setForm({ ...form, place_type: e.target.value as PlaceType })}
                  >
                    {placeTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-on-surface-variant">{t("admin.province")}</label>
                  <input
                    className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary"
                    value={form.province}
                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                    required
                  />
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
                  <input
                    className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary text-sm"
                    value={form.pet_fee}
                    onChange={(e) => setForm({ ...form, pet_fee: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-on-surface-variant">{t("admin.petCondition")}</label>
                  <input
                    className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary text-sm"
                    value={form.pet_condition}
                    onChange={(e) => setForm({ ...form, pet_condition: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-on-surface-variant">{t("admin.petFriendly")}</label>
                  <input
                    className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary text-sm"
                    value={form.pet_friendly}
                    onChange={(e) => setForm({ ...form, pet_friendly: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-on-surface-variant">{t("admin.latitude")}</label>
                  <input
                    type="number"
                    step="any"
                    className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary text-sm"
                    value={form.latitude}
                    onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-bold text-on-surface-variant">{t("admin.longitude")}</label>
                  <input
                    type="number"
                    step="any"
                    className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary text-sm"
                    value={form.longitude}
                    onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/10">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-2.5 rounded-full font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  {t("pet.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-2.5 rounded-full font-bold bg-primary text-on-primary shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
                >
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
          <div
            key={place.id}
            className="bg-surface-container-low rounded-xl p-4 md:p-5 flex items-center gap-4 border border-outline-variant/10 hover:shadow-sm transition-shadow"
          >
            {/* Cover thumbnail */}
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-surface-container overflow-hidden shrink-0 flex items-center justify-center">
              {place.cover_image ? (
                <img src={place.cover_image} alt={place.name} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-2xl text-on-surface-variant/20">{typeIcon(place.place_type)}</span>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-headline font-bold text-base truncate">{place.name}</h3>
                <span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-xs font-medium text-on-surface-variant whitespace-nowrap">
                  {place.place_type}
                </span>
              </div>
              <p className="text-sm text-on-surface-variant truncate">
                <span className="material-symbols-outlined text-xs align-middle mr-1">location_on</span>
                {place.province}
              </p>
              {place.description && (
                <p className="text-xs text-on-surface-variant/70 mt-1 line-clamp-1">{place.description}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => openEditForm(place)}
                className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-primary-container transition-colors"
                title={t("common.edit")}
              >
                <span className="material-symbols-outlined text-sm text-on-surface-variant">edit</span>
              </button>
              <button
                onClick={() => handleDelete(place)}
                className="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-error-container transition-colors"
                title={t("common.delete")}
              >
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
