"use client";

import { useI18n } from "@/lib/i18n";
import Link from "next/link";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-stone-50 w-full py-12 border-t border-stone-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:justify-between px-6 md:px-10 max-w-7xl mx-auto font-body text-sm">
        <div className="mb-8 lg:mb-0">
          <div className="font-headline font-bold text-lg text-primary mb-4">PetHabitat</div>
          <p className="text-stone-500 max-w-xs">{t("footer.copyright")}</p>
        </div>
        <div className="flex gap-12">
          <div className="flex flex-col gap-3">
            <Link href="/privacy" className="text-stone-500 hover:text-primary underline underline-offset-4 transition-all">{t("footer.privacy")}</Link>
            <Link href="/terms" className="text-stone-500 hover:text-primary underline underline-offset-4 transition-all">{t("footer.terms")}</Link>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="#" className="text-stone-500 hover:text-primary underline underline-offset-4 transition-all">{t("footer.partner")}</Link>
            <Link href="#" className="text-stone-500 hover:text-primary underline underline-offset-4 transition-all">{t("footer.help")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
