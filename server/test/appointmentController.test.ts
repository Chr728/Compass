import request from 'supertest';
import app from '../index';
import db from '../models/index';
import admin from 'firebase-admin';
import { startServer, stopServer } from '../utils/journalsTestHelper';

let server: any;
const port = process.env.PORT;

const appointment = [
  {
    id: 1,
    uid: 'appointUid',
    appointmentWith: 'John Doe',
    reason: 'test',
    date: '2023-09-23T10:30:00.000Z',
    time: '00:00:00',
    frequency: 'daily',
    quantity: 2,
    notes: 'Call the doctor back 2 days later',
  },
  {
    id: 2,
    uid: 'appointUid',
    reason: 'test',
    appointmentWith: 'Jane Doe',
    date: '2023-09-30T10:30:00.000Z',
    time: '00:00:00',
    frequency: 'monthly',
    quantity: 2,
    notes: 'Checkup',
  },
];

const createAppointment = {
  id: 5,
  uid: '5',
  appointmentWith: 'Test Man',
  reason: 'Medications',
  date: '2023-09-23T10:30:00.000Z',
  time: '00:00:00',
  frequency: 'monthly',
  quantity: 2,
  notes: 'Call the doctor back 2 days later',
};

const updateAppointment = {
  id: 5,
  uid: '5',
  appointmentWith: 'New Docker',
  reason: 'Medications',
  date: '2023-10-23T11:30:00.000Z',
  time: '11:30:00',
  frequency: 'biweekly',
  quantity: 2,
  notes: 'Call the doctor back 2 days later',
};

const mockedDecodedToken = {
  uid: 'appointUid',
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

describe('should test the getAppointment Controller', () => {
  it('should get one specific appointment', async () => {
    jest.spyOn(db.Appointment, 'findOne').mockResolvedValueOnce(appointment[0]);
    const res = await request(app)
      .get('/api/appointments/single/1')
      .set({ Authorization: 'Bearer token' });
    expect(db.Appointment.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(appointment[0]);
  });

  it('should give error when the appointment id sent is wrong', async () => {
    const nonExistentAppointmentId = 0;
    jest.spyOn(db.Appointment, 'findOne').mockResolvedValueOnce(null);
    const res = await request(app)
      .get(`/api/appointments/single/${nonExistentAppointmentId}`)
      .set({ Authorization: 'Bearer token' });
    expect(db.Appointment.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe(
      'Appointment not found, invalid appointment id.'
    );
  });

  it('should catch error ', async () => {
    jest
      .spyOn(db.Appointment, 'findOne')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .get('/api/appointments/single/1')
      .set({ Authorization: 'Bearer token' });
    expect(db.Appointment.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('should test the deleteAppointment Controller', () => {
  it('should delete one specific appointment', async () => {
    jest.spyOn(db.Appointment, 'destroy').mockResolvedValueOnce(appointment);
    const res = await request(app)
      .delete('/api/appointments/single/1')
      .set({ Authorization: 'Bearer token' });
    expect(db.Appointment.destroy).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toBe('Successfully deleted appointment.');
  });

  it('should give error when the appointment id sent is wrong', async () => {
    const nonExistentAppointmentId = 0;
    jest.spyOn(db.Appointment, 'destroy').mockResolvedValueOnce(null);
    const res = await request(app)
      .delete(`/api/appointments/single/${nonExistentAppointmentId}`)
      .set({ Authorization: 'Bearer token' });
    expect(db.Appointment.destroy).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe(
      'Appointment not found, invalid appointment id.'
    );
  });

  it('should catch error ', async () => {
    jest
      .spyOn(db.Appointment, 'destroy')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .delete('/api/appointments/single/1')
      .set({ Authorization: 'Bearer token' });
    expect(db.Appointment.destroy).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('Testing the get all appointments Controller', () => {
  it('should get all appointment for a user', async () => {
    jest.spyOn(db.Appointment, 'findAll').mockResolvedValueOnce(appointment);
    const res = await request(app)
      .get('/api/appointments/appointUid')
      .set({ Authorization: 'Bearer token' });
    expect(db.Appointment.findAll).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(appointment);
  });

  it('should catch error if something goes wrong', async () => {
    jest
      .spyOn(db.Appointment, 'findAll')
      .mockRejectedValue(new Error('query Error'));
    const res = await request(app)
      .get('/api/appointments/appointUid')
      .set({ Authorization: 'Bearer token' });
    expect(db.Appointment.findAll).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe(
      'Error getting appointments of user: Error: query Error'
    );
  });
});

describe('Testing the create appointment controller', () => {
  it('test to create appointment', async () => {
    jest
      .spyOn(db.Appointment, 'create')
      .mockResolvedValueOnce(createAppointment);
    const res = await request(app)
      .post('/api/appointments/appointUid')
      .send(createAppointment)
      .set({ Authorization: 'Bearer token' });
    expect(db.Appointment.create).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(createAppointment);
  });

  it('test the error if request is not made properly', async () => {
    jest.spyOn(db.Appointment, 'create').mockResolvedValueOnce('');
    const res = await request(app)
      .post('/api/appointments/appointUid')
      .send('')
      .set({ Authorization: 'Bearer token' });
    expect(db.Appointment.create).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('Testing the update appointment controller', () => {
  it('test to update appointment', async () => {
    jest
      .spyOn(db.Appointment, 'update')
      .mockResolvedValueOnce(updateAppointment);
    jest
      .spyOn(db.Appointment, 'findOne')
      .mockResolvedValueOnce(updateAppointment);
    const res = await request(app)
      .put('/api/appointments/single/5')
      .set({ Authorization: 'Bearer token' });
    expect(db.Appointment.update).toBeCalledTimes(1);
    expect(db.Appointment.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(updateAppointment);
  });

  it('should give error if wrong appointment id is sent', async () => {
    jest.spyOn(db.Appointment, 'update').mockResolvedValueOnce(null);
    const res = await request(app)
      .put('/api/appointments/single/5')
      .set({ Authorization: 'Bearer token' });
    expect(db.Appointment.update).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe(
      'Appointment not found, invalid appointment id.'
    );
  });

  it('should catch error', async () => {
    jest
      .spyOn(db.Appointment, 'update')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .put('/api/appointments/single/5')
      .set({ Authorization: 'Bearer token' });
    expect(db.Appointment.update).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
