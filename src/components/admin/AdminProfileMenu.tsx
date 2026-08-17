"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LogOut, User, Settings } from "lucide-react";
import { signOut } from "@/actions/auth";

export function AdminProfileMenu({
  userEmail,
  initials,
}: {
  userEmail: string;
  initials: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-slate-200 dark:border-[#1e3a5f] py-1 pl-1 pr-2.5 transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46]"
        aria-label="Admin menu"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-ocean text-[10px] font-bold text-white">
          {initials}
        </span>
        <span className="hidden text-left lg:block">
          <span className="block text-xs font-semibold leading-none text-slate-700 dark:text-slate-300">
            {userEmail.split("@")[0]}
          </span>
          <span className="mt-0.5 block text-[10px] leading-none text-slate-400 dark:text-slate-500">
            Administrator
          </span>
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] shadow-lg">
          <div className="border-b border-slate-100 dark:border-[#1a3352] px-4 py-3">
            <p className="truncate text-sm font-semibold text-slate-700 dark:text-slate-300">{userEmail}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500">Galaxy Hub Administrator</p>
          </div>
          <div className="p-1.5">
            <Link
              href="/admin/customers"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46] hover:text-slate-900 dark:hover:text-slate-100"
            >
              <User className="h-4 w-4 text-slate-400 dark:text-slate-500" /> My Profile
            </Link>
            <Link
              href="/admin/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-50 dark:hover:bg-[#132c46] hover:text-slate-900 dark:hover:text-slate-100"
            >
              <Settings className="h-4 w-4 text-slate-400 dark:text-slate-500" /> Settings
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium text-red-600 dark:text-red-300 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}