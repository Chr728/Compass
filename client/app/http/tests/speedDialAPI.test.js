import { auth } from '../../config/firebase';
import { getSpeedDial, getSpeedDials, createSpeedDial, updateSpeedDial, deleteSpeedDial } from '../speedDialAPI';

//test the getSpeedDials function
describe('getSpeedDials', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch speed dial entries for the user', async () => {
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
    
    const result = await getSpeedDials(mockUserId);

    expect(mockFetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/speed-dials/${mockUserId}`, {
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

    await expect(getSpeedDials()).rejects.toThrow('No user is currently signed in.');
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

    await expect(getSpeedDials()).rejects.toThrow('Failed to retrieve speed dial entries for user');
  });
});

//test the getSpeedDial function
describe('getSpeedDial', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get a user by ID', async () => {
    const mockUser = { id: 1, speedDialId: 1, name: 'John Doe', phone: '514-123-4567' };
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

    const userData = await getSpeedDial(mockUser.id);

    expect(mockResponse.json).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/speed-dials/${mockCurrentUser.uid}/${mockUser.speedDialId}`,
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

    await expect(getSpeedDial()).rejects.toThrow('No user is currently signed in.');
  });

  it('should throw an error if the request fails', async () => {
    const mockUserId = 1;
    const mockSpeedDialId = 1;
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

    await expect(getSpeedDial(mockUserId)).rejects.toThrow(
      'Failed to retrieve speed dial entry'
    );
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/speed-dials/${mockUserId}/${mockSpeedDialId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        method: 'GET',
      });
  });
});

//test the createSpeedDial function
describe('createSpeedDial', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create an speed dial entry for the user', async () => {
    const mockUserId = '123';
    const mockSpeedDialData = {
      name: 'john doe',
      phone: '514-123-4567',
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
      json: jest.fn().mockResolvedValue(mockSpeedDialData),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const result = await createSpeedDial(mockUserId, mockSpeedDialData);

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/speed-dials/${mockUserId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        body: "\"123\"",
      }
    );
    expect(result).toEqual(mockSpeedDialData);
  });

  it('should throw an error if the speed dial entry creation fails', async () => {
    const mockUserId = '123';
    const mockSpeedDialData = {
      name: 'john doe',
      phone: '514-123-4567',
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

    await expect(createSpeedDial(mockUserId, mockSpeedDialData)).rejects.toThrow(
      `Failed to create speed dial entry`
    );
  });
});

//test the updateSpeedDial function
describe('updateSpeedDial', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should update a speed dial entry for the user', async () => {
    const mockUserId = '123';
    const mockSpeedDialId = '456';
    const mockUpdatedSpeedDialData = {
      name: 'john doe',
      phone: '514-123-4567',
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
      json: jest.fn().mockResolvedValue(mockUpdatedSpeedDialData),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const result = await updateSpeedDial(
      mockSpeedDialId,
      mockUpdatedSpeedDialData
    );

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/speed-dials/${mockUserId}/${mockSpeedDialId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        body: "{\"name\":\"john doe\",\"phone\":\"514-123-4567\"}",
      }
    );
    expect(result).toEqual(mockUpdatedSpeedDialData);
  });

  it('should throw an error if the speed dial entry update fails', async () => {
    const mockUserId = '123';
    const mockSpeedDialId = '456';
    const mockUpdatedSpeedDialData = {
      name: 'john doe',
      phone: '514-123-4567',
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
      updateSpeedDial(mockSpeedDialId, mockUpdatedSpeedDialData)
    ).rejects.toThrow(
      `Failed to update speed dial entry`
    );
  });
});

//test the deleteSpeedDial function
describe('deleteSpeedDial', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should delete a speed dial entry for the user', async () => {
    const mockUserId = '123';
    const mockToken = 'mockToken';
    const mockSpeedDialId = '1';

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

    const result = await deleteSpeedDial(mockSpeedDialId);

    expect(mockFetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/speed-dials/${mockUserId}/${mockSpeedDialId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${mockToken}`,
      },
    });
    expect(result).toEqual({ message: 'Speed dial entry deleted successfully' });
  });

  it('should throw an error if the speed dial entry deletion fails', async () => {
    const mockUserId = '123';
    const mockToken = 'mockToken';
    const mockSpeedDialId = '1';
  
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
  
    await expect(deleteSpeedDial(mockSpeedDialId)).rejects.toThrow(
      `Failed to delete speed dial entry`
    );
  });
});