import { auth } from "../config/firebase";

// Function to make a GET request to retrieve all glucose journals for a user
export async function getGlucoseJournals(): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
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
      const data = await response.json();
      return data;
    } else {
      throw new Error(
        `Failed to retrieve glucose journals for user. HTTP Status: ${response.status}`
      );
    }
  } catch (error) {
    console.error("Error fetching glucose journals:", error);
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
    if (!response.ok) {
      throw new Error(
        `Failed to retrieve glucose journal entry ${glucoseJournalId} for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching glucose journal entry:", error);
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
    if (!response.ok) {
      throw new Error(
        `Failed to create glucose journal entry for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating glucose journal entry:", error);
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
    if (!response.ok) {
      throw new Error(
        `Failed to update glucose journal entry ${glucoseJournalId} for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating glucose journal entry:", error);
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
    if (response && response.status && !response.ok) {
      throw new Error(
        `Failed to delete glucose journal entry. HTTP Status: ${response.status}`
      );
    } else if (response && response.status === 204) {
      return { message: "glucose journal entry deleted successfully" };
    }
    return { message: "glucose journal entry deleted successfully" };
  } catch (error) {
    console.error("Error deleting glucose journal entry:", error);
    throw error;
  }
}



export async function getInsulinJournals(): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
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
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(
        `Failed to retrieve insulin journals for user. HTTP Status: ${response.status}`
      );
    }
  } catch (error) {
    console.error("Error fetching insulin journals:", error);
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
    if (!response.ok) {
      throw new Error(
        `Failed to retrieve insulin journal entry ${insulinJournalId} for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching insulin journal entry:", error);
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
    if (!response.ok) {
      throw new Error(
        `Failed to create insulin journal entry for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating insulin journal entry:", error);
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
    if (!response.ok) {
      throw new Error(
        `Failed to update insulin journal entry ${insulinJournalId} for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating insulin journal entry:", error);
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
    if (response && response.status && !response.ok) {
      throw new Error(
        `Failed to delete insulin journal entry. HTTP Status: ${response.status}`
      );
    } else if (response && response.status === 204) {
      return { message: "insulin journal entry deleted successfully" };
    }
    return { message: "insulin journal entry deleted successfully" };
  } catch (error) {
    console.error("Error deleting insulin journal entry:", error);
    throw error;
  }
}

