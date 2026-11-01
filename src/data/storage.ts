import "expo-sqlite/localStorage/install";
import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/** The text stored under `key`, `null` when nothing is. */
export const readStored = (key: string) => localStorage.getItem(key);

/** Stores `value` under `key` (`null` removes it) and re-renders every reader. */
export const writeStored = (key: string, value: string | null) => {
  if (value === null) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, value);
  }
  for (const listener of listeners) {
    listener();
  }
};

/**
 * The text stored under `key`, kept up to date. Texts are primitives, so `useSyncExternalStore`
 * sees a stable value between renders; parse it in the caller.
 */
export const useStored = (key: string) => {
  const read = () => readStored(key);
  return useSyncExternalStore(subscribe, read, read);
};
