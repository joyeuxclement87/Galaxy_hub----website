"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowLeft, Package, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/navbar/Navbar";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get("order_number") || "";
  const total = params.get("total") || "0";

  const formatPrice = (v: number) => new Intl.NumberFormat("en-US").format(v);

  return (
    <div className="flex-1 pt-20 lg:pt-28 min-h-screen bg-[#F8F9FA]">
      <Navbar />
      <main className="mx-auto max-w-[600px] px-6 py-16 md:px-12">
        <div className="overflow-hidden rounded-[32px] border border-white/60 bg-white/90 p-8 text-center shadow-[0_30px_90px_rgba(11,84,151,0.14)] sm:p-12">
          <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-12 w-12" />
          </div>

          <h1 className="font-clash text-3xl font-bold text-[#10233D] sm:text-4xl">Order Request Received!</h1>
          <p className="mt-4 text-sm leading-relaxed text-ocean/70 sm:text-base">
            Thank you for your order request. Our team will contact you shortly to confirm availability and finalize the details.
          </p>

          <div className="mt-8 space-y-3 rounded-[20px] border border-ocean/10 bg-ocean-light/30 p-6 text-left text-sm">
            <div className="flex items-center justify-between">
              <span className="text-ocean/55">Order Number</span>
              <span className="font-bold text-ocean font-mono">{orderNumber}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-ocean/55">Status</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">Pending Confirmation</span>
            </div>
            <div className="flex items-center justify-between border-t border-ocean/10 pt-3">
              <span className="text-ocean/55">Estimated Total</span>
              <span className="font-clash text-xl font-bold text-ocean">RWF {formatPrice(Number(total))}</span>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Link href="/">
              <Button variant="secondary" className="w-full gap-2">
                <Package className="h-4 w-4" /> Continue Shopping
              </Button>
            </Link>
            <a href="https://wa.me/250785288910" target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="w-full gap-2">
                <MessageCircle className="h-4 w-4" /> Message Us
              </Button>
            </a>
          </div>

          <Link href="/" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-ocean/60 hover:text-ocean transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Showroom
          </Link>
        </div>
      </main>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-ivory">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-ocean border-t-transparent" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
