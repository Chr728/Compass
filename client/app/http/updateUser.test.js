import { updateUser } from './updateUser';
import { useContext } from 'react';
import React from 'react';

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
    const mockToken = 'mockToken';
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    jest.spyOn(React, 'useContext').mockReturnValue({ token: mockToken });
    global.fetch.mockImplementation(mockFetch);

    try {
      await updateUser(mockUserId, mockUserData);
    } catch (error) {
      expect(error.message).toBe("Cannot read properties of null (reading 'useContext')");
    }
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/users/' + mockUserId, {
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer mockToken' },
      body: JSON.stringify(mockUserData),
      method: 'PUT',
    });
  });

  it('should throw an error if the server response is not JSON', async () => {
    const mockUserId = '1';
    const mockUserData = { name: 'John Doe', email: 'johndoe@example.com' };
    const mockToken = 'mockToken';
    const mockResponse = 'Invalid response';
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      text: () => Promise.resolve(mockResponse),
    });
    jest.spyOn(React, 'useContext').mockReturnValue({ token: mockToken });
    global.fetch.mockImplementation(mockFetch);

    try {
      await updateUser(mockUserId, mockUserData);
    } catch (error) {
      expect(error.message).toBe("Cannot read properties of null (reading 'useContext')");
    }
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/users/' + mockUserId, {
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer mockToken' },
      body: JSON.stringify(mockUserData),
      method: 'PUT',
    });
  });

  it('should throw an error if the server response is missing data', async () => {
    const mockUserId = '1';
    const mockUserData = { name: 'John Doe', email: 'johndoe@example.com' };
    const mockToken = 'mockToken';
    const mockResponse = {};
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });
    jest.spyOn(React, 'useContext').mockImplementation(() => ({ token: mockToken }));
    global.fetch = mockFetch;
  
    try {
      await updateUser(mockUserId, mockUserData);
    } catch (error) {
      expect(error.message).toBe("Cannot read properties of null (reading 'useContext')");
    }
    expect(mockFetch).toHaveBeenCalledWith('http://localhost:8000/api/users/' + mockUserId, {
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer mockToken' },
      body: JSON.stringify(mockUserData),
      method: 'PUT',
    });
  });

  it('should throw an error if the user ID is not provided', async () => {
    const mockUserData = { name: 'John Doe', email: 'johndoe@example.com' };
    const mockToken = 'mockToken';
    jest.spyOn(React, 'useContext').mockReturnValue({ token: mockToken });

    try {
      await updateUser(null, mockUserData);
    } catch (error) {
      expect(error.message).toBe("Cannot read properties of null (reading 'useContext')");
    }
  });

  it('should throw an error if the user data is not provided', async () => {
    const mockUserId = '1';
    const mockToken = 'mockToken';
    jest.spyOn(React, 'useContext').mockReturnValue({ token: mockToken });

    try {
      await updateUser(mockUserId, null);
    } catch (error) {
      expect(error.message).toBe("Cannot read properties of null (reading 'useContext')");
    }
  });
});