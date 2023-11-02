import { auth } from "../../config/firebase";
import {
  createSubscription,
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
      uid: "test",
      subscription: {
        endpoint: "test",
        keys: "test",
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

    const result = await createSubscription(mockUserSubscription);

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/subscription/${mockUserId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: '{"uid":"test","subscription":{"endpoint":"test","keys":"test"}}',
      }
    );
    expect(mockResponse.json).toHaveBeenCalled();
    expect(result).toEqual(mockUserSubscription);
  });

  it("should throw an error if the createSubscription function fails", async () => {
    const mockUserId = "123";
    const mockUserSubscription = {
      uid: "test",
      subscription: {
        endpoint: "test",
        keys: "test",
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

    await expect(createSubscription(mockUserSubscription)).rejects.toThrow(
      `Failed to create subscription object for user. HTTP Status: ${mockResponse.status}`
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
      uid: "test",
      subscription: {
        endpoint: "test",
        keys: "test",
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

    const result = await updateSubscription(mockUserSubscription);

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/subscription/${mockUserId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: '{"uid":"test","subscription":{"endpoint":"test","keys":"test"}}',
      }
    );
    expect(mockResponse.json).toHaveBeenCalled();
    expect(result).toEqual(mockUserSubscription);
  });

  it("should throw an error if the updateSubscription function fails", async () => {
    const mockUserId = "123";
    const mockUserSubscription = {
      uid: "test",
      subscription: {
        endpoint: "test",
        keys: "test",
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

    await expect(updateSubscription(mockUserSubscription)).rejects.toThrow(
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

    const result = await deleteSubscription();

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

    await expect(deleteSubscription()).rejects.toThrow(
      `Failed to delete subscription object for user. HTTP Status: ${mockResponse.status}`
    );
  });
});
