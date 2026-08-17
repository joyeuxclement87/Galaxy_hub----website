"use client";

import { usePathname } from "next/navigation";
import { signOut } from "@/actions/auth";
import { Menu, LogOut } from "lucide-react";
import { GlobalSearch } from "@/components/admin/GlobalSearch";
import { NotificationBell } from "@/components/admin/NotificationBell";
import { AdminProfileMenu } from "@/components/admin/AdminProfileMenu";
import { ThemeToggle } from "@/components/admin/ThemeToggle";

const PAGE_META: Record<string, { title: string; description: string }> = {
  "/admin": { title: "Dashboard", description: "Store overview and daily operations." },
  "/admin/messages": { title: "Messages", description: "Customer enquiries and contact forms." },
  "/admin/products": { title: "Products", description: "Manage the Galaxy Hub catalog." },
  "/admin/categories": { title: "Categories", description: "Organize product categories." },
  "/admin/brands": { title: "Brands", description: "Manage the brand catalog." },
  "/admin/promotions": { title: "Promotions", description: "Plan and manage campaigns." },
  "/admin/reviews": { title: "Reviews", description: "Curate customer testimonials." },
  "/admin/hero": { title: "Hero Section", description: "Homepage hero banner settings." },
  "/admin/orders": { title: "Orders", description: "Track and fulfil customer orders." },
  "/admin/trade-ins": { title: "Trade-Ins", description: "Review devices and manage offers." },
  "/admin/customers": { title: "Customers", description: "Customer activity across the store." },
  "/admin/analytics": { title: "Analytics", description: "Business performance overview." },
  "/admin/reports": { title: "Reports", description: "Exportable business reports." },
  "/admin/settings": { title: "Settings", description: "System control center." },
};

function resolveMeta(pathname: string): { title: string; description: string } {
  if (PAGE_META[pathname]) return PAGE_META[pathname];
  if (/^\/admin\/products\/.+\/edit$/.test(pathname)) return { title: "Edit Product", description: "" };
  if (/^\/admin\/products\/new$/.test(pathname)) return { title: "Add Product", description: "" };
  if (/^\/admin\/categories\/.+\/edit$/.test(pathname)) return { title: "Edit Category", description: "" };
  if (/^\/admin\/categories\/new$/.test(pathname)) return { title: "Add Category", description: "" };
  if (/^\/admin\/brands\/.+\/edit$/.test(pathname)) return { title: "Edit Brand", description: "" };
  if (/^\/admin\/brands\/new$/.test(pathname)) return { title: "Add Brand", description: "" };
  if (/^\/admin\/promotions\/.+\/edit$/.test(pathname)) return { title: "Edit Promotion", description: "" };
  if (/^\/admin\/promotions\/new$/.test(pathname)) return { title: "Add Promotion", description: "" };
  if (/^\/admin\/reviews\/.+\/edit$/.test(pathname)) return { title: "Edit Review", description: "" };
  if (/^\/admin\/reviews\/new$/.test(pathname)) return { title: "Add Review", description: "" };
  if (/^\/admin\/orders\/.+/.test(pathname)) return { title: "Order Detail", description: "" };
  if (/^\/admin\/trade-ins\/.+/.test(pathname)) return { title: "Trade-In Detail", description: "" };
  return { title: "Admin", description: "" };
}

export function TopBar({
  userEmail,
  onOpenMobileSidebar,
}: {
  userEmail: string;
  onOpenMobileSidebar: () => void;
}) {
  const pathname = usePathname();
  const meta = resolveMeta(pathname);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const description =
    pathname === "/admin"
      ? `${greeting} — here's what's happening with Galaxy Hub today.`
      : meta.description;

  const initials = userEmail
    .split("@")[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-[#1e3a5f] bg-white/95 dark:bg-[#0a1628]/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onOpenMobileSidebar}
            className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg border border-slate-200 dark:border-[#1e3a5f] p-2 text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46] hover:text-slate-700 dark:hover:text-slate-200 lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <h1 className="font-display text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">
              {meta.title}
            </h1>
            {description && (
              <p className="hidden truncate text-xs text-slate-400 dark:text-slate-500 sm:block">{description}</p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <GlobalSearch />
          <ThemeToggle />
          <NotificationBell />
          <div className="mx-1 hidden h-6 w-px bg-slate-200 dark:bg-slate-600 sm:block" />
          <AdminProfileMenu userEmail={userEmail} initials={initials} />
          <form action={signOut} className="hidden sm:block">
            <button
              type="submit"
              title="Sign out"
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 dark:border-[#1e3a5f] text-slate-400 dark:text-slate-500 transition-colors hover:border-red-200 dark:border-red-500/30 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}