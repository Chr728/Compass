import db from "../models/index";
import admin from "firebase-admin";
import moment from "moment-timezone";
const webPush = require("web-push");
import { user, startServer, stopServer } from "../utils/journalsTestHelper";
import { sendMoodReminder } from "../tasks/moodReminderTask";
import { Logger } from "../middlewares/logger";

let server: any;
const port = process.env.PORT;
const publicKey = process.env.VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
webPush.setVapidDetails("mailto:test@gmail.com", publicKey, privateKey);


//Predefined mood journal entry
const userMoodJournal = [
    {
        id: 1,
        uid: 'testuid',
        howAreYou: 'sad',
        stressSignals: {
        tired: 'rarely',
        sleep: 'sometimes',
        hunger: 'sometimes',
        overeating: 'rarely',
        depressed: 'often',
        pressure: 'rarely',
        anxiety: 'rarely',
        attention: 'never',
        anger: 'never',
        headache: 'sometimes',
        },
        date: '2023-10-08T10:00:00Z',
        notes: 'Sample mood entry',
        time:"10:00:00",
    }
];

//Predefined token
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

describe("Testing mood journal reminders ", () => {
  it("should send the mood journal reminder", async () => {
    // Spy on all Mood Journal functions
    jest.spyOn(webPush, "sendNotification").mockResolvedValue("test");
    jest.spyOn(db.MoodJournal, "findAll").mockResolvedValue(userMoodJournal);
    jest.spyOn(db.Subscription, "findOne").mockResolvedValue(userSubscription);

    //Spy on logger 
    jest.spyOn(Logger, "info");

    //Call mood reminder function
    await sendMoodReminder();

    //Check assertions for the mood jounral functions
    expect(db.MoodJournal.findAll).toHaveBeenCalledTimes(1);
    expect(db.Subscription.findOne).toHaveBeenCalledTimes(1);
    expect(webPush.sendNotification).toHaveBeenCalledTimes(1);

    //Check if function was sucesfully called
    expect(Logger.info).toHaveBeenCalledWith(
        "Notification for moodJournal sent to user: ",
        userMoodJournal[0].uid
    );
  });

  it("should send error if it fails to fetch mood reminder", async () => {
    // Mock Mood Journal function
    jest.spyOn(db.MoodJournal, "findAll").mockImplementation(() => {
      throw new Error("Failed to fetch");
    });
    jest.spyOn(Logger, "error");

    try {
      await sendMoodReminder();

      fail("Expected the promise to be rejected, but it was resolved.");
    } catch (err) {
      // Assertions
      expect(Logger.error).toHaveBeenCalledWith(
        "Error occurred while fetching mood journal reminders for user: Error: Failed to fetch"
      );
    }
  });
});