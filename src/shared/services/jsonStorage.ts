export interface JsonStorage {
  read<T>(key: string, fallback: T): T;
  write(key: string, value: unknown): void;
  remove(key: string): void;
}

export function createJsonStorage(storage: Storage = localStorage): JsonStorage {
  return {
    read<T>(key: string, fallback: T): T {
      try {
        const raw = storage.getItem(key);
        return raw === null ? fallback : (JSON.parse(raw) as T);
      } catch {
        return fallback;
      }
    },

    write(key, value) {
      try {
        storage.setItem(key, JSON.stringify(value));
      } catch {
        return;
      }
    },

    remove(key) {
      try {
        storage.removeItem(key);
      } catch {
        return;
      }
    },
  };
}
