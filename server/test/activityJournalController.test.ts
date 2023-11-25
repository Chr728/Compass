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

const activityJournal = {
  id: 1,
  uid: 'testuid',
  date: '2023-09-30',
  time: '12:00:00',
  activity: 'running',
  duration: 175,
  notes: 'Sample activity entry',
};

const updatedActivityJournal = {
  date: '2023-09-30',
  time: '12:00:00',
  activity: 70,
  duration: 175,
  notes: 'Sample activity entry',
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

describe('activity Journal Controller Tests', () => {
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

  it('should get activity journals for a user', async () => {
    jest
      .spyOn(db.ActivityJournal, 'findAll')
      .mockResolvedValueOnce([activityJournal]);

    const res = await request(app)
      .get(`/api/journals/activity/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(db.ActivityJournal.findAll).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual([activityJournal]);
  });

  it('should get a activity journal for a user', async () => {
    jest
      .spyOn(db.ActivityJournal, 'findOne')
      .mockResolvedValueOnce(activityJournal);

    const res = await request(app)
      .get(`/api/journals/activity/${activityJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.ActivityJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(activityJournal);
  });

  it('should create a activity journal for a user', async () => {
    jest
      .spyOn(db.ActivityJournal, 'create')
      .mockResolvedValueOnce(activityJournal);

    const res = await request(app)
      .post(`/api/journals/activity/user/${user.uid}`)
      .send(activityJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(db.ActivityJournal.create).toBeCalledTimes(1);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(activityJournal);
  });

  it('should update a activity journal for a user', async () => {
    jest
      .spyOn(db.ActivityJournal, 'findOne')
      .mockResolvedValueOnce(activityJournal);
    jest
      .spyOn(db.ActivityJournal, 'update')
      .mockResolvedValueOnce([1, [updatedActivityJournal]]);

    jest
      .spyOn(db.ActivityJournal, 'findOne')
      .mockResolvedValueOnce(updatedActivityJournal);

    const res = await request(app)
      .put(`/api/journals/activity/${activityJournal.id}`)
      .send(updatedActivityJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.ActivityJournal.findOne).toBeCalledTimes(2);
    expect(db.ActivityJournal.update).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(updatedActivityJournal);
  });

  it('should delete a activity journal for a user', async () => {
    jest
      .spyOn(db.ActivityJournal, 'findOne')
      .mockResolvedValueOnce(activityJournal);
    jest
      .spyOn(db.ActivityJournal, 'destroy')
      .mockResolvedValueOnce([1, [activityJournal]]);

    const res = await request(app)
      .delete(`/api/journals/activity/${activityJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.ActivityJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.message).toBe(
      'Activity journal entry deleted successfully'
    );
  });

  it('should handle activity journal not found error', async () => {
    jest.spyOn(db.ActivityJournal, 'findOne').mockResolvedValueOnce(null);

    const res = await request(app)
      .get(`/api/journals/activity/${activityJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.ActivityJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Activity Journal not found');
  });

  it('should handle activity journal not found error when updating', async () => {
    jest.spyOn(db.ActivityJournal, 'findOne').mockResolvedValueOnce(null);

    const res = await request(app)
      .put(`/api/journals/activity/${activityJournal.id}`)
      .send(updatedActivityJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.ActivityJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Activity Journal not found');
  });

  it('should handle activity journal not found error when deleting', async () => {
    jest.spyOn(db.ActivityJournal, 'findOne').mockResolvedValueOnce(null);

    const res = await request(app)
      .delete(`/api/journals/activity/${activityJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.ActivityJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Activity journal entry not found');
  });

  it('should handle error when getting activity journals', async () => {
    jest.spyOn(db.ActivityJournal, 'findAll').mockRejectedValueOnce('error');

    const res = await request(app)
      .get(`/api/journals/activity/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(db.ActivityJournal.findAll).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('Error fetching activity journals: error');
  });

  it('should handle error when getting activity journal', async () => {
    jest.spyOn(db.ActivityJournal, 'findOne').mockRejectedValueOnce('error');

    const res = await request(app)
      .get(`/api/journals/activity/${activityJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.ActivityJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('Error fetching activity journal: error');
  });

  it('should handle error when creating activity journal', async () => {
    jest.spyOn(db.ActivityJournal, 'create').mockRejectedValueOnce('error');

    const res = await request(app)
      .post(`/api/journals/activity/user/${user.uid}`)
      .send(activityJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(db.ActivityJournal.create).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('Error creating activity journal: error');
  });

  it('should handle error when updating activity journal', async () => {
    jest.spyOn(db.ActivityJournal, 'findOne').mockRejectedValueOnce('error');

    const res = await request(app)
      .put(`/api/journals/activity/${activityJournal.id}`)
      .send(updatedActivityJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.ActivityJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('Error updating activity journal: error');
  });

  it('should handle error when deleting activity journal', async () => {
    jest.spyOn(db.ActivityJournal, 'findOne').mockRejectedValueOnce('error');

    const res = await request(app)
      .delete(`/api/journals/activity/${activityJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.ActivityJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('Error deleting activity journal: error');
  });

  it('should handle user not found error for create', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(null);

    const res = await request(app)
      .post(`/api/journals/activity/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('User not found');
  });

  it('should handle user not found error for getAllActivityJournals', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(null);

    const res = await request(app)
      .get(`/api/journals/activity/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('User not found');
  });
});
