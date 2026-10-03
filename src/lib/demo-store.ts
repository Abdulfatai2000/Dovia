/**
 * The single place where Dovia touches browser storage.
 *
 * Every demo record lives under the `dovia_demo_` prefix so `resetDemoData` can clear
 * Dovia state without touching unrelated keys, and so nothing here can read or write
 * credentials, tokens, or keys belonging to other origins.
 */
export const DOVIA_STORAGE_PREFIX = "dovia_demo_";
export const DEMO_VERSION = 1;
export const DEMO_CHANGED = "dovia-demo-changed";
export const DEMO_RESET = "dovia-demo-reset";

export function notifyDemoChange() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(DEMO_CHANGED));
}

/** Raw namespaced read. Returns undefined when the key was never written. */
export function readStored(key: string): string | null {
  if (typeof window === "undefined") return null;
  try { return localStorage.getItem(key); }
  catch { throw new Error("Unable to read Dovia demo data. Check browser storage access and try again."); }
}

/** Raw namespaced write. Refuses keys outside the Dovia namespace. */
export function writeStored(key: string, value: string) {
  assertNamespaced(key);
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, value); }
  catch { throw new Error("Unable to save in this browser. Your changes have not been persisted."); }
  notifyDemoChange();
}

export function removeStored(key: string) {
  assertNamespaced(key);
  if (typeof window === "undefined") return;
  try { localStorage.removeItem(key); }
  catch { throw new Error("Unable to update Dovia demo data. Check browser storage access and try again."); }
}

/** Parse a raw record, returning `fallback` when nothing valid is stored. */
export function readDemo<T>(key: string, fallback: T, validate: (value: unknown) => value is T): T {
  const raw = readStored(key);
  if (!raw) return fallback;
  try {
    const envelope: unknown = JSON.parse(raw);
    if (!isRecord(envelope) || envelope.version !== DEMO_VERSION || !("data" in envelope) || !validate(envelope.data)) throw new Error();
    return envelope.data;
  } catch { throw new Error("Unable to restore Dovia demo preferences. Reset demo data in Settings if needed."); }
}

/** Versioned write so structures can evolve without silently corrupting old demo state. */
export function writeDemo<T>(key: string, data: T) {
  writeStored(key, JSON.stringify({ version: DEMO_VERSION, data }));
}

/** Clears only Dovia namespaced keys. Never calls localStorage.clear(). */
export function resetDemoData() {
  if (typeof window === "undefined") return;
  try {
    Object.keys(localStorage).filter(key => key.startsWith(DOVIA_STORAGE_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  } catch { throw new Error("Some demo data could not be cleared. Check browser storage access and try again."); }
  window.dispatchEvent(new Event(DEMO_RESET));
  notifyDemoChange();
}

export const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

function assertNamespaced(key: string) {
  if (!key.startsWith(DOVIA_STORAGE_PREFIX)) throw new Error(`Refusing to touch browser storage outside the Dovia demo namespace: ${key}`);
}