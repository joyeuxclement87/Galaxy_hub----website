"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

const THEME_KEY = "gh-admin-theme";

function resolveDark(): boolean {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored) return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return resolveDark();
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  const toggle = () => {
    setDark((d) => {
      const next = !d;
      localStorage.setItem(THEME_KEY, next ? "dark" : "light");
      return next;
    });
  };

  return (
    <button
      onClick={toggle}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 dark:border-[#1e3a5f] dark:bg-[#0f2438] dark:text-slate-300 dark:hover:bg-[#132c46] dark:hover:text-slate-100"
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}