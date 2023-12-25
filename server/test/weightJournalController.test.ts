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

const weightJournal = {
  id: 1,
  uid: 'testuid',
  date: '2023-09-30',
  time: '12:00:00',
  weight: 70,
  height: 175,
  unit: 'kg',
  notes: 'Sample weight entry',
};

const updatedWeightJournal = {
  date: '2023-09-30',
  time: '12:00:00',
  weight: 80,
  height: 200,
  unit: 'kg',
  notes: 'Updated weight entry',
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

describe('Weight Journal Controller Tests', () => {
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

  it('should get weight journals for a user', async () => {
    mockFindAll(db.WeightJournal, [weightJournal]);

    const res = await request(app)
      .get(`/api/journals/weight/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(db.WeightJournal.findAll).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual([weightJournal]);
  });

  it('should get a weight journal for a user', async () => {
    mockFindOne(db.WeightJournal, weightJournal);

    const res = await request(app)
      .get(`/api/journals/weight/${weightJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.WeightJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(weightJournal);
  });

  it('should create a weight journal for a user', async () => {
    mockCreate(db.WeightJournal, weightJournal);

    const res = await request(app)
      .post(`/api/journals/weight/user/${user.uid}`)
      .send(weightJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(db.WeightJournal.create).toBeCalledTimes(1);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(weightJournal);
  });

  it('should update a weight journal for a user', async () => {
    mockFindOne(db.WeightJournal, weightJournal);
    mockUpdate(db.WeightJournal, updatedWeightJournal);
    mockFindOne(db.WeightJournal, updatedWeightJournal);

    const res = await request(app)
      .put(`/api/journals/weight/${weightJournal.id}`)
      .send(updatedWeightJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.WeightJournal.findOne).toBeCalledTimes(2);
    expect(db.WeightJournal.update).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(updatedWeightJournal);
  });

  it('should delete a weight journal for a user', async () => {
    mockFindOne(db.WeightJournal, weightJournal);
    mockDestroy(db.WeightJournal, weightJournal);

    const res = await request(app)
      .delete(`/api/journals/weight/${weightJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.WeightJournal.findOne).toBeCalledTimes(1);
    expect(db.WeightJournal.destroy).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.message).toBe('Weight journal entry deleted successfully');
  });

  it('should handle weight journal not found error', async () => {
    mockFindOne(db.WeightJournal, null);

    const res = await request(app)
      .get(`/api/journals/weight/${weightJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.WeightJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Weight journal entry not found');
  });

  it('should handle weight journal not found error when updating', async () => {
    mockFindOne(db.WeightJournal, null);

    const res = await request(app)
      .put(`/api/journals/weight/${weightJournal.id}`)
      .send(updatedWeightJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.WeightJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Weight journal entry not found');
  });

  it('should handle weight journal not found error when deleting', async () => {
    mockFindOne(db.WeightJournal, null);

    const res = await request(app)
      .delete(`/api/journals/weight/${weightJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.WeightJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Weight journal entry not found');
  });

  it('should handle error when getting weight journals', async () => {
    mockRejectedValueOnce('findAll', db.WeightJournal, 'error');

    const res = await request(app)
      .get(`/api/journals/weight/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toBeCalledTimes(1);
    expect(db.WeightJournal.findAll).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('Error fetching weight journals: error');
  });

  it('should handle error when getting weight journal', async () => {
    mockRejectedValueOnce('findOne', db.WeightJournal, 'error');

    const res = await request(app)
      .get(`/api/journals/weight/${weightJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.WeightJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('Error fetching weight journal entry: error');
  });

  it('should handle error when creating weight journal', async () => {
    mockRejectedValueOnce('create', db.WeightJournal, 'error');

    const res = await request(app)
      .post(`/api/journals/weight/user/${user.uid}`)
      .send(weightJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(db.WeightJournal.create).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('Error creating weight entry: error');
  });

  it('should handle error when updating weight journal', async () => {
    mockRejectedValueOnce('findOne', db.WeightJournal, 'error');

    const res = await request(app)
      .put(`/api/journals/weight/${weightJournal.id}`)
      .send(updatedWeightJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.WeightJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('Error updating weight entry: error');
  });

  it('should handle error when deleting weight journal', async () => {
    mockRejectedValueOnce('findOne', db.WeightJournal, 'error');

    const res = await request(app)
      .delete(`/api/journals/weight/${weightJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.WeightJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('Error deleting weight entry: error');
  });

  it('should handle user not found error for create', async () => {
    mockFindOne(db.User, null);

    const res = await request(app)
      .post(`/api/journals/weight/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('User not found');
  });

  it('should handle user not found error for getallweightjournals', async () => {
    mockFindOne(db.User, null);

    const res = await request(app)
      .get(`/api/journals/weight/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('User not found');
  });
});
