"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

const WHATSAPP_URL = "https://wa.me/250785288910";

export function WhatsAppFloatingButton() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 600);
    return () => clearTimeout(timer);
  }, []);

  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Galaxy Hub on WhatsApp"
      title="Chat with us on WhatsApp"
      className={`fixed bottom-5 right-5 z-[70] flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-black/25 transition-all duration-500 hover:scale-110 hover:bg-[#1ebe5b] md:bottom-6 md:right-6 translate-y-[-28vh] ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <WhatsAppIcon className="h-5 w-5" />
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/40" />
    </a>
  );
}
