"use client";
/**
 * useOfflineSync — Progressive Offline-First sync hook.
 *
 * Architecture (Edge-Server Sync Model):
 *   State A: Absolute isolation  — mutations queued in IndexedDB only
 *   State B: LAN/Wi-Fi only      — flush to local Docker backend (192.168.x.x)
 *   State C: Full internet       — flush to production API (Render/Vercel)
 *
 * Flow:
 *   1. Any form submission calls queueMutation() instead of direct fetch.
 *   2. If navigator.onLine === true  → attempt immediate POST to API.
 *   3. If navigator.onLine === false → store in IndexedDB queue.
 *   4. window 'online' event fires  → flushQueue() drains IndexedDB to API.
 *   5. Server applies LWW conflict resolution (sync_engine.py).
 *
 * IndexedDB schema:
 *   DB:    "hha_offline_db"  (version 1)
 *   Store: "sync_queue"
 *   Key:   auto-increment id
 *   Value: SyncQueueItem
 */
import { useEffect, useCallback, useRef } from "react";

const DB_NAME    = "hha_offline_db";
const DB_VERSION = 1;
const STORE_NAME = "sync_queue";

export type PayloadType =
  | "contact_message"
  | "admission_inquiry"
  | "attendance"
  | "grade";

export interface SyncQueueItem {
  device_id:    string;
  payload_type: PayloadType;
  payload:      Record<string, unknown>;
  client_ts:    string;   // ISO 8601
}

// ── Stable device ID (persisted in localStorage) ─────────────
function getDeviceId(): string {
  if (typeof window === "undefined") return "ssr";
  const key = "hha_device_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = `dev_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

// ── IndexedDB helpers ─────────────────────────────────────────
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

async function enqueue(item: SyncQueueItem): Promise<void> {
  const db    = await openDB();
  const tx    = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await new Promise<void>((resolve, reject) => {
    const req = store.add(item);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
  db.close();
}

async function dequeueAll(): Promise<Array<{ key: IDBValidKey; item: SyncQueueItem }>> {
  const db    = await openDB();
  const tx    = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  return new Promise((resolve, reject) => {
    const results: Array<{ key: IDBValidKey; item: SyncQueueItem }> = [];
    const req = store.openCursor();
    req.onsuccess = (e) => {
      const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
      if (cursor) {
        results.push({ key: cursor.key, item: cursor.value as SyncQueueItem });
        cursor.continue();
      } else {
        db.close();
        resolve(results);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

async function deleteKey(key: IDBValidKey): Promise<void> {
  const db    = await openDB();
  const tx    = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await new Promise<void>((resolve, reject) => {
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
  db.close();
}

// ── Hook ──────────────────────────────────────────────────────
export function useOfflineSync() {
  const deviceId  = useRef<string>("");
  const isFlushing = useRef(false);

  useEffect(() => {
    deviceId.current = getDeviceId();
  }, []);

  /**
   * flushQueue — drain IndexedDB → POST /api/v1/sync/flush
   * Called on: window "online" event + manual trigger
   */
  const flushQueue = useCallback(async () => {
    if (isFlushing.current) return;
    if (typeof window === "undefined") return;
    if (!navigator.onLine) return;

    isFlushing.current = true;
    try {
      const entries = await dequeueAll();
      if (entries.length === 0) return;

      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/v1/sync/flush`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ items: entries.map((e) => e.item) }),
      });

      if (res.ok) {
        // Remove successfully flushed items
        for (const { key } of entries) {
          await deleteKey(key);
        }
        console.info(`[HHA Sync] Flushed ${entries.length} queued item(s).`);
      } else {
        console.warn("[HHA Sync] Flush request failed:", res.status);
      }
    } catch (err) {
      console.warn("[HHA Sync] Flush error (will retry on next online event):", err);
    } finally {
      isFlushing.current = false;
    }
  }, []);

  /* Listen for online event → auto-flush */
  useEffect(() => {
    window.addEventListener("online", flushQueue);
    // Also attempt flush on mount (page load while online)
    if (navigator.onLine) flushQueue();
    return () => window.removeEventListener("online", flushQueue);
  }, [flushQueue]);

  /**
   * queueMutation — primary API for form submissions.
   *
   * If online:  attempts direct API call; falls back to queue on failure.
   * If offline: queues immediately; flushed when connectivity returns.
   *
   * @param payloadType  One of PayloadType
   * @param payload      Form data as plain object
   * @returns            "sent" | "queued"
   */
  const queueMutation = useCallback(
    async (
      payloadType: PayloadType,
      payload: Record<string, unknown>
    ): Promise<"sent" | "queued"> => {
      const item: SyncQueueItem = {
        device_id:    deviceId.current || getDeviceId(),
        payload_type: payloadType,
        payload:      {
          ...payload,
          // Stable dedup key — same form submit won't create duplicates
          offline_id: `${deviceId.current}_${payloadType}_${Date.now()}`,
        },
        client_ts: new Date().toISOString(),
      };

      if (navigator.onLine) {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
          // Route to correct API endpoint based on payload type
          const endpointMap: Record<PayloadType, string> = {
            contact_message:   `${apiUrl}/api/v1/contact`,
            admission_inquiry: `${apiUrl}/api/v1/admissions`,
            attendance:        `${apiUrl}/api/v1/sync/flush`,
            grade:             `${apiUrl}/api/v1/sync/flush`,
          };
          const endpoint = endpointMap[payloadType];
          const res = await fetch(endpoint, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify(item.payload),
          });
          if (res.ok) return "sent";
        } catch {
          // Network failed despite navigator.onLine — fall through to queue
        }
      }

      await enqueue(item);
      return "queued";
    },
    []
  );

  return { queueMutation, flushQueue };
}
