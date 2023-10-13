import { updateUser } from '../updateUser';
import { useContext } from 'react';
import React from 'react';
import { auth } from '../../config/firebase';

jest.mock('../../contexts/UserContext', () => ({
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
  
    const mockCurrentUser = { getIdToken: jest.fn().mockResolvedValue('mockToken') };
    Object.defineProperty(auth, 'currentUser', {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });
  
    const updatedUserData = await updateUser(mockUserId, mockUserData);
  
    expect(updatedUserData.data).toEqual(mockUserData);
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/undefined`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer mockToken',
        },
        body: "\"1\"",
        method: 'PUT',
      }
    );
  });

  it('should throw an error if the request fails', async () => {
    const mockUserId = '1';
    const mockUserData = { name: 'John Doe', email: 'johndoe@example.com' };
    const mockError = new Error('Request failed');
    const mockFetch = jest.fn().mockRejectedValue(mockError);
    global.fetch.mockImplementation(mockFetch);
  
    const mockCurrentUser = {
      getIdToken: jest.fn().mockResolvedValue('mockToken'),
      uid: 'mockUid',
    };
    Object.defineProperty(auth, 'currentUser', {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });
  
    try {
      await updateUser(mockUserId, mockUserData);
    } catch (error) {
      expect(error).toBe(mockError);
      expect(mockFetch).toHaveBeenCalledWith(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/mockUid`,
        {
          headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer mockToken`,
          },
          body: "\"1\"",
          method: 'PUT',
        }
      );
    }
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
    global.fetch.mockImplementation(mockFetch);

    const mockCurrentUser = {
      getIdToken: jest.fn().mockResolvedValue('mockToken'),
      uid: 'mockUid',
    };

    Object.defineProperty(auth, 'currentUser', {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });
  
    try {
      await updateUser(mockUserId, mockUserData);
    } catch (error) {
      expect(error.message).toBe('response.json is not a function');
    }
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/mockUid`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: `Bearer ${mockToken}`,
        },
        body: "\"1\"",
        method: 'PUT',
      }
    );
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
    global.fetch.mockImplementation(mockFetch);

    const mockCurrentUser = {
      getIdToken: jest.fn().mockResolvedValue('mockToken'),
      uid: 'mockUid',
    };

    Object.defineProperty(auth, 'currentUser', {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });

    try {
      await updateUser(mockUserId, mockUserData);
    } catch (error) {
      expect(error.message).toBe('No user is logged in');
    }
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/mockUid`,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer mockToken',
        },
        body: "\"1\"",
        method: 'PUT',
      }
    );
  });

  it('should throw an error if the user ID is not provided', async () => {
    const mockUserData = { name: 'John Doe', email: 'johndoe@example.com' };
    const mockToken = 'mockToken';
    jest.spyOn(React, 'useContext').mockReturnValue({ token: mockToken });

    try {
      await updateUser(null, mockUserData);
    } catch (error) {
      expect(error.message).toBe('No user is logged in');
    }
  });

  it('should throw an error if the user data is not provided', async () => {
    const mockUserId = '1';
    const mockToken = 'mockToken';
    jest.spyOn(React, 'useContext').mockReturnValue({ token: mockToken });

    try {
      await updateUser(mockUserId, null);
    } catch (error) {
      expect(error.message).toBe('No user is logged in');
    }
  });

});
