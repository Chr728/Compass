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

const glucoseJournal = {
  id: 10,
  uid: 'testuid',
  date: '2020-12-31T00:00:00.000Z',
  mealTime: 'breakfast',
  bloodGlucose: 100,
  unit: 'mg/dL',
  notes: 'test',
};

const updatedGlucoseJournal = {
  id: 10,
  uid: 'testuid',
  date: '2020-12-31T00:00:00.000Z',
  mealTime: 'lunch',
  bloodGlucose: 200,
  unit: 'mg/dL',
  notes: 'test',
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

describe('Testing the create glucose journal controller', () => {
  it('test to create a glucose journal', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(db.GlucoseMeasurement, 'create')
      .mockResolvedValueOnce(glucoseJournal);
    const res = await request(app)
      .post(`/api/journals/diabetic/glucose/user/${user.uid}`)
      .send(glucoseJournal)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.GlucoseMeasurement.create).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(glucoseJournal);
  });

  it('test the error if the user uid passed is invalid', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(null);
    jest
      .spyOn(db.GlucoseMeasurement, 'create')
      .mockResolvedValueOnce(glucoseJournal);
    const res = await request(app)
      .post(`/api/journals/diabetic/glucose/user/${user.uid}`)
      .send(glucoseJournal)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.GlucoseMeasurement.create).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('User not found');
  });

  it('test the error if request is not made properly', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(db.GlucoseMeasurement, 'create')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .post(`/api/journals/diabetic/glucose/user/${user.uid}`)
      .send(glucoseJournal)
      .set({ Authorization: 'Bearer token' });
    expect(db.GlucoseMeasurement.create).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
describe('Testing the update glucose journal controller', () => {
  it('should update a glucose journal for a user', async () => {
    jest
      .spyOn(db.GlucoseMeasurement, 'findOne')
      .mockResolvedValueOnce(glucoseJournal);
    jest
      .spyOn(db.GlucoseMeasurement, 'update')
      .mockResolvedValueOnce([1, [updatedGlucoseJournal]]);

    jest
      .spyOn(db.GlucoseMeasurement, 'findOne')
      .mockResolvedValueOnce(updatedGlucoseJournal);

    const res = await request(app)
      .put(`/api/journals/diabetic/glucose/${glucoseJournal.id}`)
      .send(updatedGlucoseJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.GlucoseMeasurement.findOne).toBeCalledTimes(2);
    expect(db.GlucoseMeasurement.update).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(updatedGlucoseJournal);
  });

  it('should return an error if the journal is not found ', async () => {
    jest.spyOn(db.GlucoseMeasurement, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(db.GlucoseMeasurement, 'update').mockResolvedValueOnce([1]);
    const res = await request(app)
      .put(`/api/journals/diabetic/glucose/${glucoseJournal.id}`)
      .send(glucoseJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.GlucoseMeasurement.findOne).toHaveBeenCalledTimes(1);
    expect(db.GlucoseMeasurement.update).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Glucose Journal not found');
  });

  it('should return an error updating the journal', async () => {
    jest
      .spyOn(db.GlucoseMeasurement, 'findOne')
      .mockResolvedValueOnce(glucoseJournal);
    jest
      .spyOn(db.GlucoseMeasurement, 'update')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .put(`/api/journals/diabetic/glucose/${glucoseJournal.id}`)
      .send(glucoseJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.GlucoseMeasurement.findOne).toHaveBeenCalledTimes(1);
    expect(db.GlucoseMeasurement.update).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
describe('Testing the delete glucose journal controller', () => {
  it('should delete a glucose journal for a user', async () => {
    jest
      .spyOn(db.GlucoseMeasurement, 'findOne')
      .mockResolvedValueOnce(glucoseJournal);
    jest
      .spyOn(db.GlucoseMeasurement, 'destroy')
      .mockResolvedValueOnce([1, [glucoseJournal]]);

    const res = await request(app)
      .delete(`/api/journals/diabetic/glucose/${glucoseJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.GlucoseMeasurement.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
  });

  it('should return an error if the journal is not found ', async () => {
    jest.spyOn(db.GlucoseMeasurement, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(db.GlucoseMeasurement, 'destroy').mockResolvedValueOnce(1);
    const res = await request(app)
      .delete(`/api/journals/diabetic/glucose/${glucoseJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.GlucoseMeasurement.findOne).toHaveBeenCalledTimes(1);
    expect(db.GlucoseMeasurement.destroy).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Glucose Journal not found');
  });

  it('should return an error deleting the journal', async () => {
    jest
      .spyOn(db.GlucoseMeasurement, 'findOne')
      .mockResolvedValueOnce(glucoseJournal);
    jest
      .spyOn(db.GlucoseMeasurement, 'destroy')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .delete(`/api/journals/diabetic/glucose/${glucoseJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.GlucoseMeasurement.findOne).toHaveBeenCalledTimes(1);
    expect(db.GlucoseMeasurement.destroy).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
describe('Testing the get glucose journal controller', () => {
  it('should get a glucose journal for a user', async () => {
    jest
      .spyOn(db.GlucoseMeasurement, 'findOne')
      .mockResolvedValueOnce(glucoseJournal);

    const res = await request(app)
      .get(`/api/journals/diabetic/glucose/${glucoseJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.GlucoseMeasurement.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(glucoseJournal);
  });

  it('should return an error if the journal is not found ', async () => {
    jest.spyOn(db.GlucoseMeasurement, 'findOne').mockResolvedValueOnce(null);
    const res = await request(app)
      .get(`/api/journals/diabetic/glucose/${glucoseJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.GlucoseMeasurement.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Glucose Journal not found');
  });

  it('should return an error getting the journal', async () => {
    jest
      .spyOn(db.GlucoseMeasurement, 'findOne')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .get(`/api/journals/diabetic/glucose/${glucoseJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.GlucoseMeasurement.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
describe('Testing the get glucose journals controller', () => {
  it('should get all glucose journals for a user', async () => {
    jest
      .spyOn(db.GlucoseMeasurement, 'findAll')
      .mockResolvedValueOnce([glucoseJournal]);

    const res = await request(app)
      .get(`/api/journals/diabetic/glucose/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(db.GlucoseMeasurement.findAll).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual([glucoseJournal]);
  });

  it('should return an error if the user is not found ', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(null);
    const res = await request(app)
      .get(`/api/journals/diabetic/glucose/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('User not found');
  });

  it('should return an error getting the journals', async () => {
    jest
      .spyOn(db.GlucoseMeasurement, 'findAll')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .get(`/api/journals/diabetic/glucose/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toBeCalledTimes(1);
    expect(db.GlucoseMeasurement.findAll).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
