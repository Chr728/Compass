import { auth } from "../../config/firebase";
import { sendUserReminders } from "../remindersAPI";

//test the sendUserReminders function
describe("sendUserReminders", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should prepare reminders for the user", async () => {
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
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const result = await sendUserReminders();

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reminders/${mockUserId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
          "Access-Control-Allow-Origin": "*",
        },
        mode:"cors",
        credentials:"include",
      }
    );
    expect(mockResponse.json).toHaveBeenCalled();
    expect(result).toEqual({});
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

    await expect(sendUserReminders()).rejects.toThrow(
      "No user is currently signed in."
    );
  });

  it("should throw an error if the send reminder function fails", async () => {
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

    await expect(sendUserReminders()).rejects.toThrow(
      `Failed to create reminder for user. HTTP Status: ${mockResponse.status}`
    );
  });
});
