"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { provinces } from "@/lib/provinces";
import { extractCoordsFromUrl } from "@/lib/extractCoords";
import type { PlaceType, PlaceRequest } from "@/lib/types";

const allPlaceTypes: PlaceType[] = [
  "Hotel", "Pet Hotel", "Cafe", "Restaurant", "Hospital", "Clinic",
  "Pet Supplier", "Shopping Mall", "Park", "Pool", "Pet School",
];

const typeIconMap: Record<string, string> = {
  Hotel: "hotel", "Pet Hotel": "pets", Cafe: "local_cafe", Restaurant: "restaurant",
  Hospital: "medical_services", Clinic: "medical_services", "Pet Supplier": "storefront",
  "Shopping Mall": "shopping_bag", Park: "park", Pool: "pool", "Pet School": "school",
};

export default function RequestPlaceContent() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [myRequests, setMyRequests] = useState<PlaceRequest[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [extractingCoords, setExtractingCoords] = useState(false);

  const [form, setForm] = useState({
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
    latitude: "13.7563",
    longitude: "100.5018",
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data } = await supabase
        .from("place_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setMyRequests(data || []);
    }
    load();
  }, [router, success]);

  const toggleType = (type: string) => {
    setForm((f) => ({
      ...f,
      place_types: f.place_types.includes(type)
        ? f.place_types.filter((t) => t !== type)
        : [...f.place_types, type],
    }));
  };

  const handleGoogleMapsUrlChange = async (url: string) => {
    setForm((f) => ({ ...f, google_maps_url: url }));
    if (!url) return;

    const coords = extractCoordsFromUrl(url);
    if (coords) {
      setForm((f) => ({ ...f, google_maps_url: url, latitude: String(coords.lat), longitude: String(coords.lng) }));
      return;
    }

    if (url.includes("goo.gl") || url.includes("maps.app")) {
      setExtractingCoords(true);
      try {
        const res = await fetch("/api/resolve-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        const data = await res.json();
        if (data.resolvedUrl) {
          const resolved = extractCoordsFromUrl(data.resolvedUrl);
          if (resolved) {
            setForm((f) => ({ ...f, latitude: String(resolved.lat), longitude: String(resolved.lng) }));
          }
        }
      } catch { /* ignore */ }
      setExtractingCoords(false);
    }
  };

  const handleProvinceChange = (provinceTh: string) => {
    const prov = provinces.find((p) => p.th === provinceTh);
    setForm((f) => ({
      ...f,
      province: provinceTh,
      ...(prov && !f.google_maps_url ? { latitude: String(prov.coords[0]), longitude: String(prov.coords[1]) } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.place_types.length === 0) {
      setError(t("request.selectType"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { error } = await supabase.from("place_requests").insert({
        user_id: user.id,
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
        latitude: parseFloat(form.latitude) || 13.7563,
        longitude: parseFloat(form.longitude) || 100.5018,
      });
      if (error) throw error;

      setSuccess(true);
      setShowForm(false);
      setForm({
        name: "", place_types: [], province: "", description: "", google_maps_url: "",
        website_url: "", pet_fee: "", pet_condition: "", pet_friendly: "", cover_image: "",
        latitude: "13.7563", longitude: "100.5018",
      });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status: string) => {
    if (status === "approved") return { bg: "bg-secondary-container", text: "text-on-secondary-container", icon: "check_circle", label: t("request.approved") };
    if (status === "rejected") return { bg: "bg-error-container", text: "text-on-error-container", icon: "cancel", label: t("request.rejected") };
    return { bg: "bg-primary-container", text: "text-on-primary-container", icon: "schedule", label: t("request.pending") };
  };

  return (
    <>
      <header className="mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-on-surface-variant hover:text-primary mb-4">
          <span className="material-symbols-outlined">arrow_back</span> {t("common.back")}
        </button>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight">
          {t("request.title")}
        </h1>
        <p className="text-on-surface-variant mt-1">{t("request.subtitle")}</p>
      </header>

      {success && (
        <div className="mb-6 bg-secondary-container text-on-secondary-container p-4 rounded-lg text-sm font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          {t("request.submitted")}
        </div>
      )}

      {/* New Request Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="mb-8 px-6 py-3 rounded-full bg-primary text-on-primary font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          {t("request.newRequest")}
        </button>
      )}

      {/* Request Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-surface-container-low p-6 md:p-8 rounded-xl border border-outline-variant/15 space-y-5">
          <div className="flex justify-between items-center">
            <h2 className="font-headline font-bold text-xl">{t("request.newRequest")}</h2>
            <button type="button" onClick={() => setShowForm(false)} className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>

          {error && <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm">{error}</div>}

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-on-surface-variant">{t("admin.placeName")} *</label>
            <input className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>

          {/* Place Types */}
          <div className="flex flex-col gap-1">
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

          {/* Province */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-on-surface-variant">{t("admin.province")} *</label>
            <select className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary" value={form.province} onChange={(e) => handleProvinceChange(e.target.value)} required>
              <option value="">{t("explore.allProvinces")}</option>
              {provinces.map((p) => (
                <option key={p.th} value={p.th}>{locale === "th" ? p.th : `${p.en} (${p.th})`}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-on-surface-variant">{t("admin.description")}</label>
            <textarea className="w-full p-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary resize-none" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          {/* Google Maps URL */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-on-surface-variant">
              {t("admin.googleMapsUrl")}
              {extractingCoords && <span className="ml-2 text-xs text-primary font-normal">{t("admin.extractingCoords")}</span>}
            </label>
            <input className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary text-sm" placeholder="https://maps.app.goo.gl/..." value={form.google_maps_url} onChange={(e) => handleGoogleMapsUrlChange(e.target.value)} />
          </div>

          {/* Website */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-on-surface-variant">{t("admin.websiteUrl")}</label>
            <input className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary text-sm" placeholder="https://..." value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} />
          </div>

          {/* Cover Image URL */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-bold text-on-surface-variant">{t("admin.coverImage")}</label>
            <input className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary text-sm" placeholder={t("admin.imageUrlPlaceholder")} value={form.cover_image} onChange={(e) => setForm({ ...form, cover_image: e.target.value })} />
          </div>

          {/* Pet info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-on-surface-variant">{t("admin.petFee")}</label>
              <input className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary text-sm" value={form.pet_fee} onChange={(e) => setForm({ ...form, pet_fee: e.target.value })} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-bold text-on-surface-variant">{t("admin.petFriendly")}</label>
              <input className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary text-sm" value={form.pet_friendly} onChange={(e) => setForm({ ...form, pet_friendly: e.target.value })} />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant/10">
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-full font-bold text-on-surface-variant hover:bg-surface-container transition-colors">
              {t("pet.cancel")}
            </button>
            <button type="submit" disabled={loading} className="px-8 py-2.5 rounded-full font-bold bg-primary text-on-primary shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50">
              {loading ? t("common.loading") : t("request.submit")}
            </button>
          </div>
        </form>
      )}

      {/* My Requests List */}
      <section>
        <h2 className="font-headline font-bold text-xl mb-4">{t("request.myRequests")}</h2>
        <div className="space-y-3">
          {myRequests.map((req) => {
            const badge = statusBadge(req.status);
            return (
              <div key={req.id} className="bg-surface-container-low rounded-xl p-4 md:p-5 border border-outline-variant/10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-headline font-bold text-base">{req.name}</h3>
                    <p className="text-sm text-on-surface-variant mt-0.5">
                      <span className="material-symbols-outlined text-xs align-middle mr-1">location_on</span>
                      {req.province}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {req.place_type.split(",").map((t) => (
                        <span key={t.trim()} className="px-2 py-0.5 rounded-full bg-surface-container-highest text-xs font-medium text-on-surface-variant">{t.trim()}</span>
                      ))}
                    </div>
                  </div>
                  <span className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0`}>
                    <span className="material-symbols-outlined text-xs">{badge.icon}</span>
                    {badge.label}
                  </span>
                </div>
                {req.admin_note && (
                  <div className="mt-3 p-3 bg-surface-container rounded-lg text-sm text-on-surface-variant">
                    <span className="font-bold">{t("request.adminNote")}:</span> {req.admin_note}
                  </div>
                )}
                <p className="text-xs text-on-surface-variant/50 mt-2">{new Date(req.created_at).toLocaleDateString()}</p>
              </div>
            );
          })}
          {myRequests.length === 0 && (
            <div className="text-center py-12 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/20 mb-2">add_location_alt</span>
              <p>{t("request.noRequests")}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
