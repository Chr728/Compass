// Function to subscribe users to push notifications
export const subscribeToPushNotifications = async (
  handlePopUp: (arg0: any, arg1: string) => void,
  setSubscriptionReminders: (arg0: boolean) => void
) => {
  // Ask user permission for push notifications
  if ("Notification" in window) {
    const currentPermission = Notification.permission;
    // Ask permission if its set to default or denied
    if (currentPermission === "default" || currentPermission === "denied") {
      Notification.requestPermission().then(function (permission) {
        if (permission === "granted") {
          // Permission has been granted. Send request to create subscription object for user
          if (
            "serviceWorker" in navigator &&
            navigator.serviceWorker.controller
          ) {
            // Request user to turn on their notifications
            navigator.serviceWorker.controller.postMessage({
              action: "subscribeToPush",
            });
            handlePopUp("success", "Notification subscription created!");
          } else {
            // Handle the case where serviceWorker or controller is not available.
            console.error("Service Worker or controller is not available.");
            handlePopUp("error", "Notification subscription failed to create!");
          }
        } else if (permission === "denied") {
          // Permission has been denied.
          console.log("Notification permission denied.");
          // Unsubscribe a user from push notifications
          if (
            "serviceWorker" in navigator &&
            navigator.serviceWorker.controller
          ) {
            navigator.serviceWorker.controller.postMessage({
              action: "unsubscribeFromPush",
            });
          }
          setSubscriptionReminders(false);
          handlePopUp(
            "error",
            "Notification permission denied, please reset permissions in your browser if you want to enable the feature!"
          );
        } else if (permission === "default") {
          // The user closed the permission dialog without making a choice.
          console.log("Notification permission dismissed.");
          setSubscriptionReminders(false);
        }
      });
    } else {
      handlePopUp(
        "error",
        "To turn off notifications, please change your settings in your browser!"
      );
      setSubscriptionReminders(false);
    }
  }
};
