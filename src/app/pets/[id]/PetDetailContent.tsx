"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/uploadImage";
import type { Pet } from "@/lib/types";

export default function PetDetailContent({ petId }: { petId: string }) {
  const { t } = useI18n();
  const router = useRouter();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [petCount, setPetCount] = useState(0);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [deathDate, setDeathDate] = useState("");
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data } = await supabase.from("pets").select("*").eq("id", petId).single();
      setPet(data);

      const { count } = await supabase
        .from("pets")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);
      setPetCount(count || 0);

      setLoading(false);
    }
    load();
  }, [petId]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pet) return;
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError(t("pet.photoTooLarge"));
      return;
    }
    setUploadingPhoto(true);
    setPhotoError("");
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const url = await uploadImage("pet-photos", user.id, file);
      await supabase.from("pets").update({ photo_url: url }).eq("id", petId);
      setPet({ ...pet, photo_url: url });
    } catch (err: any) {
      setPhotoError(err.message || "Failed to upload photo");
    }
    setUploadingPhoto(false);
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this pet profile?")) return;
    const supabase = createClient();
    await supabase.from("pets").delete().eq("id", petId);
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
      </div>
    );
  }

  if (!pet) {
    return <div className="text-center py-20 text-on-surface-variant">Pet not found</div>;
  }

  const age = pet.birthday
    ? `${Math.floor((new Date(pet.status === "deceased" && pet.date_of_death ? pet.date_of_death : Date.now()).getTime() - new Date(pet.birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years`
    : "";

  return (
    <>
      <header className="mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-on-surface-variant hover:text-primary mb-4">
          <span className="material-symbols-outlined">arrow_back</span> {t("common.back")}
        </button>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div
              onClick={() => photoInputRef.current?.click()}
              className="w-24 h-24 rounded-full bg-surface-container border-4 border-primary flex items-center justify-center overflow-hidden cursor-pointer"
            >
              {uploadingPhoto ? (
                <span className="material-symbols-outlined text-3xl text-primary animate-spin">progress_activity</span>
              ) : pet.photo_url ? (
                <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-5xl text-on-surface-variant/30" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
              )}
            </div>
            <div
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md cursor-pointer"
              onClick={() => photoInputRef.current?.click()}
            >
              <span className="material-symbols-outlined text-on-primary text-sm">photo_camera</span>
            </div>
            <input ref={photoInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </div>
          <div>
            <h1 className="font-headline text-4xl font-extrabold tracking-tight">{pet.name}</h1>
            <p className="text-on-surface-variant text-lg">
              {pet.breed || pet.species} {age ? `• ${age}` : ""}
            </p>
            {pet.status === "deceased" ? (
              <div className="mt-2 inline-flex items-center gap-1 bg-error-container text-on-error-container px-3 py-1 rounded-full text-xs font-bold">
                <span className="material-symbols-outlined text-xs">pets</span>
                {t("pet.deceased")} {pet.date_of_death ? `• ${new Date(pet.date_of_death).toLocaleDateString()}` : ""}
              </div>
            ) : (
              <div className="mt-2 inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-secondary"></span> {t("pet.alive")}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Info card */}
        <div className="bg-surface-container-low p-6 rounded-xl space-y-4">
          <h3 className="font-headline font-bold text-lg">{t("pet.basicInfo")}</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-on-surface-variant">{t("pet.species")}</span><span className="font-medium">{pet.species}</span></div>
            {pet.breed && <div className="flex justify-between"><span className="text-on-surface-variant">{t("pet.breed")}</span><span className="font-medium">{pet.breed}</span></div>}
            {pet.birthday && <div className="flex justify-between"><span className="text-on-surface-variant">{t("pet.birthday")}</span><span className="font-medium">{new Date(pet.birthday).toLocaleDateString()}</span></div>}
            {pet.weight && <div className="flex justify-between"><span className="text-on-surface-variant">{t("pet.weight")}</span><span className="font-medium">{pet.weight} kg</span></div>}
            <div className="flex justify-between">
              <span className="text-on-surface-variant">{t("pet.statusSection")}</span>
              <span className={`font-medium ${pet.status === "deceased" ? "text-error" : "text-secondary"}`}>
                {pet.status === "deceased" ? t("pet.deceased") : t("pet.alive")}
              </span>
            </div>
            {pet.date_of_death && (
              <div className="flex justify-between">
                <span className="text-on-surface-variant">{t("pet.dateOfDeath")}</span>
                <span className="font-medium">{new Date(pet.date_of_death).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Personality card */}
        <div className="bg-surface-container-low p-6 rounded-xl space-y-4">
          <h3 className="font-headline font-bold text-lg">{t("pet.personality")}</h3>
          {pet.temperament && pet.temperament.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {pet.temperament.map((tag) => (
                <span key={tag} className="px-4 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed text-xs font-semibold">{tag}</span>
              ))}
            </div>
          )}
          {pet.social_dogs && <p className="text-sm"><span className="text-on-surface-variant">{t("pet.socialDogs")}</span> <span className="font-medium">{pet.social_dogs}</span></p>}
          {pet.social_cats && <p className="text-sm"><span className="text-on-surface-variant">{t("pet.socialCats")}</span> <span className="font-medium">{pet.social_cats}</span></p>}
        </div>

        {/* Health card */}
        <div className="md:col-span-2 bg-surface-container-low p-6 rounded-xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-headline font-bold text-lg">{t("pet.healthCare")}</h3>
            <Link href={`/pets/${petId}/medical`} className="text-primary font-bold text-sm hover:underline">
              {t("medical.title")} →
            </Link>
          </div>
          {pet.special_needs && <p className="text-sm text-on-surface-variant">{pet.special_needs}</p>}
          <Link
            href={`/pets/${petId}/medical`}
            className="inline-flex items-center gap-2 bg-tertiary-container text-on-tertiary-container px-6 py-3 rounded-full font-bold text-sm"
          >
            <span className="material-symbols-outlined text-sm">vaccines</span>
            {t("medical.vaccinations")}
          </Link>
        </div>
      </div>

      {photoError && (
        <div className="mt-4 bg-error-container text-on-error-container p-3 rounded-lg text-sm">{photoError}</div>
      )}

      {/* Status change modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
          <div className="bg-surface rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <h3 className="font-headline font-bold text-lg">{t("pet.markDeceased")}</h3>
            <p className="text-sm text-on-surface-variant">{t("pet.markDeceasedDesc")}</p>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-on-surface-variant">{t("pet.dateOfDeath")} *</label>
              <input
                type="date"
                className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-error"
                value={deathDate}
                onChange={(e) => setDeathDate(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => { setShowStatusModal(false); setDeathDate(""); }} className="px-5 py-2 rounded-full font-bold text-on-surface-variant hover:bg-surface-container transition-colors">
                {t("pet.cancel")}
              </button>
              <button
                onClick={async () => {
                  if (!deathDate) return;
                  const supabase = createClient();
                  await supabase.from("pets").update({ status: "deceased", date_of_death: deathDate }).eq("id", petId);
                  setPet({ ...pet!, status: "deceased", date_of_death: deathDate });
                  setShowStatusModal(false);
                  setDeathDate("");
                }}
                className="px-5 py-2 rounded-full font-bold bg-error text-white hover:opacity-90 transition-colors"
              >
                {t("common.save")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-outline-variant/10">
        {petCount < 3 && (
          <Link
            href="/pets/new"
            className="px-6 py-2 rounded-full bg-primary text-on-primary font-bold hover:opacity-90 transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            {t("dashboard.addPet")}
          </Link>
        )}
        {pet.status === "alive" ? (
          <button
            onClick={() => setShowStatusModal(true)}
            className="px-6 py-2 rounded-full border-2 border-on-surface-variant text-on-surface-variant font-bold hover:bg-surface-container transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">pets</span>
            {t("pet.markDeceased")}
          </button>
        ) : (
          <button
            onClick={async () => {
              const supabase = createClient();
              await supabase.from("pets").update({ status: "alive", date_of_death: null }).eq("id", petId);
              setPet({ ...pet, status: "alive", date_of_death: null });
            }}
            className="px-6 py-2 rounded-full border-2 border-secondary text-secondary font-bold hover:bg-secondary-container transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">favorite</span>
            {t("pet.markAlive")}
          </button>
        )}
        <button onClick={handleDelete} className="px-6 py-2 rounded-full border-2 border-error text-error font-bold hover:bg-error-container transition-colors">
          {t("common.delete")}
        </button>
      </div>
    </>
  );
}
