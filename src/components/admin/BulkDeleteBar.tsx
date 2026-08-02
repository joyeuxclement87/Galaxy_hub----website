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
    <div className="flex items-center justify-between gap-3 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-2.5">
      <span className="text-sm font-semibold text-red-200">
        {count} {label} selected
      </span>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onClear}
          disabled={busy}
          className="inline-flex cursor-pointer items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-50"
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
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-red-500/90 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-red-500/20 transition-colors hover:bg-red-500 disabled:opacity-60"
        >
          {pending || busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          Delete Selected
        </button>
      </div>
    </div>
  );
}
