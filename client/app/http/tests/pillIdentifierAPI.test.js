import { auth } from "../../config/firebase";
import { sendImage } from '../pillIdentifierAPI';

describe("Pill API", () => {
    beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
    });
    
    it("should send an image successfully", async () => {
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
        
        const mockImage = new File(['imageData'], 'image.jpg', { type: 'image/jpeg' });
        const formData = new FormData();
        formData.append('file', mockImage);

        await expect(sendImage(mockImage)).resolves.toEqual(expect.anything());

        expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:8080/PillAI', {
          method: 'POST',
          body: formData,
        });
	
    })
})