import { auth } from "../config/firebase";

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
    if (!response.ok) {
      throw new Error(
        `Failed to create subscription object for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating subscription object:", error);
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
    if (!response.ok) {
      throw new Error(
        `Failed to retrieve subscription object for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching subscription object:", error);
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
    if (!response.ok) {
      throw new Error(
        `Failed to update subscription object for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating subscription object:", error);
    throw error;
  }
}

// Function to delete a subscription object for push notifications for a user
export async function deleteSubscription(): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
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
    if (!response.ok) {
      throw new Error(
        `Failed to delete subscription object for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return { message: "Subscription object deleted successfully" };
  } catch (error) {
    console.error("Error deleting subscription object:", error);
    throw error;
  }
}
