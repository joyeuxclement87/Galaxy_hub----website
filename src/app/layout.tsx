import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Galaxy Hub | Premium Product Showroom",
  description: "Discover and reserve premium devices and flagship accessories with ultimate trust.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased`}
    >
      <head>
        {/* Cabinet Grotesk — Fontshare (not available on Google Fonts) */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,700,600,500&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-ivory text-ocean select-none">
        {children}
      </body>
    </html>
  );
}
