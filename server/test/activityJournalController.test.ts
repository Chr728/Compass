import request from 'supertest';
import app from '../index';
import db from '../models';
import {
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
import admin from 'firebase-admin';
import {ErrorHandler} from '../middlewares/errorMiddleware';

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

const invalidActivityJournal = {
  id: 1,
  uid: 'testuid',
  date: '2023-09-30',
  time: '12:00:00',
  activity: 'running',
  duration: '175',
  notes: 'Sample activity entry',
};

const updatedActivityJournal = {
  date: '2023-09-30',
  time: '12:00:00',
  activity: 'swimming',
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

describe('activity Journal Controller Tests', () => {
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

  it('should get activity journals for a user', async () => {
    mockFindAll(db.ActivityJournal, [activityJournal]);

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
    mockFindOne(db.ActivityJournal, activityJournal);

    const res = await request(app)
      .get(`/api/journals/activity/${activityJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.ActivityJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(activityJournal);
  });

  it('should create a activity journal for a user', async () => {
    mockCreate(db.ActivityJournal, activityJournal);

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
    mockFindOne(db.ActivityJournal, activityJournal);
    mockUpdate(db.ActivityJournal, updatedActivityJournal);
    mockFindOne(db.ActivityJournal, updatedActivityJournal);

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
    mockFindOne(db.ActivityJournal, activityJournal);
    mockDestroy(db.ActivityJournal, activityJournal);

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
    mockFindOne(db.ActivityJournal, null);

    const res = await request(app)
      .get(`/api/journals/activity/${activityJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.ActivityJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Activity Journal not found');
  });

  it('should handle activity journal not found error when updating', async () => {
    mockFindOne(db.ActivityJournal, null);

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
    mockFindOne(db.ActivityJournal, null);

    const res = await request(app)
      .delete(`/api/journals/activity/${activityJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.ActivityJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Activity journal entry not found');
  });

  it('should handle error when getting activity journals', async () => {
    mockRejectedValueOnce('findAll', db.ActivityJournal, 'error');

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
    mockRejectedValueOnce('findOne', db.ActivityJournal, 'error');

    const res = await request(app)
      .get(`/api/journals/activity/${activityJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.ActivityJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('Error fetching activity journal: error');
  });

  it('should handle error when creating activity journal', async () => {
    jest.spyOn(db.ActivityJournal, 'create').mockRejectedValueOnce(new ErrorHandler(400,'ERROR','Error creating activity journal: error'));

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
    mockRejectedValueOnce('findOne', db.ActivityJournal, 'error');

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
    mockRejectedValueOnce('findOne', db.ActivityJournal, 'error');

    const res = await request(app)
      .delete(`/api/journals/activity/${activityJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.ActivityJournal.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('Error deleting activity journal: error');
  });

  it('should handle user not found error for create', async () => {
    mockFindOne(db.User, null);
    const res = await request(app)
      .post(`/api/journals/activity/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('User not found');
  });

  it('should handle user not found error for getAllActivityJournals', async () => {
    mockFindOne(db.User, null);

    const res = await request(app)
      .get(`/api/journals/activity/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('User not found');
  });

  it('should throw error for invalid data when creating a activity journal for a user', async () => {
    mockCreate(db.ActivityJournal, activityJournal);

    const res = await request(app)
      .post(`/api/journals/activity/user/${user.uid}`)
      .send(invalidActivityJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(db.ActivityJournal.create).toBeCalledTimes(0);
    expect(res.status).toBe(400);
  });

  it('should throw error for invalid data when updating a activity journal for a user', async () => {
    mockFindOne(db.ActivityJournal, activityJournal);
    mockUpdate(db.ActivityJournal, updatedActivityJournal);
    mockFindOne(db.ActivityJournal, updatedActivityJournal);

    const res = await request(app)
      .put(`/api/journals/activity/${activityJournal.id}`)
      .send(invalidActivityJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.ActivityJournal.findOne).toBeCalledTimes(1);
    expect(db.ActivityJournal.update).toBeCalledTimes(0);
    expect(res.status).toBe(400);
  });
});
