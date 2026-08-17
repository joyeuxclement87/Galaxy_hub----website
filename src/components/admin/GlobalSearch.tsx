"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, Package, ShoppingCart, RefreshCw, MessageSquare, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResults {
  products: { id: string; name: string; slug: string; price: number }[];
  orders: { id: string; order_number: string; customer_name: string; status: string }[];
  tradeIns: { id: string; trade_in_id: string; customer_name: string; wanted_product_name: string; status: string }[];
  messages: { id: string; name: string; subject: string | null; message: string | null; type: "contact" | "enquiry"; status: string }[];
}

const EMPTY: SearchResults = { products: [], orders: [], tradeIns: [], messages: [] };

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searched, setSearched] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const q = query.trim();
    if (timerRef.current) clearTimeout(timerRef.current);
    if (q.length < 2) return;
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`/admin/api/search?q=${encodeURIComponent(q)}`);
        if (!res.ok) throw new Error("search failed");
        const data = await res.json();
        setResults({
          products: data.products ?? [],
          orders: data.orders ?? [],
          tradeIns: data.tradeIns ?? [],
          messages: data.messages ?? [],
        });
        setSearched(q);
      } catch {
        setResults(EMPTY);
        setError(true);
        setSearched(q);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  const total = results.products.length + results.orders.length + results.tradeIns.length + results.messages.length;
  const pending = loading || (searched !== query.trim() && query.trim().length >= 2);

  return (
    <div ref={rootRef} className="relative hidden md:block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search products, orders, customers…"
        className="h-10 w-52 rounded-lg border border-slate-200 dark:border-[#1e3a5f] bg-slate-50 dark:bg-[#0f2438] pl-9 pr-3 text-sm text-slate-700 dark:text-slate-300 placeholder:text-slate-400 transition-colors focus:border-ocean/50 focus:bg-white dark:bg-[#0f2438] focus:outline-none focus:ring-2 focus:ring-ocean/10 lg:w-64 xl:w-80"
      />

      {open && query.trim().length >= 2 && (
        <div className="absolute right-0 top-12 z-50 w-96 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 dark:border-[#1e3a5f] bg-white dark:bg-[#0f2438] shadow-lg">
          {pending ? (
            <div className="flex items-center gap-2 px-4 py-6 text-sm text-slate-400 dark:text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching…
            </div>
          ) : error ? (
            <p className="px-4 py-6 text-sm text-slate-400 dark:text-slate-500">Unable to search right now. Try again.</p>
          ) : total === 0 ? (
            <p className="px-4 py-6 text-sm text-slate-400 dark:text-slate-500">
              No results for &ldquo;{query}&rdquo;
            </p>
          ) : (
            <div className="max-h-[28rem] overflow-y-auto py-1">
              {results.products.length > 0 && (
                <ResultGroup label="Products">
                  {results.products.map((p) => (
                    <ResultRow
                      key={p.id}
                      icon={<Package className="h-3.5 w-3.5" />}
                      title={p.name}
                      subtitle={`${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number(p.price))} RWF`}
                      href={`/admin/products/${p.id}/edit`}
                    />
                  ))}
                </ResultGroup>
              )}
              {results.orders.length > 0 && (
                <ResultGroup label="Orders">
                  {results.orders.map((o) => (
                    <ResultRow
                      key={o.id}
                      icon={<ShoppingCart className="h-3.5 w-3.5" />}
                      title={`#${o.order_number}`}
                      subtitle={`${o.customer_name} · ${o.status}`}
                      href={`/admin/orders/${o.id}`}
                    />
                  ))}
                </ResultGroup>
              )}
              {results.tradeIns.length > 0 && (
                <ResultGroup label="Trade-Ins">
                  {results.tradeIns.map((t) => (
                    <ResultRow
                      key={t.id}
                      icon={<RefreshCw className="h-3.5 w-3.5" />}
                      title={t.trade_in_id}
                      subtitle={`${t.customer_name} · ${t.wanted_product_name}`}
                      href={`/admin/trade-ins/${t.id}`}
                    />
                  ))}
                </ResultGroup>
              )}
              {results.messages.length > 0 && (
                <ResultGroup label="Messages">
                  {results.messages.map((m) => (
                    <ResultRow
                      key={`${m.type}-${m.id}`}
                      icon={<MessageSquare className="h-3.5 w-3.5" />}
                      title={m.name}
                      subtitle={m.subject || m.message || m.status}
                      href="/admin/messages"
                    />
                  ))}
                </ResultGroup>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ResultGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="px-4 pb-1 pt-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400 dark:text-slate-500">
        {label}
      </p>
      {children}
    </div>
  );
}

function ResultRow({
  icon,
  title,
  subtitle,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-2 transition-colors hover:bg-ocean-subtle dark:bg-ocean/15"
      )}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 dark:bg-[#162f4a] text-slate-500 dark:text-slate-400">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-slate-700 dark:text-slate-300">{title}</span>
        <span className="block truncate text-xs text-slate-400 dark:text-slate-500">{subtitle}</span>
      </span>
    </Link>
  );
}