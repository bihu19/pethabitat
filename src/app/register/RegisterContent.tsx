"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

export default function RegisterContent() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="bg-secondary-container p-8 rounded-xl">
          <span className="material-symbols-outlined text-5xl text-on-secondary-container mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <h2 className="font-headline text-2xl font-bold mb-2">Account Created!</h2>
          <p className="text-on-secondary-container mb-4">Please check your email to verify your account.</p>
          <Link href="/login" className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold inline-block">{t("auth.signIn")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight mb-2">{t("auth.register")}</h1>
        <p className="text-on-surface-variant">Join the PetHabitat community</p>
      </div>

      <form onSubmit={handleRegister} className="bg-surface-container-low p-8 rounded-xl space-y-6">
        {error && (
          <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm">{error}</div>
        )}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-on-surface-variant">{t("auth.email")}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-on-surface-variant">{t("auth.password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-on-surface-variant">{t("auth.confirmPassword")}</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-12 px-4 bg-surface-container-highest border-none rounded-lg focus:ring-2 focus:ring-primary"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-on-primary rounded-full font-bold text-lg disabled:opacity-50"
        >
          {loading ? t("common.loading") : t("auth.signUp")}
        </button>
        <p className="text-center text-sm text-on-surface-variant">
          {t("auth.hasAccount")}{" "}
          <Link href="/login" className="text-primary font-bold hover:underline">{t("auth.signIn")}</Link>
        </p>
      </form>
    </div>
  );
}
