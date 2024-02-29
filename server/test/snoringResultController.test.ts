import request from 'supertest';
import app from '../index';
import db from '../models';
import {
  user,
  startServer,
  stopServer,
  mockCreate,
  mockDestroy,
  mockFindAll,
  mockFindOne,
  mockTokenVerification,
  mockUpdate,
  mockRejectedValueOnce,
} from '../utils/journalsTestHelper';

const snoringResult = {
  id: 1,
  uid: 'testuid',
  date: '2020-12-31T00:00:00.000Z',
  filename: 'testfilename',
  result: 'testresult',
};

const invalidSnoringResult = {
  id: 'hvhg',
  uid: 'testuid',
  date: '2020-12-31T00:00:00.000Z',
};

const mockedDecodedToken = {
  uid: 'testuid',
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
  startServer();
});

afterAll(() => {
  stopServer();
});

beforeEach(() => {
  mockTokenVerification(mockedDecodedToken);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Testing the create SnoringResult controller', () => {
  it('test to create a snoring result', async () => {
    mockFindOne(db.User, user);
    mockCreate(db.SnoringResult, snoringResult);

    const res = await request(app)
      .post(`/api/snoringAI/user/${user.uid}`)
      .send(snoringResult)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.SnoringResult.create).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(snoringResult);
  });

  it('test the error if the user uid passed is invalid', async () => {
    mockFindOne(db.User, null);
    mockCreate(db.SnoringResult, snoringResult);

    const res = await request(app)
      .post(`/api/snoringAI/user/${user.uid}`)
      .send(snoringResult)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.SnoringResult.create).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('User not found');
  });

  it('test the error if request is not made properly', async () => {
    mockFindOne(db.User, user);
    mockRejectedValueOnce('create', db.SnoringResult, new Error('query error'));

    const res = await request(app)
      .post(`/api/snoringAI/user/${user.uid}`)
      .send(snoringResult)
      .set({ Authorization: 'Bearer token' });

    expect(db.SnoringResult.create).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('Testing the delete Snoring Result controller', () => {
  it('should delete an Snoring Resultl for a user', async () => {
    mockFindOne(db.SnoringResult, snoringResult);
    mockDestroy(db.SnoringResult, snoringResult);

    const res = await request(app)
      .delete(`/api/snoringAI/${snoringResult.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.SnoringResult.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
  });

  it('should return an error if the Snoring Result is not found ', async () => {
    mockFindOne(db.SnoringResult, null);
    mockDestroy(db.SnoringResult, 1);

    const res = await request(app)
      .delete(`/api/snoringAI/${snoringResult.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.SnoringResult.findOne).toHaveBeenCalledTimes(1);
    expect(db.SnoringResult.destroy).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Snoring result not found');
  });

  it('should return an error deleting the Snoring Result', async () => {
    mockFindOne(db.SnoringResult, snoringResult);
    mockRejectedValueOnce(
      'destroy',
      db.SnoringResult,
      new Error('query error')
    );

    const res = await request(app)
      .delete(`/api/snoringAI/${snoringResult.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.SnoringResult.findOne).toHaveBeenCalledTimes(1);
    expect(db.SnoringResult.destroy).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('Testing the get Snoring Result controller', () => {
  it('should get an Snoring Result for a user', async () => {
    mockFindOne(db.SnoringResult, snoringResult);

    const res = await request(app)
      .get(`/api/snoringAI/${snoringResult.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.SnoringResult.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(snoringResult);
  });

  it('should return an error if the Snoring Result is not found ', async () => {
    mockFindOne(db.SnoringResult, null);

    const res = await request(app)
      .get(`/api/snoringAI/${snoringResult.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.SnoringResult.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Snoring result not found');
  });

  it('should return an error getting the Snoring Result', async () => {
    mockRejectedValueOnce(
      'findOne',
      db.SnoringResult,
      new Error('query error')
    );

    const res = await request(app)
      .get(`/api/snoringAI/${snoringResult.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.SnoringResult.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('Testing the get Snoring Result controller', () => {
  it('should get all Snoring Result for a user', async () => {
    mockFindOne(db.User, user);
    mockFindAll(db.SnoringResult, [snoringResult]);

    const res = await request(app)
      .get(`/api/snoringAI/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.SnoringResult.findAll).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual([snoringResult]);
  });

  it('should return an error if the user is not found ', async () => {
    mockFindOne(db.User, null);

    const res = await request(app)
      .get(`/api/snoringAI/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('User not found');
  });

  it('should return an error getting the Snoring Result', async () => {
    mockFindOne(db.User, user);
    mockRejectedValueOnce(
      'findAll',
      db.SnoringResult,
      new Error('query error')
    );

    const res = await request(app)
      .get(`/api/snoringAI/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.SnoringResult.findAll).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
