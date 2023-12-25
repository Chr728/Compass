import request from 'supertest';
import app from '../index';
import db from '../models/index';
import admin from 'firebase-admin';
import { startServer, stopServer } from '../utils/journalsTestHelper';

let server: any;
const port = process.env.PORT;


const user = {
  id: 1,
  uid: 'uid',
  email: 'test@gmail.com',
  firstName: 'test',
  lastName: 'test',
  phoneNumber: '5149872835',
  birthDate: '2001-11-23',
  sex: 'male',
};

const subscription = {
  id: 0,
  uid: 'uid',
  subscription: {
    key: {
      key1: 'userKey1',
      key2: 'userKey2',
    },
    endpoint: 'userEndPoint',
  },
};

const updateSubscription = {
  id: 0,
  uid: 'uid',
  subscription: {
    key: {
      key1: 'newUserKey1',
      key2: 'newUserKey2',
    },
    endpoint: 'newUserEndPoint',
  },
};

const mockedDecodedToken = {
  uid: 'uid',
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

afterAll(() => {
  stopServer(); // Stop the server after all tests are done
});

beforeEach(() => {
  jest
    .spyOn(admin.auth(), 'verifyIdToken')
    .mockResolvedValue(mockedDecodedToken);
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Testing the create subscription controller', () => {
  it('test to create subscription', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest.spyOn(db.Subscription, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(db.Subscription, 'create').mockResolvedValueOnce(subscription);
    const res = await request(app)
      .post('/api/subscription/uid')
      .send(subscription)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.Subscription.findOne).toHaveBeenCalledTimes(1);
    expect(db.Subscription.create).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(subscription);
  });

  it('test the error if the user uid passed is invalid', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(db.Subscription, 'create').mockResolvedValueOnce(subscription);
    const res = await request(app)
      .post('/api/subscription/uid')
      .send(subscription)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.Subscription.create).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('User not found, invalid user uid.');
  });

  it('test the error if user already has one subscription', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest.spyOn(db.Subscription, 'findOne').mockResolvedValueOnce(subscription);
    jest.spyOn(db.Subscription, 'create').mockResolvedValue(subscription);
    const res = await request(app)
      .post('/api/subscription/uid')
      .send(subscription)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.Subscription.findOne).toHaveBeenCalledTimes(1);
    expect(db.Subscription.create).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe(
      'The user already has one subscription, please update instead!'
    );
  });

  it('test the error if request is not made properly', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(db.Subscription, 'create')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .post('/api/subscription/uid')
      .send('')
      .set({ Authorization: 'Bearer token' });
    expect(db.Subscription.create).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('Testing the get subscription controller', () => {
  it('test to get subscription', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest.spyOn(db.Subscription, 'findOne').mockResolvedValueOnce(subscription);
    const res = await request(app)
      .get('/api/subscription/uid')
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.Subscription.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(subscription);
  });

  it('test the error if the user uid passed is invalid', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(db.Subscription, 'findOne').mockResolvedValueOnce(subscription);
    const res = await request(app)
      .get('/api/subscription/uid')
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.Subscription.findOne).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('User not found, invalid user uid.');
  });

  it('test the error if user has no subscription', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest.spyOn(db.Subscription, 'findOne').mockResolvedValueOnce(null);
    const res = await request(app)
      .get('/api/subscription/uid')
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.Subscription.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe(
      'No subscription exist for this user, please create.'
    );
  });

  it('test the error if request is not made properly', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(db.Subscription, 'findOne')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .get('/api/subscription/uid')
      .set({ Authorization: 'Bearer token' });
    expect(db.Subscription.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('Testing the update subscription controller', () => {
  it('test to update subscription', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest.spyOn(db.Subscription, 'findOne').mockResolvedValueOnce(subscription);
    jest
      .spyOn(db.Subscription, 'update')
      .mockResolvedValueOnce(updateSubscription);
    jest
      .spyOn(db.Subscription, 'findOne')
      .mockResolvedValueOnce(updateSubscription);
    const res = await request(app)
      .put('/api/subscription/uid')
      .send(updateSubscription)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.Subscription.update).toHaveBeenCalledTimes(1);
    expect(db.Subscription.findOne).toHaveBeenCalledTimes(2);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(updateSubscription);
  });

  it('test the error if the user uid passed is invalid', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(db.Subscription, 'findOne').mockResolvedValueOnce(subscription);
    const res = await request(app)
      .put('/api/subscription/uid')
      .send(updateSubscription)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.Subscription.findOne).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('User not found, invalid user uid.');
  });

  it('test the error if user has no subscription', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest.spyOn(db.Subscription, 'findOne').mockResolvedValueOnce(null);
    const res = await request(app)
      .put('/api/subscription/uid')
      .send(updateSubscription)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.Subscription.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('No subscription exist for this user.');
  });

  it('test the error if request is not made properly', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(db.Subscription, 'findOne')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .put('/api/subscription/uid')
      .send(updateSubscription)
      .set({ Authorization: 'Bearer token' });
    expect(db.Subscription.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('Testing the delete subscription controller', () => {
  it('test to delete subscription', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest.spyOn(db.Subscription, 'findOne').mockResolvedValueOnce(subscription);
    jest.spyOn(db.Subscription, 'destroy').mockResolvedValueOnce(true);
    const res = await request(app)
      .delete('/api/subscription/uid')
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.Subscription.findOne).toHaveBeenCalledTimes(1);
    expect(db.Subscription.destroy).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.message).toBe('Successfully deleted subscription.');
  });

  it('test the error if the user uid passed is invalid', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(db.Subscription, 'findOne').mockResolvedValueOnce(subscription);
    const res = await request(app)
      .delete('/api/subscription/uid')
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.Subscription.findOne).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('User not found, invalid user uid.');
  });

  it('test the error if user has no subscription', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest.spyOn(db.Subscription, 'findOne').mockResolvedValueOnce(null);
    const res = await request(app)
      .delete('/api/subscription/uid')
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.Subscription.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('No subscription exist for this user.');
  });

  it('test the error if request is not made properly', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(db.Subscription, 'findOne')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .delete('/api/subscription/uid')
      .set({ Authorization: 'Bearer token' });
    expect(db.Subscription.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
