import type { Metadata } from "next";
import { Navbar } from "@/components/navbar/Navbar";
import Footer from "@/components/ui/Footer";
import { getTradeInEligibleProducts } from "@/data/public-products";
import { TradeInClient } from "./TradeInClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Trade In — Galaxy Hub Rwanda",
  description:
    "Trade in your old phone, laptop or tablet toward a new Galaxy Hub device. Tell us what you want and what you're trading in — we'll send you a trade-in value.",
};

export default async function TradeInPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const sp = await searchParams;

  const products = await getTradeInEligibleProducts();

  // Optional ?product=ID preselect — only when the product is currently
  // eligible. Otherwise the customer picks from the list themselves.
  const requestedId = sp.product?.trim() || null;
  const preselectedId =
    requestedId && products.some((p) => p.id === requestedId) ? requestedId : null;

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />
      <main className="pt-20 pb-24 sm:pt-24">
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 md:px-8">
          <header className="mb-10 lg:mb-12">
            <p className="text-caption font-bold uppercase tracking-[0.18em] text-accent">
              Trade In
            </p>
            <h1 className="mt-3 font-clash text-3xl font-bold tracking-tight text-ocean-deeper sm:text-4xl lg:text-5xl">
              Turn your old device into your next upgrade.
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ocean-deeper/60">
              Tell us what you&apos;re upgrading to and the device you&apos;re trading in.
              Our team will review it and send you a trade-in value to put toward your
              next purchase at Galaxy Hub.
            </p>
          </header>

          <TradeInClient products={products} preselectedId={preselectedId} />
        </div>
      </main>
      <Footer />
    </div>
  );
}