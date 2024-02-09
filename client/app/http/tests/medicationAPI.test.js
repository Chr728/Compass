import { auth } from "../../config/firebase";
import {
	createMedication,
	deleteMedication,
	getMedication,
	getMedications,
	updateMedication,
	uploadMedicationImage,
} from "../medicationAPI";

//test the getMedications function
describe("getMedications", () => {
	beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should fetch medications for the user", async () => {
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

		const result = await getMedications(mockUserId);

		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/medication/user/${mockUserId}`,
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

		await expect(getMedications()).rejects.toThrow(
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

		await expect(getMedications()).rejects.toThrow(
			"Failed to retrieve Medications for user"
		);
	});
});

//test the getMedication function
describe("getMedication", () => {
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

		const userData = await getMedication(mockUser.id);

		expect(mockResponse.json).toHaveBeenCalled();
		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/medication/${mockUser.id}`,
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

		await expect(getMedication()).rejects.toThrow(
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

		await expect(getMedication(mockUserId)).rejects.toThrow(
			"Failed to retrieve Medication entry data"
		);
		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/medication/${mockUserId}`,
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

//test the createMedication function
describe("createMedication", () => {
	beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should create an medication entry for the user", async () => {
		const mockUserId = "123";
		const mockMedicationData = {
			medicationName: "asaphin",
			dateStarted: "2022-01-01",
			time: "12:00:00",
			dosage: 70,
			unit: "milligram (mg)",
			frequency: "Every 8 hours",
			route: "Oral",
			notes: "Test medication entry",
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
			json: jest.fn().mockResolvedValue(mockMedicationData),
		};
		const mockFetch = jest.fn().mockResolvedValue(mockResponse);
		global.fetch = mockFetch;

		const result = await createMedication(mockUserId, mockMedicationData);

		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/medication/user/${mockUserId}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${mockToken}`,
				},
				body: '"123"',
			}
		);
		expect(result).toEqual(mockMedicationData);
	});

	it("should throw an error if the medication entry creation fails", async () => {
		const mockUserId = "123";
		const mockMedicationData = {
			medicationName: "asaphin",
			dateStarted: "2022-01-01",
			time: "12:00:00",
			dosage: 70,
			unit: "milligram (mg)",
			frequency: "Every 8 hours",
			route: "Oral",
			notes: "Test medication entry",
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
			createMedication(mockUserId, mockMedicationData)
		).rejects.toThrow(`Failed to create Medication entry for user`);
	});
});

describe("uploadMedicationImage", () => {
	beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should upload medication image successfully", async () => {
		const medicationId = "123";
		const imageFile = new File(["file contents"], "image.jpg", {
			type: "image/jpeg",
		});
		const mockToken = "mockToken";
		const mockCurrentUser = {
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

		await uploadMedicationImage(medicationId, imageFile);

		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/medication/uploadImage/${medicationId}`,
			{
				method: "PUT",
				headers: {
					Authorization: `Bearer ${mockToken}`,
				},
				body: expect.any(FormData),
			}
		);
	});

	it("should throw an error if the user is not signed in", async () => {
		Object.defineProperty(auth, "currentUser", {
			get: jest.fn().mockReturnValue(null),
		});

		await expect(
			uploadMedicationImage(
				"123",
				new File(["file contents"], "image.jpg", { type: "image/jpeg" })
			)
		).rejects.toThrow("No user is currently signed in.");
	});

	it("should throw an error if the upload fails", async () => {
		const medicationId = "123";
		const imageFile = new File(["file contents"], "image.jpg", {
			type: "image/jpeg",
		});
		const mockToken = "mockToken";
		const mockCurrentUser = {
			getIdToken: jest.fn().mockResolvedValue(mockToken),
		};

		Object.defineProperty(auth, "currentUser", {
			get: jest.fn().mockReturnValue(mockCurrentUser),
		});

		const mockFetch = jest.fn().mockResolvedValue({
			ok: false,
			status: 500,
		});
		global.fetch = mockFetch;

		await expect(
			uploadMedicationImage(medicationId, imageFile)
		).rejects.toThrow(
			"Failed to upload Medication image. HTTP Status: 500"
		);
	});
});

//test the updateMedication function
describe("updateMedication", () => {
	beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should update a medication entry for the user", async () => {
		const mockUserId = "123";
		const mockMedicationId = "456";
		const mockUpdatedMedicationData = {
			medicationName: "asaphin",
			dateStarted: "2022-01-01",
			time: "12:00:00",
			dosage: 70,
			unit: "milligram (mg)",
			frequency: "Every 8 hours",
			route: "Oral",
			notes: "Test medication entry",
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
			json: jest.fn().mockResolvedValue(mockUpdatedMedicationData),
		};
		const mockFetch = jest.fn().mockResolvedValue(mockResponse);
		global.fetch = mockFetch;

		const result = await updateMedication(
			mockUserId,
			mockMedicationId,
			mockUpdatedMedicationData
		);

		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/medication/${mockUserId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${mockToken}`,
				},
				body: '"456"',
			}
		);
		expect(result).toEqual(mockUpdatedMedicationData);
	});

	it("should throw an error if the medication entry update fails", async () => {
		const mockUserId = "123";
		const mockMedicationId = "456";
		const mockUpdatedMedicationData = {
			medicationName: "asaphin",
			dateStarted: "2022-01-01",
			time: "12:00:00",
			dosage: 70,
			unit: "milligram (mg)",
			frequency: "Every 8 hours",
			route: "Oral",
			notes: "Test medication entry",
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
			updateMedication(mockMedicationId, mockUpdatedMedicationData)
		).rejects.toThrow(`Failed to update Medication entry for user`);
	});
});

//test the deleteMedication function
describe("deleteMedication", () => {
	beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should delete a medication entry for the user", async () => {
		const mockUserId = "123";
		const mockToken = "mockToken";
		const mockMedicationId = "1";

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

		const result = await deleteMedication(mockMedicationId);

		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/medication/${mockMedicationId}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${mockToken}`,
				},
			}
		);
		expect(result).toEqual({
			message: "Medication entry deleted successfully",
		});
	});

	it("should throw an error if the medication entry deletion fails", async () => {
		const mockUserId = "123";
		const mockToken = "mockToken";
		const mockMedicationId = "1";

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

		await expect(deleteMedication(mockMedicationId)).rejects.toThrow(
			`Failed to delete Medication entry`
		);
	});
});
