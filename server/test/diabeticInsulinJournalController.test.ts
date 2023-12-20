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

const insulinJournal = {
  id: 1,
  uid: 'testuid',
  date: '2020-12-31T00:00:00.000Z',
  time: '2020-12-31T00:00:00.000Z',
  typeOfInsulin: 'testTypeOfInsulin',
  unit: 10,
  bodySite: 'testBodySite',
  notes: 'testNotes',
};

const invalidInsulinJournal = {
  id: 1,
  uid: 'testuid',
  date: '2020-12-31T00:00:00.000Z',
  time: '2020-12-31T00:00:00.000Z',
  typeOfInsulin: 'testTypeOfInsulin',
  unit: "10",
  bodySite: 'testBodySite',
  notes: 'testNotes',
};

const updatedInsulinJournal = {
  id: 1,
  uid: 'testuid',
  date: '2020-12-31T00:00:00.000Z',
  time: '2020-12-31T00:00:00.000Z',
  typeOfInsulin: 'Humalog',
  unit: 12,
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
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('Testing the create insulin journal controller', () => {
  it('test to create a insulin journal', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(db.InsulinDosage, 'create')
      .mockResolvedValueOnce(insulinJournal);
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
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(null);
    jest
      .spyOn(db.InsulinDosage, 'create')
      .mockResolvedValueOnce(insulinJournal);
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
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(db.InsulinDosage, 'create')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .post(`/api/journals/diabetic/insulin/user/${user.uid}`)
      .send(insulinJournal)
      .set({ Authorization: 'Bearer token' });
    expect(db.InsulinDosage.create).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });

  it('test the error if the data is invalid', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(db.InsulinDosage, 'create')
      .mockRejectedValue(insulinJournal);
    const res = await request(app)
      .post(`/api/journals/diabetic/insulin/user/${user.uid}`)
      .send(invalidInsulinJournal)
      .set({ Authorization: 'Bearer token' });
    expect(db.InsulinDosage.create).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });

});
describe('Testing the update insulin journal controller', () => {
  it('should update a insulin journal for a user', async () => {
    jest
      .spyOn(db.InsulinDosage, 'findOne')
      .mockResolvedValueOnce(insulinJournal);
    jest
      .spyOn(db.InsulinDosage, 'update')
      .mockResolvedValueOnce([1, [updatedInsulinJournal]]);

    jest
      .spyOn(db.InsulinDosage, 'findOne')
      .mockResolvedValueOnce(updatedInsulinJournal);

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
    jest.spyOn(db.InsulinDosage, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(db.InsulinDosage, 'update').mockResolvedValueOnce([1]);
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
    jest
      .spyOn(db.InsulinDosage, 'findOne')
      .mockResolvedValueOnce(insulinJournal);
    jest
      .spyOn(db.InsulinDosage, 'update')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .put(`/api/journals/diabetic/insulin/${insulinJournal.id}`)
      .send(insulinJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.InsulinDosage.findOne).toHaveBeenCalledTimes(1);
    expect(db.InsulinDosage.update).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });

  it('should return an error if the data is invalid when updating the journal', async () => {
    jest.spyOn(db.InsulinDosage, 'findOne').mockResolvedValueOnce(insulinJournal);
    jest.spyOn(db.InsulinDosage, 'update').mockRejectedValue(updatedInsulinJournal);
    const res = await request(app)
      .put(`/api/journals/diabetic/insulin/${insulinJournal.id}`)
      .send(invalidInsulinJournal)
      .set({ Authorization: 'Bearer token' });

    expect(db.InsulinDosage.findOne).toHaveBeenCalledTimes(1);
    expect(db.InsulinDosage.update).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });

});
describe('Testing the delete insulin journal controller', () => {
  it('should delete a insulin journal for a user', async () => {
    jest
      .spyOn(db.InsulinDosage, 'findOne')
      .mockResolvedValueOnce(insulinJournal);
    jest
      .spyOn(db.InsulinDosage, 'destroy')
      .mockResolvedValueOnce([1, [insulinJournal]]);

    const res = await request(app)
      .delete(`/api/journals/diabetic/insulin/${insulinJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.InsulinDosage.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
  });

  it('should return an error if the journal is not found ', async () => {
    jest.spyOn(db.InsulinDosage, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(db.InsulinDosage, 'destroy').mockResolvedValueOnce(1);
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
    jest
      .spyOn(db.InsulinDosage, 'findOne')
      .mockResolvedValueOnce(insulinJournal);
    jest
      .spyOn(db.InsulinDosage, 'destroy')
      .mockRejectedValue(new Error('query error'));
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
    jest
      .spyOn(db.InsulinDosage, 'findOne')
      .mockResolvedValueOnce(insulinJournal);

    const res = await request(app)
      .get(`/api/journals/diabetic/insulin/${insulinJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.InsulinDosage.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toEqual(insulinJournal);
  });

  it('should return an error if the journal is not found ', async () => {
    jest.spyOn(db.InsulinDosage, 'findOne').mockResolvedValueOnce(null);
    const res = await request(app)
      .get(`/api/journals/diabetic/insulin/${insulinJournal.id}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.InsulinDosage.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('Insulin Journal not found');
  });

  it('should return an error getting the journal', async () => {
    jest
      .spyOn(db.InsulinDosage, 'findOne')
      .mockRejectedValue(new Error('query error'));
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
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(db.InsulinDosage, 'findAll')
      .mockResolvedValueOnce([insulinJournal]);

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
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(null);
    const res = await request(app)
      .get(`/api/journals/diabetic/insulin/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('NOT_FOUND');
    expect(res.body.message).toBe('User not found');
  });

  it('should return an error getting the journals', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(db.InsulinDosage, 'findAll')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .get(`/api/journals/diabetic/insulin/user/${user.uid}`)
      .set({ Authorization: 'Bearer token' });

    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.InsulinDosage.findAll).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
