import request from 'supertest';
import app from './../index';
import db from './../models/index';
import admin from 'firebase-admin';
import { startServer, stopServer } from '../utils/journalsTestHelper';

const speedDial = {
  contactName: 'John',
  contactNumber: '5147894561',
};

const invalidSpeedDial = {
  contactName: 1,
};

const mockedDecodedToken = {
  uid: 'userUid',
  aud: '',
  auth_time: 0,
  exp: 0,
  firebase: {
    identities: { [0]: 'string' },
    sign_in_provider: 'string',
  },
  iat: 0,
  iss: '',
  sub: '',
};

beforeAll(() => {
  startServer(); // Start the server before running tests
});

beforeEach(() => {
  jest
    .spyOn(admin.auth(), 'verifyIdToken')
    .mockResolvedValue(mockedDecodedToken);
});

afterAll(() => {
  stopServer(); // Stop the server after all tests are done
});

describe('should test the getSpeedDials Controller', () => {
  it('show get all speed dials', async () => {
    jest.spyOn(db.SpeedDial, 'findAll').mockResolvedValueOnce(speedDial);
    const res = await request(app)
      .get('/api/speed-dials/userUid')
      .set({ Authorization: 'Bearer token' });
    expect(db.SpeedDial.findAll).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(speedDial);
  });

  it('should return an error for a non-existent user id', async () => {
    jest
      .spyOn(db.SpeedDial, 'findAll')
      .mockRejectedValue(new Error('connection error'));
    const res = await request(app)
      .get('/api/speed-dials/userUid')
      .set({ Authorization: 'Bearer token' });
    expect(db.SpeedDial.findAll).toBeCalledTimes(2);
    expect(res.status).toBe(400);
  });
});

describe('should test the getSpeedDial Controller', () => {
  it('show get speed dial', async () => {
    jest.spyOn(db.SpeedDial, 'findOne').mockResolvedValueOnce(speedDial);
    const res = await request(app)
      .get('/api/speed-dials/123/1')
      .set({ Authorization: 'Bearer token' });
    expect(db.SpeedDial.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(speedDial);
  });

  it('should return an error for a connection error', async () => {
    jest
      .spyOn(db.SpeedDial, 'findOne')
      .mockRejectedValue(new Error('connection error'));
    const res = await request(app)
      .get('/api/speed-dials/123/1')
      .set({ Authorization: 'Bearer token' });
    expect(db.SpeedDial.findOne).toBeCalledTimes(2);
    expect(res.status).toBe(400);
  });

  it('should return an error for a non-existent speed dial', async () => {
    jest.spyOn(db.SpeedDial, 'findOne').mockResolvedValueOnce(null);
    const res = await request(app)
      .get('/api/speed-dials/123/1')
      .set({ Authorization: 'Bearer token' });
    expect(db.SpeedDial.findOne).toBeCalledTimes(3);
    expect(res.status).toBe(404);
  });
});

describe('should test the createSpeedDial Controller', () => {
  it('show create speed dial', async () => {
    jest.spyOn(db.SpeedDial, 'create').mockResolvedValueOnce(speedDial);
    const res = await request(app)
      .post('/api/speed-dials/userUid')
      .send(speedDial)
      .set({ Authorization: 'Bearer token' });
    expect(db.SpeedDial.create).toBeCalledTimes(1);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(speedDial);
  });

  it('should return an error for an invalid speed dial', async () => {
    jest
      .spyOn(db.SpeedDial, 'create')
      .mockRejectedValue(new Error('connection error'));
    const res = await request(app)
      .post('/api/speed-dials/userUid')
      .send(invalidSpeedDial)
      .set({ Authorization: 'Bearer token' });
    expect(db.SpeedDial.create).toBeCalledTimes(1);
    expect(res.status).toBe(400);
  });
});

describe('should test the updateSpeedDial Controller', () => {
  const updatedSpeedDial = {
    contactName: 'Bob',
    contactNumber: '5147894561',
  };

  const invalidSpeedDial = {
    contactName: 'Bob123', // Numbers in name make it invalid
    contactNumber: '514789456',
  };

  const mockFindOne = jest.spyOn(db.SpeedDial, 'findOne');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update speed dial', async () => {
    const mockSpeedDialInstance = {
      update: jest.fn().mockImplementationOnce((data) => {
        Object.assign(mockSpeedDialInstance, data);
        return Promise.resolve([1]);
      }),
    };

    mockFindOne.mockResolvedValueOnce(mockSpeedDialInstance);

    const res = await request(app)
      .put('/api/speed-dials/1/1')
      .send(updatedSpeedDial)
      .set({ Authorization: 'Bearer token' });
    expect(mockFindOne).toBeCalledTimes(4);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(updatedSpeedDial);
  });

  it('should return an error for an invalid speed dial', async () => {
    const res = await request(app)
      .put('/api/speed-dials/1/1')
      .send(invalidSpeedDial)
      .set({ Authorization: 'Bearer token' });
    expect(mockFindOne).not.toBeCalled();
    expect(res.status).toBe(400);
  });

  it('should return an error for a database connection error', async () => {
    mockFindOne.mockRejectedValueOnce(new Error('connection error'));
    const res = await request(app)
      .put('/api/speed-dials/123/1')
      .send(updatedSpeedDial)
      .set({ Authorization: 'Bearer token' });
    expect(mockFindOne).toBeCalledTimes(1);
    expect(res.status).toBe(400);
  });

  it('should return an error for a non-existent speed dial', async () => {
    mockFindOne.mockResolvedValueOnce(null);
    const res = await request(app)
      .put('/api/speed-dials/123/1')
      .send(updatedSpeedDial)
      .set({ Authorization: 'Bearer token' });
    expect(mockFindOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
  });
});

describe('should test the deleteSpeedDial Controller', () => {
  // Mocking findOne
  const mockFindOne = jest.spyOn(db.SpeedDial, 'findOne');

  afterEach(() => {
    jest.clearAllMocks(); // Clears the mock call count after each test
  });

  it('show delete speed dial', async () => {
    const mockSpeedDialInstance = {
      destroy: jest.fn().mockImplementationOnce(() => {
        return Promise.resolve([1]); // Sequelize usually returns the number of affected rows
      }),
    };

    mockFindOne.mockResolvedValueOnce(mockSpeedDialInstance);

    const res = await request(app)
      .delete('/api/speed-dials/1/1')
      .set({ Authorization: 'Bearer token' });
    expect(mockFindOne).toBeCalledTimes(1);
    expect(res.status).toBe(204);
  });

  it('should return an error for a non-existent speed dial', async () => {
    mockFindOne.mockResolvedValueOnce(null);
    const res = await request(app)
      .delete('/api/speed-dials/123/1')
      .set({ Authorization: 'Bearer token' });
    expect(mockFindOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
  });

  it('should return an error for a connection error', async () => {
    mockFindOne.mockRejectedValueOnce(new Error('connection error'));
    const res = await request(app)
      .delete('/api/speed-dials/123/1')
      .set({ Authorization: 'Bearer token' });
    expect(mockFindOne).toBeCalledTimes(1);
    expect(res.status).toBe(400);
  });
});
