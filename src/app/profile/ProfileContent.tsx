"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import { avatarOptions } from "@/lib/avatars";
import type { User } from "@supabase/supabase-js";

export default function ProfileContent() {
  const { t } = useI18n();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);
      setFullName(user.user_metadata?.full_name || "");
      setAvatarUrl(user.user_metadata?.avatar_url || "");
      setPhone(user.user_metadata?.phone || user.phone || "");
      setLoading(false);
    }
    load();
  }, [router]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setMessage("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          avatar_url: avatarUrl,
          phone: phone,
        },
      });
      if (error) throw error;
      setMessage(t("profile.saved"));
    } catch (err: any) {
      setMessage(err.message || "Failed to save");
    }
    setSaving(false);
  };

  const selectAvatar = (url: string) => {
    setAvatarUrl(url);
    setShowAvatarPicker(false);
  };

  const isGoogleUser = user?.app_metadata?.provider === "google";

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
      </div>
    );
  }

  return (
    <>
      <header className="mb-8">
        <button onClick={() => router.back()} className="flex items-center gap-1 text-on-surface-variant hover:text-primary mb-4">
          <span className="material-symbols-outlined">arrow_back</span> {t("common.back")}
        </button>
        <h1 className="font-headline text-3xl md:text-5xl font-extrabold text-on-surface tracking-tight">
          {t("profile.title")}
        </h1>
        <p className="text-on-surface-variant mt-1">{t("profile.subtitle")}</p>
      </header>

      {message && (
        <div className="mb-6 bg-secondary-container text-on-secondary-container p-3 rounded-lg text-sm font-medium flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">check_circle</span>
          {message}
        </div>
      )}

      <div className="space-y-8">
        {/* Avatar Section */}
        <section className="bg-surface-container-low p-6 md:p-8 rounded-xl border border-outline-variant/15">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary-fixed-variant">photo_camera</span>
            </div>
            <h2 className="font-headline font-bold text-xl">{t("profile.profilePicture")}</h2>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="w-28 h-28 rounded-full border-4 border-primary bg-surface-container overflow-hidden flex items-center justify-center">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-5xl text-on-surface-variant/30">person</span>
              )}
            </div>
            <button
              onClick={() => setShowAvatarPicker(!showAvatarPicker)}
              className="px-5 py-2 rounded-full bg-primary-container text-on-primary-container font-bold text-sm hover:opacity-90 transition-colors"
            >
              {t("profile.changeAvatar")}
            </button>
          </div>

          {/* Avatar Picker */}
          {showAvatarPicker && (
            <div className="mt-6 p-4 bg-surface-container rounded-xl">
              <p className="text-sm font-bold text-on-surface-variant mb-3">{t("profile.selectAvatar")}</p>
              <div className="grid grid-cols-5 gap-3">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => selectAvatar(avatar.url)}
                    className={`w-full aspect-square rounded-full overflow-hidden border-3 transition-all hover:scale-105 ${
                      avatarUrl === avatar.url
                        ? "border-primary ring-2 ring-primary ring-offset-2"
                        : "border-transparent hover:border-outline-variant/30"
                    }`}
                  >
                    <img src={avatar.url} alt={avatar.id} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              {avatarUrl && (
                <button
                  onClick={() => { setAvatarUrl(""); setShowAvatarPicker(false); }}
                  className="mt-3 text-xs text-error hover:underline"
                >
                  {t("profile.removeAvatar")}
                </button>
              )}
            </div>
          )}
        </section>

        {/* Personal Info */}
        <section className="bg-surface-container-low p-6 md:p-8 rounded-xl border border-outline-variant/15 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-secondary-container">person</span>
            </div>
            <h2 className="font-headline font-bold text-xl">{t("profile.personalInfo")}</h2>
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">{t("profile.fullName")}</label>
            <input
              className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary font-medium"
              placeholder={t("profile.fullNamePlaceholder")}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">{t("profile.phone")}</label>
            <input
              type="tel"
              className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary font-medium"
              placeholder="08X-XXX-XXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </section>

        {/* Account Info (read-only) */}
        <section className="bg-surface-container-low p-6 md:p-8 rounded-xl border border-outline-variant/15 space-y-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-on-tertiary-container">shield_person</span>
            </div>
            <h2 className="font-headline font-bold text-xl">{t("profile.accountInfo")}</h2>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">{t("auth.email")}</label>
            <div className="flex items-center gap-3">
              <input
                className="flex-1 h-12 px-4 bg-surface-container-highest border-none rounded-lg font-medium text-on-surface-variant cursor-not-allowed"
                value={user?.email || ""}
                disabled
              />
              <span className="material-symbols-outlined text-secondary text-xl">verified</span>
            </div>
          </div>

          {/* Google Account */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">{t("profile.googleAccount")}</label>
            {isGoogleUser ? (
              <div className="flex items-center gap-3 h-12 px-4 bg-surface-container-highest rounded-lg">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="font-medium text-sm">{user?.email}</span>
                <span className="ml-auto inline-flex items-center gap-1 bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-xs font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                  {t("profile.connected")}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3 h-12 px-4 bg-surface-container-highest rounded-lg">
                <svg width="18" height="18" viewBox="0 0 24 24" opacity="0.3">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-sm text-on-surface-variant/50">{t("profile.notConnected")}</span>
              </div>
            )}
          </div>

          {/* Auth Provider Info */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-on-surface-variant">{t("profile.signInMethod")}</label>
            <div className="flex items-center gap-2 h-12 px-4 bg-surface-container-highest rounded-lg">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">
                {isGoogleUser ? "account_circle" : "email"}
              </span>
              <span className="text-sm font-medium">
                {isGoogleUser ? "Google" : t("profile.emailPassword")}
              </span>
            </div>
          </div>
        </section>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-4">
          <Link href="/dashboard" className="px-6 py-3 rounded-full font-bold text-on-surface-variant hover:bg-surface-container transition-colors">
            {t("pet.cancel")}
          </Link>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-10 py-3 rounded-full font-extrabold bg-primary text-on-primary shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? t("common.loading") : t("common.save")}
          </button>
        </div>
      </div>
    </>
  );
}
