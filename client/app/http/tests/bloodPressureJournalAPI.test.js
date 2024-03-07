import { auth } from '../../config/firebase';
import { getBloodPressureJournals, createBloodPressureJournal, getBloodPressureJournal, deleteBloodPressureJournalEntry, updateBloodPressureJournal} from '../bloodPressureJournalAPI.ts';


describe("getBloodPressureJournals", () => {

    beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

    it("should fetch blood pressure journals for the user", async () => {
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

		const result = await getBloodPressureJournals(mockUserId);

		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/bloodPressure/user/${mockUserId}`,
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

		await expect(getBloodPressureJournals()).rejects.toThrow(
			"No user is currently signed in."
		);
	});

    it("should throw an error if the fetch request fails", async () => {
		const mockUserId = "123";
		const mockToken = "mockToken";
		const mockCurrentUser = {
			uid: mockUserId,
			getIdToken: jest.fn().mockResolvedValue(mockToken),
		};

		Object.defineProperty(auth, "currentUser", {
			get: jest.fn().mockReturnValue(mockCurrentUser),
		});

		const mockErrorResponse = {
			ok: false,
		};
		const mockErrorFetch = jest.fn().mockResolvedValue(mockErrorResponse);
		global.fetch = mockErrorFetch;

		await expect(getBloodPressureJournals()).rejects.toThrow(
			"Failed to retrieve blood pressure journals for user"
		);
	});

})


describe("getBloodPressureJournal", () => {

    beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

    it("Should get a user by ID", async () => {
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

		const userData = await getBloodPressureJournal(mockUser.id);

		expect(mockResponse.json).toHaveBeenCalled();
		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/bloodPressure/${mockUser.id}`,
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

		await expect(getBloodPressureJournal()).rejects.toThrow(
			"No user is currently signed in."
		);
	});

    it("Should throw an error if the request fails", async () => {
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

		await expect(getBloodPressureJournal(mockUserId)).rejects.toThrow(
			"Failed to retrieve blood pressure journal entry"
		);
		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/bloodPressure/${mockUserId}`,
			{
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${mockToken}`,
				},
				method: "GET",
			}
		);
	});

})

describe("createBloodPressureJournal", () => {

    beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

    it("Should create a blood pressure journal entry for the user", async () => {
		const mockUserId = "123";
		const mockBloodPressureJournalData = {
			date: "2022-01-01",
			time: "12:00:00",
			bloodPressure: "120/80",
            systolic: 0,
            diastolic: 0,
			pulse: 30,
			notes: "Test blood pressure journal entry",
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
			json: jest.fn().mockResolvedValue(mockBloodPressureJournalData),
		};
		const mockFetch = jest.fn().mockResolvedValue(mockResponse);
		global.fetch = mockFetch;

		const result = await createBloodPressureJournal(
			mockUserId,
			mockBloodPressureJournalData
		);

		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/bloodPressure/user/${mockUserId}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${mockToken}`,
				},
				body: '"123"',
			}
		);
		expect(result).toEqual(mockBloodPressureJournalData);
	});

    it("should throw an error if the blood pressure journal entry creation fails", async () => {
		const mockUserId = "123";
		const mockBloodPressureJournalData = {
			date: "2022-01-01",
			time: "12:00:00",
			bloodPressure: "120/80",
            systolic: 0,
            diastolic: 0,
			pulse: 30,
			notes: "Test blood pressure journal entry",
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
			createBloodPressureJournal(mockUserId, mockBloodPressureJournalData)
		).rejects.toThrow(`Failed to create blood pressure journal for user`);
	});
})

describe("updateBloodPressureJournal", () => {

    beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

    it("should update a blood pressure journal entry for the user", async () => {
		const mockUserId = "123";
		const mockBloodPressureJournalId = "456";
		const mockUpdatedBloodPressureJournalData = {
			date: "2022-01-01",
			time: "12:00:00",
			bloodPressure: "120/80",
            systolic: 0,
            diastolic: 0,
			pulse: 30,
			notes: "Test blood pressure journal entry",
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
			json: jest.fn().mockResolvedValue(mockUpdatedBloodPressureJournalData),
		};
		const mockFetch = jest.fn().mockResolvedValue(mockResponse);
		global.fetch = mockFetch;

		const result = await updateBloodPressureJournal(
			mockUserId,
			mockBloodPressureJournalId,
			mockUpdatedBloodPressureJournalData
		);

		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/bloodPressure/${mockUserId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${mockToken}`,
				},
				body: '"456"',
			}
		);
		expect(result).toEqual(mockUpdatedBloodPressureJournalData);
	});

    it("should throw an error if the blood pressure journal entry update fails", async () => {
		const mockUserId = "123";
		const mockBloodPressureJournalId = "456";
		const mockUpdatedBloodPressureJournalData = {
			date: "2022-01-01",
			time: "12:00:00",
			bloodPressure: "120/80",
            systolic: 0,
            diastolic: 0,
			pulse: 30,
			notes: "Test blood pressure journal entry",
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
			updateBloodPressureJournal(
				mockBloodPressureJournalId,
				mockUpdatedBloodPressureJournalData
			)
		).rejects.toThrow(`Failed to update blood pressure journal entry`);
	});
})

describe("deleteBloodPressureJournalEntry", () => {

    beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

    it("should delete a blood pressure journal entry for the user", async () => {
		const mockUserId = "123";
		const mockToken = "mockToken";
		const mockBloodPressureJournalId = "1";

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

		const result = await deleteBloodPressureJournalEntry(mockBloodPressureJournalId);

		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/bloodPressure/${mockBloodPressureJournalId}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${mockToken}`,
				},
			}
		);
		expect(result).toEqual({
			message: "Blood pressure entry deleted successfully",
		});
	});

    it("should throw an error if the blood pressure journal entry deletion fails", async () => {
		const mockUserId = "123";
		const mockToken = "mockToken";
		const mockBloodPressureJournalId = "1";

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
			deleteBloodPressureJournalEntry(mockBloodPressureJournalId)
		).rejects.toThrow(/Failed to delete the entry./i);
	});

})