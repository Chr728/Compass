import { auth } from "../config/firebase";

// Function to create a subscription object for push notifications for a user
export async function createSubscription(subscription: any): Promise<any> {
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
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscription),
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

// Function to update a subscription object for push notifications for a user
export async function updateSubscription(subscription: any): Promise<any> {
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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscription),
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
