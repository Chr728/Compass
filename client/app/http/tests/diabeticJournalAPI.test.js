import { auth } from '../../config/firebase';
import { getGlucoseJournal, getGlucoseJournals, createGlucoseJournal, deleteGlucoseJournal, updateGlucoseJournal,getInsulinJournal, getInsulinJournals, createInsulinJournal, deleteInsulinJournal, updateInsulinJournal } 
from '../diabeticJournalAPI';

//test the getGlucoseJournals function
describe('getGlucoseJournals', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should retrieve glucose journals for the user', async () => {
    const mockUserId = '123';
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
      json: jest.fn().mockResolvedValue({}),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const result = await getGlucoseJournals(mockUserId);

    expect(mockFetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/diabetic/glucose/user/${mockUserId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${mockToken}`,
      },
    });
    expect(mockResponse.json).toHaveBeenCalled();
    expect(result).toEqual({});
    });

    it('should throw an error if the user is not signed in', async () => {
      Object.defineProperty(auth, 'currentUser', {
        get: jest.fn().mockReturnValue(null),
      });
    
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({}),
      };
      const mockFetch = jest.fn().mockResolvedValue(mockResponse);
      global.fetch = mockFetch;
  
      await expect(getGlucoseJournals()).rejects.toThrow('No user is currently signed in.');
    });

  it('should throw an error if the glucose journal retrieval fails', async () => {
    const mockUserId = '123';
    const mockToken = 'mockToken';
    const mockCurrentUser = {
      uid: mockUserId,
      getIdToken: jest.fn().mockResolvedValue(mockToken),
    };

    Object.defineProperty(auth, 'currentUser', {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });

    const mockResponse = {
      status: 500,
      statusText: 'Internal Server Error',
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    await expect(getGlucoseJournals(mockUserId)).rejects.toThrow(
      `Failed to retrieve glucose journals for user. HTTP Status: ${mockResponse.status}`
    );
  });
});

//test the getGlucoseJournal function
describe('getGlucoseJournal', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get a user by ID', async () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'johndoe@example.com' };
    const mockToken = 'mockToken';
    const mockCurrentUser = {
      uid: mockUser.id,
      getIdToken: jest.fn().mockResolvedValue(mockToken),
    };

    Object.defineProperty(auth, 'currentUser', {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });

    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const userData = await getGlucoseJournal(mockUser.id);

    expect(mockResponse.json).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/diabetic/glucose/${mockUser.id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
      });
  });

  it('should throw an error if the user is not signed in', async () => {
    Object.defineProperty(auth, 'currentUser', {
      get: jest.fn().mockReturnValue(null),
    });
  
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    await expect(getGlucoseJournal()).rejects.toThrow('No user is currently signed in.');
  });

  it('should throw an error if the request fails', async () => {
    const mockUserId = 1;
    const mockToken = 'mockToken';
    const mockCurrentUser = {
      uid: mockUserId,
      getIdToken: jest.fn().mockResolvedValue(mockToken),
    };
  
    Object.defineProperty(auth, 'currentUser', {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });

    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    global.fetch.mockImplementation(mockFetch);

    await expect(getGlucoseJournal(mockUserId)).rejects.toThrow(
      'Failed to retrieve glucose journal entry 1 for user. HTTP Status: 500'
    );
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/diabetic/glucose/${mockUserId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
      });
  });
});

//test the createGlucoseJournal function
describe('createGlucoseJournal', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a glucose journal entry for the user', async () => {
    const mockUserId = '123';
    const mockGlucoseJournalData = {
      date: '2022-01-01',
      time: '12:00:00',
      glucose: 150,
      height: 70,
      unit: 'kg',
      notes: 'Test glucose journal entry',
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
      json: jest.fn().mockResolvedValue(mockGlucoseJournalData),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const result = await createGlucoseJournal(mockUserId, mockGlucoseJournalData);

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/diabetic/glucose/user/${mockUserId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        body: "\"123\"",
      }
    );
    expect(result).toEqual(mockGlucoseJournalData);
  });

  it('should throw an error if the glucose journal entry creation fails', async () => {
    const mockUserId = '123';
    const mockGlucoseJournalData = {
      date: '2022-01-01',
      time: '12:00:00',
      glucose: 150,
      height: 70,
      unit: 'kg',
      notes: 'Test glucose journal entry',
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
      ok: false,
      status: 500,
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    await expect(createGlucoseJournal(mockUserId, mockGlucoseJournalData)).rejects.toThrow(
      `Failed to create glucose journal entry for user. HTTP Status: ${mockResponse.status}`
    );
  });
});

//test the updateGlucoseJournal function
describe('updateGlucoseJournal', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should update a glucose journal entry for the user', async () => {
    const mockUserId = '123';
    const mockGlucoseJournalId = '456';
    const mockUpdatedGlucoseJournalData = {
      date: '2022-01-01',
      time: '12:00:00',
      glucose: 150,
      height: 70,
      unit: 'kg',
      notes: 'Test glucose journal entry',
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
      json: jest.fn().mockResolvedValue(mockUpdatedGlucoseJournalData),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const result = await updateGlucoseJournal(
      mockUserId,
      mockGlucoseJournalId,
      mockUpdatedGlucoseJournalData
    );

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/diabetic/glucose/${mockUserId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        body: "\"456\"",
      }
    );
    expect(result).toEqual(mockUpdatedGlucoseJournalData);
  });

  it('should throw an error if the glucose journal entry update fails', async () => {
    const mockUserId = '123';
    const mockGlucoseJournalId = '456';
    const mockUpdatedGlucoseJournalData = {
      date: '2022-01-01',
      time: '12:00:00',
      glucose: 150,
      height: 70,
      unit: 'kg',
      notes: 'Test glucose journal entry',
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
      ok: false,
      status: 500,
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    await expect(
      updateGlucoseJournal(mockGlucoseJournalId, mockUpdatedGlucoseJournalData)
    ).rejects.toThrow(
      `Failed to update glucose journal entry ${mockGlucoseJournalId} for user. HTTP Status: ${mockResponse.status}`
    );
  });
});

//test the deleteGlucoseJournal function
describe('deleteGlucoseJournal', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should delete a glucose journal entry for the user', async () => {
    const mockUserId = '123';
    const mockToken = 'mockToken';
    const mockGlucoseJournalId = '1';

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

    const result = await deleteGlucoseJournal(mockGlucoseJournalId);

    expect(mockFetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/diabetic/glucose/${mockGlucoseJournalId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${mockToken}`,
      },
    });
    expect(result).toEqual({ message: 'glucose journal entry deleted successfully' });
  });

  it('should throw an error if the glucose journal entry deletion fails', async () => {
    const mockUserId = '123';
    const mockToken = 'mockToken';
    const mockGlucoseJournalId = '1';
  
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
  
    await expect(deleteGlucoseJournal(mockGlucoseJournalId)).rejects.toThrow(
      `Failed to delete glucose journal entry. HTTP Status: ${mockErrorResponse.status}`
    );
  });
});