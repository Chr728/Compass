import { auth } from "../config/firebase";
const logger = require("../../logger");

// Function to make a GET request to retrieve all health tips for a user
export async function getHealthTips(): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error("No user is currently signed in.");
      throw new Error("No user is currently signed in.");
    }
    const id = currentUser.uid;
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/healthtips/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.info(`Health tips fetched successfully for user ${id}`);
    if (!response.ok) {
      logger.error("Failed to retrieve health tips for user");
      throw new Error(`Failed to retrieve health tips for user`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("Error fetching health tips:", error);
    throw error;
  }
}
