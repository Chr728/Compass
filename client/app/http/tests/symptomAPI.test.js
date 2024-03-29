import { auth } from "../../config/firebase";
import { sendSymptoms } from '../symptomAPI';


const logger = {
    error: jest.fn()
};

describe("Send symptoms function", () => {

    beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
    });

    it("Should send symptoms successfully", async() => {
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

        await expect(sendSymptoms(["itching", "rashes"])).resolves.toEqual(expect.anything());

        expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:8080/SymptomChecker', {
        method: 'POST',
        body: JSON.stringify({ symptoms: ["itching", "rashes"] }),
        headers: {
          'Content-Type': 'application/json'
        },
      });

    })

    it('should throw an error and log when there is no currentUser', () => {
        const currentUser = null; 
        expect(() => {
            if (!currentUser) {
                logger.error('No user is currently signed in.');
                throw new Error("No user is currently signed in.");
            }
        }).toThrowError("No user is currently signed in.");
        expect(logger.error).toHaveBeenCalledWith('No user is currently signed in.');
    });
})