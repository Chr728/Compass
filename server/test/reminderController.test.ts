import request from "supertest";
import app from "../index";
import db from "../models/index";
import admin from "firebase-admin";
import moment = require("moment-timezone");
const webPush = require("web-push");
import { user, startServer, stopServer } from "../utils/journalsTestHelper";

let server: any;
const port = process.env.PORT;
const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
webPush.setVapidDetails("mailto:test@gmail.com", publicKey, privateKey);

//Predefined preferences
const userNotificationPreferences = {
  id: 1,
  uid: "testuid",
  activityReminders: true,
  medicationReminders: true,
  appointmentReminders: true,
  foodIntakeReminders: true,
  glucoseMeasurementReminders: true,
  insulinDosageReminders: true,
};

//Predefined appointment reminders
const userAppointment = [
  {
    id: 1,
    uid: "testuid",
    appointmentWith: "New Docker",
    reason: "Medications",
    date: "2023-09-30",
    time: "12:00:00",
    notes: "Call the doctor back 2 days later",
  },
];

//Prwdefined activity journal reminders
const userActivityJournal = [
  {
    id: 1,
    uid: "testuid",
    date: "2023-09-30",
    time: "12:00:00",
    activity: "running",
    duration: 175,
    notes: "Sample activity entry",
  },
];

//Predefined food intake reminders
const userFoodIntake = [
  {
    id: 1,
    uid: "testuid",
    date: "2023-09-30",
    time: "12:00:00",
    foodName: "test",
    mealType: "test",
    servingNumber: 5,
    notes: "test",
  },
];

//Predefined medication reminders
const userMedication = [
  {
    id: 1,
    uid: "testuid",
    medicationName: "test",
    dateStarted: "2023-09-30",
    time: "12:00:00",
    dosage: 2,
    unit: "test",
    frequency: "Test",
    route: "Test",
    notes: "test",
  },
];

//Predefined insulin reminders
const userInsulin = [
  {
    id: 1,
    uid: "testuid",
    date: "2023-09-30",
    time: "12:00:00",
    typeOfInsulin: "Test",
    unit: 1,
    bodySite: "Test",
    notes: "test",
  },
];

//Predefined glucose measurement reminders
const userGlucoseMeasurement = [
  {
    id: 1,
    uid: "testuid",
    date: "2023-09-30",
    mealTime: "12:00:00",
    bloodGlucose: 4,
    unit: "Test",
    notes: "Test",
  },
];

const mockedDecodedToken = {
  uid: "testuid",
  aud: "",
  auth_time: 0,
  exp: 0,
  firebase: {
    identities: { [0]: "string" },
    sign_in_provider: "string",
  },
  iat: 0,
  iss: "",
  sub: "",
};

//Predefined subscription
const userSubscription = {
  uid: "testuid",
  subscription: {
    endpoint: "test",
    keys: "test",
  },
};

describe("Testing reminder controller", () => {
  beforeAll(() => {
    startServer();
  });

  afterAll(() => {
    stopServer();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .spyOn(admin.auth(), "verifyIdToken")
      .mockResolvedValue(mockedDecodedToken);
    jest.spyOn(db.User, "findOne").mockResolvedValue(user);

    //Mock momemt library
    jest.mock("moment-timezone", () => {
      return moment.tz.setDefault("America/Toronto");
    });

    //Mock web push library
    jest.mock("web-push", () => {
      return {
        sendNotification: jest.fn(),
      };
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("test should find all reminders and send notification", async () => {
    //Spy on the sendNotification Method
    jest.spyOn(webPush, "sendNotification").mockResolvedValue("test");
    jest.spyOn(db.Subscription, "findOne").mockResolvedValue(userSubscription);
    jest
      .spyOn(db.NotificationPreference, "findOne")
      .mockResolvedValueOnce(userNotificationPreferences);
    jest
      .spyOn(db.ActivityJournal, "findAll")
      .mockResolvedValueOnce(userActivityJournal);
    jest
      .spyOn(db.Appointment, "findAll")
      .mockResolvedValueOnce(userAppointment);
    jest
      .spyOn(db.FoodIntakeJournal, "findAll")
      .mockResolvedValueOnce(userFoodIntake);
    jest.spyOn(db.Medication, "findAll").mockResolvedValueOnce(userMedication);
    jest.spyOn(db.InsulinDosage, "findAll").mockResolvedValueOnce(userInsulin);
    jest
      .spyOn(db.GlucoseMeasurement, "findAll")
      .mockResolvedValueOnce(userGlucoseMeasurement);
    const res = await request(app).get(`/api/reminders`);
    // .set({ Authorization: 'Bearer token' });
    expect(db.ActivityJournal.findAll).toHaveBeenCalledTimes(1);
    expect(db.Appointment.findAll).toHaveBeenCalledTimes(1);
    expect(db.FoodIntakeJournal.findAll).toHaveBeenCalledTimes(1);
    expect(db.GlucoseMeasurement.findAll).toHaveBeenCalledTimes(1);
    expect(db.Medication.findAll).toHaveBeenCalledTimes(1);
    expect(db.InsulinDosage.findAll).toHaveBeenCalledTimes(1);
    //Expect to send notificaiton for the appoinment with the subscription and title
    userAppointment.forEach((appointment) => {
      expect(db.Subscription.findOne).toHaveBeenCalledTimes(1);
      expect(db.NotificationPreference.findOne).toHaveBeenCalledTimes(1);
      expect(webPush.sendNotification).toBeCalled();
    });
    //Expect the journals to send notification
    userActivityJournal.forEach((activity) => {
      expect(webPush.sendNotification).toBeCalled();
    });
    userFoodIntake.forEach((foodintake) => {
      expect(webPush.sendNotification).toBeCalled();
    });
    userGlucoseMeasurement.forEach((glucose) => {
      expect(webPush.sendNotification).toBeCalled();
    });
    userInsulin.forEach((Insulin) => {
      expect(webPush.sendNotification).toBeCalled();
    });
    userMedication.forEach((medication) => {
      expect(webPush.sendNotification).toBeCalled();
    });
  });

  // it('should handle the case when notification preferences are not found', async () => {
  //   // Mock the function to simulate the absence of notification preferences
  //   jest
  //     .spyOn(db.NotificationPreference, 'findOne')
  //     .mockResolvedValueOnce(null);

  //   jest.spyOn(db.Subscription, 'findOne').mockResolvedValue(userSubscription);

  //   const res = await request(app)
  //     .get(`/api/reminders/`)
  //     .send('test')
  //     // .set({ Authorization: 'Bearer token' });

  //   // Expectations for the response
  //   expect(db.Subscription.findOne).toHaveBeenCalledTimes(1);
  //   expect(db.NotificationPreference.findOne).toHaveBeenCalledTimes(1);
  //   expect(res.status).toBe(404);
  //   expect(res.body.status).toBe('ERROR');
  //   expect(res.body.message).toBe(
  //     'Notification preference not found, invalid user id.'
  //   );
  // });

  // // it('the test should fail', async () => {
  // //   const res = await request(app)
  // //     .get(`/api/reminders/0`)
  // //     .send('')
  // //     .set({ Authorization: 'Bearer token' });
  // //   expect(res.status).toBe(401);
  // //   expect(res.body.status).toBe('UNAUTHORIZED');
  // // });

  // it('notification should fail sending', async () => {
  //   //Spy On webpush to give error when calling the sendNotification Method
  //   jest
  //     .spyOn(webPush, 'sendNotification')
  //     .mockRejectedValue(new Error('query error'));
  //   jest.spyOn(db.Subscription, 'findOne').mockResolvedValue(userSubscription);
  //   jest
  //     .spyOn(db.NotificationPreference, 'findOne')
  //     .mockResolvedValueOnce(userNotificationPreferences);
  //   jest
  //     .spyOn(db.ActivityJournal, 'findAll')
  //     .mockResolvedValueOnce(userActivityJournal);
  //   jest
  //     .spyOn(db.Appointment, 'findAll')
  //     .mockResolvedValueOnce(userAppointment);
  //   jest
  //     .spyOn(db.FoodIntakeJournal, 'findAll')
  //     .mockResolvedValueOnce(userFoodIntake);
  //   jest.spyOn(db.Medication, 'findAll').mockResolvedValueOnce(userMedication);
  //   jest.spyOn(db.InsulinDosage, 'findAll').mockResolvedValueOnce(userInsulin);
  //   jest
  //     .spyOn(db.GlucoseMeasurement, 'findAll')
  //     .mockResolvedValueOnce(userGlucoseMeasurement);
  //   const res = await request(app)
  //     .get(`/api/reminders/`)
  //     .send(userSubscription)
  //     // .set({ Authorization: 'Bearer token' });
  //   expect(db.Subscription.findOne).toHaveBeenCalledTimes(1);
  //   expect(db.Appointment.findAll).toHaveBeenCalledTimes(1);
  //   //Expect it to be called
  //   userAppointment.forEach((appointment) => {
  //     expect(webPush.sendNotification).toHaveBeenCalled();
  //   });
  // });

  // it('should handle the case when subscription is not found in databases', async () => {
  //   // Mock the function to simulate the absence of subscribtion
  //   jest.spyOn(db.Subscription, 'findOne').mockResolvedValueOnce(null);

  //   const res = await request(app)
  //     .get(`/api/reminders/`)
  //     .send('null')
  //     // .set({ Authorization: 'Bearer token' });

  //   // Expectations for the response
  //   expect(db.Subscription.findOne).toHaveBeenCalledTimes(1);
  //   expect(res.status).toBe(404);
  //   expect(res.body.status).toBe('ERROR');
  //   expect(res.body.message).toBe('No Subscription was found.');
  // });
});
