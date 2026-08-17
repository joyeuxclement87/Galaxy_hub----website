import type { Metadata } from "next";
import { Navbar } from "@/components/navbar/Navbar";
import Footer from "@/components/ui/Footer";
import { TradeInClient } from "./TradeInClient";

export const metadata: Metadata = {
  title: "Trade In — Galaxy Hub Rwanda",
  description:
    "Trade in your old smartphone, laptop or tablet and put the value toward your next device. Submit your device for review at Galaxy Hub Rwanda.",
};

export default function TradeInPage() {
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
              Tell us about your current phone, laptop or tablet and our team will review it
              and send you a trade-in value — ready to put toward anything at Galaxy Hub.
            </p>
          </header>

          <TradeInClient />
        </div>
      </main>
      <Footer />
    </div>
  );
}