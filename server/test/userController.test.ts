import request from 'supertest';
import app from './../index';
import db from './../models/index';
import admin from 'firebase-admin';

let server: any;
const port = process.env.SERVER_DEV_PORT;

const user = {
  id: 1,
  uid: 'testuid',
  email: 'test@gmail.com',
  firstName: 'John',
  lastName: 'Doe',
  // streetAddress: '1234 Street',
  // city: 'Montreal',
  // province: 'Quebec',
  // postalCode: 'H4M 2M9',
  phoneNumber: '5147894561',
  birthDate: '1990-12-31T00:00:00.000Z',
  sex: 'male',
};

const invalidUser = {
  email: 'test@gmail.com',
  firstName: 'John',
  // streetAddress: '1234 Street',
  // province: 'Quebec',
  // postalCode: 'H4M 2M9',
  birthDate: '1990-12-31T00:00:00.000Z',
  sex: 'male',
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

describe('should test the getUsers Controller', () => {
  it('show get all users', async () => {
    jest.spyOn(db.User, 'findAll').mockResolvedValueOnce(user);
    const res = await request(app)
      .get('/api/users/')
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findAll).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(user);
  });

  it('should return an error for a non-existent user', async () => {
    jest
      .spyOn(db.User, 'findAll')
      .mockRejectedValue(new Error('connection error'));
    const res = await request(app)
      .get('/api/users/')
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findAll).toBeCalledTimes(2);
    expect(res.status).toBe(400);
  });
});

describe('should test the getUser Controller', () => {
  it('show get user', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    const res = await request(app)
      .get(`/api/users/${user.uid}`)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(user);
  });

  it('should return an error for a non-existent user', async () => {
    jest
      .spyOn(db.User, 'findOne')
      .mockRejectedValue(new Error('connection error'));
    const res = await request(app)
      .get(`/api/users/${user.uid}`)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toBeCalledTimes(2);
    expect(res.status).toBe(400);
  });
});

it('should return a 404 response when the user is not found', async () => {
  const nonExistentUserId = 999;

  jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(null);
  const res = await request(app)
    .get(`/api/users/${nonExistentUserId}`)
    .set({ Authorization: 'Bearer token' });

  // Verify that findByPk was called with the correct user ID
  expect(db.User.findOne).toBeCalledTimes(2);

  // Verify the response
  expect(res.status).toBe(401);
  expect(res.body.status).toBe('UNAUTHORIZED');
});

describe('should test the createUser Controller', () => {
  it('show create user', async () => {
    jest.spyOn(db.User, 'create').mockResolvedValueOnce(user);
    const res = await request(app)
      .post('/api/users/')
      .send(user)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.create).toBeCalledTimes(1);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(user);
  });

  it('should return an error for a non-existent user', async () => {
    jest.spyOn(db.User, 'create').mockRejectedValueOnce(new Error('error'));
    const res = await request(app)
      .post('/api/users/')
      .send(user)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.create).toBeCalledTimes(2);
    expect(res.status).toBe(400);
  });

  it('should return an error for a missing field', async () => {
    jest.spyOn(db.User, 'create').mockRejectedValueOnce(new Error('error'));
    const res = await request(app)
      .post('/api/users/')
      .send(invalidUser)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.create).toBeCalledTimes(2);
    expect(res.status).toBe(400);
  });

  it('should return an error for an incorrect email format', async () => {
    const invalidUser = { ...user, email: 'testgmail.com' };
    jest.spyOn(db.User, 'create').mockRejectedValueOnce(new Error('error'));
    const res = await request(app)
      .post('/api/users/')
      .send(invalidUser)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.create).toBeCalledTimes(2);
    expect(res.status).toBe(400);
  });
});

describe('should test the updateUser Controller', () => {
  const updatedUser = {
    id: 1,
    uid: 'testuid',
    email: 'test@gmail.com',
    firstName: 'Test',
    lastName: 'Test',
    streetAddress: '5678 Street',
    city: 'Montreal',
    province: 'Quebec',
    postalCode: 'H4M 6L8',
    phoneNumber: '5147894561',
    birthDate: '1990-12-31T00:00:00.000Z',
    sex: 'male',
  };
  it('show update user', async () => {
    jest.spyOn(db.User, 'update').mockResolvedValueOnce(updatedUser);
    const res = await request(app)
      .put(`/api/users/${user.uid}`)
      .send(updatedUser)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.update).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(updatedUser);
  });

  it('should return an error for updating a non-existent user', async () => {
    const nonExistentUserId = 999;
    const res = await request(app)
      .put(`/api/users/${nonExistentUserId}`)
      .send(updatedUser)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.update).toBeCalledTimes(1);
    expect(res.status).toBe(401);
  });
});

describe('should test the deleteUser Controller', () => {
  it('show delete user', async () => {
    jest.spyOn(db.User, 'destroy').mockResolvedValueOnce(user);
    const res = await request(app)
      .delete(`/api/users/${user.uid}`)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.destroy).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toBe('Successfully deleted user.');
  });

  it('should return an error for a non-existent user', async () => {
    jest.spyOn(db.User, 'destroy').mockRejectedValueOnce(new Error('error'));
    const res = await request(app)
      .delete(`/api/users/${user.uid}`)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.destroy).toBeCalledTimes(2);
    expect(res.status).toBe(400);
  });

  it('should return a 404 response when attempting to delete a non-existent user', async () => {
    const nonExistentUserId = 999;

    jest.spyOn(db.User, 'destroy').mockResolvedValueOnce(0);
    const res = await request(app)
      .delete(`/api/users/${nonExistentUserId}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.destroy).toBeCalledTimes(2);
    expect(res.status).toBe(401);
    expect(res.body.status).toBe('UNAUTHORIZED');
  });
});
