"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { provinces as allProvinces } from "@/lib/provinces";

// Unsplash (free license). To swap a photo: open the Unsplash page, right-click
// the main image → Copy image address, and replace the URL below.
const heroImages = [
  {
    // Smiling golden retriever — unsplash.com/photos/CLhFS67ni1c
    url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=80",
    alt: "Happy smiling golden retriever",
  },
  {
    // Happy rottweiler tongue out — unsplash.com/photos/GXOEkFVZ7R8
    url: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=900&q=80",
    alt: "Happy rottweiler with tongue out",
  },
  {
    // Happy corgi on green grass — unsplash.com/photos/4agER9GF1cA
    url: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=80",
    alt: "Happy corgi lying on green grass",
  },
  {
    // Fluffy smiling pomeranian — unsplash.com/photos/oIsAYyGBges
    url: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=80",
    alt: "Fluffy smiling pomeranian puppy",
  },
];

type LandingPlace = {
  place_type: string;
  province: string;
  cover_image: string | null;
};

const categories = [
  { icon: "hotel", label: "Pet-Friendly Hotels", labelTh: "โรงแรมพาสัตว์เลี้ยงเข้าได้", color: "bg-tertiary-container", textColor: "text-on-tertiary-container", tag: "Hotel" },
  { icon: "pets", label: "Pet Hotels", labelTh: "โรงแรมสัตว์เลี้ยง", color: "bg-primary-container", textColor: "text-on-primary-container", tag: "Pet Hotel" },
  { icon: "local_cafe", label: "Cafes & Restaurants", labelTh: "คาเฟ่และร้านอาหาร", color: "bg-secondary-container", textColor: "text-on-secondary-container", tag: "Cafe" },
  { icon: "medical_services", label: "Hospitals & Clinics", labelTh: "โรงพยาบาลและคลินิก", color: "bg-error-container", textColor: "text-on-error-container", tag: "Hospital" },
  { icon: "storefront", label: "Pet Shops", labelTh: "ร้านสัตว์เลี้ยง", color: "bg-surface-container-highest", textColor: "text-on-surface-variant", tag: "Pet Supplier" },
];

function matchesCategory(placeType: string, tag: string): boolean {
  const types = placeType.split(",").map((t) => t.trim());
  if (tag === "Cafe") return types.some((t) => t === "Cafe" || t === "Restaurant");
  if (tag === "Hospital") return types.some((t) => t === "Hospital" || t === "Clinic");
  return types.includes(tag);
}

export default function LandingContent({ places }: { places: LandingPlace[] }) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [selectedProvince, setSelectedProvince] = useState("");
  const [heroImgError, setHeroImgError] = useState(false);

  const heroImage = useMemo(
    () => heroImages[Math.floor(Math.random() * heroImages.length)],
    []
  );

  const topProvinces = useMemo(() => {
    const counts: Record<string, number> = {};
    places.forEach((p) => {
      if (p.province) counts[p.province] = (counts[p.province] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([province]) => {
        const prov = allProvinces.find((p) => p.th === province);
        return { province, en: prov?.en || province };
      });
  }, [places]);

  const categoryImages = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat) => {
      const matching = places.filter(
        (p) => matchesCategory(p.place_type, cat.tag) && p.cover_image
      );
      if (matching.length > 0) {
        map[cat.tag] = matching[Math.floor(Math.random() * matching.length)].cover_image!;
      }
    });
    return map;
  }, [places]);

  const handleSearch = () => {
    if (selectedProvince) {
      router.push(`/explore?province=${encodeURIComponent(selectedProvince)}`);
    } else {
      router.push("/explore");
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="px-6 md:px-10 max-w-7xl mx-auto mt-8 md:mt-12 mb-20 md:mb-24">
        <div className="relative rounded-xl overflow-hidden bg-primary-container/10 p-8 md:p-16 flex flex-col lg:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 z-10">
            <h1 className="font-headline font-extrabold text-4xl md:text-6xl lg:text-7xl text-on-primary-container leading-[1.1] mb-6 tracking-tight">
              {locale === "en" ? (
                <>Discover the <br /><span className="text-primary italic">Wilder</span> Side.</>
              ) : (
                <>ค้นพบโลกกว้าง<br /><span className="text-primary italic">ไปกับเพื่อนขนฟู</span></>
              )}
            </h1>
            <p className="text-on-surface-variant text-lg md:text-xl max-w-md mb-8 md:mb-10 leading-relaxed">
              {t("home.subtitle")}
            </p>

            {/* Search bar */}
            <div className="flex flex-col sm:flex-row gap-4 bg-surface-container-lowest p-2 rounded-lg sm:rounded-full shadow-lg max-w-2xl ring-1 ring-outline-variant/10">
              <div className="flex-1 flex items-center px-4 md:px-6 py-3 sm:py-0 border-b sm:border-b-0 sm:border-r border-outline-variant/20 relative">
                <span className="material-symbols-outlined text-primary mr-3 shrink-0">location_on</span>
                <select
                  className="w-full bg-transparent border-none focus:ring-0 text-on-surface font-body appearance-none cursor-pointer pr-6"
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                >
                  <option value="">{t("home.searchCity")}</option>
                  {allProvinces.map((p) => (
                    <option key={p.th} value={p.th}>
                      {locale === "en" ? `${p.en} (${p.th})` : p.th}
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined text-on-surface-variant text-sm pointer-events-none absolute right-2">expand_more</span>
              </div>
              <button
                onClick={handleSearch}
                className="bg-primary text-on-primary px-8 md:px-10 py-3 md:py-4 rounded-full font-bold hover:shadow-xl hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                <span>{t("home.searchButton")}</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
            </div>

            {/* Top provinces quick-select */}
            {topProvinces.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-4">
                <span className="text-sm text-on-surface-variant font-medium">
                  {locale === "en" ? "Popular:" : "ยอดนิยม:"}
                </span>
                {topProvinces.map(({ province, en }) => (
                  <Link
                    key={province}
                    href={`/explore?province=${encodeURIComponent(province)}`}
                    className="px-4 py-1.5 rounded-full bg-surface-container text-sm font-medium hover:bg-primary-container hover:text-on-primary-container transition-colors ring-1 ring-outline-variant/20"
                  >
                    {locale === "en" ? en : province}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 relative hidden lg:block">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-container/30 rounded-full blur-3xl"></div>
            <div className="relative z-10 w-full aspect-square rounded-xl overflow-hidden bg-primary-container/20">
              {!heroImgError ? (
                <Image
                  src={heroImage.url}
                  alt={heroImage.alt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1280px) 50vw, 560px"
                  priority
                  onError={() => setHeroImgError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary/20" style={{ fontSize: "200px", fontVariationSettings: "'FILL' 1" }}>pets</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-6 md:px-10 max-w-7xl mx-auto mb-20 md:mb-24">
        <div className="flex justify-between items-end mb-8 md:mb-12">
          <div>
            <h2 className="font-headline font-extrabold text-3xl md:text-4xl text-on-surface mb-3 tracking-tight">{t("home.categories")}</h2>
            <p className="text-on-surface-variant text-lg">{t("home.categoriesSubtitle")}</p>
          </div>
          <Link href="/explore" className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all">
            {t("common.viewAll")} <span className="material-symbols-outlined">chevron_right</span>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link key={cat.tag} href={`/explore?type=${encodeURIComponent(cat.tag)}`}>
              <div className="group cursor-pointer">
                <div className="relative h-40 md:h-52 rounded-lg overflow-hidden mb-3 group-hover:shadow-xl transition-all">
                  {categoryImages[cat.tag] ? (
                    <>
                      <img
                        src={categoryImages[cat.tag]}
                        alt={locale === "en" ? cat.label : cat.labelTh}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
                      <span
                        className="absolute bottom-3 left-3 material-symbols-outlined text-2xl text-white drop-shadow"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {cat.icon}
                      </span>
                    </>
                  ) : (
                    <div className={`w-full h-full ${cat.color} flex flex-col items-center justify-center gap-4`}>
                      <span
                        className={`material-symbols-outlined text-5xl md:text-6xl ${cat.textColor}`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {cat.icon}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="font-headline font-bold text-sm md:text-base text-center">
                  {locale === "en" ? cat.label : cat.labelTh}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 md:px-10 max-w-7xl mx-auto mb-20 md:mb-24">
        <div className="bg-inverse-surface rounded-xl p-8 md:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-tertiary/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          <h2 className="font-headline font-extrabold text-3xl md:text-4xl text-white mb-6 relative z-10">{t("home.cta")}</h2>
          <p className="text-stone-400 text-lg mb-8 md:mb-10 max-w-2xl mx-auto relative z-10">
            {t("home.ctaSubtitle")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <Link href="/register" className="bg-primary text-on-primary px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-lg">
              {t("home.ctaButton")}
            </Link>
            <Link href="/explore" className="bg-stone-800 text-white px-8 md:px-10 py-3 md:py-4 rounded-full font-bold text-lg hover:bg-stone-700 transition-colors">
              {t("home.learnMore")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
