import request from 'supertest';
import app from '../index';
import db from '../models/index';
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

const notificationPreference = {
  id: 1,
  uid: 'testuid',
  activityReminders: true,
  medicationReminders: true,
  appointmentReminders: true,
  foodIntakeReminders: true,
  insulinDosageReminders: true,
  glucoseMeasurementReminders: true,
};

const updatedNotificationPreference = {
  id: 2,
  uid: 'testuid',
  activityReminders: false,
  medicationReminders: false,
  appointmentReminders: false,
  foodIntakeReminders: false,
  insulinDosageReminders: false,
  glucoseMeasurementReminders: false,
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

describe('Testing the create notificationPreference controller', () => {
  it('test to create notificationPreference', async () => {
    jest
      .spyOn(db.NotificationPreference, 'create')
      .mockResolvedValueOnce(notificationPreference);
    const res = await request(app)
      .post(`/api/notifications/${user.uid}`)
      .send(notificationPreference)
      .set({ Authorization: 'Bearer token' });
    expect(db.NotificationPreference.create).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(notificationPreference);
  });

  it('should catch error if something goes wrong', async () => {
    jest
      .spyOn(db.NotificationPreference, 'create')
      .mockRejectedValue(new Error('query Error'));
    const res = await request(app)
      .post(`/api/notifications/${user.uid}`)
      .set({ Authorization: 'Bearer token' });
    expect(db.NotificationPreference.create).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe(
      'Error creating notification preference : Error: query Error'
    );
  });
});

describe('Notification preference Controller tests', () => {
  it('should get notification preference for a user', async () => {
    jest
      .spyOn(db.NotificationPreference, 'findOne')
      .mockResolvedValueOnce(notificationPreference);
    const res = await request(app)
      .get(`/api/notifications/${user.uid}`)
      .set({ Authorization: 'Bearer token' });
    expect(db.NotificationPreference.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(notificationPreference);
  });

  it('should give error when the notification preference user id sent is wrong', async () => {
    const nonExistentUserId = 'user';
    jest
      .spyOn(db.NotificationPreference, 'findOne')
      .mockResolvedValueOnce(null);
    const res = await request(app)
      .get(`/api/notifications/${user.uid}`)
      .set({ Authorization: 'Bearer token' });
    expect(db.NotificationPreference.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe(
      'Notification preference not found, invalid user id.'
    );
  });

  it('should catch error ', async () => {
    jest
      .spyOn(db.NotificationPreference, 'findOne')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .get(`/api/notifications/${user.uid}`)
      .set({ Authorization: 'Bearer token' });
    expect(db.NotificationPreference.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

describe('should test the deleteNotificationPreference Controller', () => {
  it('should delete one specific notification preference', async () => {
    jest
      .spyOn(db.NotificationPreference, 'destroy')
      .mockResolvedValueOnce(notificationPreference);
    const res = await request(app)
      .delete(`/api/notifications/${user.uid}`)
      .set({ Authorization: 'Bearer token' });
    expect(db.NotificationPreference.destroy).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toBe('Successfully deleted notification preference.');
  });

  it('should give error when the user id sent is wrong', async () => {
    const nonExistentUserId = 'user';
    jest
      .spyOn(db.NotificationPreference, 'destroy')
      .mockResolvedValueOnce(null);
    const res = await request(app)
      .delete(`/api/notifications/${user.uid}`)
      .set({ Authorization: 'Bearer token' });
    expect(db.NotificationPreference.destroy).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe(
      'Notification preference not found, invalid user id.'
    );
  });

  it('should catch error ', async () => {
    jest
      .spyOn(db.NotificationPreference, 'destroy')
      .mockRejectedValue(new Error('query error'));
    const res = await request(app)
      .delete(`/api/notifications/${user.uid}`)
      .set({ Authorization: 'Bearer token' });
    expect(db.NotificationPreference.destroy).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});

const validInput = {
  activityReminders: true,
  medicationReminders: true,
  appointmentReminders: true,
  foodIntakeReminders: true,
  insulinDosageReminders: true,
  glucoseMeasurementReminders: true,
};

describe('Testing the update notificationPreference controller', () => {
  it('test to update notificationPreference', async () => {
    jest
      .spyOn(db.NotificationPreference, 'update')
      .mockResolvedValueOnce(updatedNotificationPreference);
    jest
      .spyOn(db.NotificationPreference, 'findOne')
      .mockResolvedValueOnce(updatedNotificationPreference);
    const res = await request(app)
      .put(`/api/notifications/${user.uid}`)
        .send(validInput) // Send valid input
      .set({ Authorization: 'Bearer token' });
    expect(db.NotificationPreference.update).toBeCalledTimes(1);
    expect(db.NotificationPreference.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SUCCESS');
    expect(res.body.data).toStrictEqual(updatedNotificationPreference);
  });

  it('should give error if wrong user id is sent', async () => {
    jest.spyOn(db.NotificationPreference, 'update').mockResolvedValueOnce(null);
    const res = await request(app)
      .put(`/api/notifications/${user.uid}`)
        .send(validInput) // Send valid input
      .set({ Authorization: 'Bearer token' });
    expect(db.NotificationPreference.update).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe('ERROR');
    expect(res.body.message).toBe(
      'Notification preference not found, invalid user id.'
    );
  });

  it('should catch error', async () => {
    // Provide valid input for the validator

    jest
        .spyOn(db.NotificationPreference, 'update')
        .mockRejectedValue(new Error('query error'));

    const res = await request(app)
        .put(`/api/notifications/${user.uid}`)
        .send(validInput) // Send valid input
        .set({ Authorization: 'Bearer token' });

    expect(db.NotificationPreference.update).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe('ERROR');
  });
});
