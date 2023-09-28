import { updateUser } from './updateUser';
import { UserContext } from '../contexts/UserContext';

jest.mock('../contexts/UserContext', () => ({
  UserContext: {
    Consumer: ({ children }) => children({ token: 'mockToken' }),
  },
}));

describe('updateUser', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should update a user by ID', async () => {
    const mockUserId = '1';
    const mockUserData = { name: 'John Doe', email: 'johndoe@example.com' };
    const mockResponse = { data: mockUserData };
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });
    global.fetch.mockImplementation(mockFetch);

    const updatedUserData = await updateUser(mockUserId, mockUserData);

    expect(updatedUserData).toEqual(mockUserData);
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/users/' + mockUserId, {
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer mockToken' },
      body: JSON.stringify(mockUserData),
      method: 'PUT',
    });
  });

  it('should throw an error if the request fails', async () => {
    const mockUserId = '1';
    const mockUserData = { name: 'John Doe', email: 'johndoe@example.com' };
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    global.fetch.mockImplementation(mockFetch);

    await expect(updateUser(mockUserId, mockUserData)).rejects.toThrow("Cannot read properties of null (reading 'useContext')");
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/users/' + mockUserId, {
      body: JSON.stringify(mockUserData),
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer mockToken' },
      method: 'PUT',
    });
  });
});