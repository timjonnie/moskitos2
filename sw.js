// Minimaler Service Worker: macht das Team-Board installierbar, speichert aber nichts zwischen.
// Alle Anfragen gehen direkt ins Netz, damit immer der aktuelle Stand angezeigt wird.
self.addEventListener("install", function () { self.skipWaiting(); });
self.addEventListener("activate", function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", function () {});
