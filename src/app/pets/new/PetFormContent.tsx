"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/uploadImage";

const temperamentOptions = ["Playful", "Shy", "Energetic", "Cuddly", "Vocal", "Calm", "Protective"];

export default function PetFormContent() {
  const { t } = useI18n();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  // Check if user already has 5 pets (limit)
  useEffect(() => {
    async function checkPetLimit() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push("/login"); return; }

        const { count } = await supabase
          .from("pets")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        if (count && count >= 5) {
          router.push("/dashboard");
          return;
        }
      } catch {
        // continue to form
      }
      setChecking(false);
    }
    checkPetLimit();
  }, [router]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    species: "dog" as "dog" | "cat" | "other",
    breed: "",
    birthday: "",
    weight: "",
    temperament: [] as string[],
    social_dogs: "",
    social_cats: "",
    special_needs: "",
    status: "alive" as "alive" | "deceased",
    date_of_death: "",
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError(t("pet.photoTooLarge"));
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const toggleTemperament = (tag: string) => {
    setForm((f) => ({
      ...f,
      temperament: f.temperament.includes(tag)
        ? f.temperament.filter((t) => t !== tag)
        : [...f.temperament, tag],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      let photo_url: string | null = null;
      if (photoFile) {
        try {
          photo_url = await uploadImage("pet-photos", user.id, photoFile);
        } catch (uploadErr: any) {
          setError(uploadErr.message || "Failed to upload photo. Make sure the pet-photos storage bucket exists in Supabase.");
          setLoading(false);
          return;
        }
      }

      const { error } = await supabase.from("pets").insert({
        user_id: user.id,
        name: form.name,
        species: form.species,
        breed: form.breed || null,
        birthday: form.birthday || null,
        weight: form.weight ? parseFloat(form.weight) : null,
        temperament: form.temperament,
        social_dogs: form.social_dogs || null,
        social_cats: form.social_cats || null,
        special_needs: form.special_needs || null,
        photo_url,
        status: form.status,
        date_of_death: form.status === "deceased" && form.date_of_death ? form.date_of_death : null,
      });
      if (error) throw error;
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create pet profile");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <>
      <header className="mb-8 md:mb-10">
        <span className="inline-flex items-center px-4 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold tracking-widest uppercase mb-3">
          {t("dashboard.addPet")}
        </span>
        <h1 className="text-3xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight">
          {t("pet.createProfile")}
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm">{error}</div>
        )}

        {/* Photo Upload */}
        <section className="bg-surface-container-low p-6 md:p-8 rounded-xl border border-outline-variant/15">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-fixed-variant">photo_camera</span>
            </div>
            <h2 className="font-headline font-bold text-xl md:text-2xl tracking-tight">{t("pet.photo")}</h2>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 rounded-full border-4 border-dashed border-outline-variant/30 hover:border-primary/50 flex items-center justify-center cursor-pointer overflow-hidden bg-surface-container transition-colors"
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Pet preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-1 text-on-surface-variant/40">
                  <span className="material-symbols-outlined text-3xl">add_a_photo</span>
                  <span className="text-xs font-medium">{t("pet.addPhoto")}</span>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
            {photoPreview && (
              <button
                type="button"
                onClick={() => { setPhotoFile(null); setPhotoPreview(null); }}
                className="text-xs text-error hover:underline"
              >
                {t("pet.removePhoto")}
              </button>
            )}
            <p className="text-xs text-on-surface-variant">{t("pet.photoHint")}</p>
          </div>
        </section>

        {/* Basic Info */}
        <section className="bg-surface-container-low p-6 md:p-8 rounded-xl border border-outline-variant/15 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-fixed-variant">edit</span>
            </div>
            <h2 className="font-headline font-bold text-xl md:text-2xl tracking-tight">{t("pet.basicInfo")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 flex flex-col gap-2">
              <label className="text-sm font-bold text-on-surface-variant px-1">{t("pet.name")}</label>
              <input
                className="w-full h-14 px-6 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary font-medium"
                placeholder="e.g. Luna"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-on-surface-variant px-1">{t("pet.species")}</label>
              <select
                className="w-full h-14 px-6 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary font-medium"
                value={form.species}
                onChange={(e) => setForm({ ...form, species: e.target.value as any })}
              >
                <option value="dog">{t("pet.dog")}</option>
                <option value="cat">{t("pet.cat")}</option>
                <option value="other">{t("pet.other")}</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-on-surface-variant px-1">{t("pet.breed")}</label>
              <input
                className="w-full h-14 px-6 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary font-medium"
                placeholder="Golden Retriever"
                value={form.breed}
                onChange={(e) => setForm({ ...form, breed: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-on-surface-variant px-1">{t("pet.birthday")}</label>
              <input
                type="date"
                className="w-full h-14 px-6 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary font-medium"
                value={form.birthday}
                onChange={(e) => setForm({ ...form, birthday: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-on-surface-variant px-1">{t("pet.weight")}</label>
              <input
                type="number"
                step="0.1"
                className="w-full h-14 px-6 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary font-medium"
                placeholder="24.5"
                value={form.weight}
                onChange={(e) => setForm({ ...form, weight: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Personality */}
        <section className="bg-surface-container p-6 md:p-8 rounded-xl space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-secondary-container">mood</span>
            </div>
            <h2 className="font-headline font-bold text-xl md:text-2xl tracking-tight">{t("pet.personality")}</h2>
          </div>
          <div>
            <p className="text-sm font-bold text-on-surface-variant mb-3">{t("pet.temperament")}</p>
            <div className="flex flex-wrap gap-3">
              {temperamentOptions.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTemperament(tag)}
                  className={`px-5 py-2 rounded-full border-2 font-semibold text-sm transition-all ${
                    form.temperament.includes(tag)
                      ? "border-primary bg-primary-fixed text-on-primary-fixed"
                      : "border-transparent bg-surface-container-highest text-on-surface-variant hover:border-outline-variant"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-lg bg-surface-container-low border border-outline-variant/15 space-y-3">
              <p className="text-sm font-bold text-on-surface-variant">{t("pet.socialDogs")}</p>
              <div className="flex gap-2">
                {["Loves them", "Selective", "No"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setForm({ ...form, social_dogs: opt })}
                    className={`flex-1 py-2.5 rounded-full font-bold text-xs transition-all ${
                      form.social_dogs === opt
                        ? "bg-secondary-container text-on-secondary-container"
                        : "bg-surface-container-highest text-on-surface-variant"
                    }`}
                  >
                    {opt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-5 rounded-lg bg-surface-container-low border border-outline-variant/15 space-y-3">
              <p className="text-sm font-bold text-on-surface-variant">{t("pet.socialCats")}</p>
              <div className="flex gap-2">
                {["Friendly", "Curious", "Avoid"].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setForm({ ...form, social_cats: opt })}
                    className={`flex-1 py-2.5 rounded-full font-bold text-xs transition-all ${
                      form.social_cats === opt
                        ? opt === "Avoid" ? "bg-error-container text-on-error-container" : "bg-secondary-container text-on-secondary-container"
                        : "bg-surface-container-highest text-on-surface-variant"
                    }`}
                  >
                    {opt.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Health */}
        <section className="bg-stone-100/50 p-6 md:p-8 rounded-xl border border-stone-200 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-tertiary-container">medical_information</span>
            </div>
            <h2 className="font-headline font-bold text-xl md:text-2xl tracking-tight">{t("pet.healthCare")}</h2>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">{t("pet.specialNeeds")}</label>
            <textarea
              className="w-full p-4 md:p-6 bg-surface-container-lowest border border-stone-200 rounded-lg focus:ring-2 focus:ring-tertiary resize-none"
              placeholder="e.g. Needs eye drops twice daily, allergy to chicken protein..."
              rows={4}
              value={form.special_needs}
              onChange={(e) => setForm({ ...form, special_needs: e.target.value })}
            />
          </div>
        </section>

        {/* Status */}
        <section className="bg-surface-container-low p-6 md:p-8 rounded-xl border border-outline-variant/15 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-secondary-container">favorite</span>
            </div>
            <h2 className="font-headline font-bold text-xl md:text-2xl tracking-tight">{t("pet.statusSection")}</h2>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, status: "alive", date_of_death: "" })}
              className={`flex-1 py-3 rounded-full font-bold text-sm transition-all ${
                form.status === "alive"
                  ? "bg-secondary-container text-on-secondary-container"
                  : "bg-surface-container-highest text-on-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined text-sm align-middle mr-1">favorite</span>
              {t("pet.alive")}
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, status: "deceased" })}
              className={`flex-1 py-3 rounded-full font-bold text-sm transition-all ${
                form.status === "deceased"
                  ? "bg-error-container text-on-error-container"
                  : "bg-surface-container-highest text-on-surface-variant"
              }`}
            >
              <span className="material-symbols-outlined text-sm align-middle mr-1">pets</span>
              {t("pet.deceased")}
            </button>
          </div>
          {form.status === "deceased" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-on-surface-variant">{t("pet.dateOfDeath")} *</label>
              <input
                type="date"
                className="w-full h-14 px-6 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-error font-medium"
                value={form.date_of_death}
                onChange={(e) => setForm({ ...form, date_of_death: e.target.value })}
                required
              />
            </div>
          )}
        </section>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-stone-100">
          <button type="button" onClick={() => router.back()} className="px-8 py-3 rounded-full font-bold text-primary hover:bg-primary-fixed transition-all">
            {t("pet.cancel")}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-10 py-3 rounded-full font-extrabold bg-primary text-on-primary shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? t("common.loading") : t("pet.saveProfile")}
          </button>
        </div>
      </form>
    </>
  );
}
