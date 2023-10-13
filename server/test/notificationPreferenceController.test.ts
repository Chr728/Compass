import request from "supertest";
import app from "../index";
import db from "../models/index";
import admin from "firebase-admin";

let server: any;
const port = process.env.SERVER_DEV_PORT;

const notificationPreference = {
  id: 1,
  uid: "userUid",
  activityReminders: true,
  medicationReminders: true,
  appointmentReminders: true,
  foodIntakeReminders: true,
};

const createNotificationPreference = {
  id: 2,
  uid: "userUid",
  activityReminders: true,
  medicationReminders: false,
  appointmentReminders: true,
  foodIntakeReminders: false,
};

const updateNotificationPreference = {
  id: 1,
  uid: "userUid",
  activityReminders: false,
  medicationReminders: false,
  appointmentReminders: false,
  foodIntakeReminders: false,
};

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

function startServer() {
  server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

function stopServer() {
  if (server) {
    server.close(() => {
      console.log("Server stopped");
    });
  }
}

describe("Notification preference Controller tests", () => {
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
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should get notification preference for a user", async () => {
    jest
      .spyOn(db.NotificationPreference, "findOne")
      .mockResolvedValueOnce(notificationPreference);
    const res = await request(app)
      .get("/api/notifications/userUid")
      .set({ Authorization: "Bearer token" });
    expect(db.NotificationPreference.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("SUCCESS");
    expect(res.body.data).toStrictEqual(notificationPreference);
  });

  it("should give error when the notification preference user id sent is wrong", async () => {
    const nonExistentUserId = "user";
    jest
      .spyOn(db.NotificationPreference, "findOne")
      .mockResolvedValueOnce(null);
    const res = await request(app)
      .get(`/api/notifications/${nonExistentUserId}`)
      .set({ Authorization: "Bearer token" });
    expect(db.NotificationPreference.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe("ERROR");
    expect(res.body.message).toBe(
      "Notification preference not found, invalid user id."
    );
  });

  it("should catch error ", async () => {
    jest
      .spyOn(db.NotificationPreference, "findOne")
      .mockRejectedValue(new Error("query error"));
    const res = await request(app)
      .get("/api/notifications/userUid")
      .set({ Authorization: "Bearer token" });
    expect(db.NotificationPreference.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe("ERROR");
  });
});

describe("should test the deleteNotificationPreference Controller", () => {
  it("should delete one specific notification preference", async () => {
    jest
      .spyOn(db.Notification, "destroy")
      .mockResolvedValueOnce(notificationPreference);
    const res = await request(app)
      .delete("/api/notifications/userUid")
      .set({ Authorization: "Bearer token" });
    expect(db.NotificationPreference.destroy).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("SUCCESS");
    expect(res.body.data).toBe("Successfully deleted notification preference.");
  });

  it("should give error when the user id sent is wrong", async () => {
    const nonExistentUserId = "user";
    jest
      .spyOn(db.notificationPreference, "destroy")
      .mockResolvedValueOnce(null);
    const res = await request(app)
      .delete(`/api/notifications/${nonExistentUserId}}`)
      .set({ Authorization: "Bearer token" });
    expect(db.NotificationPreference.destroy).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe("ERROR");
    expect(res.body.message).toBe(
      "Notification preference not found, invalid user id."
    );
  });

  it("should catch error ", async () => {
    jest
      .spyOn(db.NotificationPreference, "destroy")
      .mockRejectedValue(new Error("query error"));
    const res = await request(app)
      .delete("/api/notifications/userUid")
      .set({ Authorization: "Bearer token" });
    expect(db.NotificationPreference.destroy).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe("ERROR");
  });
});

describe("Testing the create notificationPreference controller", () => {
  it("test to create notificationPreference", async () => {
    jest
      .spyOn(db.NotificationPreference, "create")
      .mockResolvedValueOnce(createNotificationPreference);
    const res = await request(app)
      .post("/api/notifications/userUid")
      .send(createNotificationPreference)
      .set({ Authorization: "Bearer token" });
    expect(db.NotificationPreference.create).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(201);
    expect(res.body.status).toBe("SUCCESS");
    expect(res.body.data).toStrictEqual(createNotificationPreference);
  });

  it("test the error if request is not made properly", async () => {
    jest.spyOn(db.NotificationPreference, "create").mockResolvedValueOnce("");
    const res = await request(app)
      .post("/api/notifications/userUid")
      .send("")
      .set({ Authorization: "Bearer token" });
    expect(db.NotificationPreference.create).toHaveBeenCalledTimes(0);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe("ERROR");
  });
});

describe("Testing the update notificationPreference controller", () => {
  it("test to update notificationPreference", async () => {
    jest
      .spyOn(db.NotificationPreference, "update")
      .mockResolvedValueOnce(updateNotificationPreference);
    jest
      .spyOn(db.NotificationPreference, "findOne")
      .mockResolvedValueOnce(updateNotificationPreference);
    const res = await request(app)
      .put("/api/notifications/userUid")
      .set({ Authorization: "Bearer token" });
    expect(db.NotificationPreference.update).toBeCalledTimes(1);
    expect(db.NotificationPreference.findOne).toBeCalledTimes(1);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("SUCCESS");
    expect(res.body.data).toStrictEqual(updateNotificationPreference);
  });

  it("should give error if wrong user id is sent", async () => {
    jest.spyOn(db.NotificationPreference, "update").mockResolvedValueOnce(null);
    const res = await request(app)
      .put("/api/notifications/userUid")
      .set({ Authorization: "Bearer token" });
    expect(db.NotificationPreference.update).toBeCalledTimes(1);
    expect(res.status).toBe(404);
    expect(res.body.status).toBe("ERROR");
    expect(res.body.message).toBe(
      "Notification preference not found, invalid user id."
    );
  });

  it("should catch error", async () => {
    jest
      .spyOn(db.NotificationPreference, "update")
      .mockRejectedValue(new Error("query error"));
    const res = await request(app)
      .put("/api/notifications/userUid")
      .set({ Authorization: "Bearer token" });
    expect(db.NotificationPreference.update).toBeCalledTimes(1);
    expect(res.status).toBe(400);
    expect(res.body.status).toBe("ERROR");
  });
});
