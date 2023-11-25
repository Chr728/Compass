import createUser from '../createUser';
import { auth } from '../../config/firebase';

describe('createUser', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create a new user', async () => {
    const mockUser = { name: 'John Doe', email: 'johndoe@example.com' };
    const mockResponse = { data: { id: 1, ...mockUser } };
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });
    global.fetch.mockImplementation(mockFetch);
  
    const mockCurrentUser = { getIdToken: jest.fn().mockResolvedValue('mockToken') };
    
    Object.defineProperty(auth, 'currentUser', {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });
  
    const result = await createUser(mockUser);
    expect(result).toEqual(mockResponse.data);
  
    expect(mockFetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mockToken',
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
  
    const mockCurrentUser = { getIdToken: jest.fn().mockResolvedValue('mockToken') };

    Object.defineProperty(auth, 'currentUser', {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });

    try {
      await createUser(mockUser);
    } catch (error) {
      expect(error.message).toBe('Error creating user: HTTP error! Status: undefined');
    }
    expect(mockFetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mockToken',
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

    const mockCurrentUser = { getIdToken: jest.fn().mockResolvedValue('mockToken') };

    Object.defineProperty(auth, 'currentUser', {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });

    try {
      await createUser(mockUser);
    } catch (error) {
      expect(error.message).toBe('Error creating user: response.json is not a function');
    }
    expect(mockFetch).toHaveBeenCalledWith(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mockToken',
      },
      body: JSON.stringify(mockUser),
    });
  });

});
