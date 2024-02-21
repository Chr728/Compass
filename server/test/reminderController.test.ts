import db from "../models/index";
import admin from "firebase-admin";
import moment from "moment-timezone";
const webPush = require("web-push");
import { user, startServer, stopServer } from "../utils/journalsTestHelper";
import { checkFrequency, sendUserReminders } from "../tasks/reminderTask";
import { Logger } from "../middlewares/logger";

let server: any;
const port = process.env.PORT;
const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
webPush.setVapidDetails("mailto:test@gmail.com", publicKey, privateKey);

//Predefined preferences
const userNotificationPreferences = {
  id: 1,
  uid: "testuid",
  permissionGranted: true,
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
    dateStarted: "2023-09-20",
    expirationDate: "2023-09-30",
    time: "12:00:00",
    dosage: 2,
    unit: "test",
    frequency: "Test",
    route: "Test",
    notes: "test",
  },
  {
    id: 2,
    uid: "testuid",
    medicationName: "test",
    dateStarted: "2023-09-30",
    expirationDate: "2023-10-10",
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

  //Mock web push library
  jest.mock("web-push", () => {
    return {
      sendNotification: jest.fn(),
    };
  });

  // Mock the moment module
  jest.mock("moment-timezone");

  // Mock the logger module
  jest.mock("../middlewares/logger", () => {
    const originalLogger = jest.requireActual("../middlewares/logger");

    return {
      ...originalLogger,
      Logger: {
        info: jest.fn(),
        error: jest.fn(),
      },
    };
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Testing reminder server task", () => {
  it("should send all reminders and prepare payloads", async () => {
    // Mock dependencies
    jest.spyOn(webPush, "sendNotification").mockResolvedValue("test");
    jest.spyOn(db.Appointment, "findAll").mockResolvedValue(userAppointment);
    jest
      .spyOn(db.ActivityJournal, "findAll")
      .mockResolvedValue(userActivityJournal);
    jest
      .spyOn(db.FoodIntakeJournal, "findAll")
      .mockResolvedValue(userFoodIntake);
    jest
      .spyOn(db.GlucoseMeasurement, "findAll")
      .mockResolvedValue(userGlucoseMeasurement);
    jest.spyOn(db.InsulinDosage, "findAll").mockResolvedValue(userInsulin);
    jest.spyOn(db.Medication, "findAll").mockResolvedValue(userMedication);
    jest
      .spyOn(db.NotificationPreference, "findOne")
      .mockResolvedValue(userNotificationPreferences);
    jest.spyOn(db.Subscription, "findOne").mockResolvedValue(userSubscription);

    // Spy on the Logger.info and Logger.error functions
    jest.spyOn(Logger, "info");

    await sendUserReminders();

    // Assertions for the main functionality
    expect(db.Appointment.findAll).toHaveBeenCalledTimes(1);
    expect(db.ActivityJournal.findAll).toHaveBeenCalledTimes(1);
    expect(db.FoodIntakeJournal.findAll).toHaveBeenCalledTimes(1);
    expect(db.GlucoseMeasurement.findAll).toHaveBeenCalledTimes(1);
    expect(db.InsulinDosage.findAll).toHaveBeenCalledTimes(1);
    expect(db.Medication.findAll).toHaveBeenCalledTimes(1);
    expect(db.NotificationPreference.findOne).toHaveBeenCalledTimes(7);
    expect(db.Subscription.findOne).toHaveBeenCalledTimes(7);
    expect(webPush.sendNotification).toHaveBeenCalledTimes(5);

    // Assertions for logging statements
    expect(Logger.info).toHaveBeenCalledWith(
      "Notification for appointments sent to user: ",
      userAppointment[0].uid
    );
    expect(Logger.info).toHaveBeenCalledWith(
      "Notification for activityJournals sent to user: ",
      userActivityJournal[0].uid
    );
    expect(Logger.info).toHaveBeenCalledWith(
      "Notification for foodIntakeJournals sent to user: ",
      userFoodIntake[0].uid
    );
    expect(Logger.info).toHaveBeenCalledWith(
      "Notification for glucoseMeasurements sent to user: ",
      userGlucoseMeasurement[0].uid
    );
    expect(Logger.info).toHaveBeenCalledWith(
      "Notification for insulinDosages sent to user: ",
      userInsulin[0].uid
    );
    // expect(Logger.info).toHaveBeenCalledWith(
    //   "Expiration notification for medications sent to user: ",
    //   userMedication[0].uid
    // );
    // expect(Logger.info).toHaveBeenCalledWith(
    //   "Notification for medications sent to user: ",
    //   userMedication[1].uid
    // );
  });

  it("should log an error when notification preferences are not found", async () => {
    // Mock dependencies
    jest.spyOn(db.Appointment, "findAll").mockResolvedValue(userAppointment);
    jest
      .spyOn(db.ActivityJournal, "findAll")
      .mockResolvedValue(userActivityJournal);
    jest
      .spyOn(db.FoodIntakeJournal, "findAll")
      .mockResolvedValue(userFoodIntake);
    jest
      .spyOn(db.GlucoseMeasurement, "findAll")
      .mockResolvedValue(userGlucoseMeasurement);
    jest.spyOn(db.InsulinDosage, "findAll").mockResolvedValue(userInsulin);
    jest.spyOn(db.Medication, "findAll").mockResolvedValue(userMedication);
    // Simulates not finding the notification preference
    jest
      .spyOn(db.NotificationPreference, "findOne")
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);
    jest.spyOn(Logger, "error");

    await sendUserReminders();

    // Assertions
    expect(db.Appointment.findAll).toHaveBeenCalledTimes(1);
    expect(db.ActivityJournal.findAll).toHaveBeenCalledTimes(1);
    expect(db.FoodIntakeJournal.findAll).toHaveBeenCalledTimes(1);
    expect(db.GlucoseMeasurement.findAll).toHaveBeenCalledTimes(1);
    expect(db.InsulinDosage.findAll).toHaveBeenCalledTimes(1);
    expect(db.Medication.findAll).toHaveBeenCalledTimes(1);
    expect(db.NotificationPreference.findOne).toHaveBeenCalledTimes(7);

    // Ensure Logger.error is called with the appropriate message
    expect(Logger.error).toHaveBeenCalledTimes(7);
    expect(Logger.error).toHaveBeenCalledWith(
      "Notification preference not found, invalid user id."
    );
  });

  it("should log an error when subscriptions is not found", async () => {
    // Mock dependencies
    jest.spyOn(db.Appointment, "findAll").mockResolvedValue(userAppointment);
    jest
      .spyOn(db.ActivityJournal, "findAll")
      .mockResolvedValue(userActivityJournal);
    jest
      .spyOn(db.FoodIntakeJournal, "findAll")
      .mockResolvedValue(userFoodIntake);
    jest
      .spyOn(db.GlucoseMeasurement, "findAll")
      .mockResolvedValue(userGlucoseMeasurement);
    jest.spyOn(db.InsulinDosage, "findAll").mockResolvedValue(userInsulin);
    jest.spyOn(db.Medication, "findAll").mockResolvedValue(userMedication);
    jest
      .spyOn(db.NotificationPreference, "findOne")
      .mockResolvedValue(userNotificationPreferences);
    jest.spyOn(db.Subscription, "findOne").mockResolvedValue(null); // Simulate not finding the subscription
    jest.spyOn(Logger, "error");

    await sendUserReminders();

    // Assertions
    expect(db.Appointment.findAll).toHaveBeenCalledTimes(1);
    expect(db.ActivityJournal.findAll).toHaveBeenCalledTimes(1);
    expect(db.FoodIntakeJournal.findAll).toHaveBeenCalledTimes(1);
    expect(db.GlucoseMeasurement.findAll).toHaveBeenCalledTimes(1);
    expect(db.InsulinDosage.findAll).toHaveBeenCalledTimes(1);
    expect(db.Medication.findAll).toHaveBeenCalledTimes(1);
    expect(db.NotificationPreference.findOne).toHaveBeenCalledTimes(7);
    expect(db.Subscription.findOne).toHaveBeenCalledTimes(7);

    // Ensure Logger.error is called with the appropriate message
    expect(Logger.error).toHaveBeenCalledTimes(7);
    expect(Logger.error).toHaveBeenCalledWith("No Subscription was found.");
  });

  it("should log an error when webPush.sendNotification fails", async () => {
    // Mock dependencies
    jest.spyOn(db.Appointment, "findAll").mockResolvedValue(userAppointment);
    jest
      .spyOn(db.ActivityJournal, "findAll")
      .mockResolvedValue(userActivityJournal);
    jest
      .spyOn(db.FoodIntakeJournal, "findAll")
      .mockResolvedValue(userFoodIntake);
    jest
      .spyOn(db.GlucoseMeasurement, "findAll")
      .mockResolvedValue(userGlucoseMeasurement);
    jest.spyOn(db.InsulinDosage, "findAll").mockResolvedValue(userInsulin);
    jest.spyOn(db.Medication, "findAll").mockResolvedValue(userMedication);
    jest
      .spyOn(db.NotificationPreference, "findOne")
      .mockResolvedValue(userNotificationPreferences);
    jest.spyOn(db.Subscription, "findOne").mockResolvedValue(userSubscription);
    jest.spyOn(webPush, "sendNotification").mockRejectedValue("WebPush Error");
    jest.spyOn(Logger, "error");

    await sendUserReminders();

    // Assertions
    expect(db.Appointment.findAll).toHaveBeenCalledTimes(1);
    expect(db.ActivityJournal.findAll).toHaveBeenCalledTimes(1);
    expect(db.FoodIntakeJournal.findAll).toHaveBeenCalledTimes(1);
    expect(db.GlucoseMeasurement.findAll).toHaveBeenCalledTimes(1);
    expect(db.InsulinDosage.findAll).toHaveBeenCalledTimes(1);
    expect(db.Medication.findAll).toHaveBeenCalledTimes(1);
    expect(db.NotificationPreference.findOne).toHaveBeenCalledTimes(7);
    expect(db.Subscription.findOne).toHaveBeenCalledTimes(7);
    expect(webPush.sendNotification).toHaveBeenCalled(); // Ensure this is called
    expect(Logger.error).toHaveBeenCalledWith("WebPush Error"); // Ensure Logger.error is called with the appropriate message
  });

  it("should log an error when there's a database error", async () => {
    // Mock dependencies
    jest.spyOn(db.Appointment, "findAll").mockImplementation(() => {
      throw new Error("Database error"); // Simulate a database error
    });
    jest.spyOn(Logger, "error");

    try {
      // Call the function and expect it to throw an error
      await sendUserReminders();

      // If the promise is resolved, fail the test
      fail("Expected the promise to be rejected, but it was resolved.");
    } catch (err) {
      // Assertions
      expect(Logger.error).toHaveBeenCalledWith(
        "Error occurred while fetching reminders for user: Error: Database error"
      );
    }
  });
});

describe("checkFrequency function", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return true for 'Once a day (morning)' at 8:00 AM", () => {
    const result = checkFrequency("Once a day (morning)", "08:00:00");
    expect(result).toBe(true);
  });

  it("should return false for 'Once a day (morning)' at 9:00 AM", () => {
    const result = checkFrequency("Once a day (morning)", "09:00:00");
    expect(result).toBe(false);
  });

  it("should return true for 'Once a day (evening)' at 8:00 PM", () => {
    const result = checkFrequency("Once a day (evening)", "20:00:00");
    expect(result).toBe(true);
  });

  it("should return false for 'Once a day (evening)' at 9:00 PM", () => {
    const result = checkFrequency("Once a day (evening)", "21:00:00");
    expect(result).toBe(false);
  });

  it("should return true for 'Twice a day' at 10:00 AM", () => {
    const result = checkFrequency("Twice a day", "10:00:00");
    expect(result).toBe(true);
  });

  it("should return false for 'Twice a day' at 12:00 PM", () => {
    const result = checkFrequency("Twice a day", "12:00:00");
    expect(result).toBe(false);
  });

  it("should return true for 'Three times a day' at 10:00 AM", () => {
    const result = checkFrequency("Three times a day", "10:00:00");
    expect(result).toBe(true);
  });

  it("should return false for 'Three times a day' at 17:00:00 PM", () => {
    const result = checkFrequency("Three times a day", "17:00:00");
    expect(result).toBe(false);
  });

  it("should return true for 'Four times a day' at 08:00:00 AM", () => {
    const result = checkFrequency("Four times a day", "08:00:00");
    expect(result).toBe(true);
  });

  it("should return false for 'Four times a day' at 14:00:00 PM", () => {
    const result = checkFrequency("Four times a day", "14:00:00");
    expect(result).toBe(false);
  });

  it("should return true for 'Five times a day' at 10:00:00 AM", () => {
    const result = checkFrequency("Five times a day", "10:00:00");
    expect(result).toBe(true);
  });

  it("should return false for 'Five times a day' at 15:00:00 PM", () => {
    const result = checkFrequency("Five times a day", "15:00:00");
    expect(result).toBe(false);
  });

  it("should return true for 'Six times a day' at 17:00:00 PM", () => {
    const result = checkFrequency("Six times a day", "17:00:00");
    expect(result).toBe(true);
  });

  it("should return false for 'Six times a day' at 12:00:00 PM", () => {
    const result = checkFrequency("Six times a day", "12:00:00");
    expect(result).toBe(false);
  });
  it("should return true for 'Every 30 minutes' at 00:30:00 AM", () => {
    const result = checkFrequency("Every 30 minutes", "00:30:00");
    expect(result).toBe(true);
  });

  it("should return false for 'Every 30 minutes' at 00:15:00 AM", () => {
    const result = checkFrequency("Every 30 minutes", "00:15:00");
    expect(result).toBe(false);
  });

  it("should return true for 'Every 1 hour' at 01:00:00 AM", () => {
    const result = checkFrequency("Every 1 hour", "01:00:00");
    expect(result).toBe(true);
  });

  it("should return false for 'Every 1 hour' at 01:30:00 AM", () => {
    const result = checkFrequency("Every 1 hour", "01:30:00");
    expect(result).toBe(false);
  });

  it("should return true for 'Every 2 hours' at 12:00:00 PM", () => {
    const result = checkFrequency("Every 2 hours", "12:00:00");
    expect(result).toBe(true);
  });

  it("should return false for 'Every 2 hours' at 13:00:00 PM", () => {
    const result = checkFrequency("Every 2 hours", "13:00:00");
    expect(result).toBe(false);
  });

  it("should return true for 'Every 4 hours' at 12:00:00 PM", () => {
    const result = checkFrequency("Every 4 hours", "12:00:00");
    expect(result).toBe(true);
  });

  it("should return false for 'Every 4 hours' at 14:00:00 PM", () => {
    const result = checkFrequency("Every 4 hours", "14:00:00");
    expect(result).toBe(false);
  });

  it("should return true for 'Every 6 hours' at 18:00:00 PM", () => {
    const result = checkFrequency("Every 6 hours", "18:00:00");
    expect(result).toBe(true);
  });

  it("should return false for 'Every 6 hours' at 16:00:00 PM", () => {
    const result = checkFrequency("Every 6 hours", "16:00:00");
    expect(result).toBe(false);
  });

  it("should return true for 'Every 8 hours' at 16:00:00 PM", () => {
    const result = checkFrequency("Every 8 hours", "16:00:00");
    expect(result).toBe(true);
  });

  it("should return false for 'Every 8 hours' at 14:00:00 PM", () => {
    const result = checkFrequency("Every 8 hours", "14:00:00");
    expect(result).toBe(false);
  });

  it("should return true for 'Before meals' at 09:00:00 AM", () => {
    const result = checkFrequency("Before meals", "09:00:00");
    expect(result).toBe(true);
  });

  it("should return true for 'Before meals' at 12:00:00 PM", () => {
    const result = checkFrequency("Before meals", "12:00:00");
    expect(result).toBe(true);
  });

  it("should return false for 'Before meals' at 4:00:00 AM", () => {
    const result = checkFrequency("Before meals", "4:00:00");
    expect(result).toBe(false);
  });

  it("should return true for 'After meals' at 10:00:00 AM", () => {
    const result = checkFrequency("After meals", "10:00:00");
    expect(result).toBe(true);
  });

  it("should return false for 'After meals' at 4:00:00 AM", () => {
    const result = checkFrequency("After meals", "4:00:00");
    expect(result).toBe(false);
  });

  it("should return true for 'Before bedtime' at 22:00:00 PM", () => {
    const result = checkFrequency("Before bedtime", "22:00:00");
    expect(result).toBe(true);
  });

  it("should return false for 'Before bedtime' at 10:00:00 AM", () => {
    const result = checkFrequency("Before bedtime", "10:00:00");
    expect(result).toBe(false);
  });

  it("should return false for 'As needed (PRN)'", () => {
    const result = checkFrequency("As needed (PRN)", "12:00:00");
    expect(result).toBe(false);
  });

  it("should return false for 'Other' and log an error", () => {
    jest.spyOn(Logger, "error");
    const result = checkFrequency("Other", "12:00:00");
    expect(result).toBe(false);
  });

  it("should log an error for an unknown frequency", () => {
    jest.spyOn(Logger, "error");
    checkFrequency("Unknown Frequency", "12:00:00");
    expect(Logger.error).toHaveBeenCalledWith(
      "Unknown frequency entered for medication..."
    );
  });
});
