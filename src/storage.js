// Drop-in replacement for the Claude-artifact `window.storage` API, backed by
// IndexedDB so it works in a normal browser with no size limits worth worrying
// about (unlike localStorage's ~5-10MB cap, which a real OLManager save can
// exceed once decompressed).
//
// API matches what RiftRoom.jsx already calls:
//   window.storage.get(key, shared)    -> { key, value, shared } | throws if missing
//   window.storage.set(key, value, sh) -> { key, value, shared } | null on failure
//   window.storage.delete(key, shared) -> { key, deleted, shared } | null
//   window.storage.list(prefix, shared)-> { keys, prefix, shared } | null
//
// `shared` is accepted for API compatibility but ignored — this app has no
// backend, so there's no concept of data shared between users.

const DB_NAME = "oml-scout-db";
const STORE_NAME = "kv";
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore(mode, fn) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const store = tx.objectStore(STORE_NAME);
    const result = fn(store);
    tx.oncomplete = () => resolve(result.value ?? result);
    tx.onerror = () => reject(tx.error);
  });
}

window.storage = {
  async get(key /*, shared */) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readonly");
      const req = tx.objectStore(STORE_NAME).get(key);
      req.onsuccess = () => {
        if (req.result === undefined) {
          reject(new Error(`Key not found: ${key}`));
        } else {
          resolve({ key, value: req.result, shared: false });
        }
      };
      req.onerror = () => reject(req.error);
    });
  },

  async set(key, value /*, shared */) {
    try {
      const db = await openDB();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).put(value, key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
      return { key, value, shared: false };
    } catch (e) {
      console.error("storage.set failed", e);
      return null;
    }
  },

  async delete(key /*, shared */) {
    try {
      const db = await openDB();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        tx.objectStore(STORE_NAME).delete(key);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
      return { key, deleted: true, shared: false };
    } catch (e) {
      console.error("storage.delete failed", e);
      return null;
    }
  },

  async list(prefix = "" /*, shared */) {
    try {
      const db = await openDB();
      const keys = await new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const req = tx.objectStore(STORE_NAME).getAllKeys();
        req.onsuccess = () => resolve(req.result.filter((k) => k.startsWith(prefix)));
        req.onerror = () => reject(req.error);
      });
      return { keys, prefix, shared: false };
    } catch (e) {
      console.error("storage.list failed", e);
      return null;
    }
  },
};
