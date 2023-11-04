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
import sendUserReminders from "./app/http/remindersAPI";
import {
  createSubscription,
  getSubscription,
  updateSubscription,
} from "./app/http/subscriptionAPI";

skipWaiting();
clientsClaim();

// must include following lines when using inject manifest module from workbox
// https://developers.google.com/web/tools/workbox/guides/precache-files/workbox-build#add_an_injection_point
const WB_MANIFEST = self.__WB_MANIFEST;
// Precache fallback route and image
WB_MANIFEST.push({
  url: "/~offline",
});
precacheAndRoute(WB_MANIFEST);

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
  "/~offline",
  new NetworkFirst({
    cacheName: "offline-fallback",
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
function subscribeUserToPush(userUID, userToken) {
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
        const result = await getSubscription(userUID, userToken);
        if (result && result.data) {
          console.log("Found subscription object of the user");
          console.log("Attempting to update it...");
          try {
            await updateSubscription(userUID, userToken, subscriptionData);
            console.log("Updated subscription object of user");
          } catch (error) {
            console.log("Error updating subscription object of user:", error);
          }
        }
      } catch (error) {
        console.log("Error retrieving subscription object of user:", error);
        console.log("Attempting to create subscription object for user");
        try {
          await createSubscription(userUID, userToken, subscriptionData);
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
    .then((subscription) => {
      console.log("Unsubscribed from push notifications.");
    })
    .catch((error) => {
      console.error("Unsubscribe task failed:", error);
    });
}

// On event, subscribe the user to push notifications or unsubscribe them
self.addEventListener("message", (event) => {
  // Event to subscribe user to push notifications
  if (event.data.action === "subscribeToPush") {
    event.waitUntil(
      subscribeUserToPush(event.data.userUID, event.data.userToken)
    );
  }

  // Event to unsubscribe a user to push notifications
  if (event.data.action === "unsubscribeFromPush") {
    event.waitUntil(unsubscribeUserFromPush());
  }
});

// Function to run every 30 minutes
function runTaskEvery5Minutes() {
  // This function will run every 30 minutes
  console.log("Push Notification Task!");
  //sendUserReminders();
}

// Schedule the task to run every 30 minutes
setInterval(() => {
  runTaskEvery5Minutes();
}, 30 * 60 * 1000); // 30 minutes in milliseconds

// Event listener for push notifications
self.addEventListener("push", (event) => {
  const options = {
    icon: "/compass-removebg.png",
    ...event.data.json(),
  };

  event.waitUntil(self.registration.showNotification(options.title, options));
});
