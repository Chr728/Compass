import { subscribeToPushNotifications } from "./pushNotificationService"; // Update this path to your notification file
describe("subscribeToPushNotifications", () => {
  let mockHandlePopUp;
  let mockSetSubscriptionReminders;
  let mockController;
  let mockServiceWorker;
  let mockRegistration;
  let originalNotification;

  beforeEach(() => {
    mockHandlePopUp = jest.fn();
    mockSetSubscriptionReminders = jest.fn();

    mockController = {
      postMessage: jest.fn(), // Mock the postMessage method
    };

    mockServiceWorker = {
      controller: mockController,
    };

    mockRegistration = {
      active: mockServiceWorker,
    };
    originalNotification = window.Notification;
  });
  afterEach(() => {
    jest.clearAllMocks();
    window.Notification = originalNotification;
  });

  test("should handle notification subscription when permission is granted but serviceWorker is not available", async () => {
    // Mock the notification object to have default permission and return granted when permission is requested
    Object.defineProperty(window, "Notification", {
      value: {
        permission: "default",
        requestPermission: jest.fn().mockImplementation(() => {
          return Promise.resolve("granted"); // Change the resolved value as needed
        }),
      },
      writable: true,
    });

    // Call function
    await subscribeToPushNotifications(
      mockHandlePopUp,
      mockSetSubscriptionReminders
    );

    // Expect that postMessage was called with specific parameters
    expect(mockController.postMessage).not.toHaveBeenCalledWith({
      action: "subscribeToPush",
    });

    // Expect that handlePopUp was called with specific parameters
    expect(mockHandlePopUp).toHaveBeenCalledWith(
      "error",
      "Notification subscription failed to create!"
    );
  });

  test("should handle notification subscription when permission is granted and serviceWorker is available", async () => {
    // Mock the service worker to be available
    Object.defineProperty(window.navigator, "serviceWorker", {
      value: {
        ready: Promise.resolve(),
        getRegistration: jest.fn().mockResolvedValue(mockRegistration), // Mock the getRegistration method
        controller: mockController, // Ensure the controller is available directly in navigator.serviceWorker
      },
      writable: true,
    });

    // Mock the notification object to have default permission and return granted when permission is requested
    Object.defineProperty(window, "Notification", {
      value: {
        permission: "default",
        requestPermission: jest.fn().mockImplementation(() => {
          return Promise.resolve("granted"); // Change the resolved value as needed
        }),
      },
      writable: true,
    });

    // Call function
    await subscribeToPushNotifications(
      mockHandlePopUp,
      mockSetSubscriptionReminders
    );

    // Expect that postMessage was called with specific parameters
    expect(mockController.postMessage).toHaveBeenCalledWith({
      action: "subscribeToPush",
    });

    // Expect that handlePopUp was called with specific parameters
    expect(mockHandlePopUp).toHaveBeenCalledWith(
      "success",
      "Notification subscription created!"
    );
  });

  test("should handle notification permission denied and unsubscribe when permission is denied", async () => {
    // Mock the service worker to be available
    Object.defineProperty(window.navigator, "serviceWorker", {
      value: {
        ready: Promise.resolve(),
        getRegistration: jest.fn().mockResolvedValue(mockRegistration), // Mock the getRegistration method
        controller: mockController, // Ensure the controller is available directly in navigator.serviceWorker
      },
      writable: true,
    });

    // Mock the notification object to have default permission and return denied when permission is requested
    Object.defineProperty(window, "Notification", {
      value: {
        permission: "default",
        requestPermission: jest.fn().mockImplementation(() => {
          return Promise.resolve("denied"); // Change the resolved value as needed
        }),
      },
      writable: true,
    });

    // Call function
    await subscribeToPushNotifications(
      mockHandlePopUp,
      mockSetSubscriptionReminders
    );

    // Expect that postMessage was called with specific parameters
    expect(mockController.postMessage).toHaveBeenCalledWith({
      action: "unsubscribeFromPush",
    });

    // Expect that handlePopUp was called with specific parameters
    expect(mockHandlePopUp).toHaveBeenCalledWith(
      "error",
      "Notification permission denied, please reset permissions in your browser if you want to enable the feature!"
    );

    // Expect that setSubscriptionReminders was called with specific parameters
    expect(mockSetSubscriptionReminders).toHaveBeenCalledWith(false);
  });

  test("should handle notification permission default", async () => {
    // Mock the service worker to be available
    Object.defineProperty(window.navigator, "serviceWorker", {
      value: {
        ready: Promise.resolve(),
        getRegistration: jest.fn().mockResolvedValue(mockRegistration), // Mock the getRegistration method
        controller: mockController, // Ensure the controller is available directly in navigator.serviceWorker
      },
      writable: true,
    });

    // Mock the notification object to have default permission and return default when permission is requested
    Object.defineProperty(window, "Notification", {
      value: {
        permission: "default",
        requestPermission: jest.fn().mockImplementation(() => {
          return Promise.resolve("default"); // Change the resolved value as needed
        }),
      },
      writable: true,
    });

    // Call function
    await subscribeToPushNotifications(
      mockHandlePopUp,
      mockSetSubscriptionReminders
    );

    // Expect that setSubscriptionReminders was called with specific parameters
    expect(mockSetSubscriptionReminders).toHaveBeenCalledWith(false);
  });

  test("should handle notification permission already granted before requesting user permission", async () => {
    // Mock the notification object to have granted permission
    Object.defineProperty(window, "Notification", {
      value: {
        permission: "granted",
      },
      writable: true,
    });

    // Call function
    await subscribeToPushNotifications(
      mockHandlePopUp,
      mockSetSubscriptionReminders
    );

    // Expect that handlePopUp was called with specific parameters
    expect(mockHandlePopUp).toHaveBeenCalledWith(
      "error",
      "To turn off notifications, please change your settings in your browser!"
    );

    // Expect that setSubscriptionReminders was called with specific parameters
    expect(mockSetSubscriptionReminders).toHaveBeenCalledWith(true);
  });
});
