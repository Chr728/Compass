import { auth } from "../config/firebase";
const logger = require("pino")();

// Function to create a subscription object for push notifications for a user
export async function createSubscription(
  userUID: any,
  userToken: any,
  subscription: any
): Promise<any> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/subscription/${userUID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ subscription: subscription }),
      }
    );
    logger.info(`Subscription object created successfully for user ${userUID}`);
    if (!response.ok) {
      logger.error(
        `Failed to create subscription object for user. HTTP Status: ${response.status}`
      );
      throw new Error(
        `Failed to create subscription object for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("Error creating subscription object:", error);
    throw error;
  }
}

// Function to get subscription object of a user
export async function getSubscription(
  userUID: any,
  userToken: any
): Promise<any> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/subscription/${userUID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      }
    );
    logger.info(`Subscription object fetched successfully for user ${userUID}`);
    if (!response.ok) {
      logger.error(
        `Failed to retrieve subscription object for user. HTTP Status: ${response.status}`
      );
      throw new Error(
        `Failed to retrieve subscription object for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("Error fetching subscription object:", error);
    throw error;
  }
}

// Function to update a subscription object for push notifications for a user
export async function updateSubscription(
  userUID: any,
  userToken: any,
  subscription: any
): Promise<any> {
  try {
    const subscriptionData = { ...subscription };
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/subscription/${userUID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({ subscription: subscription }),
      }
    );
    logger.info(`Subscription object updated successfully for user ${userUID}`);
    if (!response.ok) {
      logger.error(
        `Failed to update subscription object for user. HTTP Status: ${response.status}`
      );
      throw new Error(
        `Failed to update subscription object for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("Error updating subscription object:", error);
    throw error;
  }
}

// Function to delete a subscription object for push notifications for a user
export async function deleteSubscription(): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error("No user is currently signed in.");
      throw new Error("No user is currently signed in.");
    }
    const uid = currentUser.uid;
    const token = await currentUser.getIdToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/subscription/${uid}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.info(`Subscription object deleted successfully for user ${uid}`);
    if (!response.ok) {
      logger.error(
        `Failed to delete subscription object for user. HTTP Status: ${response.status}`
      );
      throw new Error(
        `Failed to delete subscription object for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return { message: "Subscription object deleted successfully" };
  } catch (error) {
    logger.error("Error deleting subscription object:", error);
    throw error;
  }
}
