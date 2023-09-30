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

  it('should throw an error if the server returns an error', async () => {
    const mockUser = { name: 'John Doe', email: 'johndoe@example.com' };
    const mockResponse = { error: 'Server error' };
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve(mockResponse),
    });
    global.fetch.mockImplementation(mockFetch);

    try {
      await createUser(mockUser);
    } catch (error) {
      expect(error.message).toBe('Error creating user');
    }
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockUser),
    });
  });

  it('should throw an error if the server response is not JSON', async () => {
    const mockUser = { name: 'John Doe', email: 'johndoe@example.com' };
    const mockResponse = 'Invalid response';
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockResponse),
    });
    global.fetch.mockImplementation(mockFetch);

    try {
      await createUser(mockUser);
    } catch (error) {
      expect(error.message).toBe('Error creating user');
    }
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockUser),
    });
  });

  it('should throw an error if the server response is missing data', async () => {
    const mockUser = { name: 'John Doe', email: 'johndoe@example.com' };
    const mockResponse = {};
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });
    global.fetch.mockImplementation(mockFetch);

    try {
      await createUser(mockUser);
    } catch (error) {
      expect(error.message).toBe('Invalid response');
    }
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mockUser),
    });
  });
});