import type { Metadata, Viewport } from "next";
import { Manrope, IBM_Plex_Sans } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0b5497",
};

export const metadata: Metadata = {
  title: {
    default: "Galaxy Hub | Genuine Tech in Rwanda — Smartphones, Laptops & Accessories",
    template: "%s | Galaxy Hub Rwanda",
  },
  description:
    "Galaxy Hub is Rwanda's premium technology showroom in Kigali. Shop genuine smartphones, laptops, earbuds, creator gear, and accessories from Apple, Samsung, Sony, DJI, and more. Nationwide delivery across Rwanda.",
  keywords: [
    "buy smartphones Rwanda",
    "buy iPhone Kigali",
    "Samsung Galaxy Rwanda",
    "buy laptop Rwanda",
    "tech accessories Kigali",
    "creator gear Rwanda",
    "genuine gadgets Rwanda",
    "AirPods Rwanda",
    "MacBook Rwanda",
    "Galaxy Hub Kigali",
  ],
  authors: [{ name: "Galaxy Hub", url: "https://galaxyhub.rw" }],
  creator: "Galaxy Hub",
  publisher: "Galaxy Hub",
  metadataBase: new URL("https://galaxyhub.rw"),
  openGraph: {
    title: "Galaxy Hub | Genuine Tech in Rwanda",
    description:
      "Premium smartphones, laptops, accessories, and creator gear. Nationwide delivery across Rwanda.",
    url: "https://galaxyhub.rw",
    siteName: "Galaxy Hub",
    locale: "en_RW",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Galaxy Hub | Genuine Tech in Rwanda",
    description:
      "Premium smartphones, laptops, accessories, and creator gear. Nationwide delivery across Rwanda.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${ibmPlexSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-ivory text-ocean select-none overflow-x-hidden">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
