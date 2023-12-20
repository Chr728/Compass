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

const glucoseJournal = {
  id: 10,
  uid: 'testuid',
  date: '2020-12-31T00:00:00.000Z',
  mealTime: 'breakfast',
  bloodGlucose: 100,
  unit: 'mg/dL',
  notes: 'test',
};

const invalidGlucoseJournal = {
  id: 10,
  uid: 'testuid',
  date: '2020-12-31T00:00:00.000Z',
  mealTime: 'breakfast',
  bloodGlucose: 100,
  unit: 'mg/dL',
};

const updatedGlucoseJournal = {
  id: 10,
  uid: 'testuid',
  date: '2020-12-31T00:00:00.000Z',
  mealTime: 'lunch',
  bloodGlucose: 200,
  unit: 'mg/dL',
  notes: 'test',
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
  mockFindOne(db.User, user);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Testing the create glucose journal controller', () => {
  it('test to create a glucose journal', async () => {
    mockFindOne(db.User, user);
    mockCreate(db.GlucoseMeasurement, glucoseJournal);

    const res = await request(app)
      .post(`/api/journals/diabetic/glucose/user/${user.uid}`)
      .send(glucoseJournal)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.GlucoseMeasurement.create).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(glucoseJournal);
  });

  it('test the error if the user uid passed is invalid', async () => {
    mockFindOne(db.User, null);
    mockCreate(db.GlucoseMeasurement, glucoseJournal);

    const res = await request(app)
      .post(`/api/journals/diabetic/glucose/user/${user.uid}`)
      .send(glucoseJournal)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.GlucoseMeasurement.create).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('User not found');
  });

  it('test the error if request is not made properly', async () => {
    mockFindOne(db.User, user);
    mockRejectedValueOnce(
      'create',
      db.GlucoseMeasurement,
      new Error('query error')
    );

    const res = await request(app)
      .post(`/api/journals/diabetic/glucose/user/${user.uid}`)
      .send(glucoseJournal)
      .set({ Authorization: 'Bearer token' });
    expect(db.GlucoseMeasurement.create).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });

  it('test the error if data is invalid', async () => {
    mockFindOne(db.User, user);
    mockRejectedValueOnce(
      'create',
      db.GlucoseMeasurement,
      new Error('query error')
    );

    const res = await request(app)
      .post(`/api/journals/diabetic/glucose/user/${user.uid}`)
      .send(invalidGlucoseJournal)
      .set({ Authorization: 'Bearer token' });
    expect(db.GlucoseMeasurement.create).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('Testing the update glucose journal controller', () => {
  it('should update a glucose journal for a user', async () => {
    mockFindOne(db.GlucoseMeasurement, glucoseJournal);
    mockUpdate(db.GlucoseMeasurement, updatedGlucoseJournal);
    mockFindOne(db.GlucoseMeasurement, updatedGlucoseJournal);

    const res = await request(app)
      .put(`/api/journals/diabetic/glucose/${glucoseJournal.id}`)
      .send(updatedGlucoseJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.GlucoseMeasurement.findOne).toBeCalledTimes(2);
    expect(db.GlucoseMeasurement.update).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(updatedGlucoseJournal);
  });

  it('should return an error if the journal is not found ', async () => {
    mockFindOne(db.GlucoseMeasurement, null);
    mockUpdate(db.GlucoseMeasurement, [1]);

    const res = await request(app)
      .put(`/api/journals/diabetic/glucose/${glucoseJournal.id}`)
      .send(glucoseJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.GlucoseMeasurement.findOne).toHaveBeenCalledTimes(1);
    expect(db.GlucoseMeasurement.update).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Glucose Journal not found');
  });

  it('should return an error updating the journal', async () => {
    mockFindOne(db.GlucoseMeasurement, glucoseJournal);
    mockRejectedValueOnce(
      'update',
      db.GlucoseMeasurement,
      new Error('query error')
    );

    const res = await request(app)
      .put(`/api/journals/diabetic/glucose/${glucoseJournal.id}`)
      .send(glucoseJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.GlucoseMeasurement.findOne).toHaveBeenCalledTimes(1);
    expect(db.GlucoseMeasurement.update).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });

  it('should return an error if the journal data is invalid ', async () => {
    mockFindOne(db.GlucoseMeasurement, glucoseJournal);
    mockUpdate(db.GlucoseMeasurement, [1]);

    const res = await request(app)
      .put(`/api/journals/diabetic/glucose/${glucoseJournal.id}`)
      .send(invalidGlucoseJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.GlucoseMeasurement.findOne).toHaveBeenCalledTimes(1);
    expect(db.GlucoseMeasurement.update).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
describe('Testing the delete glucose journal controller', () => {
  it('should delete a glucose journal for a user', async () => {
    mockFindOne(db.GlucoseMeasurement, glucoseJournal);
    mockDestroy(db.GlucoseMeasurement, glucoseJournal);

    const res = await request(app)
      .delete(`/api/journals/diabetic/glucose/${glucoseJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.GlucoseMeasurement.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
  });

  it('should return an error if the journal is not found ', async () => {
    mockFindOne(db.GlucoseMeasurement, null);
    mockDestroy(db.GlucoseMeasurement, 1);

    const res = await request(app)
      .delete(`/api/journals/diabetic/glucose/${glucoseJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.GlucoseMeasurement.findOne).toHaveBeenCalledTimes(1);
    expect(db.GlucoseMeasurement.destroy).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Glucose Journal not found');
  });

  it('should return an error deleting the journal', async () => {
    mockFindOne(db.GlucoseMeasurement, glucoseJournal);
    mockRejectedValueOnce(
      'destroy',
      db.GlucoseMeasurement,
      new Error('query error')
    );

    const res = await request(app)
      .delete(`/api/journals/diabetic/glucose/${glucoseJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.GlucoseMeasurement.findOne).toHaveBeenCalledTimes(1);
    expect(db.GlucoseMeasurement.destroy).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
describe('Testing the get glucose journal controller', () => {
  it('should get a glucose journal for a user', async () => {
    mockFindOne(db.GlucoseMeasurement, glucoseJournal);

    const res = await request(app)
      .get(`/api/journals/diabetic/glucose/${glucoseJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.GlucoseMeasurement.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(glucoseJournal);
  });

  it('should return an error if the journal is not found ', async () => {
    mockFindOne(db.GlucoseMeasurement, null);

    const res = await request(app)
      .get(`/api/journals/diabetic/glucose/${glucoseJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.GlucoseMeasurement.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Glucose Journal not found');
  });

  it('should return an error getting the journal', async () => {
    mockRejectedValueOnce(
      'findOne',
      db.GlucoseMeasurement,
      new Error('query error')
    );

    const res = await request(app)
      .get(`/api/journals/diabetic/glucose/${glucoseJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.GlucoseMeasurement.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
describe('Testing the get glucose journals controller', () => {
  it('should get all glucose journals for a user', async () => {
    mockFindAll(db.GlucoseMeasurement, [glucoseJournal]);

    const res = await request(app)
      .get(`/api/journals/diabetic/glucose/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(db.GlucoseMeasurement.findAll).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual([glucoseJournal]);
  });

  it('should return an error if the user is not found ', async () => {
    mockFindOne(db.User, null);

    const res = await request(app)
      .get(`/api/journals/diabetic/glucose/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('User not found');
  });

  it('should return an error getting the journals', async () => {
    mockRejectedValueOnce(
      'findAll',
      db.GlucoseMeasurement,
      new Error('query error')
    );

    const res = await request(app)
      .get(`/api/journals/diabetic/glucose/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(db.GlucoseMeasurement.findAll).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
