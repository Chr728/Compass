import { auth } from "../config/firebase";
const logger = require("pino")();

// Function to create a notification preference of a user
export async function createNotificationPreference(): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("No user is currently signed in.");
    }
    const uid = currentUser.uid;
    const token = await currentUser.getIdToken();
    const dataToBeStringified = {
      uid: uid,
      activityReminders: true,
      medicationReminders: true,
      appointmentReminders: true,
      foodIntakeReminders: true,
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${uid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToBeStringified),
      }
    );
    logger.info(`Notification preference created successfully for user ${uid}`);
    if (!response.ok) {
      logger.error(
        `Failed to create notification preference for user. HTTP Status: ${response.status}`
      );
      throw new Error(
        `Failed to create notification preference for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("Error creating notification preference entry:", error);
    throw error;
  }
}

// Function to get notification preference of a user
export async function getNotificationPreference(): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error("No user is currently signed in.");
      throw new Error("No user is currently signed in.");
    }
    const uid = currentUser.uid;
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${uid}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.info(`Notification preference fetched successfully for user ${uid}`);
    if (!response.ok) {
      logger.error(
        `Failed to retrieve notification preferences for user. HTTP Status: ${response.status}`
      );
      throw new Error(
        `Failed to retrieve notification preferences for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("Error fetching notification preferences:", error);
    throw error;
  }
}

// Function to update notification preference of a user
export async function updateNotificationPreference(
  updatedNotificationPreference: any
): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error("No user is currently signed in.");
      throw new Error("No user is currently signed in.");
    }
    const uid = currentUser.uid;
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${uid}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedNotificationPreference),
      }
    );
    logger.info(`Notification preference updated successfully for user ${uid}`);
    if (!response.ok) {
      logger.error(
        `Failed to update notification preference for user ${uid}. HTTP Status: ${response.status}`
      );
      throw new Error(
        `Failed to update notification preference for user ${uid}. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("Error updating notification preference:", error);
    throw error;
  }
}

// Function to delete notification preference of a user
export async function deleteNotificationPreference(
  userID: string
): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error("No user is currently signed in.");
      throw new Error("No user is currently signed in.");
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/${userID}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.info(
      `Notification preference deleted successfully for user ${userID}`
    );
    if (!response.ok) {
      logger.error(
        `Failed to delete notification preference for user ${userID}. HTTP Status: ${response.status}`
      );
      throw new Error(
        `Failed to delete notification preference for user ${userID}. HTTP Status: ${response.status}`
      );
    }
    return { message: "Notification preference deleted successfully" };
  } catch (error) {
    logger.error("Error deleting notification preference:", error);
    throw error;
  }
}
