import getUser from '../getUser';
import { auth } from '../../config/firebase';


describe('getUser', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get a user by ID', async () => {
    const mockUserId = '123';
    const mockToken = 'mockToken';
    const mockCurrentUser = {
      uid: mockUserId,
      getIdToken: jest.fn().mockResolvedValue(mockToken),
    };
    
    Object.defineProperty(auth, 'currentUser', {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });

    const mockUserData = {
      id: mockUserId,
      name: 'Mock User',
      email: 'mockuser@example.com',
    };
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({ data: mockUserData }),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch.mockImplementation(mockFetch);
  
    const userData = await getUser();
    expect(userData).toEqual(mockUserData);
    expect(mockFetch).toHaveBeenCalledWith(
      `http://localhost:8000/api/users/${mockUserId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
      }
    );
  });

  it('should throw an error if the request fails', async () => {
    const mockUserId = '123';
    const mockToken = 'mockToken';
    const mockCurrentUser = {
      uid: mockUserId,
      getIdToken: jest.fn().mockResolvedValue(mockToken),
    };
    const mockAuth = {
      currentUser: mockCurrentUser,
    };
    Object.defineProperty(auth, 'currentUser', {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });
          
    const mockResponse = {
      ok: false,
      status: 500,
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch.mockImplementation(mockFetch);
  
    await expect(getUser()).rejects.toThrow('Error fetching user profile');
    expect(mockFetch).toHaveBeenCalledWith(
      `http://localhost:8000/api/users/${mockUserId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
      }
    );
  });
});
