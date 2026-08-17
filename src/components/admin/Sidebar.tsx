"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MessageSquare,
  Package,
  Tags,
  Building2,
  Percent,
  Star,
  ImageIcon,
  ShoppingCart,
  RefreshCw,
  Users,
  BarChart3,
  FileText,
  Settings,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
} from "lucide-react";

interface BadgeState {
  messages?: number;
  orders?: number;
  tradeIns?: number;
}

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Messages", href: "/admin/messages", icon: MessageSquare, badgeKey: "messages" as const },
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
      { label: "Orders", href: "/admin/orders", icon: ShoppingCart, badgeKey: "orders" as const },
      { label: "Trade-Ins", href: "/admin/trade-ins", icon: RefreshCw, badgeKey: "tradeIns" as const },
    ],
  },
  {
    label: "Business",
    items: [
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      { label: "Reports", href: "/admin/reports", icon: FileText },
    ],
  },
  {
    label: "System",
    items: [{ label: "Settings", href: "/admin/settings", icon: Settings }],
  },
];

export function Sidebar({
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onMobileClose,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const pathname = usePathname();
  const [badges, setBadges] = useState<BadgeState>({});

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [mobileOpen]);

  useEffect(() => {
    let cancelled = false;
    fetch("/admin/api/summary")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data?.badges) return;
        const b = data.badges;
        setBadges({
          messages: b.unreadMessages || 0,
          orders: b.pendingOrders || 0,
          tradeIns: b.pendingTradeIns || 0,
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  const badgeCount = (key?: "messages" | "orders" | "tradeIns") =>
    key ? badges[key] || 0 : 0;

  const renderNav = (isMobile: boolean) => (
    <nav className={cn("flex-1 overflow-y-auto px-2.5 py-4 no-scrollbar", collapsed && !isMobile && "px-2")}>
      <div className={cn("space-y-5", collapsed && !isMobile && "space-y-6")}>
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p
              className={cn(
                "mb-1.5 px-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500",
                collapsed && !isMobile && "px-0 text-center"
              )}
            >
              {collapsed && !isMobile ? "·" : group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                const count = badgeCount(item.badgeKey);
                const showLabel = !collapsed || isMobile;
                return (
                  <li key={item.href} className="relative">
                    <Link
                      href={item.href}
                      onClick={onMobileClose}
                      title={collapsed && !isMobile ? item.label : undefined}
                      className={cn(
                        "group/nav flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
                        collapsed && !isMobile && "justify-center px-0",
                        active
                          ? "bg-ocean-subtle dark:bg-ocean/15 text-ocean-dark dark:text-[#8ec5f2]"
                          : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#132c46] hover:text-slate-900 dark:hover:text-slate-100"
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-ocean" />
                      )}
                      <item.icon
                        className={cn(
                          "h-4 w-4 shrink-0",
                          active ? "text-ocean dark:text-[#8ec5f2]" : "text-slate-400 dark:text-slate-500 group-hover/nav:text-slate-600 dark:group-hover/nav:text-slate-300"
                        )}
                      />
                      {showLabel && <span className="flex-1 truncate">{item.label}</span>}
                      {showLabel && count > 0 && (
                        <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-red-100 bg-red-50 px-1.5 text-[10px] font-bold text-red-600 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-300">
                          {count > 99 ? "99+" : count}
                        </span>
                      )}
                      {!showLabel && count > 0 && (
                        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 dark:bg-red-400" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </nav>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          <MobileSidebarContent pathname={pathname} onClose={onMobileClose} />
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:flex lg:shrink-0 transition-[width] duration-200 ease-out",
          collapsed ? "w-[72px]" : "w-60"
        )}
      >
        <div className="flex h-full w-full flex-col">
          {/* Brand */}
          <div
            className={cn(
              "flex items-center gap-2.5 border-b border-slate-100 dark:border-[#1a3352] px-4 py-4",
              collapsed && "justify-center px-0"
            )}
          >
            <Link
              href="/admin"
              className={cn("flex items-center gap-2.5", collapsed && "gap-0")}
              title={collapsed ? "Galaxy Hub Admin" : undefined}
            >
              <div className="relative h-8 w-8 shrink-0">
                <Image
                  src="/g-hub logo ii.png"
                  alt="Galaxy Hub"
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>
              {!collapsed && (
                <div>
                  <p className="font-display text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-none">
                    GALAXY HUB
                  </p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                    Admin Panel
                  </p>
                </div>
              )}
            </Link>
          </div>

          {renderNav(false)}

          {/* Footer */}
          <div className="border-t border-slate-100 dark:border-[#1a3352] p-2.5">
            <button
              onClick={onToggleCollapsed}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46] hover:text-slate-900 dark:hover:text-slate-100",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4 text-slate-400 dark:text-slate-500" />
              ) : (
                <>
                  <PanelLeftClose className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                  Collapse
                </>
              )}
            </button>
            <div
              className={cn(
                "mt-1 flex items-center gap-2.5 rounded-lg px-2.5 py-2",
                collapsed && "justify-center px-0"
              )}
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ocean">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              {!collapsed && (
                <div>
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">Galaxy Hub</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Rwanda · v1.0</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function MobileSidebarContent({
  pathname,
  onClose,
}: {
  pathname: string;
  onClose: () => void;
}) {
  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  return (
    <div className="flex h-full w-60 flex-col border-r border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438]">
      {/* Brand */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1a3352] px-4 py-4">
        <Link href="/admin" onClick={onClose} className="flex items-center gap-2.5">
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
            <p className="font-display text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-none">
              GALAXY HUB
            </p>
            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
              Admin Panel
            </p>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="inline-flex cursor-pointer items-center justify-center rounded-lg p-1.5 text-slate-400 dark:text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-[#1c3a5c] hover:text-slate-600"
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 py-4 no-scrollbar">
        <div className="space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="mb-1.5 px-2.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href} className="relative">
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
                          active
                            ? "bg-ocean-subtle dark:bg-ocean/15 text-ocean-dark dark:text-[#8ec5f2]"
                            : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-[#132c46] hover:text-slate-900 dark:hover:text-slate-100"
                        )}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full bg-ocean" />
                        )}
                        <item.icon
                          className={cn(
                            "h-4 w-4 shrink-0",
                            active ? "text-ocean dark:text-[#8ec5f2]" : "text-slate-400 dark:text-slate-500"
                          )}
                        />
                        <span className="flex-1 truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom: settings + profile */}
      <div className="border-t border-slate-100 dark:border-[#1a3352] p-2.5">
        <Link
          href="/admin/settings"
          onClick={onClose}
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46] hover:text-slate-900 dark:hover:text-slate-100"
        >
          <Settings className="h-4 w-4 text-slate-400 dark:text-slate-500" />
          Settings
        </Link>
      </div>
    </div>
  );
}