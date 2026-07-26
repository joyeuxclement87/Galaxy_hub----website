"use client";

import { usePathname } from "next/navigation";
import { signOut } from "@/actions/auth";
import { LogOut, Bell, Search } from "lucide-react";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/products": "Products",
  "/admin/products/new": "Add Product",
  "/admin/categories": "Categories",
  "/admin/brands": "Brands",
  "/admin/promotions": "Promotions",
  "/admin/hero": "Hero Section",
  "/admin/orders": "Orders",
  "/admin/settings": "Settings",
};

export function TopBar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  let pageTitle = PAGE_TITLES[pathname] || "Admin";
  if (!pageTitle || pageTitle === "Admin") {
    if (pathname.match(/^\/admin\/products\/.+\/edit$/)) pageTitle = "Edit Product";
    else if (pathname.match(/^\/admin\/products\/new$/)) pageTitle = "Add Product";
    else if (pathname.match(/^\/admin\/categories\/.+\/edit$/)) pageTitle = "Edit Category";
    else if (pathname.match(/^\/admin\/categories\/new$/)) pageTitle = "Add Category";
    else if (pathname.match(/^\/admin\/brands\/.+\/edit$/)) pageTitle = "Edit Brand";
    else if (pathname.match(/^\/admin\/brands\/new$/)) pageTitle = "Add Brand";
    else if (pathname.match(/^\/admin\/promotions\/.+\/edit$/)) pageTitle = "Edit Promotion";
    else if (pathname.match(/^\/admin\/promotions\/new$/)) pageTitle = "Add Promotion";
    else if (pathname.match(/^\/admin\/orders\/.+/)) pageTitle = "Order Detail";
  }

  const initials = userEmail
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0d1f3c]/90 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 pl-10 lg:pl-0">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
              Galaxy Hub
            </p>
            <h1 className="font-clash text-lg font-bold leading-tight text-white lg:text-xl">
              {pageTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30 pointer-events-none" />
            <input
              type="text"
              placeholder="Search anything…"
              className="w-44 rounded-xl border border-white/8 bg-white/5 py-2 pl-9 pr-3 text-sm text-white placeholder:text-white/25 focus:border-ocean/40 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-ocean/20 transition-all lg:w-56"
            />
          </div>

          <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-white/5 text-white/50 hover:border-ocean/30 hover:bg-ocean/15 hover:text-ocean transition-all">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#0f70c9] ring-2 ring-[#0d1f3c]" />
          </button>

          <div className="h-6 w-px bg-white/8 mx-1 hidden sm:block" />

          <div className="hidden sm:flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#0b5497] to-[#0f70c9] text-xs font-bold text-white shadow-md shadow-[#0b5497]/30">
              {initials}
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-semibold text-white/80 leading-none">{userEmail.split("@")[0]}</p>
              <p className="text-[10px] text-white/30 mt-0.5">{userEmail.split("@")[1] ?? "Admin"}</p>
            </div>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              title="Sign out"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/8 bg-white/5 px-3 py-2 text-sm font-medium text-white/50 transition-all hover:border-red-400/30 hover:bg-red-500/15 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">Sign Out</span>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
