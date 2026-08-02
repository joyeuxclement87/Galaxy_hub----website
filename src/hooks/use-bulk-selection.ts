"use client";

import { useCallback, useMemo, useState } from "react";

export function useBulkSelection(ids: string[]) {
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelected((prev) => {
      if (prev.size === ids.length) return new Set();
      return new Set(ids);
    });
  }, [ids]);

  const clear = useCallback(() => setSelected(new Set()), []);

  const allSelected = ids.length > 0 && selected.size === ids.length;

  return useMemo(
    () => ({ selected, toggle, toggleAll, clear, allSelected, count: selected.size }),
    [selected, toggle, toggleAll, clear, allSelected],
  );
}
