// Docs site is static routes (full page nav between components), so the
// Toolbar's React state resets on every navigation. Persist the live luz
// settings here and re-apply them on mount instead.
const KEY = "luz-docs-settings";

export interface PersistedSettings {
  primary?: string;
  mode?: "light" | "dark";
  soundEnabled?: boolean;
}

export function loadPersistedSettings(): PersistedSettings {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function savePersistedSettings(patch: PersistedSettings): void {
  try {
    localStorage.setItem(
      KEY,
      JSON.stringify({ ...loadPersistedSettings(), ...patch }),
    );
  } catch {
    // Private browsing / storage disabled — settings just won't persist.
  }
}
