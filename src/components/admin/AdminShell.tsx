"use client";

import { useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { TopBar } from "@/components/admin/TopBar";
import { useLocalStorageFlag } from "@/hooks/use-local-storage";

export function AdminShell({
  userEmail,
  children,
}: {
  userEmail: string;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useLocalStorageFlag("gh-admin-sidebar-collapsed", false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-ivory dark:bg-[#0a1628] text-slate-800 dark:text-slate-200">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapsed={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          userEmail={userEmail}
          onOpenMobileSidebar={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}