import { auth } from '../../config/firebase';
import { getMoodJournals, getMoodJournal, createMoodJournal, updateMoodJournal, deleteMoodJournal } from '../moodJournalAPI';

//test the getMoodJournals function
describe('getMoodJournals', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch mood journals for the user', async () => {
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
    
    const result = await getMoodJournals(mockUserId);

    expect(mockFetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/mood/user/${mockUserId}`, {
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

    await expect(getMoodJournals()).rejects.toThrow('No user is currently signed in.');
  });

  it('should throw an error if the fetch request fails', async () => {
    const mockUserId = '123';
    const mockToken = 'mockToken';
    const mockCurrentUser = {
      uid: mockUserId,
      getIdToken: jest.fn().mockResolvedValue(mockToken),
    };
  
    Object.defineProperty(auth, 'currentUser', {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });

    const mockErrorResponse = {
      ok: false,
    };
    const mockErrorFetch = jest.fn().mockResolvedValue(mockErrorResponse);
    global.fetch = mockErrorFetch;

    await expect(getMoodJournals()).rejects.toThrow('Failed to retrieve mood journals for user');
  });
});

//test the getMoodJournal function
describe('getMoodJournal', () => {
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

    const userData = await getMoodJournal(mockUser.id);

    expect(mockResponse.json).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/mood/${mockUser.id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        method: 'GET',
      }
      );
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

    await expect(getMoodJournal()).rejects.toThrow('No user is currently signed in.');
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

    await expect(getMoodJournal(mockUserId)).rejects.toThrow(
      'Failed to retrieve mood journal entry'
    );
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/mood/${mockUserId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        method: 'GET',
      });
  });
});

//test the createMoodJournal function
describe('createMoodJournal', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create an mood journal entry for the user', async () => {
    const mockUserId = '123';
    const mockMoodJournalData = {
      date: '2022-01-01',
      howAreYou: 5,
      stressSignals: {'1': 'always'},
      notes: 'Test mood journal entry',
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
      json: jest.fn().mockResolvedValue(mockMoodJournalData),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const result = await createMoodJournal(mockUserId, mockMoodJournalData);

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/mood/user/${mockUserId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        body: "\"123\"",
      }
    );
    expect(result).toEqual(mockMoodJournalData);
  });

  it('should throw an error if the mood journal entry creation fails', async () => {
    const mockUserId = '123';
    const mockMoodJournalData = {
      date: '2022-01-01',
      howAreYou: 5,
      stressSignals: {'1': 'always'},
      notes: 'Test mood journal entry',
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

    await expect(createMoodJournal(mockUserId, mockMoodJournalData)).rejects.toThrow(
      `Failed to create mood journal entry`
    );
  });
});

//test the updateMoodJournal function
describe('updateMoodJournal', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should update an mood journal entry for the user', async () => {
    const mockUserId = '123';
    const mockMoodJournalId = '456';
    const mockUpdatedMoodJournalData = {
      date: '2022-01-01',
      howAreYou: 5,
      stressSignals: {'1': 'always'},
      notes: 'Test mood journal entry',
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
      json: jest.fn().mockResolvedValue(mockUpdatedMoodJournalData),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const result = await updateMoodJournal(
      mockUserId,
      mockMoodJournalId,
      mockUpdatedMoodJournalData
    );

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/mood/${mockUserId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        body: "\"456\"",
      }
    );
    expect(result).toEqual(mockUpdatedMoodJournalData);
  });

  it('should throw an error if the mood journal entry update fails', async () => {
    const mockUserId = '123';
    const mockMoodJournalId = '456';
    const mockUpdatedMoodJournalData = {
      date: '2022-01-01',
      howAreYou: 5,
      stressSignals: {'1': 'always'},
      notes: 'Test mood journal entry',
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
      updateMoodJournal(mockMoodJournalId, mockUpdatedMoodJournalData)
    ).rejects.toThrow(
      `Failed to update mood journal entry`
    );
  });
});

//test the deleteMoodJournal function
describe('deleteMoodJournal', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should delete an mood journal entry for the user', async () => {
    const mockUserId = '123';
    const mockToken = 'mockToken';
    const mockMoodJournalId = '1';

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

    const result = await deleteMoodJournal(mockMoodJournalId);

    expect(mockFetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/mood/${mockMoodJournalId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${mockToken}`,
      },
    });
    expect(result).toEqual(undefined);
  });

  it('should throw an error if the mood journal entry deletion fails', async () => {
    const mockUserId = '123';
    const mockToken = 'mockToken';
    const mockMoodJournalId = '1';
  
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
  
    await expect(deleteMoodJournal(mockMoodJournalId)).rejects.toThrow(
      `Failed to delete mood journal entry`
    );
  });
});