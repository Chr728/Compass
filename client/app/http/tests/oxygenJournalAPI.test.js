import { auth } from "../../config/firebase";
import {
	createO2SaturationJournal,
	deleteO2SaturationJournal,
	getO2SaturationJournal,
	getO2SaturationJournals,
	updateO2SaturationJournal,
} from "../oxygenJournalAPI";

//test the getO2SaturationJournals function
describe("getO2SaturationJournals", () => {
	beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should retrieve oxygen journals for the user", async () => {
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

		const result = await getO2SaturationJournals(mockUserId);

		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/o2Saturation/user/${mockUserId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${mockToken}`,
				},
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

		await expect(getO2SaturationJournals()).rejects.toThrow(
			"No user is currently signed in."
		);
	});

	it("should throw an error if the oxygen journal retrieval fails", async () => {
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
			status: 500,
			statusText: "Internal Server Error",
		};
		const mockFetch = jest.fn().mockResolvedValue(mockResponse);
		global.fetch = mockFetch;

		await expect(getO2SaturationJournals(mockUserId)).rejects.toThrow(
			`Failed to retrieve oxygen journals for user. HTTP Status: ${mockResponse.status}`
		);
	});
});

//test the getO2SaturationJournal function
describe("getO2SaturationJournal", () => {
	beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should get a user by ID", async () => {
		const mockUser = {
			id: 1,
			name: "John Doe",
			email: "johndoe@example.com",
		};
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

		const userData = await getO2SaturationJournal(mockUser.id);

		expect(mockResponse.json).toHaveBeenCalled();
		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/o2Saturation/${mockUser.id}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${mockToken}`,
				},
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

		await expect(getO2SaturationJournal()).rejects.toThrow(
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

		const mockFetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 500,
		});
		global.fetch.mockImplementation(mockFetch);

		await expect(getO2SaturationJournal(mockUserId)).rejects.toThrow(
			"Failed to retrieve oxygen journal entry 1 for user. HTTP Status: 500"
		);
		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/o2Saturation/${mockUserId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${mockToken}`,
				},
			}
		);
	});
});

//test the createO2SaturationJournal function
describe("createO2SaturationJournal", () => {
	beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should create a oxygen journal entry for the user", async () => {
		const mockUserId = "123";
		const mockOxygenJournalData = {
			date: "2022-01-01",
			time: "12:00:00",
			o2sat: 98,
			pulse: 90,
			activitylevel: "at rest",
			notes: "Test oxygen journal entry",
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
			json: jest.fn().mockResolvedValue(mockOxygenJournalData),
		};
		const mockFetch = jest.fn().mockResolvedValue(mockResponse);
		global.fetch = mockFetch;

		const result = await createO2SaturationJournal(
			mockUserId,
			mockOxygenJournalData
		);

		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/o2Saturation/user/${mockUserId}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${mockToken}`,
				},
				body: '"123"',
			}
		);
		expect(result).toEqual(mockOxygenJournalData);
	});

	it("should throw an error if the oxygen journal entry creation fails", async () => {
		const mockUserId = "123";
		const mockOxygenJournalData = {
			date: "2022-01-01",
			time: "12:00:00",
			o2sat: 98,
			pulse: 90,
			activitylevel: "at rest",
			notes: "Test oxygen journal entry",
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
			createO2SaturationJournal(mockUserId, mockOxygenJournalData)
		).rejects.toThrow(
			`Failed to create oxygen journal entry for user. HTTP Status: ${mockResponse.status}`
		);
	});
});

//test the updateO2SaturationJournal function
describe("updateO2SaturationJournal", () => {
	beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should update a oxygen journal entry for the user", async () => {
		const mockUserId = "123";
		const mockOxygenJournalId = "456";
		const mockUpdatedOxygenJournalData = {
			date: "2022-01-01",
			time: "12:00:00",
			o2sat: 98,
			pulse: 90,
			activitylevel: "at rest",
			notes: "Test oxygen journal entry",
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
			json: jest.fn().mockResolvedValue(mockUpdatedOxygenJournalData),
		};
		const mockFetch = jest.fn().mockResolvedValue(mockResponse);
		global.fetch = mockFetch;

		const result = await updateO2SaturationJournal(
			mockUserId,
			mockOxygenJournalId,
			mockUpdatedOxygenJournalData
		);

		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/o2Saturation/${mockUserId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${mockToken}`,
				},
				body: '"456"',
			}
		);
		expect(result).toEqual(mockUpdatedOxygenJournalData);
	});

	it("should throw an error if the oxygen journal entry update fails", async () => {
		const mockUserId = "123";
		const mockOxygenJournalId = "456";
		const mockUpdatedOxygenJournalData = {
			date: "2022-01-01",
			time: "12:00:00",
			o2sat: 98,
			pulse: 90,
			activitylevel: "At rest",
			notes: "Test oxygen journal entry",
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
			updateO2SaturationJournal(
				mockOxygenJournalId,
				mockUpdatedOxygenJournalData
			)
		).rejects.toThrow(
			`Failed to update oxygen journal entry ${mockOxygenJournalId} for user. HTTP Status: ${mockResponse.status}`
		);
	});
});

//test the deleteO2SaturationJournal function
describe("deleteO2SaturationJournal", () => {
	beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should delete a oxygen journal entry for the user", async () => {
		const mockUserId = "123";
		const mockToken = "mockToken";
		const mockOxygenJournalId = "1";

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

		const result = await deleteO2SaturationJournal(mockOxygenJournalId);

		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/o2Saturation/${mockOxygenJournalId}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${mockToken}`,
				},
			}
		);
		expect(result).toEqual({
			message: "Oxygen journal entry deleted successfully",
		});
	});

	it("should throw an error if the oxygen journal entry deletion fails", async () => {
		const mockUserId = "123";
		const mockToken = "mockToken";
		const mockOxygenJournalId = "1";

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

		await expect(
			deleteO2SaturationJournal(mockOxygenJournalId)
		).rejects.toThrow(
			`Failed to delete oxygen journal entry. HTTP Status: ${mockErrorResponse.status}`
		);
	});
});
