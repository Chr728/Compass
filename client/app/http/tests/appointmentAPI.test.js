import { auth } from '../../config/firebase';
import {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../appointmentAPI';

import { getFrequencyInMilliseconds } from '../appointmentAPI';

//test the getAppointments function
describe('getAppointments', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch appointments for the user', async () => {
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

    const result = await getAppointments(mockUserId);

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${mockUserId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
      }
    );
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

    await expect(getAppointments()).rejects.toThrow(
      'No user is currently signed in.'
    );
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

    await expect(getAppointments()).rejects.toThrow(
      'Failed to retrieve appointment. HTTP Status: undefined'
    );
  });
});

//test the getAppointment function
describe('getAppointment', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get a user by ID', async () => {
    const mockUser = { id: 1, name: 'John Doe', email: 'johndoe@example.com' };
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

    const userData = await getAppointment(mockUser.id);

    expect(mockResponse.json).toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/single/${mockUser.id}`,
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

    await expect(getAppointment()).rejects.toThrow(
      'No user is currently signed in.'
    );
  });

  it('should throw an error if the request fails', async () => {
    const mockUserId = 1;
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

    await expect(getAppointment(mockUserId)).rejects.toThrow(
      `Failed to fetch the appointment data. HTTP Status: 500`
    );
    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/single/${mockUserId}`,
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

//test the createAppointment function
describe('createAppointment', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should create an appointment entry for the user', async () => {
    const mockUserId = '123';
    const mockAppointmentData = {
      time: '12:00:00',
      appointmentWith: 'test doctor',
      reason: 'test reason',
      notes: 'Test appointment entry',
      date: '2022-01-01',
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
      json: jest.fn().mockResolvedValue(mockAppointmentData),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const result = await createAppointment(mockUserId, mockAppointmentData);

    // Modify mockAppointmentData to match the expected format with ISO date
    const expectedData = {
      ...mockAppointmentData,
      date: new Date(mockAppointmentData.date).toISOString(),
    };

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${mockUserId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        body: JSON.stringify(expectedData), // Use expectedData here
      }
    );
    expect(result).toEqual([mockAppointmentData]); // Ensure the result is as expected
  });

  it('should throw an error if the appointment  entry creation fails', async () => {
    const mockUserId = '123';
    const mockAppointmentData = {
      date: '2022-01-01',
      time: '12:00:00',
      appointmentWith: 'test doctor',
      reason: 'test reason',
      notes: 'Test appointment entry',
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
      createAppointment(mockUserId, mockAppointmentData)
    ).rejects.toThrow(
      `Failed to create appointment for user ${mockUserId}. HTTP Status: ${mockResponse.status}`
    );
  });
});

// Import the function you want to test

describe('getFrequencyInMilliseconds', () => {
  it('should return correct milliseconds for daily frequency', () => {
    expect(getFrequencyInMilliseconds('daily')).toBe(24 * 60 * 60 * 1000); // 1 day
  });

  it('should return correct milliseconds for weekly frequency', () => {
    expect(getFrequencyInMilliseconds('weekly')).toBe(7 * 24 * 60 * 60 * 1000); // 1 week
  });

  it('should return correct milliseconds for bi-weekly frequency', () => {
    expect(getFrequencyInMilliseconds('bi-weekly')).toBe(
      14 * 24 * 60 * 60 * 1000
    );
  });

  it('should return correct milliseconds for monthly frequency', () => {
    expect(getFrequencyInMilliseconds('monthly')).toBeCloseTo(
      30 * 24 * 60 * 60 * 1000,
      -2
    );
  });

  it('should return correct milliseconds for yearly frequency', () => {
    expect(getFrequencyInMilliseconds('yearly')).toBeCloseTo(
      365 * 24 * 60 * 60 * 1000,
      -1
    );
  });

  it('should throw an error for invalid frequency', () => {
    expect(() => getFrequencyInMilliseconds('invalid')).toThrowError(
      'Invalid frequency'
    );
  });
});

describe('createAppointment', () => {
  const mockUserId = '123';
  const mockToken = 'mockToken';
  const mockDate = '2022-01-01T00:00:00.000Z'; // Any valid date
  const mockAppointmentData = {
    date: mockDate,
    time: '12:00:00',
    appointmentWith: 'test doctor',
    reason: 'test reason',
    notes: 'Test appointment entry',
    frequency: 'daily',
    quantity: 3,
  };
  const mockCurrentUser = {
    uid: mockUserId,
    getIdToken: jest.fn().mockResolvedValue(mockToken),
  };

  beforeEach(() => {
    jest.clearAllMocks(); // Clear all mocks before each test
    Object.defineProperty(auth, 'currentUser', {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });
  });

  it('should throw an error when no user is signed in', async () => {
    Object.defineProperty(auth, 'currentUser', {
      get: jest.fn().mockReturnValue(null),
    });

    await expect(
      createAppointment(mockUserId, mockAppointmentData)
    ).rejects.toThrowError('No user is currently signed in.');
  });

  it('should handle API call failure', async () => {
    // Mock the fetch function to return a failed response
    const mockError = new Error('API Error');
    const mockFetch = jest.fn().mockRejectedValue(mockError);
    global.fetch = mockFetch;

    await expect(
      createAppointment(mockUserId, mockAppointmentData)
    ).rejects.toThrowError('API Error');
  });
});

//test the updateAppointment function
describe('updateAppointment', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should update an appointment  entry for the user', async () => {
    const mockUserId = '123';
    const mockAppointmentId = '456';
    const mockUpdatedAppointmentData = {
      date: '2022-01-01',
      time: '12:00:00',
      appointmentWith: 'test doctor',
      reason: 'test reason',
      notes: 'Test appointment entry',
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
      json: jest.fn().mockResolvedValue(mockUpdatedAppointmentData),
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    const result = await updateAppointment(
      mockUserId,
      mockAppointmentId,
      mockUpdatedAppointmentData
    );

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/single/${mockUserId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${mockToken}`,
        },
        body: '"456"',
      }
    );
    expect(result).toEqual(mockUpdatedAppointmentData);
  });

  it('should throw an error if the appointment entry update fails', async () => {
    const mockUserId = '123';
    const mockAppointmentId = '456';
    const mockUpdatedAppointmentData = {
      date: '2022-01-01',
      time: '12:00:00',
      appointmentWith: 'test doctor',
      reason: 'test reason',
      notes: 'Test appointment entry',
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
      updateAppointment(mockAppointmentId, mockUpdatedAppointmentData)
    ).rejects.toThrow(
      `Failed to update the appointment. HTTP Status: ${mockResponse.status}`
    );
  });
});

//test the deleteAppointment function
describe('deleteAppointment', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should delete an appointment entry for the user', async () => {
    const mockUserId = '123';
    const mockToken = 'mockToken';
    const mockAppointmentId = '1';

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

    const result = await deleteAppointment(mockAppointmentId);

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/single/${mockAppointmentId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      }
    );
    expect(result).toEqual({
      message: 'Appointment entry deleted successfully',
    });
  });

  it('should throw an error if the appointment entry deletion fails', async () => {
    const mockUserId = '123';
    const mockToken = 'mockToken';
    const mockAppointmentId = '1';

    const mockCurrentUser = {
      uid: mockUserId,
      getIdToken: jest.fn().mockResolvedValue(mockToken),
    };

    const mockResponse = {
      ok: false,
      status: 204,
    };
    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = jest
      .fn()
      .mockImplementation(() => Promise.resolve(mockResponse));

    Object.defineProperty(auth, 'currentUser', {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });

    const mockErrorResponse = {
      ok: false,
      status: 500,
    };
    const mockErrorFetch = jest.fn().mockResolvedValue(mockErrorResponse);
    global.fetch = mockErrorFetch;

    await expect(deleteAppointment(mockAppointmentId)).rejects.toThrow(
      `Failed to delete the appointment. HTTP Status: ${mockErrorResponse.status}`
    );
  });
});
