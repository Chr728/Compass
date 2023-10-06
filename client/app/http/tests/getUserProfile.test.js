import { getUserProfile } from '../getUserProfile';
import { auth } from '../../config/firebase';

describe('getUserProfile', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get a user profile by ID', async () => {
    const mockUserId = '1';
    const mockToken = 'mockToken';
    const mockCurrentUser = {
      uid: mockUserId,
      getIdToken: jest.fn().mockResolvedValue(mockToken),
    };

    Object.defineProperty(auth, 'currentUser', {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });

    const mockUserProfile = {
      id: 1,
      name: 'John Doe',
      email: 'johndoe@example.com',
      bio: 'Hello, world!',
    };
    const mockResponse = { data: mockUserProfile };
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });
    global.fetch.mockImplementation(mockFetch);

    const userProfile = await getUserProfile();
    expect(userProfile).toEqual(mockUserProfile);
    expect(mockFetch).toHaveBeenCalledWith(
      `http://localhost:8000/api/users/${mockUserId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        method: 'GET',
      }
    );
  });

  it('should throw an error if the request fails', async () => {
    const mockUserId = '1';
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
    global.fetch.mockImplementation(mockFetch);

    await expect(getUserProfile()).rejects.toThrow('Error fetching user profile');
    expect(mockFetch).toHaveBeenCalledWith(
      `http://localhost:8000/api/users/${mockUserId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        method: 'GET',
      }
    );
  });
});