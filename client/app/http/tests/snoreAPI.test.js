import { get } from "express/lib/response";
import { auth } from "../../config/firebase";
import { createAudioEntry, deleteAudioEntry, getAudioEntries, getAudioEntry, sendAudio } from '../snoreAPI'

describe("Send API file function", () => {

    beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
    });


    it("should send an audio successfully when uploaded", async () => {
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
        
        const mockAudio = new File(['Audio Data'], 'recording.wav', { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('file', mockAudio);

        await expect(sendAudio(mockAudio)).resolves.toEqual(expect.anything());

        expect(global.fetch).toHaveBeenCalledWith('http://127.0.0.1:8080/SnoringAI', {
          method: 'POST',
          body: formData,
        });
	})


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

		await expect(getAudioEntries()).rejects.toThrow(
			"No user is currently signed in."
		);
	});
    
})


describe("Funtion to fetch the audio list", () => {
    beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
    });


    it("should fetch audio list for the user", async () => {
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

		const result = await getAudioEntries(mockUserId);

		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/snoringAI/user/${mockUserId}`,
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

		await expect(getAudioEntries()).rejects.toThrow(
			"No user is currently signed in."
		);
	});
})

describe("Function to fetch a single audio entry", () => {
     
    beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
    });

   
    it("should fetch an audio entry", async () => {
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

		const userData = await getAudioEntry(mockUser.id);

		expect(mockResponse.json).toHaveBeenCalled();
		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/snoringAI/${mockUser.id}`,
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

		await expect(getAudioEntry()).rejects.toThrow(
			"No user is currently signed in."
		);
	});
})

describe("Function to create an audio entry", () =>{
  
    beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
    });

    it('should create an audio entry for the user', async () => {
        const mockUserId = '123';
        const mockAudioEntryData = {
          date: '2022-01-01',
          filename: 'blob',
          result: 'Snoring Detected'
        };
    
        const mockToken = 'mockToken';
        const mockCurrentUser = {
          uid: mockUserId,
          getIdToken: jest.fn().mockResolvedValue(mockToken),
        };
    
        Object.defineProperty(auth, 'currentUser', {
          get: jest.fn().mockReturnValue(mockCurrentUser),
        });
    
        const mockResponse = {
          ok: true,
          json: jest.fn().mockResolvedValue(mockAudioEntryData),
        };
        const mockFetch = jest.fn().mockResolvedValue(mockResponse);
        global.fetch = mockFetch;
    
        const result = await createAudioEntry(mockUserId, mockAudioEntryData);
    
        expect(mockFetch).toHaveBeenCalledWith(
          `${process.env.NEXT_PUBLIC_API_URL}/api/snoringAI/user/${mockUserId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${mockToken}`,
            },
            body: "\"123\"",
          }
        );
        expect(result).toEqual(mockAudioEntryData);
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

		await expect(createAudioEntry()).rejects.toThrow(
			"No user is currently signed in."
		);
	});
})

describe("Function to delete an audio entry", () => {

    beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
    });

    it('should delete an audio entry for the user', async () => {
        const mockUserId = '123';
        const mockToken = 'mockToken';
        const mockAudioEntryID = '1';
    
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
    
        Object.defineProperty(auth, 'currentUser', {
          get: jest.fn().mockReturnValue(mockCurrentUser),
        });
    
        const result = await deleteAudioEntry(mockAudioEntryID);
    
        expect(mockFetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/snoringAI/${mockAudioEntryID}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        });
        expect(result).toEqual({"message": "Audio entry deleted successfully"});
      });

      it('should throw an error if the audio entry deletion fails', async () => {
        const mockUserId = '123';
        const mockToken = 'mockToken';
        const mockAudioEntryID = '1';
      
        const mockCurrentUser = {
          uid: mockUserId,
          getIdToken: jest.fn().mockResolvedValue(mockToken),
        };
      
        const mockResponse = {
          ok: false,
          status: 204,
        };
        const mockFetch = jest.fn().mockResolvedValue(mockResponse);
        global.fetch = jest.fn().mockImplementation(() => Promise.resolve(mockResponse));
      
        Object.defineProperty(auth, 'currentUser', {
          get: jest.fn().mockReturnValue(mockCurrentUser),
        });
    
        const mockErrorResponse = {
          ok: false,
          status: 500,
        };
        const mockErrorFetch = jest.fn().mockResolvedValue(mockErrorResponse);
        global.fetch = mockErrorFetch;
      
        await expect(deleteAudioEntry(mockAudioEntryID)).rejects.toThrow(
          /Failed to delete the entry/i
        );
      });
})