import createUser from './createUser';

describe('createUser', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a new user', async () => {
    const mockUser = { name: 'John Doe', email: 'johndoe@example.com' };
    const mockResponse = { data: mockUser };
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });
    global.fetch.mockImplementation(mockFetch);

    const userData = await createUser(mockUser);

    expect(userData).toEqual(mockUser);
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockUser),
    });
  });

  it('should throw an error if the request fails', async () => {
    const mockUser = { name: 'John Doe', email: 'johndoe@example.com' };
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    global.fetch.mockImplementation(mockFetch);

    async function createUser(user) {
      try {
        const response = await fetch('http://localhost:8000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        });
        const userData = await response.json();
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return userData.data;
      } catch (error) {
        throw new Error('Error creating user');
      }
    };
  });
});