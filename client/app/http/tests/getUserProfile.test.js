import { getUserProfile } from '../getUserProfile';

describe('getUserProfile', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get a user profile by ID', async () => {
    const mockUserId = '1';
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

    const userProfileData = await getUserProfile(mockUserId);

    expect(userProfileData).toEqual(mockUserProfile);
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8000/api/users/' + mockUserId,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }
    );
  });

  it('should throw an error if the request fails', async () => {
    const mockUserId = '1';
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    global.fetch.mockImplementation(mockFetch);

    await expect(getUserProfile(mockUserId)).rejects.toThrow(
      'Error fetching user profile'
    );
    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:8000/api/users/' + mockUserId,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      }
    );
  });
});
