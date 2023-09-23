import request from 'supertest';
import app from './../index';
import db from './../models/index';

let server: any;
const port = process.env.SERVER_DEV_PORT;

const user = {
  email: 'test@gmail.com',
  firstName: 'John',
  lastName: 'Doe',
  streetAddress: '1234 Street',
  city: 'Montreal',
  province: 'Quebec',
  postalCode: 'H4M 2M9',
  phoneNumber: '5147894561',
  birthDate: '1990-12-31T00:00:00.000Z',
  sex: 'male',
};

const invalidUser = {
  email: 'test@gmail.com',
  firstName: 'John',
  streetAddress: '1234 Street',
  province: 'Quebec',
  postalCode: 'H4M 2M9',
  birthDate: '1990-12-31T00:00:00.000Z',
  sex: 'male',
};

function startServer() {
  server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

function stopServer() {
  if (server) {
    server.close(() => {
      console.log('Server stopped');
    });
  }
}

beforeAll(() => {
  startServer(); // Start the server before running tests
});

afterAll(() => {
  stopServer(); // Stop the server after all tests are done
});

describe('should test the getUsers Controller', () => {
  it('show get all users', async () => {
    jest.spyOn(db.User, 'findAll').mockResolvedValueOnce(user);
    const res = await request(app).get('/api/users/');
    expect(db.User.findAll).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(user);
  });

  it('should return an error for a non-existent user', async () => {
    jest
      .spyOn(db.User, 'findAll')
      .mockRejectedValue(new Error('connection error'));
    const res = await request(app).get('/api/users/');
    expect(db.User.findAll).toBeCalledTimes(2);
    expect(res.status).toBe(400);
  });
});

describe('should test the getUser Controller', () => {
  it('show get user', async () => {
    jest.spyOn(db.User, 'findByPk').mockResolvedValueOnce(user);
    const res = await request(app).get('/api/users/1');
    expect(db.User.findByPk).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(user);
  });

  it('should return an error for a non-existent user', async () => {
    jest
      .spyOn(db.User, 'findByPk')
      .mockRejectedValue(new Error('connection error'));
    const res = await request(app).get('/api/users/1');
    expect(db.User.findByPk).toBeCalledTimes(2);
    expect(res.status).toBe(400);
  });
});

it('should return a 404 response when the user is not found', async () => {
  const nonExistentUserId = 999;

  jest.spyOn(db.User, 'findByPk').mockResolvedValueOnce(null);
  const res = await request(app).get(`/api/users/${nonExistentUserId}`);

  // Verify that findByPk was called with the correct user ID
  expect(db.User.findByPk).toBeCalledTimes(3);

  // Verify the response
  expect(res.status).toBe(404);
  expect(res.body.status).toBe('ERROR');
  expect(res.body.message).toBe('User not found.');
});

describe('should test the createUser Controller', () => {
  it('show create user', async () => {
    jest.spyOn(db.User, 'create').mockResolvedValueOnce(user);
    const res = await request(app).post('/api/users/').send(user);
    expect(db.User.create).toBeCalledTimes(1);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(user);
  });

  it('should return an error for a non-existent user', async () => {
    jest.spyOn(db.User, 'create').mockRejectedValueOnce(new Error('error'));
    const res = await request(app).post('/api/users/').send(user);
    expect(db.User.create).toBeCalledTimes(2);
    expect(res.status).toBe(400);
  });

  it('should return an error for a missing field', async () => {
    jest.spyOn(db.User, 'create').mockRejectedValueOnce(new Error('error'));
    const res = await request(app).post('/api/users/').send(invalidUser);
    expect(db.User.create).toBeCalledTimes(3);
    expect(res.status).toBe(400);
  });

  it('should return an error for an incorrect email format', async () => {
    const invalidUser = { ...user, email: 'testgmail.com' };
    jest.spyOn(db.User, 'create').mockRejectedValueOnce(new Error('error'));
    const res = await request(app).post('/api/users/').send(invalidUser);
    expect(db.User.create).toBeCalledTimes(4);
    expect(res.status).toBe(400);
  });
});

describe('should test the updateUser Controller', () => {
  const updatedUser = {
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
    const res = await request(app).put('/api/users/1').send(updatedUser);
    expect(db.User.update).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(updatedUser);
  });

  it('should return an error for updating a non-existent user', async () => {
    const nonExistentUserId = 999;
    const res = await request(app)
      .put(`/api/users/${nonExistentUserId}`)
      .send(updatedUser);
    expect(db.User.update).toBeCalledTimes(2);
    expect(res.status).toBe(400);
  });
});

describe('should test the deleteUser Controller', () => {
  it('show delete user', async () => {
    jest.spyOn(db.User, 'destroy').mockResolvedValueOnce(user);
    const res = await request(app).delete('/api/users/1');
    expect(db.User.destroy).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toBe('Successfully deleted user.');
  });

  it('should return an error for a non-existent user', async () => {
    jest.spyOn(db.User, 'destroy').mockRejectedValueOnce(new Error('error'));
    const res = await request(app).delete('/api/users/1');
    expect(db.User.destroy).toBeCalledTimes(2);
    expect(res.status).toBe(400);
  });

  it('should return a 404 response when attempting to delete a non-existent user', async () => {
    const nonExistentUserId = 999;

    jest.spyOn(db.User, 'destroy').mockResolvedValueOnce(0);
    const res = await request(app).delete(`/api/users/${nonExistentUserId}`);

    expect(db.User.destroy).toBeCalledTimes(3);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('User not found.');
  });
});
