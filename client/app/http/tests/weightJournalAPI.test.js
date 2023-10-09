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

// //test the createWeightJournal function
// describe.skip('createWeightJournal', () => {
//   it('should create a weight journal entry for the user', async () => {
//     const userId = '123';
//     const weightJournalData = {
//       date: '2022-01-01',
//       time: '12:00:00',
//       weight: 150,
//       height: 70,
//       unit: 'kg',
//       notes: 'Test weight journal entry',
//     };

//     const mockResponse = {
//       status: 201,
//       json: jest.fn().mockResolvedValue(weightJournalData),
//     };
//     const mockFetch = jest.fn().mockResolvedValue(mockResponse);
//     global.fetch = mockFetch;

//     const result = await createWeightJournal(userId, weightJournalData);

//     expect(mockFetch).toHaveBeenCalledWith(
//       `http://localhost:8000/api/journals/weight/user/${userId}`,
//       {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(weightJournalData),
//       }
//     );
//     expect(result).toEqual(weightJournalData);
//   });

//   it('should throw an error if the weight journal entry creation fails', async () => {
//     const userId = '123';
//     const weightJournalData = {
//       date: '2022-01-01',
//       time: '12:00:00',
//       weight: 150,
//       height: 70,
//       unit: 'kg',
//       notes: 'Test weight journal entry',
//     };

//     const mockResponse = {
//       status: 500,
//       statusText: 'Internal Server Error',
//     };
//     const mockFetch = jest.fn().mockResolvedValue(mockResponse);
//     global.fetch = mockFetch;

//     await expect(createWeightJournal(userId, weightJournalData)).rejects.toThrow(
//       `Failed to create weight journal entry for user ${userId}. HTTP Status: ${mockResponse.status}`
//     );
//   });
// });

// //test the updateWeightJournal function
// describe.skip('updateWeightJournal', () => {
//   it('should update a weight journal entry for the user', async () => {
//     const userId = '123';
//     const weightJournalId = '456';
//     const updatedWeightJournalData = {
//       date: '2022-01-01',
//       time: '12:00:00',
//       weight: 150,
//       height: 70,
//       unit: 'kg',
//       notes: 'Test weight journal entry',
//     };

//     const mockResponse = {
//       status: 200,
//       json: jest.fn().mockResolvedValue(updatedWeightJournalData),
//     };
//     const mockFetch = jest.fn().mockResolvedValue(mockResponse);
//     global.fetch = mockFetch;

//     const result = await updateWeightJournal(
//       userId,
//       weightJournalId,
//       updatedWeightJournalData
//     );

//     expect(mockFetch).toHaveBeenCalledWith(
//       `http://localhost:8000/api/journals/weight/${weightJournalId}`,
//       {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatedWeightJournalData),
//       }
//     );
//     expect(result).toEqual(updatedWeightJournalData);
//   });

//   it('should throw an error if the weight journal entry update fails', async () => {
//     const userId = '123';
//     const weightJournalId = '456';
//     const updatedWeightJournalData = {
//       date: '2022-01-01',
//       time: '12:00:00',
//       weight: 150,
//       height: 70,
//       unit: 'kg',
//       notes: 'Test weight journal entry',
//     };

//     const mockResponse = {
//       status: 500,
//       statusText: 'Internal Server Error',
//     };
//     const mockFetch = jest.fn().mockResolvedValue(mockResponse);
//     global.fetch = mockFetch;

//     await expect(
//       updateWeightJournal(userId, weightJournalId, updatedWeightJournalData)
//     ).rejects.toThrow(
//       `Failed to update weight journal entry ${weightJournalId} for user ${userId}. HTTP Status: ${mockResponse.status}`
//     );
//   });
// });

// //test the deleteWeightJournal function
// describe.skip('deleteWeightJournal', () => {
//   beforeEach(() => {
//     global.fetch = jest.fn();
//   });

//   afterEach(() => {
//     jest.resetAllMocks();
//   });

//   const mockUserId = '123';
//   const mockToken = 'mockToken';
//   const mockWeightJournalId = '1';

//   const mockCurrentUser = {
//     uid: mockUserId,
//     getIdToken: jest.fn().mockResolvedValue(mockToken),
//   };

//   const mockResponse = {
//     ok: false,
//     status: 204,
//   };
//   const mockFetch = jest.fn().mockResolvedValue(mockResponse);
//   global.fetch = jest.fn().mockImplementation(() => Promise.resolve(mockResponse));

//   Object.defineProperty(auth, 'currentUser', {
//     get: jest.fn().mockReturnValue(mockCurrentUser),
//   });

//   it.skip('should delete a weight journal entry for the user', async () => {
//     const result = await deleteWeightJournal(mockWeightJournalId);

//     expect(mockFetch).toHaveBeenCalledWith(`http://localhost:8000/api/journals/weight/${mockWeightJournalId}`, {
//       method: 'DELETE',
//       headers: {
//         Authorization: `Bearer ${mockToken}`,
//       },
//     });
//     expect(result).toBeUndefined();
//   });

//   it('should throw an error if the weight journal entry deletion fails', async () => {
//     const mockErrorResponse = {
//       ok: false,
//       status: 500,
//     };
//     const mockErrorFetch = jest.fn().mockResolvedValue(mockErrorResponse);
//     global.fetch = mockErrorFetch;
  
//     await expect(deleteWeightJournal(mockWeightJournalId)).rejects.toThrow(
//       `Failed to delete weight journal entry ${mockWeightJournalId} for user. HTTP Status: ${mockErrorResponse.status}`
//     );
//   });
// });