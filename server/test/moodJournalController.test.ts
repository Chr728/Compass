import request from 'supertest';
import app from '../index';
import db from '../models';
import admin from 'firebase-admin';

let server: any;
const port = process.env.SERVER_DEV_PORT;

const user = {
  id: 10,
  uid: 'testuid',
  email: 'test@gmail.com',
  firstName: 'John',
  lastName: 'Doe',
  phoneNumber: '5147894561',
  birthDate: '1990-12-31T00:00:00.000Z',
  sex: 'male',
};

const moodJournal = {
  id: 1,
  uid: 'testuid',
  howAreYou: 'Good',
  stressSignals: JSON.stringify({ '1': 'rarely', '7': 'never' }),
  date: '2023-10-08T10:00:00Z',
  notes: 'Sample mood entry',
};

const updateMoodJournal = {
  uid: 'testuid',
  howAreYou: 'Horrible',
  stressSignals: JSON.stringify({ '1': 'Often', '7': 'never' }),
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

function startServer() {
  server = app.listen(port);
}

function stopServer() {
  if (server) {
    server.close();
  }
}

describe('Mood Journal Controllern Tests', () => {
  beforeAll(() => {
    startServer();
  });

  afterAll(() => {
    stopServer();
  });

  beforeEach(() => {
    jest
      .spyOn(admin.auth(), 'verifyIdToken')
      .mockResolvedValue(mockedDecodedToken);
    jest.spyOn(db.User, 'findOne').mockResolvedValue(user);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should get mood journals for a user', async () => {
    jest.spyOn(db.MoodJournal, 'findAll').mockResolvedValueOnce([moodJournal]);

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
    jest.spyOn(db.MoodJournal, 'findOne').mockResolvedValueOnce(moodJournal);

    const res = await request(app)
      .get(`/api/journals/mood/${moodJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.MoodJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(moodJournal);
  });

  it('should create a mood journal for a user', async () => {
    jest.spyOn(db.MoodJournal, 'create').mockResolvedValueOnce(moodJournal);

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
    jest.spyOn(db.MoodJournal, 'findOne').mockResolvedValueOnce(moodJournal);
    jest
      .spyOn(db.MoodJournal, 'update')
      .mockResolvedValueOnce([1, [updateMoodJournal]]);

    jest
      .spyOn(db.MoodJournal, 'findOne')
      .mockResolvedValueOnce(updateMoodJournal);

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
    jest.spyOn(db.MoodJournal, 'findOne').mockResolvedValueOnce(moodJournal);
    jest
      .spyOn(db.MoodJournal, 'destroy')
      .mockResolvedValueOnce([1, [moodJournal]]);

    const res = await request(app)
      .delete(`/api/journals/mood/${moodJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.MoodJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.message).toBe('Mood Journal deleted successfully');
  });

  it('should handle mood journal not found error', async () => {
    jest.spyOn(db.MoodJournal, 'findOne').mockResolvedValueOnce(null);

    const res = await request(app)
      .get(`/api/journals/mood/${moodJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.MoodJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Mood Journal not found');
  });

  it('should handle mood journal not found error when updating', async () => {
    jest.spyOn(db.MoodJournal, 'findOne').mockResolvedValueOnce(null);

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
    jest.spyOn(db.MoodJournal, 'findOne').mockResolvedValueOnce(null);

    const res = await request(app)
      .delete(`/api/journals/mood/${moodJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.MoodJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Mood Journal not found');
  });

  it('should handle error when getting mood journals', async () => {
    jest.spyOn(db.MoodJournal, 'findAll').mockRejectedValueOnce(new Error());

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
    jest.spyOn(db.MoodJournal, 'findOne').mockRejectedValueOnce(new Error());

    const res = await request(app)
      .get(`/api/journals/mood/${moodJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.MoodJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('Error fetching mood journal: Error');
  });

  it('should handle error when creating mood journal', async () => {
    jest.spyOn(db.MoodJournal, 'create').mockRejectedValueOnce(new Error());

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
    jest.spyOn(db.MoodJournal, 'findOne').mockResolvedValueOnce(moodJournal);
    jest.spyOn(db.MoodJournal, 'update').mockRejectedValueOnce(new Error());

    const res = await request(app)
      .put(`/api/journals/mood/${moodJournal.id}`)
      .send(updateMoodJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.MoodJournal.findOne).toBeCalledTimes(1);
    expect(db.MoodJournal.update).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('Error updating mood journal: Error');
  });

  it('should handle error when deleting mood journal', async () => {
    jest.spyOn(db.MoodJournal, 'findOne').mockResolvedValueOnce(moodJournal);
    jest.spyOn(db.MoodJournal, 'destroy').mockRejectedValueOnce(new Error());

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
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(null);

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
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(null);

    const res = await request(app)
      .get(`/api/journals/mood/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('User not found');
  });
});
