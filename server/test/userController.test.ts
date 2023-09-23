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

//test for createUser
describe('should test the createUser Controller', () => {
  it('show create user', async () => {
    jest.spyOn(db.User, 'create').mockResolvedValueOnce(user);
    const res = await request(app).post('/api/users/').send(user);
    expect(db.User.create).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.data).toStrictEqual(user);
  });

  it('should return an error for a non-existent user', async () => {
    jest.spyOn(db.User, 'create').mockRejectedValueOnce(new Error('error'));
    const res = await request(app).post('/api/users/').send(user);
    expect(db.User.create).toBeCalledTimes(2);
    expect(res.status).toBe(400);
  });
});
