import { auth } from "../config/firebase";
const logger = require("pino")();

// Function to prepare push notifications
export async function sendUserReminders(): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error("No user is currently signed in.");
      throw new Error("No user is currently signed in.");
    }
    const uid = currentUser.uid;
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reminders/${uid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "Access-Control-Allow-Origin": "*",
        },
        mode:"cors",
      }
    );
    logger.info(`Reminder notifications sent successfully for user ${uid}`);
    if (!response.ok) {
      logger.error(
        `Failed to send reminder notifications for user. HTTP Status: ${response.status}`
      );
      throw new Error(
        `Failed to create reminder for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("Error creating reminder entry:", error);
    throw error;
  }
}
