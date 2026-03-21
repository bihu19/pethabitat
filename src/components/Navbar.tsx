"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

function useIsAdmin(user: User | null) {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).single();
        setIsAdmin(data?.role === "admin");
      } catch { /* table may not exist */ }
    })();
  }, [user]);
  return isAdmin;
}

export default function Navbar() {
  const { t, locale, setLocale } = useI18n();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin = useIsAdmin(user);

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    } catch {
      // Supabase not configured
    }
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // Supabase not configured
    }
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-sm font-headline">
      <div className="flex justify-between items-center px-4 md:px-8 py-4 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="text-xl md:text-2xl font-bold tracking-tight text-primary">
            PetHabitat
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/explore" className="text-on-surface-variant hover:text-primary transition-colors font-semibold">
              {t("nav.explore")}
            </Link>
            <Link href="/explore" className="text-on-surface-variant hover:text-primary transition-colors">
              {t("nav.community")}
            </Link>
            {user && (
              <Link href="/dashboard" className="text-on-surface-variant hover:text-primary transition-colors">
                {t("nav.dashboard")}
              </Link>
            )}
            {isAdmin && (
              <Link href="/admin" className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                {t("nav.admin")}
              </Link>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
            <input
              className="bg-surface-container-highest border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary w-48 md:w-64"
              placeholder={t("nav.search")}
              type="text"
            />
          </div>
          <button
            onClick={() => setLocale(locale === "en" ? "th" : "en")}
            className="px-3 py-2 rounded-full text-xs font-bold bg-surface-container-highest text-on-surface-variant hover:bg-surface-container transition-colors"
          >
            {locale === "en" ? "TH" : "EN"}
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/dashboard" className="w-10 h-10 rounded-full overflow-hidden bg-surface-container border-2 border-primary-container flex items-center justify-center">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-primary">person</span>
                )}
              </Link>
              <button onClick={handleLogout} className="hidden md:block text-sm text-on-surface-variant hover:text-primary">
                {t("nav.logout")}
              </button>
            </div>
          ) : (
            <Link href="/login" className="bg-primary text-on-primary px-4 md:px-6 py-2 rounded-full font-medium hover:opacity-90 active:scale-95 transition-all text-sm">
              {t("nav.login")}
            </Link>
          )}
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <span className="material-symbols-outlined text-on-surface">{menuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-outline-variant/10 px-6 py-4 space-y-3">
          <Link href="/explore" className="block text-on-surface-variant hover:text-primary font-medium" onClick={() => setMenuOpen(false)}>
            {t("nav.explore")}
          </Link>
          <Link href="/explore" className="block text-on-surface-variant hover:text-primary font-medium" onClick={() => setMenuOpen(false)}>
            {t("nav.community")}
          </Link>
          {user && (
            <Link href="/dashboard" className="block text-on-surface-variant hover:text-primary font-medium" onClick={() => setMenuOpen(false)}>
              {t("nav.dashboard")}
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="block text-on-surface-variant hover:text-primary font-medium flex items-center gap-1" onClick={() => setMenuOpen(false)}>
              <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
              {t("nav.admin")}
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
