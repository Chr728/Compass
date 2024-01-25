import { skipWaiting, clientsClaim } from "workbox-core";
import { ExpirationPlugin } from "workbox-expiration";
import {
  NetworkOnly,
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";
import {
  registerRoute,
  setDefaultHandler,
  setCatchHandler,
} from "workbox-routing";
import {
  matchPrecache,
  precacheAndRoute,
  cleanupOutdatedCaches,
} from "workbox-precaching";
import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { sendUserReminders } from "./app/http/remindersAPI";
import {
  createSubscription,
  getSubscription,
  updateSubscription,
  deleteSubscription,
} from "./app/http/subscriptionAPI";
skipWaiting();
clientsClaim();

// must include following lines when using inject manifest module from workbox
// https://developers.google.com/web/tools/workbox/guides/precache-files/workbox-build#add_an_injection_point
const WB_MANIFEST = self.__WB_MANIFEST;
// Precache fallback route and image
//precacheAndRoute(WB_MANIFEST);

cleanupOutdatedCaches();
registerRoute(
  "/",
  new NetworkFirst({
    cacheName: "start-url",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 1,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: !0,
      }),
    ],
  }),
  "GET"
);
registerRoute(
  /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
  new CacheFirst({
    cacheName: "google-fonts",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 4,
        maxAgeSeconds: 31536e3,
        purgeOnQuotaError: !0,
      }),
    ],
  }),
  "GET"
);
registerRoute(
  /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
  new StaleWhileRevalidate({
    cacheName: "static-font-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 4,
        maxAgeSeconds: 604800,
        purgeOnQuotaError: !0,
      }),
    ],
  }),
  "GET"
);
// disable image cache, so we could observe the placeholder image when offline
registerRoute(
  /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
  new NetworkOnly({
    cacheName: "static-image-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 64,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: !0,
      }),
    ],
  }),
  "GET"
);
registerRoute(
  /\.(?:js)$/i,
  new StaleWhileRevalidate({
    cacheName: "static-js-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 32,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: !0,
      }),
    ],
  }),
  "GET"
);
registerRoute(
  /\.(?:css|less)$/i,
  new StaleWhileRevalidate({
    cacheName: "static-style-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 32,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: !0,
      }),
    ],
  }),
  "GET"
);
registerRoute(
  /\.(?:json|xml|csv)$/i,
  new NetworkFirst({
    cacheName: "static-data-assets",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 32,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: !0,
      }),
    ],
  }),
  "GET"
);
registerRoute(
  /\/api\/.*$/i,
  new NetworkFirst({
    cacheName: "apis",
    networkTimeoutSeconds: 10,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 16,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: !0,
      }),
    ],
  }),
  "GET"
);
registerRoute(
  /.*/i,
  new NetworkFirst({
    cacheName: "others",
    networkTimeoutSeconds: 10,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 32,
        maxAgeSeconds: 86400,
        purgeOnQuotaError: !0,
      }),
    ],
  }),
  "GET"
);

// following lines gives you control of the offline fallback strategies
// https://developers.google.com/web/tools/workbox/guides/advanced-recipes#comprehensive_fallbacks

// Use a stale-while-revalidate strategy for all other requests.
setDefaultHandler(new StaleWhileRevalidate());

// This "catch" handler is triggered when any of the other routes fail to
// generate a response.
setCatchHandler(({ event }) => {
  // The FALLBACK_URL entries must be added to the cache ahead of time, either
  // via runtime or precaching. If they are precached, then call
  // `matchPrecache(FALLBACK_URL)` (from the `workbox-precaching` package)
  // to get the response from the correct cache.
  //
  // Use event, request, and url to figure out how to respond.
  // One approach would be to use request.destination, see
  // https://medium.com/dev-channel/service-worker-caching-strategies-based-on-request-types-57411dd7652c
  switch (event.request.destination) {
    case "document":
      // If using precached URLs:
      return matchPrecache("/~offline");
      // return caches.match('/fallback')
      break;
    case "image":
      // If using precached URLs:
      return matchPrecache("/static/images/fallback.png");
      // return caches.match('/static/images/fallback.png')
      break;
    case "font":
    // If using precached URLs:
    // return matchPrecache(FALLBACK_FONT_URL);
    // return caches.match('/static/fonts/fallback.otf')
    // break
    default:
      // If we don't have a fallback, just return an error response.
      return Response.error();
  }
});

registerRoute(
  ({ request }) => request.destination === "document",
  new CacheFirst({
    cacheName: "pages",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Utility function to convert base64 to Uint8Array
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const binaryString = atob(base64);
  const arrayBuffer = new ArrayBuffer(binaryString.length);
  const uint8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  return uint8Array;
}

// Function to subscribe a user to push notifications
function subscribeUserToPush() {
  // Register user for push notifications
  return self.registration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        "BKlaijHeFLlg0cuC8twkPz0p-vY8EzOJSATZnUdGu5Kc49ScJL4iVMaCIaSY4xI4t-XVeJS69H6c1tPSzstO0pw"
      ),
    })
    .then(async (subscription) => {
      // Convert keys into base64 string format
      const base64AuthKey = btoa(
        String.fromCharCode.apply(
          null,
          new Uint8Array(subscription.getKey("auth"))
        )
      );
      const base64P256dhKey = btoa(
        String.fromCharCode.apply(
          null,
          new Uint8Array(subscription.getKey("p256dh"))
        )
      );

      const subscriptionData = {
        endpoint: subscription.endpoint,
        keys: {
          auth: base64AuthKey, // Extract the auth key
          p256dh: base64P256dhKey, // Extract the p256dh key
        },
      };

      try {
        // Check if subscription exists in the database for the user
        const result = await getSubscription();
        if (result && result.data) {
          console.log("Found subscription object of the user");
          console.log("Attempting to update it...");
          try {
            await updateSubscription(subscriptionData);
            console.log("Updated subscription object of user");
          } catch (error) {
            console.log("Error updating subscription object of user:", error);
          }
        }
      } catch (error) {
        console.log("Error retrieving subscription object of user:", error);
        console.log("Attempting to create subscription object for user");
        try {
          await createSubscription(subscriptionData);
          console.log("Subscription for user created!");
        } catch (error) {
          console.error("Error creating subscription object for user:", error);
        }
      }
    })
    .catch((error) => {
      console.error("Subscription task failed:", error);
    });
}

// Function to unsubscribe a user from push notifications
function unsubscribeUserFromPush() {
  return self.registration.pushManager
    .getSubscription()
    .then(async (subscription) => {
      try {
        const result = await getSubscription();
        if (result && result.data) {
          console.log("Found subscription object of the user");
          console.log("Attempting to delete it...");
          await deleteSubscription();
          console.log("Unsubscribed from push notifications.");
        }
      } catch (error) {
        console.error("Unsubscription task failed:", error);
      }
    })
    .catch((error) => {
      console.error("Unsubscribe task failed:", error);
    });
}

// On event, subscribe the user to push notifications or unsubscribe them
self.addEventListener("message", (event) => {
  // Event to subscribe user to push notifications
  if (event.data.action === "subscribeToPush") {
    event.waitUntil(subscribeUserToPush());
  }

  // Event to unsubscribe a user to push notifications
  if (event.data.action === "unsubscribeFromPush") {
    event.waitUntil(unsubscribeUserFromPush());
  }
});

// Event listener for push notifications
self.addEventListener("push", (event) => {
  const options = {
    icon: "/compass-removebg.png",
    ...event.data.json(),
  };

  event.waitUntil(self.registration.showNotification(options.title, options));
});

// // Function to run every 10 minutes
// async function runTaskEvery10Minutes() {
//   const currentTime = new Date()
//   const currentHour = currentTime.getHours()
//   const currentMinute = currentTime.getMinutes()
//   console.log(currentHour)
//   console.log(currentMinute)
//   if ((currentHour == 0 && currentMinute == 0) || (currentHour == 0 && currentMinute == 10) || (currentHour == 0 && currentMinute == 20) || (currentHour == 0 && currentMinute == 30) || (currentHour == 0 && currentMinute == 40) || (currentHour == 0 && currentMinute == 50)
//   || (currentHour == 1 && currentMinute == 0) || (currentHour == 1 && currentMinute == 10) || (currentHour == 1 && currentMinute == 20) || (currentHour == 1 && currentMinute == 30) || (currentHour == 1 && currentMinute == 40) || (currentHour == 1 && currentMinute == 50)
//   || (currentHour == 2 && currentMinute == 0) || (currentHour == 2 && currentMinute == 10) || (currentHour == 2 && currentMinute == 20) || (currentHour == 2 && currentMinute == 30) || (currentHour == 2 && currentMinute == 40) || (currentHour == 2 && currentMinute == 50)
//   || (currentHour == 3 && currentMinute == 0) || (currentHour == 3 && currentMinute == 10) || (currentHour == 3 && currentMinute == 20) || (currentHour == 3 && currentMinute == 30) || (currentHour == 3 && currentMinute == 40) || (currentHour == 3 && currentMinute == 50)
//   || (currentHour == 4 && currentMinute == 0) || (currentHour == 4 && currentMinute == 10) || (currentHour == 4 && currentMinute == 20) || (currentHour == 4 && currentMinute == 30) || (currentHour == 4 && currentMinute == 40) || (currentHour == 4 && currentMinute == 50)
//   || (currentHour == 5 && currentMinute == 0) || (currentHour == 5 && currentMinute == 10) || (currentHour == 5 && currentMinute == 20) || (currentHour == 5 && currentMinute == 30) || (currentHour == 5 && currentMinute == 40) || (currentHour == 5 && currentMinute == 50)
//   || (currentHour == 6 && currentMinute == 0) || (currentHour == 6 && currentMinute == 10) || (currentHour == 6 && currentMinute == 20) || (currentHour == 6 && currentMinute == 30) || (currentHour == 6 && currentMinute == 40) || (currentHour == 6 && currentMinute == 50)
//   || (currentHour == 7 && currentMinute == 0) || (currentHour == 7 && currentMinute == 10) || (currentHour == 7 && currentMinute == 20) || (currentHour == 7 && currentMinute == 30) || (currentHour == 7 && currentMinute == 40) || (currentHour == 7 && currentMinute == 50)
//   || (currentHour == 8 && currentMinute == 0) || (currentHour == 8 && currentMinute == 10) || (currentHour == 8 && currentMinute == 20) || (currentHour == 8 && currentMinute == 30) || (currentHour == 8 && currentMinute == 40) || (currentHour == 8 && currentMinute == 50)
//   || (currentHour == 9 && currentMinute == 0) || (currentHour == 9 && currentMinute == 10) || (currentHour == 9 && currentMinute == 20) || (currentHour == 9 && currentMinute == 30) || (currentHour == 9 && currentMinute == 40) || (currentHour == 9 && currentMinute == 50)
//   || (currentHour == 10 && currentMinute == 0) || (currentHour == 10 && currentMinute == 10) || (currentHour == 10 && currentMinute == 20) || (currentHour == 10 && currentMinute == 30) || (currentHour == 10 && currentMinute == 40) || (currentHour == 10 && currentMinute == 50)
//   || (currentHour == 11 && currentMinute == 0) || (currentHour == 11 && currentMinute == 10) || (currentHour == 11 && currentMinute == 20) || (currentHour == 11 && currentMinute == 30) || (currentHour == 11 && currentMinute == 40) || (currentHour == 11 && currentMinute == 50)
//   || (currentHour == 12 && currentMinute == 0) || (currentHour == 12 && currentMinute == 10) || (currentHour == 12 && currentMinute == 20) || (currentHour == 12 && currentMinute == 30) || (currentHour == 12 && currentMinute == 40) || (currentHour == 12 && currentMinute == 50)
//   || (currentHour == 13 && currentMinute == 0) || (currentHour == 13 && currentMinute == 10) || (currentHour == 13 && currentMinute == 20) || (currentHour == 13 && currentMinute == 30) || (currentHour == 13 && currentMinute == 40) || (currentHour == 13 && currentMinute == 50)
//   || (currentHour == 14 && currentMinute == 0) || (currentHour == 14 && currentMinute == 10) || (currentHour == 14 && currentMinute == 20) || (currentHour == 14 && currentMinute == 30) || (currentHour == 14 && currentMinute == 40) || (currentHour == 14 && currentMinute == 50)
//   || (currentHour == 15 && currentMinute == 0) || (currentHour == 15 && currentMinute == 10) || (currentHour == 15 && currentMinute == 20) || (currentHour == 15 && currentMinute == 30) || (currentHour == 15 && currentMinute == 40) || (currentHour == 15 && currentMinute == 50)
//   || (currentHour == 16 && currentMinute == 0) || (currentHour == 16 && currentMinute == 10) || (currentHour == 16 && currentMinute == 20) || (currentHour == 16 && currentMinute == 30) || (currentHour == 16 && currentMinute == 40) || (currentHour == 16 && currentMinute == 50)
//   || (currentHour == 17 && currentMinute == 0) || (currentHour == 17 && currentMinute == 10) || (currentHour == 17 && currentMinute == 20) || (currentHour == 17 && currentMinute == 30) || (currentHour == 17 && currentMinute == 40) || (currentHour == 17 && currentMinute == 50)
//   || (currentHour == 18 && currentMinute == 0) || (currentHour == 18 && currentMinute == 10) || (currentHour == 18 && currentMinute == 20) || (currentHour == 18 && currentMinute == 30) || (currentHour == 18 && currentMinute == 40) || (currentHour == 18 && currentMinute == 50)
//   || (currentHour == 19 && currentMinute == 0) || (currentHour == 19 && currentMinute == 10) || (currentHour == 19 && currentMinute == 20) || (currentHour == 19 && currentMinute == 30) || (currentHour == 19 && currentMinute == 40) || (currentHour == 19 && currentMinute == 50)
//   || (currentHour == 20 && currentMinute == 0) || (currentHour == 20 && currentMinute == 10) || (currentHour == 20 && currentMinute == 20) || (currentHour == 20 && currentMinute == 30) || (currentHour == 20 && currentMinute == 40) || (currentHour == 20 && currentMinute == 50)
//   || (currentHour == 21 && currentMinute == 0) || (currentHour == 21 && currentMinute == 10) || (currentHour == 21 && currentMinute == 20) || (currentHour == 21 && currentMinute == 30) || (currentHour == 21 && currentMinute == 40) || (currentHour == 21 && currentMinute == 50)
//   || (currentHour == 22 && currentMinute == 0) || (currentHour == 22 && currentMinute == 10) || (currentHour == 22 && currentMinute == 20) || (currentHour == 22 && currentMinute == 30) || (currentHour == 22 && currentMinute == 40) || (currentHour == 22 && currentMinute == 50)
//   || (currentHour == 23 && currentMinute == 0) || (currentHour == 23 && currentMinute == 10) || (currentHour == 23 && currentMinute == 20) || (currentHour == 23 && currentMinute == 30) || (currentHour == 23 && currentMinute == 40) || (currentHour == 23 && currentMinute == 50)){
//     console.log("Push Notification Task!");
//     sendUserReminders();
//   }
// }

// // // Schedule the task to run every 10 minutes
// setInterval(() => {
//   runTaskEvery10Minutes();
// }, 1 * 60 * 1000); // 10 minutes in milliseconds

// When service worker activates, register the periodic syunc
// self.addEventListener("activate", async (event) => {
//   try {
//     await self.registration.periodicSync.register("notification-sync", {
//       // An interval of 10 minutes
//       minInterval: 1 * 60 * 1000,
//     });
//     console.log("periodic sync is here!");
//   } catch (error) {
//     console.log("Periodic sync cannot be used :", error);
//   }
// });

// // Event listener for the periodic background sync event
// self.addEventListener("periodicsync", (event) => {
//   console.log("Periodic task has been triggered!");
//   console.log(event);
//   if (event.tag === "notification-sync") {
//     event.waitUntil(runTaskEvery10Minutes());
//   }
// });
