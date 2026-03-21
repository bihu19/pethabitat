"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";

export default function BottomNav() {
  const pathname = usePathname();
  const { t } = useI18n();

  const items = [
    { href: "/", icon: "home", label: "Home" },
    { href: "/explore", icon: "explore", label: t("nav.explore") },
    { href: "/dashboard", icon: "dashboard", label: t("nav.dashboard") },
    { href: "/login", icon: "person", label: t("nav.login") },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-white/90 backdrop-blur-xl border-t border-outline-variant/10 flex justify-around items-center px-4 pb-6 pt-3 rounded-t-[2rem]">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center px-4 py-2 transition-colors ${
              isActive
                ? "bg-primary-container text-on-primary rounded-full"
                : "text-stone-500 hover:text-primary"
            }`}
          >
            <span className="material-symbols-outlined text-[22px]" style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}>
              {item.icon}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider mt-0.5">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
