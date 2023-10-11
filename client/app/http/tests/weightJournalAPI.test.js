import { auth } from '../../config/firebase';
import { getWeightJournal, getWeightJournals, createWeightJournal, deleteWeightJournal, updateWeightJournal } 
from '../weightJournalAPI';

//test the getWeightJournals function
describe('getWeightJournals', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should retrieve weight journals for the user', async () => {
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

    const result = await getWeightJournals(mockUserId);

    expect(mockFetch).toHaveBeenCalledWith(`http://localhost:8000/api/journals/weight/user/${mockUserId}`, {
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
  
      await expect(getWeightJournals()).rejects.toThrow('No user is currently signed in.');
    });

  it('should throw an error if the weight journal retrieval fails', async () => {
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

    await expect(getWeightJournals(mockUserId)).rejects.toThrow(
      `Failed to retrieve weight journals for user. HTTP Status: ${mockResponse.status}`
    );
  });
});

//test the getWeightJournal function
describe('getWeightJournal', () => {
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

    const userData = await getWeightJournal(mockUser.id);

    expect(mockResponse.json).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith(
      `http://localhost:8000/api/journals/weight/${mockUser.id}`,
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

    await expect(getWeightJournal()).rejects.toThrow('No user is currently signed in.');
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

    await expect(getWeightJournal(mockUserId)).rejects.toThrow(
      'Failed to retrieve weight journal entry 1 for user. HTTP Status: 500'
    );
    expect(mockFetch).toHaveBeenCalledWith(
      `http://localhost:8000/api/journals/weight/${mockUserId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
      });
  });
});

//test the createWeightJournal function
describe('createWeightJournal', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a weight journal entry for the user', async () => {
    const mockUserId = '123';
    const mockWeightJournalData = {
      date: '2022-01-01',
      time: '12:00:00',
      weight: 150,
      height: 70,
      unit: 'kg',
      notes: 'Test weight journal entry',
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
      json: jest.fn().mockResolvedValue(mockWeightJournalData),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const result = await createWeightJournal(mockUserId, mockWeightJournalData);

    expect(mockFetch).toHaveBeenCalledWith(
      `http://localhost:8000/api/journals/weight/user/${mockUserId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        body: "\"123\"",
      }
    );
    expect(result).toEqual(mockWeightJournalData);
  });

  it('should throw an error if the weight journal entry creation fails', async () => {
    const mockUserId = '123';
    const mockWeightJournalData = {
      date: '2022-01-01',
      time: '12:00:00',
      weight: 150,
      height: 70,
      unit: 'kg',
      notes: 'Test weight journal entry',
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

    await expect(createWeightJournal(mockUserId, mockWeightJournalData)).rejects.toThrow(
      `Failed to create weight journal entry for user. HTTP Status: ${mockResponse.status}`
    );
  });
});

//test the updateWeightJournal function
describe('updateWeightJournal', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should update a weight journal entry for the user', async () => {
    const mockUserId = '123';
    const mockWeightJournalId = '456';
    const mockUpdatedWeightJournalData = {
      date: '2022-01-01',
      time: '12:00:00',
      weight: 150,
      height: 70,
      unit: 'kg',
      notes: 'Test weight journal entry',
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
      json: jest.fn().mockResolvedValue(mockUpdatedWeightJournalData),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const result = await updateWeightJournal(
      mockUserId,
      mockWeightJournalId,
      mockUpdatedWeightJournalData
    );

    expect(mockFetch).toHaveBeenCalledWith(
      `http://localhost:8000/api/journals/weight/${mockUserId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        body: "\"456\"",
      }
    );
    expect(result).toEqual(mockUpdatedWeightJournalData);
  });

  it('should throw an error if the weight journal entry update fails', async () => {
    const mockUserId = '123';
    const mockWeightJournalId = '456';
    const mockUpdatedWeightJournalData = {
      date: '2022-01-01',
      time: '12:00:00',
      weight: 150,
      height: 70,
      unit: 'kg',
      notes: 'Test weight journal entry',
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
      updateWeightJournal(mockWeightJournalId, mockUpdatedWeightJournalData)
    ).rejects.toThrow(
      `Failed to update weight journal entry ${mockWeightJournalId} for user. HTTP Status: ${mockResponse.status}`
    );
  });
});

//test the deleteWeightJournal function
describe('deleteWeightJournal', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should delete a weight journal entry for the user', async () => {
    const mockUserId = '123';
    const mockToken = 'mockToken';
    const mockWeightJournalId = '1';

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

    const result = await deleteWeightJournal(mockWeightJournalId);

    expect(mockFetch).toHaveBeenCalledWith(`http://localhost:8000/api/journals/weight/${mockWeightJournalId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${mockToken}`,
      },
    });
    expect(result).toEqual({ message: 'Weight journal entry deleted successfully' });
  });

  it('should throw an error if the weight journal entry deletion fails', async () => {
    const mockUserId = '123';
    const mockToken = 'mockToken';
    const mockWeightJournalId = '1';
  
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
  
    await expect(deleteWeightJournal(mockWeightJournalId)).rejects.toThrow(
      `Failed to delete weight journal entry. HTTP Status: ${mockErrorResponse.status}`
    );
  });
});