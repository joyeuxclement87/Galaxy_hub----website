"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";

function SearchRedirectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSearchQuery, setShowDealsOnly, setSelectedCategory, setSelectedBrand } = useApp();

  useEffect(() => {
    const query = searchParams.get("q");
    if (query !== null) {
      setSearchQuery(query.trim());
      setShowDealsOnly(false);
      setSelectedCategory("All");
      setSelectedBrand("All");
    }
    router.replace("/#products");
  }, [router, searchParams, setSearchQuery, setShowDealsOnly, setSelectedCategory, setSelectedBrand]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory">
      <div className="text-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ocean border-t-transparent mx-auto" />
        <p className="text-sm font-medium text-ocean/60 font-manrope">Searching Galaxy Hub...</p>
      </div>
    </div>
  );
}

export default function SearchRedirectPage() {
  return (
    <Suspense fallback={null}>
      <SearchRedirectContent />
    </Suspense>
  );
}
