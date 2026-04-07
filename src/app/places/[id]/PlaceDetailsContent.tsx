"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";
import { createClient } from "@/lib/supabase/client";
import type { Place, Review } from "@/lib/types";

const typeIcons: Record<string, string> = {
  Hotel: "hotel", "Pet Hotel": "pets", Cafe: "local_cafe", Restaurant: "restaurant",
  Hospital: "local_hospital", Clinic: "medical_services", "Pet Supplier": "storefront",
  "Shopping Mall": "shopping_bag", Park: "park", Pool: "pool", "Pet School": "school",
};

function parseTypes(placeType: string): string[] {
  return placeType.split(",").map((t) => t.trim()).filter(Boolean);
}

export default function PlaceDetailsContent({ place, reviews: initialReviews }: { place: Place; reviews: Review[] }) {
  const { t, locale } = useI18n();
  const [reviews, setReviews] = useState(initialReviews);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingPlace, setSavingPlace] = useState(false);

  useEffect(() => {
    async function checkSaved() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("saved_places")
        .select("id")
        .eq("user_id", user.id)
        .eq("place_id", place.id)
        .maybeSingle();
      if (data) setSaved(true);
    }
    checkSaved();
  }, [place.id]);

  const handleToggleSave = async () => {
    setSavingPlace(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert(t("place.loginToSave"));
        window.location.href = "/login";
        return;
      }
      if (saved) {
        await supabase
          .from("saved_places")
          .delete()
          .eq("user_id", user.id)
          .eq("place_id", place.id);
        setSaved(false);
      } else {
        await supabase
          .from("saved_places")
          .insert({ user_id: user.id, place_id: place.id });
        setSaved(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingPlace(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "N/A";

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please login to write a review");
        window.location.href = "/login";
        return;
      }
      const { data, error } = await supabase
        .from("reviews")
        .insert({ place_id: place.id, user_id: user.id, rating, comment })
        .select()
        .single();
      if (error) throw error;
      setReviews([{ ...data, user_email: user.email, user_name: user.email?.split("@")[0] }, ...reviews]);
      setComment("");
      setShowReviewForm(false);
    } catch (err) {
      console.error(err);
      alert("Failed to submit review. Please make sure you are logged in.");
    } finally {
      setSubmitting(false);
    }
  };

  const types = parseTypes(place.place_type);
  const firstIcon = typeIcons[types[0]] || "place";

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
      {/* Main content */}
      <div className="lg:col-span-8 space-y-8 md:space-y-12">
        {/* Cover Image */}
        <div className="relative w-full h-48 md:h-64 rounded-2xl overflow-hidden bg-surface-container-low">
          {place.cover_image ? (
            <img src={place.cover_image} alt={place.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant/20">
              <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>{firstIcon}</span>
            </div>
          )}
        </div>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {types.map((tp) => (
              <span key={tp} className="bg-secondary-container text-on-secondary-container px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {tp}
              </span>
            ))}
            {reviews.length > 0 && (
              <div className="flex items-center gap-1 text-primary">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <span className="font-bold">{avgRating}</span>
                <span className="text-on-surface-variant text-sm font-normal">({reviews.length} {t("explore.reviews")})</span>
              </div>
            )}
          </div>
          <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-extrabold text-on-background tracking-tight">{place.name}</h1>
          <p className="text-on-surface-variant mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[20px]">location_on</span>
            {place.province}
          </p>
        </div>

        {/* Description */}
        <div className="space-y-4">
          <h2 className="font-headline text-xl md:text-2xl font-bold">{t("place.about")}</h2>
          <p className="text-base md:text-lg leading-relaxed text-on-surface-variant max-w-3xl">
            {place.description || "A great pet-friendly location."}
          </p>
          {/* Info chips */}
          <div className="flex gap-3 md:gap-4 pt-4 overflow-x-auto hide-scrollbar">
            <div className="flex-shrink-0 flex items-center gap-3 bg-surface-container-low px-4 md:px-6 py-3 md:py-4 rounded-lg">
              <span className="material-symbols-outlined text-primary text-[28px] md:text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>{firstIcon}</span>
              <div>
                <p className="text-xs font-bold text-on-surface-variant">TYPE</p>
                <p className="font-bold text-sm">{types.join(", ")}</p>
              </div>
            </div>
            {place.pet_friendly && (
              <div className="flex-shrink-0 flex items-center gap-3 bg-secondary-container/30 px-4 md:px-6 py-3 md:py-4 rounded-lg">
                <span className="material-symbols-outlined text-secondary text-[28px] md:text-[32px]">pets</span>
                <div>
                  <p className="text-xs font-bold text-on-surface-variant">{t("place.petFriendly")}</p>
                  <p className="font-bold text-sm">{place.pet_friendly}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pet Fee & Conditions */}
        {(place.pet_fee || place.pet_condition) && (
          <div className="space-y-6">
            <h2 className="font-headline text-xl md:text-2xl font-bold">{t("place.petConditions")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {place.pet_fee && (
                <div className="p-6 bg-surface-container-lowest border border-outline-variant/10 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-primary-container/30 flex items-center justify-center text-primary mb-3">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <h3 className="font-medium mb-2">{t("place.petFee")}</h3>
                  <p className="text-sm text-on-surface-variant whitespace-pre-line">{place.pet_fee}</p>
                </div>
              )}
              {place.pet_condition && (
                <div className="p-6 bg-surface-container-lowest border border-outline-variant/10 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary mb-3">
                    <span className="material-symbols-outlined">info</span>
                  </div>
                  <h3 className="font-medium mb-2">{t("place.petConditions")}</h3>
                  <p className="text-sm text-on-surface-variant whitespace-pre-line">{place.pet_condition}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pet Amenities */}
        {place.pet_amenities && (
          <div className="space-y-4">
            <h2 className="font-headline text-xl md:text-2xl font-bold">{t("place.petAmenities")}</h2>
            <div className="flex flex-wrap gap-2">
              {place.pet_amenities.split(",").map((item) => {
                const trimmed = item.trim();
                const labels: Record<string, { th: string; en: string }> = {
                  pet_bed: { th: "เบาะสัตว์เลี้ยง", en: "Pet Bed" },
                  food_tray: { th: "ถาดรองกินอาหาร", en: "Food Tray" },
                  pee_pad: { th: "แผ่นรองฉี่", en: "Pee Pad" },
                };
                const label = labels[trimmed];
                return (
                  <span key={trimmed} className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary-container/30 text-on-secondary-container rounded-full text-sm font-medium">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    {label ? (locale === "th" ? label.th : label.en) : trimmed}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="space-y-6 md:space-y-8 pt-6">
          <div className="flex justify-between items-end">
            <h2 className="font-headline text-xl md:text-2xl font-bold">{t("place.communityFeedback")}</h2>
            <button onClick={() => setShowReviewForm(!showReviewForm)} className="text-primary font-bold hover:underline text-sm">
              {t("place.writeReview")}
            </button>
          </div>

          {/* Review form */}
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="p-6 bg-surface-container-low rounded-xl space-y-4">
              <div>
                <label className="text-sm font-bold text-on-surface-variant block mb-2">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRating(star)}>
                      <span
                        className={`material-symbols-outlined text-2xl ${star <= rating ? "text-primary" : "text-surface-container-highest"}`}
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >star</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-on-surface-variant block mb-2">Comment</label>
                <textarea
                  className="w-full p-4 bg-surface-container-lowest border border-outline-variant/20 rounded-lg focus:ring-2 focus:ring-primary resize-none"
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="bg-primary text-on-primary px-6 py-2 rounded-full font-bold disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          )}

          {/* Review list */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="p-6 md:p-8 bg-surface-container-low rounded-xl">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-on-surface-variant">person</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-bold">{review.user_name || review.user_email || "Anonymous"}</h4>
                        <p className="text-sm text-on-surface-variant">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex text-primary">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-on-surface-variant leading-relaxed">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
            {reviews.length === 0 && (
              <p className="text-center text-on-surface-variant py-8">{t("place.noReviews")}</p>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-4">
        <div className="sticky top-28 space-y-6">
          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-xl shadow-sm border border-outline-variant/10">
            <div className="space-y-4 md:space-y-6">
              {/* Map preview */}
              <div className="w-full h-48 rounded-lg overflow-hidden bg-surface-container relative flex items-center justify-center">
                <div className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined">location_on</span>
                </div>
              </div>

              <div className="space-y-3">
                {place.google_maps_url && (
                  <a
                    href={place.google_maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 md:py-4 bg-primary text-on-primary rounded-full font-bold text-base md:text-lg shadow-md flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">directions</span>
                    {t("place.getDirections")}
                  </a>
                )}
                {place.website_url && (
                  <a
                    href={place.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 md:py-4 border-2 border-primary text-primary rounded-full font-bold transition-colors hover:bg-primary-fixed flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">language</span>
                    {t("place.visitWebsite")}
                  </a>
                )}
                <button
                  onClick={handleToggleSave}
                  disabled={savingPlace}
                  className={`w-full py-3 md:py-4 rounded-full font-bold transition-colors flex items-center justify-center gap-2 ${
                    saved
                      ? "bg-primary-container text-on-primary-container"
                      : "border-2 border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary"
                  }`}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: saved ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    bookmark
                  </span>
                  {saved ? t("place.unsave") : t("place.save")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
