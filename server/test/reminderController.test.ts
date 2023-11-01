import request from "supertest";
import app from "../index";
import db from "../models/index";
import admin from "firebase-admin";
import moment = require("moment-timezone");
const webPush = require("web-push");

let server: any;
const port = process.env.SERVER_DEV_PORT;
const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
webPush.setVapidDetails("mailto:test@gmail.com", publicKey, privateKey);

const user = {
  id: 10,
  uid: "testuid",
  email: "test@gmail.com",
  firstName: "John",
  lastName: "Doe",
  phoneNumber: "5147894561",
  birthDate: "1990-12-31T00:00:00.000Z",
  sex: "male",
};

const userNotificationPreferences = {
  id: 1,
  uid: "testuid",
  activityReminders: true,
  medicationReminders: true,
  appointmentReminders: true,
  foodIntakeReminders: true,
};

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
  uid: "userUid",
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

const userSubscription = {
  uid: "userUid",
  subscription: "test",
};

const userAppointmentPayload =
  '{"title":"Appointment Reminder with Dr New Docker at 12:00:00"}';

function startServer() {
  server = app.listen(port);
}

function stopServer() {
  if (server) {
    server.close();
  }
}

describe("Testing reminder controller", () => {
  beforeAll(() => {
    startServer();
  });

  afterAll(() => {
    stopServer();
  });

  beforeEach(() => {
    jest
      .spyOn(admin.auth(), "verifyIdToken")
      .mockResolvedValueOnce(mockedDecodedToken);
    jest.spyOn(db.User, "findOne").mockResolvedValue(user);

    jest.mock("moment-timezone", () => {
      return moment.tz.setDefault("America/Toronto");
    });

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
    jest.spyOn(webPush, "sendNotification").mockResolvedValue("test");
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
    const res = await request(app)
      .post(`/api/reminders/${user.uid}`)
      .send(userSubscription)
      .set({ Authorization: "Bearer token" });
    expect(db.ActivityJournal.findAll).toHaveBeenCalledTimes(1);
    expect(db.Appointment.findAll).toHaveBeenCalledTimes(1);
    expect(db.FoodIntakeJournal.findAll).toHaveBeenCalledTimes(1);
    expect(db.GlucoseMeasurement.findAll).toHaveBeenCalledTimes(1);
    expect(db.Medication.findAll).toHaveBeenCalledTimes(1);
    expect(db.InsulinDosage.findAll).toHaveBeenCalledTimes(1);
    userAppointment.forEach((appointment) => {
      expect(webPush.sendNotification).toHaveBeenCalledWith(
        userSubscription,
        userAppointmentPayload
      );
    });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("SUCCESS");
  });

  it("should handle the case when notification preferences are not found", async () => {
    // Mock the function to simulate the absence of notification preferences
    jest
      .spyOn(db.NotificationPreference, "findOne")
      .mockResolvedValueOnce(null);

    const res = await request(app)
      .post(`/api/reminders/${user.uid}`)
      .send("test")
      .set({ Authorization: "Bearer token" });

    // Expectations for the response
    expect(db.NotificationPreference.findOne).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe("ERROR");
    expect(res.body.message).toBe(
      "Notification preference not found, invalid user id."
    );
  });

  it("the test should fail", async () => {
    const res = await request(app)
      .post(`/api/reminders/0`)
      .send("")
      .set({ Authorization: "Bearer token" });
    expect(res.status).toBe(400);
    expect(res.body.status).toBe("ERROR");
  });
});
