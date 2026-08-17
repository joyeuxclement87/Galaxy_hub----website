"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, CheckCheck, ShoppingCart, MessageSquare, RefreshCw, Package, Percent, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocalStorageJson } from "@/hooks/use-local-storage";

export interface AdminNotification {
  id: string;
  kind: "order" | "message" | "trade-in" | "product" | "promotion" | "telegram";
  title: string;
  detail: string;
  href: string;
  tone: "red" | "amber" | "blue" | "emerald";
  time: string;
}

const READ_KEY = "gh-admin-notifications-read";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [readIds, setReadIds] = useLocalStorageJson<string[]>(READ_KEY, []);
  const rootRef = useRef<HTMLDivElement>(null);
  const readSet = new Set(readIds);

  useEffect(() => {
    fetch("/admin/api/summary")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.notifications) setNotifications(data.notifications);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const unread = notifications.filter((n) => !readSet.has(n.id));

  const markAllRead = () => {
    const next = new Set(readSet);
    notifications.forEach((n) => next.add(n.id));
    setReadIds([...next]);
  };

  const markRead = (id: string) => {
    const next = new Set(readSet);
    next.add(id);
    setReadIds([...next]);
  };

  const toneClasses: Record<string, string> = {
    red: "bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-300",
    amber: "bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-300",
    blue: "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-300",
    emerald: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  };

  const icons: Record<string, React.ReactNode> = {
    order: <ShoppingCart className="h-3.5 w-3.5" />,
    message: <MessageSquare className="h-3.5 w-3.5" />,
    "trade-in": <RefreshCw className="h-3.5 w-3.5" />,
    product: <Package className="h-3.5 w-3.5" />,
    promotion: <Percent className="h-3.5 w-3.5" />,
    telegram: <AlertTriangle className="h-3.5 w-3.5" />,
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 dark:border-[#1e3a5f] text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46] hover:text-slate-700 dark:hover:text-slate-200"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4" />
        {unread.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[9px] font-bold text-white dark:bg-red-500/20 dark:text-red-300">
            {unread.length > 9 ? "9+" : unread.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#1a3352] px-4 py-2.5">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Notifications</p>
            {unread.length > 0 && (
              <button
                onClick={markAllRead}
                className="inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-ocean dark:text-[#8ec5f2] transition-colors hover:text-ocean dark:hover:text-[#8ec5f2]-dark dark:hover:text-[#a5d3f7]"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all as read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                You&rsquo;re all caught up. New activity will appear here.
              </p>
            ) : unread.length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
                All caught up.
              </p>
            ) : (
              unread.map((n) => (
                <Link
                  key={n.id}
                  href={n.href}
                  onClick={() => markRead(n.id)}
                  className="flex items-start gap-3 border-b border-slate-50 px-4 py-3 transition-colors last:border-0 hover:bg-ocean-subtle dark:bg-ocean/15"
                >
                  <span className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md", toneClasses[n.tone])}>
                    {icons[n.kind]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold leading-snug text-slate-700 dark:text-slate-300">{n.title}</span>
                    <span className="mt-0.5 block text-xs text-slate-400 dark:text-slate-500">{n.detail}</span>
                  </span>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}