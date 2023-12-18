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

const insulinJournal = {
  id: 1,
  uid: 'testuid',
  date: '2020-12-31T00:00:00.000Z',
  time: '2020-12-31T00:00:00.000Z',
  typeOfInsulin: 'testTypeOfInsulin',
  unit: 'testUnit',
  bodySite: 'testBodySite',
  notes: 'testNotes',
};

const updatedInsulinJournal = {
  id: 1,
  uid: 'testuid',
  date: '2020-12-31T00:00:00.000Z',
  time: '2020-12-31T00:00:00.000Z',
  typeOfInsulin: 'Humalog',
  unit: '10',
  bodySite: 'L Buttock',
  notes: 'testNotes',
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
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Testing the create insulin journal controller', () => {
  it('test to create a insulin journal', async () => {
    mockFindOne(db.User, user);
    mockCreate(db.InsulinDosage, insulinJournal);

    const res = await request(app)
      .post(`/api/journals/diabetic/insulin/user/${user.uid}`)
      .send(insulinJournal)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.InsulinDosage.create).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(insulinJournal);
  });

  it('test the error if the user uid passed is invalid', async () => {
    mockFindOne(db.User, null);
    mockCreate(db.InsulinDosage, insulinJournal);

    const res = await request(app)
      .post(`/api/journals/diabetic/insulin/user/${user.uid}`)
      .send(insulinJournal)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.InsulinDosage.create).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('User not found');
  });

  it('test the error if request is not made properly', async () => {
    mockFindOne(db.User, user);
    mockRejectedValueOnce('create', db.InsulinDosage, new Error('query error'));

    const res = await request(app)
      .post(`/api/journals/diabetic/insulin/user/${user.uid}`)
      .send('')
      .set({ Authorization: 'Bearer token' });
    expect(db.InsulinDosage.create).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
describe('Testing the update insulin journal controller', () => {
  it('should update a insulin journal for a user', async () => {
    mockFindOne(db.InsulinDosage, insulinJournal);
    mockUpdate(db.InsulinDosage, updatedInsulinJournal);
    mockFindOne(db.InsulinDosage, updatedInsulinJournal);

    const res = await request(app)
      .put(`/api/journals/diabetic/insulin/${insulinJournal.id}`)
      .send(updatedInsulinJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.InsulinDosage.findOne).toBeCalledTimes(2);
    expect(db.InsulinDosage.update).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(updatedInsulinJournal);
  });

  it('should return an error if the journal is not found ', async () => {
    mockFindOne(db.InsulinDosage, null);
    mockUpdate(db.InsulinDosage, [1]);

    const res = await request(app)
      .put(`/api/journals/diabetic/insulin/${insulinJournal.id}`)
      .send(insulinJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.InsulinDosage.findOne).toHaveBeenCalledTimes(1);
    expect(db.InsulinDosage.update).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Insulin Journal not found');
  });

  it('should return an error updating the journal', async () => {
    mockFindOne(db.InsulinDosage, insulinJournal);
    mockRejectedValueOnce('update', db.InsulinDosage, new Error('query error'));

    const res = await request(app)
      .put(`/api/journals/diabetic/insulin/${insulinJournal.id}`)
      .send(insulinJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.InsulinDosage.findOne).toHaveBeenCalledTimes(1);
    expect(db.InsulinDosage.update).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
describe('Testing the delete insulin journal controller', () => {
  it('should delete a insulin journal for a user', async () => {
    mockFindOne(db.InsulinDosage, insulinJournal);
    mockDestroy(db.InsulinDosage, insulinJournal);

    const res = await request(app)
      .delete(`/api/journals/diabetic/insulin/${insulinJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.InsulinDosage.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
  });

  it('should return an error if the journal is not found ', async () => {
    mockFindOne(db.InsulinDosage, null);
    mockDestroy(db.InsulinDosage, 1);

    const res = await request(app)
      .delete(`/api/journals/diabetic/insulin/${insulinJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.InsulinDosage.findOne).toHaveBeenCalledTimes(1);
    expect(db.InsulinDosage.destroy).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Insulin Journal not found');
  });

  it('should return an error deleting the journal', async () => {
    mockFindOne(db.InsulinDosage, insulinJournal);
    mockRejectedValueOnce(
      'destroy',
      db.InsulinDosage,
      new Error('query error')
    );

    const res = await request(app)
      .delete(`/api/journals/diabetic/insulin/${insulinJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.InsulinDosage.findOne).toHaveBeenCalledTimes(1);
    expect(db.InsulinDosage.destroy).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
describe('Testing the get insulin journal controller', () => {
  it('should get a insulin journal for a user', async () => {
    mockFindOne(db.InsulinDosage, insulinJournal);

    const res = await request(app)
      .get(`/api/journals/diabetic/insulin/${insulinJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.InsulinDosage.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(insulinJournal);
  });

  it('should return an error if the journal is not found ', async () => {
    mockFindOne(db.InsulinDosage, null);

    const res = await request(app)
      .get(`/api/journals/diabetic/insulin/${insulinJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.InsulinDosage.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Insulin Journal not found');
  });

  it('should return an error getting the journal', async () => {
    mockRejectedValueOnce(
      'findOne',
      db.InsulinDosage,
      new Error('query error')
    );

    const res = await request(app)
      .get(`/api/journals/diabetic/insulin/${insulinJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.InsulinDosage.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
describe('Testing the get insulin journals controller', () => {
  it('should get all insulin journals for a user', async () => {
    mockFindOne(db.User, user);
    mockFindAll(db.InsulinDosage, [insulinJournal]);

    const res = await request(app)
      .get(`/api/journals/diabetic/insulin/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.InsulinDosage.findAll).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual([insulinJournal]);
  });

  it('should return an error if the user is not found ', async () => {
    mockFindOne(db.User, null);

    const res = await request(app)
      .get(`/api/journals/diabetic/insulin/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('User not found');
  });

  it('should return an error getting the journals', async () => {
    mockFindOne(db.User, user);
    mockRejectedValueOnce(
      'findAll',
      db.InsulinDosage,
      new Error('query error')
    );

    const res = await request(app)
      .get(`/api/journals/diabetic/insulin/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.InsulinDosage.findAll).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
