// Minimal service worker: enables "Add to Home Screen" installability and
// gives the app shell basic offline support. Network-first with a cache
// fallback, and it only touches same-origin GETs (Supabase calls pass through).
const CACHE = "omg-cache-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  // Only cache our own origin — leave Supabase (DB + storage) alone.
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(async () => {
        const cached = await caches.match(req);
        // For page navigations, fall back to the cached app shell.
        return cached || (await caches.match("/")) || Response.error();
      })
  );
});
