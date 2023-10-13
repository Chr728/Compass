import { auth } from '../../config/firebase';
import { getActivityJournals, getActivityJournal, createActivityJournal, updateActivityJournal, deleteActivityJournal } from '../activityJournalAPI';

//test the getActivityJournals function
describe('getActivityJournals', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch activity journals for the user', async () => {
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
    
    const result = await getActivityJournals(mockUserId);

    expect(mockFetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/activity/user/${mockUserId}`, {
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

    await expect(getActivityJournals()).rejects.toThrow('No user is currently signed in.');
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

    await expect(getActivityJournals()).rejects.toThrow('Failed to retrieve activity journals for user');
  });
});

//test the getActivityJournal function
describe('getActivityJournal', () => {
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

    const userData = await getActivityJournal(mockUser.id);

    expect(mockResponse.json).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/activity/${mockUser.id}`,
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

    await expect(getActivityJournal()).rejects.toThrow('No user is currently signed in.');
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

    await expect(getActivityJournal(mockUserId)).rejects.toThrow(
      'Failed to retrieve activity journal entry'
    );
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/activity/${mockUserId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        method: 'GET',
      });
  });
});

//test the createActivityJournal function
describe('createActivityJournal', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create an activity journal entry for the user', async () => {
    const mockUserId = '123';
    const mockActivityJournalData = {
      date: '2022-01-01',
      time: '12:00:00',
      activity: 'swimming',
      duration: 70,
      notes: 'Test activity journal entry',
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
      json: jest.fn().mockResolvedValue(mockActivityJournalData),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const result = await createActivityJournal(mockUserId, mockActivityJournalData);

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/activity/user/${mockUserId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        body: "\"123\"",
      }
    );
    expect(result).toEqual(mockActivityJournalData);
  });

  it('should throw an error if the activity journal entry creation fails', async () => {
    const mockUserId = '123';
    const mockActivityJournalData = {
      date: '2022-01-01',
      time: '12:00:00',
      activity: 'swimming',
      duration: 70,
      notes: 'Test activity journal entry',
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

    await expect(createActivityJournal(mockUserId, mockActivityJournalData)).rejects.toThrow(
      `Failed to create activity journal entry`
    );
  });
});

//test the updateActivityJournal function
describe('updateActivityJournal', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should update an activity journal entry for the user', async () => {
    const mockUserId = '123';
    const mockActivityJournalId = '456';
    const mockUpdatedActivityJournalData = {
      date: '2022-01-01',
      time: '12:00:00',
      activity: 'swimming',
      duration: 70,
      notes: 'Test activity journal entry',
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
      json: jest.fn().mockResolvedValue(mockUpdatedActivityJournalData),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const result = await updateActivityJournal(
      mockUserId,
      mockActivityJournalId,
      mockUpdatedActivityJournalData
    );

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/activity/${mockUserId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        body: "\"456\"",
      }
    );
    expect(result).toEqual(mockUpdatedActivityJournalData);
  });

  it('should throw an error if the activity journal entry update fails', async () => {
    const mockUserId = '123';
    const mockActivityJournalId = '456';
    const mockUpdatedActivityJournalData = {
      date: '2022-01-01',
      time: '12:00:00',
      activity: 'swimming',
      duration: 70,
      notes: 'Test activity journal entry',
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
      updateActivityJournal(mockActivityJournalId, mockUpdatedActivityJournalData)
    ).rejects.toThrow(
      `Failed to update activity journal entry`
    );
  });
});

//test the deleteActivityJournal function
describe('deleteActivityJournal', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should delete an activity journal entry for the user', async () => {
    const mockUserId = '123';
    const mockToken = 'mockToken';
    const mockActivityJournalId = '1';

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

    const result = await deleteActivityJournal(mockActivityJournalId);

    expect(mockFetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/journals/activity/${mockActivityJournalId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${mockToken}`,
      },
    });
    expect(result).toEqual({ message: 'Activity journal entry deleted successfully' });
  });

  it('should throw an error if the activity journal entry deletion fails', async () => {
    const mockUserId = '123';
    const mockToken = 'mockToken';
    const mockActivityJournalId = '1';
  
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
  
    await expect(deleteActivityJournal(mockActivityJournalId)).rejects.toThrow(
      `Failed to delete activity journal entry`
    );
  });
});