"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/uploadImage";
import type { Pet } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

export default function DashboardContent() {
  const { t } = useI18n();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);
      setAvatarUrl(user.user_metadata?.avatar_url || null);

      const { data: petsData } = await supabase
        .from("pets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at");
      setPets(petsData || []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
          <p className="mt-2 text-on-surface-variant">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Friend";

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) return;
    setUploadingAvatar(true);
    const url = await uploadImage("avatars", user.id, file);
    if (url) {
      setAvatarUrl(url);
      const supabase = createClient();
      await supabase.auth.updateUser({ data: { avatar_url: url } });
    }
    setUploadingAvatar(false);
  };

  return (
    <>
      {/* Header */}
      <header className="mb-8 md:mb-12 flex items-center gap-6">
        <div className="relative group">
          <div
            onClick={() => avatarInputRef.current?.click()}
            className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-primary bg-surface-container flex items-center justify-center overflow-hidden cursor-pointer"
          >
            {uploadingAvatar ? (
              <span className="material-symbols-outlined text-3xl text-primary animate-spin">progress_activity</span>
            ) : avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">person</span>
            )}
          </div>
          <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary flex items-center justify-center shadow-md cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
            <span className="material-symbols-outlined text-on-primary text-sm">photo_camera</span>
          </div>
          <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        </div>
        <div>
          <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-on-surface mb-2">
            {t("dashboard.welcome")} {userName}!
          </h1>
          <p className="text-on-surface-variant text-lg">{t("dashboard.subtitle")}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Pet Profiles */}
        <section className="md:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-low p-6 md:p-8 rounded-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-container/10 rounded-full blur-3xl"></div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline text-xl md:text-2xl font-bold">{t("dashboard.petProfiles")}</h2>
              {pets.length === 0 && (
                <Link href="/pets/new" className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-primary-container transition-colors">
                  <span className="material-symbols-outlined text-on-surface-variant">add</span>
                </Link>
              )}
            </div>
            <div className="space-y-4">
              {pets.map((pet) => (
                <Link key={pet.id} href={`/pets/${pet.id}`}>
                  <div className="flex items-center gap-4 p-4 bg-surface-container-lowest rounded-lg hover:shadow-sm transition-all border border-transparent hover:border-outline-variant/10 cursor-pointer">
                    <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-primary bg-surface-container flex items-center justify-center">
                      {pet.photo_url ? (
                        <img src={pet.photo_url} alt={pet.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-2xl text-on-surface-variant/50" style={{ fontVariationSettings: "'FILL' 1" }}>
                          pets
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-lg leading-tight">{pet.name}</h3>
                      <p className="text-sm text-on-surface-variant">
                        {pet.breed || pet.species} {pet.birthday ? `• ${new Date().getFullYear() - new Date(pet.birthday).getFullYear()} years` : ""}
                      </p>
                      <div className="mt-1 inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> {t("common.healthy")}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {pets.length === 0 && (
                <Link href="/pets/new">
                  <div className="flex flex-col items-center gap-3 p-8 bg-surface-container-lowest rounded-lg border-2 border-dashed border-outline-variant/30 hover:border-primary/30 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant/30">add_circle</span>
                    <p className="font-medium text-on-surface-variant">{t("dashboard.addPet")}</p>
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* Health Passport Card */}
          <div className="bg-secondary-fixed text-on-secondary-fixed-variant p-6 md:p-8 rounded-xl">
            <span className="material-symbols-outlined text-4xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>pets</span>
            <h4 className="font-headline text-xl font-bold mb-2">{t("dashboard.healthPassport")}</h4>
            <p className="text-sm opacity-80 mb-4">{t("dashboard.healthPassportDesc")}</p>
            {pets.length > 0 ? (
              <Link href={`/pets/${pets[0].id}/medical`} className="bg-on-secondary-fixed-variant text-white px-5 py-2 rounded-full text-sm font-semibold inline-block">
                {t("dashboard.accessRecords")}
              </Link>
            ) : (
              <Link href="/pets/new" className="bg-on-secondary-fixed-variant text-white px-5 py-2 rounded-full text-sm font-semibold inline-block">
                {t("dashboard.addPet")}
              </Link>
            )}
          </div>
        </section>

        {/* Main content */}
        <section className="md:col-span-8 flex flex-col gap-6">
          {/* Saved spots placeholder */}
          <div className="bg-surface-container-low p-6 md:p-8 rounded-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-headline text-xl md:text-2xl font-bold">{t("dashboard.savedSpots")}</h2>
              <Link href="/explore" className="text-primary font-semibold text-sm hover:underline">{t("common.viewAll")}</Link>
            </div>
            <div className="flex flex-col items-center gap-3 py-8 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/20">bookmark</span>
              <p>Start exploring to save your favorite spots!</p>
              <Link href="/explore" className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold text-sm mt-2">
                {t("nav.explore")}
              </Link>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/explore" className="bg-primary-container/10 p-6 rounded-xl hover:bg-primary-container/20 transition-colors">
              <span className="material-symbols-outlined text-primary text-3xl mb-3">explore</span>
              <h3 className="font-headline font-bold mb-1">{t("nav.explore")}</h3>
              <p className="text-sm text-on-surface-variant">Find pet-friendly spots near you</p>
            </Link>
            {pets.length === 0 ? (
              <Link href="/pets/new" className="bg-secondary-container/10 p-6 rounded-xl hover:bg-secondary-container/20 transition-colors">
                <span className="material-symbols-outlined text-secondary text-3xl mb-3">add_circle</span>
                <h3 className="font-headline font-bold mb-1">{t("dashboard.addPet")}</h3>
                <p className="text-sm text-on-surface-variant">Create a profile for your pet</p>
              </Link>
            ) : (
              <Link href={`/pets/${pets[0].id}`} className="bg-secondary-container/10 p-6 rounded-xl hover:bg-secondary-container/20 transition-colors">
                <span className="material-symbols-outlined text-secondary text-3xl mb-3">pets</span>
                <h3 className="font-headline font-bold mb-1">{t("pet.viewProfile")}</h3>
                <p className="text-sm text-on-surface-variant">{t("pet.viewProfileDesc")}</p>
              </Link>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
