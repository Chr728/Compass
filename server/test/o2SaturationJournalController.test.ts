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

const o2SaturationJournal = {
  id: 10,
  uid: 'testuid',
  date: '2020-12-31T00:00:00.000Z',
  time: '08:00',
  o2sat: 98,
  pulse: 70,
  activityLevel: 'normal',
  notes: 'test',
};

const invalidO2SaturationJournal = {
  id: 10,
  uid: 'testuid',
  date: '2020-12-31T00:00:00.000Z',
  time: '08:00',
  o2sat: 98,
  pulse: 70,
  activityLevel: 'normal',
};

const updatedO2SaturationJournal = {
  id: 10,
  uid: 'testuid',
  date: '2020-12-31T00:00:00.000Z',
  time: '10:00',
  o2sat: 96,
  pulse: 80,
  activityLevel: 'high',
  notes: 'updated test',
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

describe('Testing the create O2SaturationJournals controller', () => {
  it('test to create a glucose journal', async () => {
    mockFindOne(db.User, user);
    mockCreate(db.O2SaturationJournal, o2SaturationJournal);

    const res = await request(app)
      .post(`/api/journals/o2Saturation/user/${user.uid}`)
      .send(o2SaturationJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.O2SaturationJournal.create).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(o2SaturationJournal);
  });
  it('test the error if the user uid passed is invalid', async () => {
    mockFindOne(db.User, null);
    mockCreate(db.O2SaturationJournal, o2SaturationJournal);

    const res = await request(app)
      .post(`/api/journals/o2Saturation/user/${user.uid}`)
      .send(o2SaturationJournal)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.O2SaturationJournal.create).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('User not found');
  });

  it('test the error if request is not made properly', async () => {
    mockFindOne(db.User, user);
    mockRejectedValueOnce(
      'create',
      db.O2SaturationJournal,
      new Error('query error')
    );

    const res = await request(app)
      .post(`/api/journals/o2Saturation/user/${user.uid}`)
      .send(o2SaturationJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.O2SaturationJournal.create).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });

  it('test the error if the data is invalid', async () => {
    mockFindOne(db.User, user);
    mockRejectedValueOnce(
      'create',
      db.O2SaturationJournal,
      o2SaturationJournal
    );

    const res = await request(app)
      .post(`/api/journals/o2Saturation/user/${user.uid}`)
      .send(invalidO2SaturationJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.O2SaturationJournal.create).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('Testing the update O2SaturationJournal controller', () => {
  it('should update an O2 saturation journal for a user', async () => {
    mockFindOne(db.O2SaturationJournal, o2SaturationJournal);
    mockUpdate(db.O2SaturationJournal, updatedO2SaturationJournal);
    mockFindOne(db.O2SaturationJournal, updatedO2SaturationJournal);

    const res = await request(app)
      .put(`/api/journals/o2Saturation/${o2SaturationJournal.id}`)
      .send(updatedO2SaturationJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.O2SaturationJournal.findOne).toBeCalledTimes(2);
    expect(db.O2SaturationJournal.update).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(updatedO2SaturationJournal);
  });

  it('should return an error if the journal is not found ', async () => {
    mockFindOne(db.O2SaturationJournal, null);
    mockUpdate(db.O2SaturationJournal, [1]);

    const res = await request(app)
      .put(`/api/journals/o2Saturation/${o2SaturationJournal.id}`)
      .send(o2SaturationJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.O2SaturationJournal.findOne).toHaveBeenCalledTimes(1);
    expect(db.O2SaturationJournal.update).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('O2 Saturation Journal not found');
  });

  it('should return an error updating the journal', async () => {
    mockFindOne(db.O2SaturationJournal, o2SaturationJournal);
    mockRejectedValueOnce(
      'update',
      db.O2SaturationJournal,
      new Error('query error')
    );

    const res = await request(app)
      .put(`/api/journals/o2Saturation/${o2SaturationJournal.id}`)
      .send(o2SaturationJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.O2SaturationJournal.findOne).toHaveBeenCalledTimes(1);
    expect(db.O2SaturationJournal.update).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });

  it('should return an error if the data is invalid when updating the journal', async () => {
    mockFindOne(db.O2SaturationJournal, o2SaturationJournal);
    mockRejectedValueOnce(
      'update',
      db.O2SaturationJournal,
      updatedO2SaturationJournal
    );

    const res = await request(app)
      .put(`/api/journals/o2Saturation/${o2SaturationJournal.id}`)
      .send(invalidO2SaturationJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.O2SaturationJournal.findOne).toHaveBeenCalledTimes(1);
    expect(db.O2SaturationJournal.update).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('Testing the delete O2SaturationJournal controller', () => {
  it('should delete an O2 saturation journal for a user', async () => {
    mockFindOne(db.O2SaturationJournal, o2SaturationJournal);
    mockDestroy(db.O2SaturationJournal, o2SaturationJournal);

    const res = await request(app)
      .delete(`/api/journals/o2Saturation/${o2SaturationJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.O2SaturationJournal.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
  });

  it('should return an error if the journal is not found ', async () => {
    mockFindOne(db.O2SaturationJournal, null);
    mockDestroy(db.O2SaturationJournal, 1);

    const res = await request(app)
      .delete(`/api/journals/o2Saturation/${o2SaturationJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.O2SaturationJournal.findOne).toHaveBeenCalledTimes(1);
    expect(db.O2SaturationJournal.destroy).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('O2 Saturation Journal not found');
  });

  it('should return an error deleting the journal', async () => {
    mockFindOne(db.O2SaturationJournal, o2SaturationJournal);
    mockRejectedValueOnce(
      'destroy',
      db.O2SaturationJournal,
      new Error('query error')
    );

    const res = await request(app)
      .delete(`/api/journals/o2Saturation/${o2SaturationJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.O2SaturationJournal.findOne).toHaveBeenCalledTimes(1);
    expect(db.O2SaturationJournal.destroy).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('Testing the get O2SaturationJournal controller', () => {
  it('should get an O2 saturation journal for a user', async () => {
    mockFindOne(db.O2SaturationJournal, o2SaturationJournal);

    const res = await request(app)
      .get(`/api/journals/o2Saturation/${o2SaturationJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.O2SaturationJournal.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(o2SaturationJournal);
  });

  it('should return an error if the journal is not found ', async () => {
    mockFindOne(db.O2SaturationJournal, null);

    const res = await request(app)
      .get(`/api/journals/o2Saturation/${o2SaturationJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.O2SaturationJournal.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('O2 Saturation Journal not found');
  });

  it('should return an error getting the journal', async () => {
    mockRejectedValueOnce(
      'findOne',
      db.O2SaturationJournal,
      new Error('query error')
    );

    const res = await request(app)
      .get(`/api/journals/o2Saturation/${o2SaturationJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.O2SaturationJournal.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('Testing the get O2SaturationJournals controller', () => {
  it('should get all O2 saturation journals for a user', async () => {
    mockFindOne(db.User, user);
    mockFindAll(db.O2SaturationJournal, [o2SaturationJournal]);

    const res = await request(app)
      .get(`/api/journals/o2Saturation/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.O2SaturationJournal.findAll).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual([o2SaturationJournal]);
  });

  it('should return an error if the user is not found ', async () => {
    mockFindOne(db.User, null);

    const res = await request(app)
      .get(`/api/journals/o2Saturation/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('User not found');
  });

  it('should return an error getting the journals', async () => {
    mockFindOne(db.User, user);
    mockRejectedValueOnce(
      'findAll',
      db.O2SaturationJournal,
      new Error('query error')
    );

    const res = await request(app)
      .get(`/api/journals/o2Saturation/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.O2SaturationJournal.findAll).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
