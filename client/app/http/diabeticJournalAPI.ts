import { auth } from "../config/firebase";
const logger = require('pino')();

// Function to make a GET request to retrieve all glucose journals for a user
export async function getGlucoseJournals(): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.');
      throw new Error("No user is currently signed in.");
    }
    const id = currentUser.uid;
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/diabetic/glucose/user/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      logger.http(`Glucose journals fetched successfully for user ${id}`)
      const data = await response.json();
      return data;
    } else {
      logger.error(`Failed to retrieve glucose journals for user. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to retrieve glucose journals for user. HTTP Status: ${response.status}`
      );
    }
  } catch (error) {
    logger.error("Error fetching glucose journals:", error);
    throw error;
  }
}

// Function to make a GET request to retrieve a specific glucose journal entry
export async function getGlucoseJournal(
  glucoseJournalId: string
): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.');
      throw new Error("No user is currently signed in.");
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/diabetic/glucose/${glucoseJournalId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.http(`Glucose journal fetched successfully for user ${glucoseJournalId}`)
    if (!response.ok) {
      logger.error(`Failed to retrieve glucose journal entry ${glucoseJournalId} for user. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to retrieve glucose journal entry ${glucoseJournalId} for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("Error fetching glucose journal entry:", error);
    throw error;
  }
}

// Function to make a POST request to create a new glucose journal entry
export async function createGlucoseJournal(
  glucoseJournalData: any
): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.');
      throw new Error("No user is currently signed in.");
    }
    const id = currentUser.uid;
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/diabetic/glucose/user/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(glucoseJournalData),
      }
    );
    logger.http(`Glucose journal created successfully for user ${id}`)
    if (!response.ok) {
      logger.error(`Failed to create glucose journal entry for user. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to create glucose journal entry for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("Error creating glucose journal entry:", error);
    throw error;
  }
}

// Function to make a PUT request to update an existing glucose journal entry
export async function updateGlucoseJournal(
  glucoseJournalId: string,
  updatedGlucoseJournalData: any
): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.');
      throw new Error("No user is currently signed in.");
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/diabetic/glucose/${glucoseJournalId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedGlucoseJournalData),
      }
    );
    logger.http(`Glucose journal updated successfully for user ${glucoseJournalId}`)
    if (!response.ok) {
      logger.error(`Failed to update glucose journal entry ${glucoseJournalId} for user. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to update glucose journal entry ${glucoseJournalId} for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("Error updating glucose journal entry:", error);
    throw error;
  }
}

// Function to make a DELETE request to delete a glucose journal entry
export async function deleteGlucoseJournal(
  glucoseJournalId: string
): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.');
      throw new Error("No user is currently signed in.");
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/diabetic/glucose/${glucoseJournalId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.http(`Glucose journal deleted successfully for user ${glucoseJournalId}`)
    if (response && response.status && !response.ok) {
      logger.error(`Failed to delete glucose journal entry. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to delete glucose journal entry. HTTP Status: ${response.status}`
      );
    } else if (response && response.status === 204) {
      logger.info(`Glucose journal entry deleted successfully for user ${glucoseJournalId}`)
      return { message: "glucose journal entry deleted successfully" };
    }
    return { message: "glucose journal entry deleted successfully" };
  } catch (error) {
    logger.error("Error deleting glucose journal entry:", error);
    throw error;
  }
}



export async function getInsulinJournals(): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.');
      throw new Error("No user is currently signed in.");
    }
    const id = currentUser.uid;
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/diabetic/insulin/user/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.http(`Insulin journals fetched successfully for user ${id}`)
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      logger.error(`Failed to retrieve insulin journals for user. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to retrieve insulin journals for user. HTTP Status: ${response.status}`
      );
    }
  } catch (error) {
    logger.error("Error fetching insulin journals:", error);
    throw error;
  }
}

// Function to make a GET request to retrieve a specific insulin journal entry
export async function getInsulinJournal(
  insulinJournalId: string
): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.');
      throw new Error("No user is currently signed in.");
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/diabetic/insulin/${insulinJournalId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.http(`Insulin journal fetched successfully for user ${insulinJournalId}`)
    if (!response.ok) {
      logger.error(`Failed to retrieve insulin journal entry ${insulinJournalId} for user. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to retrieve insulin journal entry ${insulinJournalId} for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("Error fetching insulin journal entry:", error);
    throw error;
  }
}

// Function to make a POST request to create a new insulin journal entry
export async function createInsulinJournal(
  insulinJournalData: any
): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.');
      throw new Error("No user is currently signed in.");
    }
    const id = currentUser.uid;
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/diabetic/insulin/user/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(insulinJournalData),
      }
    );
    logger.http(`Insulin journal created successfully for user ${id}`)
    if (!response.ok) {
      logger.error(`Failed to create insulin journal entry for user. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to create insulin journal entry for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("Error creating insulin journal entry:", error);
    throw error;
  }
}

// Function to make a PUT request to update an existing insulin journal entry
export async function updateInsulinJournal(
  insulinJournalId: string,
  updatedInsulinJournalData: any
): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.');
      throw new Error("No user is currently signed in.");
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/diabetic/insulin/${insulinJournalId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedInsulinJournalData),
      }
    );
    logger.http(`Insulin journal updated successfully for user ${insulinJournalId}`)
    if (!response.ok) {
      logger.error(`Failed to update insulin journal entry ${insulinJournalId} for user. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to update insulin journal entry ${insulinJournalId} for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error("Error updating insulin journal entry:", error);
    throw error;
  }
}

// Function to make a DELETE request to delete a insulin journal entry
export async function deleteInsulinJournal(
  insulinJournalId: string
): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.');
      throw new Error("No user is currently signed in.");
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/diabetic/insulin/${insulinJournalId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.http(`Insulin journal deleted successfully for user ${insulinJournalId}`)
    if (response && response.status && !response.ok) {
      logger.error(`Failed to delete insulin journal entry. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to delete insulin journal entry. HTTP Status: ${response.status}`
      );
    } else if (response && response.status === 204) {
      logger.info(`Insulin journal entry deleted successfully for user ${insulinJournalId}`)
      return { message: "insulin journal entry deleted successfully" };
    }
    return { message: "insulin journal entry deleted successfully" };
  } catch (error) {
    logger.error("Error deleting insulin journal entry:", error);
    throw error;
  }
}

