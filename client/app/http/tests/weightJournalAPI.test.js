import { getWeightJournal, getWeightJournals, createWeightJournal, deleteWeightJournal, updateWeightJournal } 
from '../weightJournalAPI';
import { auth } from '../../config/firebase';

//test the getWeightJournals function
describe('getWeightJournals', () => {
  it('should retrieve weight journals for the user', async () => {
    const userId = '123';

    const weightJournalData = [
      {
        id: '456',
        date: '2022-01-01',
        time: '12:00:00',
        weight: 150,
        height: 70,
        unit: 'kg',
        notes: 'Test weight journal entry',
      },
      {
        id: '789',
        date: '2022-01-02',
        time: '12:00:00',
        weight: 155,
        height: 70,
        unit: 'kg',
        notes: 'Test weight journal entry 2',
      },
    ];

    const mockResponse = {
      status: 200,
      json: jest.fn().mockResolvedValue(weightJournalData),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const result = await getWeightJournals(userId);

    expect(mockFetch).toHaveBeenCalledWith(
      `http://localhost:8000/api/journals/weight/user/${userId}`
    );
    expect(result).toEqual(weightJournalData);
  });

  it('should throw an error if the weight journal retrieval fails', async () => {
    const userId = '123';

    const mockResponse = {
      status: 500,
      statusText: 'Internal Server Error',
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    await expect(getWeightJournals(userId)).rejects.toThrow(
      `Failed to retrieve weight journals for user ${userId}. HTTP Status: ${mockResponse.status}`
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
    const mockResponse = { data: mockUser };
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });
    global.fetch.mockImplementation(mockFetch);

    const userData = await getWeightJournal(mockUser.id);

    expect(userData.data.id).toEqual(mockUser.id);
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/journals/weight/undefined');
  });

  it('should throw an error if the request fails', async () => {
    const mockUserId = 1;
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    global.fetch.mockImplementation(mockFetch);

    await expect(getWeightJournal(mockUserId)).rejects.toThrow(
      'Failed to retrieve weight journal entry undefined for user 1. HTTP Status: 500'
    );
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/journals/weight/undefined');
  });
});

//test the createWeightJournal function
describe('createWeightJournal', () => {
  it('should create a weight journal entry for the user', async () => {
    const userId = '123';
    const weightJournalData = {
      date: '2022-01-01',
      time: '12:00:00',
      weight: 150,
      height: 70,
      unit: 'kg',
      notes: 'Test weight journal entry',
    };

    const mockResponse = {
      status: 201,
      json: jest.fn().mockResolvedValue(weightJournalData),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const result = await createWeightJournal(userId, weightJournalData);

    expect(mockFetch).toHaveBeenCalledWith(
      `http://localhost:8000/api/journals/weight/user/${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(weightJournalData),
      }
    );
    expect(result).toEqual(weightJournalData);
  });

  it('should throw an error if the weight journal entry creation fails', async () => {
    const userId = '123';
    const weightJournalData = {
      date: '2022-01-01',
      time: '12:00:00',
      weight: 150,
      height: 70,
      unit: 'kg',
      notes: 'Test weight journal entry',
    };

    const mockResponse = {
      status: 500,
      statusText: 'Internal Server Error',
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    await expect(createWeightJournal(userId, weightJournalData)).rejects.toThrow(
      `Failed to create weight journal entry for user ${userId}. HTTP Status: ${mockResponse.status}`
    );
  });
});

//test the updateWeightJournal function
describe('updateWeightJournal', () => {
  it('should update a weight journal entry for the user', async () => {
    const userId = '123';
    const weightJournalId = '456';
    const updatedWeightJournalData = {
      date: '2022-01-01',
      time: '12:00:00',
      weight: 150,
      height: 70,
      unit: 'kg',
      notes: 'Test weight journal entry',
    };

    const mockResponse = {
      status: 200,
      json: jest.fn().mockResolvedValue(updatedWeightJournalData),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const result = await updateWeightJournal(
      userId,
      weightJournalId,
      updatedWeightJournalData
    );

    expect(mockFetch).toHaveBeenCalledWith(
      `http://localhost:8000/api/journals/weight/${weightJournalId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedWeightJournalData),
      }
    );
    expect(result).toEqual(updatedWeightJournalData);
  });

  it('should throw an error if the weight journal entry update fails', async () => {
    const userId = '123';
    const weightJournalId = '456';
    const updatedWeightJournalData = {
      date: '2022-01-01',
      time: '12:00:00',
      weight: 150,
      height: 70,
      unit: 'kg',
      notes: 'Test weight journal entry',
    };

    const mockResponse = {
      status: 500,
      statusText: 'Internal Server Error',
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    await expect(
      updateWeightJournal(userId, weightJournalId, updatedWeightJournalData)
    ).rejects.toThrow(
      `Failed to update weight journal entry ${weightJournalId} for user ${userId}. HTTP Status: ${mockResponse.status}`
    );
  });
});

//test the deleteWeightJournal function
describe('deleteWeightJournal', () => {
  const mockUserId = 'mockUserId';
  const mockToken = 'mockToken';
  const mockWeightJournalId = 'mockWeightJournalId';

  const mockCurrentUser = {
    uid: mockUserId,
    getIdToken: jest.fn().mockResolvedValue(mockToken),
  };

  const mockResponse = {
    status: 204,
  };
  const mockFetch = jest.fn().mockResolvedValue(mockResponse);
  global.fetch = mockFetch;

  Object.defineProperty(auth, 'currentUser', {
    get: jest.fn().mockReturnValue(mockCurrentUser),
  });

  it('should delete a weight journal entry for the user', async () => {
    const result = await deleteWeightJournal(mockUserId, mockWeightJournalId);

    expect(mockFetch).toHaveBeenCalledWith(`/api/weight-journals/${mockUserId}/${mockWeightJournalId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${mockToken}`,
      },
    });
    expect(result).toBeUndefined();
  });

  it('should throw an error if the weight journal entry deletion fails', async () => {
    const mockErrorResponse = {
      status: 500,
    };
    const mockErrorFetch = jest.fn().mockResolvedValue(mockErrorResponse);
    global.fetch = mockErrorFetch;

    await expect(deleteWeightJournal(mockUserId, mockWeightJournalId)).rejects.toThrow(
      `Failed to delete weight journal entry ${mockWeightJournalId} for user ${mockUserId}. HTTP Status: ${mockErrorResponse.status}`
    );
  });
});