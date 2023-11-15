import { auth } from '../config/firebase';
const logger = require("pino")();

// Function to make a GET request to retrieve all weight journals for a user
export async function getWeightJournals(): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error("No user is currently signed in.")
      throw new Error('No user is currently signed in.');
    }
    const id = currentUser.uid;
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/weight/user/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      logger.info(`Weight journals fetched successfully for user ${id}`)
      const data = await response.json();
      return data;
    } else {
      logger.error(`Failed to retrieve weight journals for user. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to retrieve weight journals for user. HTTP Status: ${response.status}`
      );
    }
  } catch (error) {
    logger.error('Error fetching weight journals:', error);
    throw error;
  }
}

// Function to make a GET request to retrieve a specific weight journal entry
export async function getWeightJournal(weightJournalId: string): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error("No user is currently signed in.")
      throw new Error('No user is currently signed in.');
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/weight/${weightJournalId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.info(`Weight journal entry fetched successfully for user ${weightJournalId}`)
    if (!response.ok) {
      logger.error(
        `Failed to retrieve weight journal entry ${weightJournalId} for user. HTTP Status: ${response.status}`
      );
      throw new Error(
        `Failed to retrieve weight journal entry ${weightJournalId} for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error fetching weight journal entry:', error);
    throw error;
  }
}

// Function to make a POST request to create a new weight journal entry
export async function createWeightJournal(
  weightJournalData: any
): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error("No user is currently signed in.")
      throw new Error('No user is currently signed in.');
    }
    const id = currentUser.uid;
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/weight/user/${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(weightJournalData),
      }
    );
    logger.info(`Weight journal entry created successfully for user ${id}`)
    if (!response.ok) {
      logger.error(
        `Failed to create weight journal entry for user. HTTP Status: ${response.status}`
      );
      throw new Error(
        `Failed to create weight journal entry for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error creating weight journal entry:', error);
    throw error;
  }
}

// Function to make a PUT request to update an existing weight journal entry
export async function updateWeightJournal(
  weightJournalId: string,
  updatedWeightJournalData: any
): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error("No user is currently signed in.")
      throw new Error('No user is currently signed in.');
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/weight/${weightJournalId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedWeightJournalData),
      }
    );
    logger.info(`Weight journal entry updated successfully for user ${weightJournalId}`)
    if (!response.ok) {
      logger.error(
        `Failed to update weight journal entry ${weightJournalId} for user. HTTP Status: ${response.status}`
      );
      throw new Error(
        `Failed to update weight journal entry ${weightJournalId} for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error updating weight journal entry:', error);
    throw error;
  }
}

// Function to make a DELETE request to delete a weight journal entry
export async function deleteWeightJournal(
  weightJournalId: string
): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error("No user is currently signed in.")
      throw new Error('No user is currently signed in.');
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/weight/${weightJournalId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.info(`Weight journal entry deleted successfully for user ${weightJournalId}`)
    if (response && response.status && !response.ok) {
      logger.error(
        `Failed to delete weight journal entry. HTTP Status: ${response.status}`
      );
      throw new Error(`Failed to delete weight journal entry. HTTP Status: ${response.status}`);
    } else if (response && response.status === 204) {
      logger.info('Weight journal entry deleted successfully')
      return { message: 'Weight journal entry deleted successfully' };
    }
    return { message: 'Weight journal entry deleted successfully' };
  } catch (error) {
    logger.error('Error deleting weight journal entry:', error);
    throw error;
  }
}
