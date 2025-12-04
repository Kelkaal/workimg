// src/lib/safeStorage.ts

export const isBrowser = typeof window !== "undefined";

export const safeLocalStorage = {
  get(key: string): string | null {
    if (!isBrowser) return null;
    // We explicitly use window.localStorage to avoid conflicts and improve clarity
    return window.localStorage.getItem(key);
  },
  set(key: string, value: string) {
    if (!isBrowser) return;
    window.localStorage.setItem(key, value);
  },
  remove(key: string) {
    if (!isBrowser) return;
    window.localStorage.removeItem(key);
  },
};

// Also protect sessionStorage if you use it
export const safeSessionStorage = {
  get(key: string): string | null {
    if (!isBrowser) return null;
    return window.sessionStorage.getItem(key);
  },
  // ... similar set/remove methods
};
