import { subscribeToPushNotifications } from "./pushNotificationService"; // Update this path to your notification file
describe("subscribeToPushNotifications", () => {
  let mockHandlePopUp;
  let mockSetSubscriptionReminders;

  beforeEach(() => {
    mockHandlePopUp = jest.fn();
    mockSetSubscriptionReminders = jest.fn();

    const mockController = {
      postMessage: jest.fn(), // Mock the postMessage method
    };

    const mockServiceWorker = {
      controller: mockController,
    };

    const mockRegistration = {
      active: mockServiceWorker,
    };

    Object.defineProperty(window.navigator, "serviceWorker", {
      value: {
        ready: Promise.resolve(),
        getRegistration: jest.fn().mockResolvedValue(mockRegistration), // Mock the getRegistration method
        controller: mockController, // Ensure the controller is available directly in navigator.serviceWorker
      },
      writable: true,
    });
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should handle notification subscription when permission is granted and serviceWorker is available", async () => {
    const mockController = {
      postMessage: jest.fn(), // Mock the postMessage method
    };

    const mockServiceWorker = {
      controller: mockController,
    };

    const mockRegistration = {
      active: mockServiceWorker,
    };

    Object.defineProperty(window, "Notification", {
      value: {
        permission: "default",
        requestPermission: jest.fn().mockImplementation(() => {
          return Promise.resolve("granted"); // Change the resolved value as needed
        }),
      },
      writable: true,
    });

    await subscribeToPushNotifications(
      mockHandlePopUp,
      mockSetSubscriptionReminders
    );

    expect(mockHandlePopUp).toHaveBeenCalledWith(
      "success",
      "Notification subscription created!"
    );
  });

  it("should handle notification permission denied and unsubscribe when permission is denied", async () => {
    const mockController = {
      postMessage: jest.fn(), // Mock the postMessage method
    };

    const mockServiceWorker = {
      controller: mockController,
    };

    const mockRegistration = {
      active: mockServiceWorker,
    };

    Object.defineProperty(window, "Notification", {
      value: {
        permission: "default",
        requestPermission: jest.fn().mockImplementation(() => {
          return Promise.resolve("denied"); // Change the resolved value as needed
        }),
      },
      writable: true,
    });

    Object.defineProperty(window.navigator, "serviceWorker", {
      value: {
        ready: Promise.resolve(),
        getRegistration: jest.fn().mockResolvedValue(mockRegistration), // Mock the getRegistration method
      },
      writable: true,
    });

    await subscribeToPushNotifications(
      mockHandlePopUp,
      mockSetSubscriptionReminders
    );

    expect(mockHandlePopUp).toHaveBeenCalledWith(
      "error",
      "Notification permission denied, please reset permissions in your browser if you want to enable the feature!"
    );
    expect(mockSetSubscriptionReminders).toHaveBeenCalledWith(false);
  });
});
