import request from 'supertest';
import app from '../index';
import db from '../models/index';
import admin from 'firebase-admin';
import { user, startServer, stopServer } from '../utils/journalsTestHelper';
const fs = require('fs');

let server: any;
const port = process.env.PORT;

const medications = [
  {
    id: 1,
    uid: 'medicationUid',
    medicationName: 'newMedication111',
    dateStarted: '2002-02-22',
    time: '14:30:00',
    dosage: 12,
    unit: 'medicationUnit111',
    frequency: 'frequency111',
    route: 'route',
    notes: '',
  },
  {
    id: 2,
    uid: 'nextMedicationUid',
    medicationName: 'newMedication222',
    dateStarted: '2002-09-22',
    time: '12:30:00',
    dosage: 8,
    unit: 'medicationUnit222',
    frequency: 'frequency222',
    route: 'route222',
    notes: 'notes',
  },
];

const createMedication = {
  id: 1,
  uid: 'medicationUid',
  medicationName: 'test med',
  dateStarted: '2002-02-22',
  time: '14:30:00',
  dosage: 12,
  unit: 'millilitre (mL)',
  frequency: 'frequency111',
  route: 'route',
  notes: '',
};

const updatedMedication = {
  id: 1,
  uid: 'medicationUid',
  medicationName: 'some other med name',
  dateStarted: '2002-02-22',
  time: '14:30:00',
  dosage: 15,
  unit: 'millilitre (mL)',
  frequency: 'updatedFrequency',
  route: 'route',
  notes: 'notes',
};

const updatedMedicationImage = {
  id: 1,
  uid: 'medicationUid',
  medicationName: 'some other med name',
  dateStarted: '2002-02-22',
  time: '14:30:00',
  dosage: 15,
  unit: 'millilitre (mL)',
  frequency: 'updatedFrequency',
  route: 'route',
  notes: 'notes',
  image:"medicationImages/1_tylenol.jpeg"
};

const updatedMedicationImage2 = {
  id: 1,
  uid: 'medicationUid',
  medicationName: 'some other med name',
  dateStarted: '2002-02-22',
  time: '14:30:00',
  dosage: 15,
  unit: 'millilitre (mL)',
  frequency: 'updatedFrequency',
  route: 'route',
  notes: 'notes',
  image:"1_tylenol.jpeg"
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

describe('Testing the create medication controller', () => {
  it('test to create medication', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest.spyOn(db.Medication, 'create').mockResolvedValueOnce(createMedication);
    const res = await request(app)
      .post('/api/medication/user/uid')
      .send(createMedication)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.Medication.create).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(createMedication);
  });

  it('test the error if the user uid passed is invalid', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(db.Medication, 'create').mockResolvedValueOnce(createMedication);
    const res = await request(app)
      .post('/api/medication/user/uid')
      .send(createMedication)
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.Medication.create).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('User not found, invalid user uid.');
  });

  it('should catch the unexpected error', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(db.Medication, 'create')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .post('/api/medication/user/uid')
      .send('')
      .set({ Authorization: 'Bearer token' });
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('Testing the get all medications controller', () => {
  it('test to get all medications', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest.spyOn(db.Medication, 'findAll').mockResolvedValueOnce(medications);
    const res = await request(app)
      .get('/api/medication/user/uid')
      .send('')
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.Medication.findAll).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(medications);
  });

  it('test the error if the user uid passed is invalid', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(db.Medication, 'findAll').mockResolvedValueOnce(medications);
    const res = await request(app)
      .get('/api/medication/user/uid')
      .send('')
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.Medication.findAll).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe('User not found, invalid user uid.');
  });

  it('should catch the error', async () => {
    jest.spyOn(db.User, 'findOne').mockResolvedValueOnce(user);
    jest
      .spyOn(db.Medication, 'findAll')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .get('/api/medication/user/uid')
      .send('')
      .set({ Authorization: 'Bearer token' });
    expect(db.User.findOne).toHaveBeenCalledTimes(1);
    expect(db.Medication.findAll).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('Testing the get one medication controller', () => {
  it('test to get one medication', async () => {
    jest.spyOn(db.Medication, 'findOne').mockResolvedValueOnce(medications[0]);
    const res = await request(app)
      .get(`/api/medication/1`)
      .set({ Authorization: 'Bearer token' });
    expect(db.Medication.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(medications[0]);
  });

  it('test the error if the medication id passed is invalid', async () => {
    jest.spyOn(db.Medication, 'findOne').mockResolvedValueOnce(null);
    const res = await request(app)
      .get('/api/medication/1')
      .set({ Authorization: 'Bearer token' });
    expect(db.Medication.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe(
      'Medication not found, invalid medication id.'
    );
  });

  it('should catch the error', async () => {
    jest
      .spyOn(db.Medication, 'findOne')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .get('/api/medication/1')
      .set({ Authorization: 'Bearer token' });
    expect(db.Medication.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('Testing the update medication controller', () => {
  it('test to update medication', async () => {
    jest.spyOn(db.Medication, 'findOne').mockResolvedValueOnce(medications[0]);
    jest
      .spyOn(db.Medication, 'update')
      .mockResolvedValueOnce(updatedMedication);
    jest
      .spyOn(db.Medication, 'findOne')
      .mockResolvedValueOnce(updatedMedication);
    const res = await request(app)
      .put('/api/medication/1')
      .send(updatedMedication)
      .set({ Authorization: 'Bearer token' });
    expect(db.Medication.update).toBeCalledTimes(1);
    expect(db.Medication.findOne).toBeCalledTimes(2);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(updatedMedication);
  });

  it('should give error if wrong medication id is sent', async () => {
    jest.spyOn(db.Medication, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(db.Medication, 'update').mockResolvedValueOnce(null);
    const res = await request(app)
      .put('/api/medication/1')
      .send(updatedMedication)
      .set({ Authorization: 'Bearer token' });
    expect(db.Medication.findOne).toBeCalledTimes(1);
    expect(db.Medication.update).toBeCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe(
      'Medication not found, invalid medication id.'
    );
  });

  it('should catch error', async () => {
    jest.spyOn(db.Medication, 'findOne').mockResolvedValueOnce(medications[0]);
    jest
      .spyOn(db.Medication, 'update')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .put('/api/medication/1')
      .send(updatedMedication)
      .set({ Authorization: 'Bearer token' });
    expect(db.Medication.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('should test the delete medication controller', () => {
  it('should delete one specific medication', async () => {
    jest.spyOn(db.Medication, 'findOne').mockResolvedValueOnce(medications[0]);
    jest.spyOn(db.Medication, 'destroy').mockResolvedValueOnce(medications[0]);
    const res = await request(app)
      .delete('/api/medication/1')
      .set({ Authorization: 'Bearer token' });
    expect(db.Medication.findOne).toBeCalledTimes(1);
    expect(db.Medication.destroy).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.message).toBe('Medication entry deleted successfully');
  });

  it('should give error when the medication id sent is wrong', async () => {
    const nonExistentMedicationId = 0;
    jest.spyOn(db.Medication, 'findOne').mockResolvedValueOnce(null);
    jest.spyOn(db.Medication, 'destroy').mockResolvedValueOnce(null);
    const res = await request(app)
      .delete(`/api/medication/${nonExistentMedicationId}`)
      .set({ Authorization: 'Bearer token' });
    expect(db.Medication.findOne).toBeCalledTimes(1);
    expect(db.Medication.destroy).toBeCalledTimes(0);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe(
      'Medication not found, invalid medication id.'
    );
  });

  it('should catch error ', async () => {
    jest.spyOn(db.Medication, 'findOne').mockResolvedValueOnce(medications[0]);
    jest
      .spyOn(db.Medication, 'destroy')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .delete('/api/medication/1')
      .set({ Authorization: 'Bearer token' });
    expect(db.Medication.findOne).toBeCalledTimes(1);
    expect(db.Medication.destroy).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('should test the upload images', () => {
  it('test to upload medication image', async () => {
    jest.spyOn(db.Medication, 'findOne').mockResolvedValueOnce(medications[0]);
    jest.spyOn(db.Medication, 'update').mockResolvedValueOnce(updatedMedicationImage);
    const res = await request(app)
      .put('/api/medication/uploadImage/1')
      .attach("image","medicationImages/1_tylenol.jpeg")
      .set({ Authorization: 'Bearer token' });
    expect(db.Medication.update).toBeCalledTimes(1);
    expect(db.Medication.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.message).toStrictEqual("Medication image uploaded successfully");
  });

  it('it should not upload medication', async () => {
    jest.spyOn(db.Medication, 'findOne').mockResolvedValueOnce(medications[0]);
    jest.spyOn(db.Medication, 'update')
    const res = await request(app)
      .put('/api/medication/uploadImage/1')
      .set({ Authorization: 'Bearer token' });
    expect(db.Medication.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
  });

  it('it should find medication', async () => {
    jest.spyOn(db.Medication, 'findOne').mockResolvedValueOnce(null);
    const res = await request(app)
      .put('/api/medication/uploadImage/0')
      .set({ Authorization: 'Bearer token' });
    expect(db.Medication.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
  });

  it('it should fail uplaoding image', async () => {
    const res = await request(app)
      .put('/api/medication/uploadImage/0')
      .set({ Authorization: 'Bearer token' });
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  }); 

  afterAll(() => {

  })
});


describe('should test the updating image', () => {
  it('test to upload medication image', async () => {
    jest.spyOn(db.Medication, 'findOne').mockResolvedValueOnce(updatedMedicationImage);
    jest.spyOn(db.Medication, 'update').mockResolvedValueOnce(updatedMedicationImage2);
    const res = await request(app)
      .put('/api/medication/updateImage/1')
      .attach("image","medicationImages/1_tylenol.jpeg")
      .set({ Authorization: 'Bearer token' });
    expect(db.Medication.update).toBeCalledTimes(1);
    expect(db.Medication.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.message).toStrictEqual("Medication image uploaded successfully");
  });

  it('it should not update medication image', async () => {
    jest.spyOn(db.Medication, 'findOne').mockResolvedValueOnce(updatedMedicationImage);
    jest.spyOn(db.Medication, 'update')
    const res = await request(app)
      .put('/api/medication/uploadImage/1')
      .set({ Authorization: 'Bearer token' });
    expect(db.Medication.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
  });

  it('it should not find medication', async () => {
    jest.spyOn(db.Medication, 'findOne').mockResolvedValueOnce(null);
    const res = await request(app)
      .put('/api/medication/updateImage/0')
      .set({ Authorization: 'Bearer token' });
    expect(db.Medication.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
  });

  it('it should fail updating image', async () => {
    const res = await request(app)
      .put('/api/medication/uploadImage/0')
      .set({ Authorization: 'Bearer token' });
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
  
  afterAll(() => {
    fs.renameSync("medicationImages/1_1_tylenol.jpeg", "medicationImages/1_tylenol.jpeg" )
  })

});

