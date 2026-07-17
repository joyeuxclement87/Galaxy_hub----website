"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { DEAL_OFFERS } from "@/data/mock-data";

export default function DealDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { setSearchQuery, setShowDealsOnly, setSelectedCategory, setSelectedBrand } = useApp();

  const deal = DEAL_OFFERS.find((d) => d.slug === params?.slug);

  useEffect(() => {
    if (!deal) {
      router.replace("/deals");
      return;
    }

    // Trigger state changes depending on which deal it is
    if (deal.slug === "iphone-sale") {
      setSearchQuery("");
      setShowDealsOnly(true);
      setSelectedCategory("All");
      setSelectedBrand("Apple");
    } else if (deal.slug === "magsafe-bundle") {
      setSearchQuery("Case");
      setShowDealsOnly(false);
      setSelectedCategory("Accessories");
      setSelectedBrand("All");
    } else if (deal.slug === "creator-bundle") {
      setSearchQuery("Light");
      setShowDealsOnly(false);
      setSelectedCategory("All");
      setSelectedBrand("All");
    } else if (deal.slug === "student-offers") {
      setSearchQuery("Laptop");
      setShowDealsOnly(false);
      setSelectedCategory("All");
      setSelectedBrand("All");
    } else if (deal.slug === "audio-sale") {
      setSearchQuery("");
      setShowDealsOnly(true);
      setSelectedCategory("Audio");
      setSelectedBrand("All");
    } else {
      setSearchQuery(deal.title);
      setShowDealsOnly(false);
      setSelectedCategory("All");
      setSelectedBrand("All");
    }

    // Redirect smoothly to the catalog list
    router.replace("/#products");
  }, [deal, router, setSearchQuery, setShowDealsOnly, setSelectedCategory, setSelectedBrand]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory">
      <div className="text-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ocean border-t-transparent mx-auto" />
        <p className="text-sm font-medium text-ocean/60 font-manrope">Activating {deal?.title || "Deal Offer"}...</p>
      </div>
    </div>
  );
}
