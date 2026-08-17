"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2, X } from "lucide-react";

export function BulkDeleteBar({
  count,
  label,
  onDelete,
  onClear,
}: {
  count: number;
  label: string;
  onDelete: () => Promise<{ error?: string } | void>;
  onClear: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [busy, setBusy] = useState(false);

  if (count === 0) return null;

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/15 px-4 py-2.5">
      <span className="text-sm font-semibold text-red-700 dark:text-red-300">
        {count} {label} selected
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onClear}
          disabled={busy}
          className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors hover:bg-slate-200 dark:bg-slate-600 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            startTransition(async () => {
              if (!window.confirm(`Delete ${count} selected ${label}? This cannot be undone.`)) return;
              setBusy(true);
              const result = await onDelete();
              setBusy(false);
              if (result?.error) {
                alert(result.error);
                return;
              }
              onClear();
            });
          }}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-red-700 disabled:opacity-60"
        >
          {pending || busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          Delete Selected
        </button>
      </div>
    </div>
  );
}