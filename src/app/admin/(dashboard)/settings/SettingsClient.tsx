"use client";

import { useEffect, useState } from "react";
import { BellOff, CheckCircle2, Moon, Sun } from "lucide-react";
import { useLocalStorageFlag } from "@/hooks/use-local-storage";

const THEME_KEY = "gh-admin-theme";

function resolveDark(): boolean {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function useAdminTheme() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return resolveDark();
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const setTheme = (next: boolean) => {
    localStorage.setItem(THEME_KEY, next ? "dark" : "light");
    setDark(next);
  };

  return [dark, setTheme] as const;
}

export function AppearanceSettings() {
  const [collapsed, setCollapsed] = useLocalStorageFlag("gh-admin-sidebar-collapsed", false);
  const [dark, setDark] = useAdminTheme();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Compact sidebar</p>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
            Collapse the sidebar to icons only. The preference is saved on this device.
          </p>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${collapsed ? "bg-ocean" : "bg-slate-200 dark:bg-slate-600"}`}
          aria-pressed={collapsed}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white dark:bg-[#0f2438] shadow transition-transform ${collapsed ? "translate-x-6" : "translate-x-1"}`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Appearance mode</p>
          <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
            Light or dark theme for the admin panel. Follows your system preference by default.
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-[#1e3a5f] dark:bg-[#0f2438]">
          <button
            onClick={() => setDark(false)}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${!dark ? "bg-white text-ocean shadow-sm dark:bg-[#162f4a] dark:text-[#8ec5f2]" : "text-slate-500 hover:text-slate-700 dark:text-slate-400"}`}
          >
            <Sun className="h-3.5 w-3.5" />
            Light
          </button>
          <button
            onClick={() => setDark(true)}
            className={`inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${dark ? "bg-white text-ocean shadow-sm dark:bg-[#162f4a] dark:text-[#8ec5f2]" : "text-slate-500 hover:text-slate-700 dark:text-slate-400"}`}
          >
            <Moon className="h-3.5 w-3.5" />
            Dark
          </button>
        </div>
      </div>
    </div>
  );
}

export function NotificationPreferences() {
  const [cleared, setCleared] = useState(false);

  const reset = () => {
    localStorage.removeItem("gh-admin-notifications-read");
    setCleared(true);
    setTimeout(() => setCleared(false), 2500);
  };

  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Reset notification read state</p>
        <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
          Notifications are generated live from store activity. Marked-as-read state is kept on this device.
        </p>
      </div>
      <button
        onClick={reset}
        className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#1e3a5f] px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46]"
      >
        {cleared ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-300" /> : <BellOff className="h-3.5 w-3.5" />}
        {cleared ? "Reset" : "Reset read state"}
      </button>
    </div>
  );
}