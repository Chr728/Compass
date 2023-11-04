import { auth } from "../../config/firebase";
import {
  createSubscription,
  getSubscription,
  updateSubscription,
  deleteSubscription,
} from "../subscriptionAPI";

//test the createSubscription function
describe("createSubscription", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should create a subscription object for the user", async () => {
    const mockUserId = "123";
    const mockUserSubscription = {
      endpoint: "test",
      keys: {
        auth: "test",
        p256dh: "test",
      },
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
      json: jest.fn().mockResolvedValue(mockUserSubscription),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const result = await createSubscription(
      mockUserId,
      mockToken,
      mockUserSubscription
    );

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/subscription/${mockUserId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: '{"subscription":{"endpoint":"test","keys":{"auth":"test","p256dh":"test"}}}',
      }
    );
    expect(mockResponse.json).toHaveBeenCalled();
    expect(result).toEqual(mockUserSubscription);
  });

  it("should throw an error if the createSubscription function fails", async () => {
    const mockUserId = "123";
    const mockUserSubscription = {
      endpoint: "test",
      keys: {
        auth: "test",
        p256dh: "test",
      },
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

    await expect(
      createSubscription(mockUserId, mockToken, mockUserSubscription)
    ).rejects.toThrow(
      `Failed to create subscription object for user. HTTP Status: ${mockResponse.status}`
    );
  });
});

//test the getSubscription function
describe("getSubscription", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should get a subscription object by ID", async () => {
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

    const result = await getSubscription(mockUserId, mockToken);

    expect(mockResponse.json).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/subscription/${mockUserId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        method: "GET",
      }
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

    await expect(getSubscription(mockUserId, mockToken)).rejects.toThrow(
      `Failed to retrieve subscription object for user. HTTP Status: ${mockResponse.status}`
    );
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/subscription/${mockUserId}`,
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

//test the sendUserReminders function
describe("updateSubscription", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should update a subscription object for the user", async () => {
    const mockUserId = "123";
    const mockUserSubscription = {
      endpoint: "test",
      keys: {
        auth: "test",
        p256dh: "test",
      },
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
      json: jest.fn().mockResolvedValue(mockUserSubscription),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const result = await updateSubscription(
      mockUserId,
      mockToken,
      mockUserSubscription
    );

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/subscription/${mockUserId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: '{"subscription":{"endpoint":"test","keys":{"auth":"test","p256dh":"test"}}}',
      }
    );
    expect(mockResponse.json).toHaveBeenCalled();
    expect(result).toEqual(mockUserSubscription);
  });

  it("should throw an error if the updateSubscription function fails", async () => {
    const mockUserId = "123";
    const mockUserSubscription = {
      endpoint: "test",
      keys: {
        auth: "test",
        p256dh: "test",
      },
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

    await expect(
      updateSubscription(mockUserId, mockToken, mockUserSubscription)
    ).rejects.toThrow(
      `Failed to update subscription object for user. HTTP Status: ${mockResponse.status}`
    );
  });
});

//test the deleteSubscription function
describe("deleteSubscription", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should delete the subscription object of the user", async () => {
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

    const result = await deleteSubscription(mockUserId, mockToken);

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/subscription/${mockUserId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      }
    );
    expect(mockResponse.json).toHaveBeenCalled();
    expect(result).toEqual({
      message: "Subscription object deleted successfully",
    });
  });

  it("should throw an error if the deleteSubscription function fails", async () => {
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

    await expect(deleteSubscription(mockUserId, mockToken)).rejects.toThrow(
      `Failed to delete subscription object for user. HTTP Status: ${mockResponse.status}`
    );
  });
});
