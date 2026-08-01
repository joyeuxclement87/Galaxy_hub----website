"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Tags,
  Building2,
  Percent,
  ImageIcon,
  ShoppingCart,
  Settings,
  X,
  Menu,
  Zap,
  Star,
} from "lucide-react";
import { useState } from "react";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    label: "Catalog",
    items: [
      { label: "Products", href: "/admin/products", icon: Package },
      { label: "Categories", href: "/admin/categories", icon: Tags },
      { label: "Brands", href: "/admin/brands", icon: Building2 },
    ],
  },
  {
    label: "Marketing",
    items: [
      { label: "Promotions", href: "/admin/promotions", icon: Percent },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
      { label: "Hero Section", href: "/admin/hero", icon: ImageIcon },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <aside className="flex h-full w-64 flex-col bg-[#0a1628] text-white">
      {/* Logo */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-white/8">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 shrink-0">
            <Image
              src="/g-hub logo ii.png"
              alt="Galaxy Hub"
              fill
              className="object-contain"
              sizes="32px"
            />
          </div>
          <div>
            <p className="font-clash text-sm font-bold text-white leading-none tracking-wide">
              GALAXY HUB
            </p>
            <p className="text-[10px] text-white/40 font-medium tracking-widest uppercase mt-0.5">
              Admin Panel
            </p>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="inline-flex items-center justify-center rounded-lg p-1.5 text-white/40 hover:text-white hover:bg-white/10 lg:hidden transition-colors"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 no-scrollbar">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        active
                          ? "bg-gradient-to-r from-[#0b5497] to-[#0f70c9] text-white shadow-lg shadow-[#0b5497]/30"
                          : "text-white/55 hover:bg-white/8 hover:text-white"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "h-4 w-4 shrink-0 transition-transform duration-200",
                          active ? "text-white" : "text-white/40 group-hover:text-white group-hover:scale-110"
                        )}
                      />
                      {item.label}
                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-white/70" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/8 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#0b5497] to-[#0f70c9]">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white/70">Galaxy Hub</p>
            <p className="text-[10px] text-white/30">v1.0.0 · Rwanda</p>
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-3 z-50 inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2 text-gray-600 shadow-sm lg:hidden"
        aria-label="Open sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 lg:hidden transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </div>

      {/* Desktop static */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:shrink-0">
        <SidebarContent />
      </div>
    </>
  );
}
