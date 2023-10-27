import { create } from "domain";
import { auth } from "../../config/firebase";
import {
  createNotificationPreference,
  getNotificationPreference,
  updateNotificationPreference,
  deleteNotificationPreference,
} from "../notificationPreferenceAPI";

//test the createNotificationPreference function
describe("createNotificationPreference", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should create a notification preference for the user", async () => {
    const mockUserId = "123";
    const mockNotificationPreferenceData = {
      uid: mockUserId,
      activityReminders: true,
      medicationReminders: true,
      appointmentReminders: true,
      foodIntakeReminders: true,
    };

    const mockToken = "mockToken";
    const mockCurrentUser = {
      uid: mockUserId,
      getIdToken: jest.fn().mockResolvedValue(mockToken),
    };

    Object.defineProperty(auth, "currentUser", {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });

    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(mockNotificationPreferenceData),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const result = await createNotificationPreference();

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${mockUserId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify(mockNotificationPreferenceData),
      }
    );
    expect(result).toEqual(mockNotificationPreferenceData);
  });

  it("should throw an error if the activity journal entry creation fails", async () => {
    const mockUserId = "123";
    const mockToken = "mockToken";
    const mockCurrentUser = {
      uid: mockUserId,
      getIdToken: jest.fn().mockResolvedValue(mockToken),
    };

    Object.defineProperty(auth, "currentUser", {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });

    const mockResponse = {
      ok: false,
      status: 500,
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    await expect(createNotificationPreference()).rejects.toThrow(
      `Failed to create notification preference for user. HTTP Status: ${mockResponse.status}`
    );
  });
});

//test the getNotificationPreference function
describe("getNotificationPreference", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should get a notificationPreference by ID", async () => {
    const mockUser = "123";
    const mockToken = "mockToken";
    const mockCurrentUser = {
      uid: mockUser.id,
      getIdToken: jest.fn().mockResolvedValue(mockToken),
    };

    Object.defineProperty(auth, "currentUser", {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });

    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const result = await getNotificationPreference();

    expect(mockResponse.json).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${mockUser.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        method: "GET",
      }
    );
  });

  it("should throw an error if the user is not signed in", async () => {
    Object.defineProperty(auth, "currentUser", {
      get: jest.fn().mockReturnValue(null),
    });

    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    await expect(getNotificationPreference()).rejects.toThrow(
      "No user is currently signed in."
    );
  });

  it("should throw an error if the request fails", async () => {
    const mockUserId = 1;
    const mockToken = "mockToken";
    const mockCurrentUser = {
      uid: mockUserId,
      getIdToken: jest.fn().mockResolvedValue(mockToken),
    };

    Object.defineProperty(auth, "currentUser", {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });

    const mockResponse = {
      ok: false,
      status: 500,
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    await expect(getNotificationPreference()).rejects.toThrow(
      `Failed to retrieve notification preferences for user. HTTP Status: ${mockResponse.status}`
    );
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${mockUserId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        method: "GET",
      }
    );
  });
});

//test the updateNotificationPreference function
describe("updateNotificationPreference", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should update the notification preference for the user", async () => {
    const mockUserId = "123";
    const mockNotificationPreferenceData = {
      activityReminders: true,
      medicationReminders: true,
      appointmentReminders: true,
      foodIntakeReminders: true,
    };

    const mockToken = "mockToken";
    const mockCurrentUser = {
      uid: mockUserId,
      getIdToken: jest.fn().mockResolvedValue(mockToken),
    };

    Object.defineProperty(auth, "currentUser", {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });

    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(mockNotificationPreferenceData),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const result = await updateNotificationPreference(
      mockNotificationPreferenceData
    );

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${mockUserId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify(mockNotificationPreferenceData),
      }
    );
    expect(result).toEqual(mockNotificationPreferenceData);
  });

  it("should throw an error if the notification preference update fails", async () => {
    const mockUserId = "123";

    const mockNotificationPreferenceData = {
      activityReminders: true,
      medicationReminders: true,
      appointmentReminders: true,
      foodIntakeReminders: true,
    };
    const mockToken = "mockToken";
    const mockCurrentUser = {
      uid: mockUserId,
      getIdToken: jest.fn().mockResolvedValue(mockToken),
    };

    Object.defineProperty(auth, "currentUser", {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });

    const mockResponse = {
      ok: false,
      status: 500,
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    await expect(updateNotificationPreference()).rejects.toThrow(
      `Failed to update notification preference for user ${mockUserId}. HTTP Status: ${mockResponse.status}`
    );
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${mockUserId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        method: "PUT",
      }
    );
  });
});

//test the deleteNotificationPreference function
describe("deleteNotificationPreference", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should delete the notification preference for the user", async () => {
    const mockUserId = "123";
    const mockToken = "mockToken";

    const mockCurrentUser = {
      uid: mockUserId,
      getIdToken: jest.fn().mockResolvedValue(mockToken),
    };

    const mockResponse = {
      ok: true,
      status: 204,
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    Object.defineProperty(auth, "currentUser", {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });

    const result = await deleteNotificationPreference(mockUserId);

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${mockUserId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      }
    );
    expect(result).toEqual({
      message: "Notification preference deleted successfully",
    });
  });

  it("should throw an error if the notification preference deletion fails", async () => {
    const mockUserId = "123";
    const mockToken = "mockToken";

    const mockCurrentUser = {
      uid: mockUserId,
      getIdToken: jest.fn().mockResolvedValue(mockToken),
    };

    const mockResponse = {
      ok: false,
      status: 204,
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockResponse));

    Object.defineProperty(auth, "currentUser", {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });

    const mockErrorResponse = {
      ok: false,
      status: 500,
    };
    const mockErrorFetch = jest.fn().mockResolvedValue(mockErrorResponse);
    global.fetch = mockErrorFetch;

    await expect(deleteNotificationPreference(mockUserId)).rejects.toThrow(
      `Failed to delete notification preference for user ${mockUserId}. HTTP Status: ${mockErrorResponse.status}`
    );
  });
});
