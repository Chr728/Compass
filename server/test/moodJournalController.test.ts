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

const moodJournal = {
  id: 1,
  uid: 'testuid',
  howAreYou: 'Good',
  stressSignals: {
    tired: 'rarely',
    sleep: 'sometimes',
    hunger: 'sometimes',
    overeating: 'rarely',
    depressed: 'often',
    pressure: 'rarely',
    anxiety: 'rarely',
    attention: 'never',
    anger: 'never',
    headache: 'sometimes',
  },
  date: '2023-10-08T10:00:00Z',
  notes: 'Sample mood entry',
};

const updateMoodJournal = {
  uid: 'testuid',
  howAreYou: 'Horrible',
  stressSignals: {
    tired: 'rarely',
    sleep: 'sometimes',
    hunger: 'sometimes',
    overeating: 'rarely',
    depressed: 'often',
    pressure: 'rarely',
    anxiety: 'rarely',
    attention: 'never',
    anger: 'never',
    headache: 'sometimes',
  },
  date: '2023-10-08T10:00:00Z',
  notes: 'Updated Sample mood entry',
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

describe('Mood Journal Controllern Tests', () => {
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

  it('should get mood journals for a user', async () => {
    mockFindAll(db.MoodJournal, [moodJournal]);

    const res = await request(app)
      .get(`/api/journals/mood/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(db.MoodJournal.findAll).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual([moodJournal]);
  });

  it('should get a mood journal for a user', async () => {
    mockFindOne(db.MoodJournal, moodJournal);

    const res = await request(app)
      .get(`/api/journals/mood/${moodJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.MoodJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(moodJournal);
  });

  it('should create a mood journal for a user', async () => {
    mockCreate(db.MoodJournal, moodJournal);

    const res = await request(app)
      .post(`/api/journals/mood/user/${user.uid}`)
      .send(moodJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(db.MoodJournal.create).toBeCalledTimes(1);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(moodJournal);
  });

  it('should update a mood journal for a user', async () => {
    mockFindOne(db.MoodJournal, moodJournal);
    mockUpdate(db.MoodJournal, updateMoodJournal);
    mockFindOne(db.MoodJournal, updateMoodJournal);

    const res = await request(app)
      .put(`/api/journals/mood/${moodJournal.id}`)
      .send(updateMoodJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.MoodJournal.findOne).toBeCalledTimes(2);
    expect(db.MoodJournal.update).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(updateMoodJournal);
  });

  it('should delete a mood journal for a user', async () => {
    mockFindOne(db.MoodJournal, moodJournal);
    mockDestroy(db.MoodJournal, moodJournal);

    const res = await request(app)
      .delete(`/api/journals/mood/${moodJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.MoodJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.message).toBe('Mood Journal deleted successfully');
  });

  it('should handle mood journal not found error', async () => {
    mockFindOne(db.MoodJournal, null);

    const res = await request(app)
      .get(`/api/journals/mood/${moodJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.MoodJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Mood Journal not found');
  });

  it('should handle mood journal not found error when updating', async () => {
    mockFindOne(db.MoodJournal, null);

    const res = await request(app)
      .put(`/api/journals/mood/${moodJournal.id}`)
      .send(updateMoodJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.MoodJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Mood Journal not found');
  });

  it('should handle mood journal not found error when deleting', async () => {
    mockFindOne(db.MoodJournal, null);

    const res = await request(app)
      .delete(`/api/journals/mood/${moodJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.MoodJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Mood Journal not found');
  });

  it('should handle error when getting mood journals', async () => {
    mockRejectedValueOnce('findAll', db.MoodJournal, new Error());

    const res = await request(app)
      .get(`/api/journals/mood/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(db.MoodJournal.findAll).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('Error fetching mood journals: Error');
  });

  it('should handle error when getting mood journal', async () => {
    mockRejectedValueOnce('findOne', db.MoodJournal, new Error());

    const res = await request(app)
      .get(`/api/journals/mood/${moodJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.MoodJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('Error fetching mood journal: Error');
  });

  it('should handle error when creating mood journal', async () => {
    mockRejectedValueOnce('create', db.MoodJournal, new Error());

    const res = await request(app)
      .post(`/api/journals/mood/user/${user.uid}`)
      .send(moodJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(db.MoodJournal.create).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('Error creating mood journal: Error');
  });

  it('should handle error when updating mood journal', async () => {
    mockFindOne(db.MoodJournal, moodJournal);
    mockRejectedValueOnce('update', db.MoodJournal, new Error());

    const res = await request(app)
      .put(`/api/journals/mood/${moodJournal.id}`)
      .send(updateMoodJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.MoodJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });

  it('should handle error when deleting mood journal', async () => {
    mockFindOne(db.MoodJournal, moodJournal);
    mockRejectedValueOnce('destroy', db.MoodJournal, new Error());

    const res = await request(app)
      .delete(`/api/journals/mood/${moodJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.MoodJournal.findOne).toBeCalledTimes(1);
    expect(db.MoodJournal.destroy).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('Error deleting mood journal: Error');
  });

  it('should handle user not found error for create', async () => {
    mockFindOne(db.User, null);

    const res = await request(app)
      .post(`/api/journals/mood/user/${user.uid}`)
      .send(moodJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('User not found');
  });

  it('should handle user not found error for getAllActivityJournals', async () => {
    mockFindOne(db.User, null);

    const res = await request(app)
      .get(`/api/journals/mood/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('User not found');
  });
});
