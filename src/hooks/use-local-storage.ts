"use client";

import { useCallback, useSyncExternalStore } from "react";

/* ─── SSR-safe localStorage sync ───────────────────────────────────────────
   Replaces the hydrate-on-mount + setState-in-effect pattern: reads are
   snapshot-based so there is never a flash of the wrong value, and writes
   dispatch a local event so every consumer of the same key stays in sync.
   ──────────────────────────────────────────────────────────────────────── */

const STORAGE_EVENT = "gh-local-storage";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(STORAGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(STORAGE_EVENT, callback);
  };
}

export function useLocalStorageFlag(key: string, defaultValue: boolean) {
  const getSnapshot = () => (localStorage.getItem(key) === "1" ? "1" : "0");
  const getServerSnapshot = () => (defaultValue ? "1" : "0");
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const set = useCallback(
    (value: boolean) => {
      localStorage.setItem(key, value ? "1" : "0");
      window.dispatchEvent(new Event(STORAGE_EVENT));
    },
    [key]
  );

  return [raw === "1", set] as const;
}

export function useLocalStorageJson<T>(key: string, empty: T) {
  const getSnapshot = () => localStorage.getItem(key) ?? "__gh_empty__";
  const getServerSnapshot = () => "__gh_empty__";
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const set = useCallback(
    (value: T) => {
      localStorage.setItem(key, JSON.stringify(value));
      window.dispatchEvent(new Event(STORAGE_EVENT));
    },
    [key]
  );

  return [raw === "__gh_empty__" ? empty : (JSON.parse(raw) as T), set] as const;
}