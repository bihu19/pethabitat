"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";

export default function LoginContent() {
  const { t } = useI18n();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight mb-2">{t("auth.login")}</h1>
        <p className="text-on-surface-variant">Welcome back to PetHabitat</p>
      </div>

      <form onSubmit={handleLogin} className="bg-surface-container-low p-8 rounded-xl space-y-6">
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
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-primary text-on-primary rounded-full font-bold text-lg disabled:opacity-50"
        >
          {loading ? t("common.loading") : t("auth.signIn")}
        </button>
        <p className="text-center text-sm text-on-surface-variant">
          {t("auth.noAccount")}{" "}
          <Link href="/register" className="text-primary font-bold hover:underline">{t("auth.signUp")}</Link>
        </p>
      </form>
    </div>
  );
}
