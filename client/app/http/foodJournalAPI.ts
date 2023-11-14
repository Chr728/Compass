import { auth } from '../config/firebase';
const logger = require('../../logger');

// Function to make a GET request to retrieve all food journals for a user
export async function getFoodIntakeJournals(): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.')
      throw new Error('No user is currently signed in.');
    }
    const id = currentUser.uid;
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/foodIntake/user/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.info(`Food intake journals fetched successfully for user ${id}`)
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      logger.error(`Failed to retrieve food journals for user. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to retrieve food journals for user. HTTP Status: ${response.status}`
      );
    }
  } catch (error) {
    logger.error('Error fetching food journals:', error);
    throw error;
  }
}

// Function to make a GET request to retrieve a specific food journal entry
export async function getFoodIntakeJournal(foodJournalId: string): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.')
      throw new Error('No user is currently signed in.');
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/foodIntake/${foodJournalId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.info(`Food intake journal entry ${foodJournalId} fetched successfully`)
    if (!response.ok) {
      logger.error(`Failed to retrieve food journal entry data. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to retrieve food journal entry data. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error fetching food journal entry:', error);
    throw error;
  }
}

// Function to make a POST request to create a new food journal entry
export async function createFoodIntakeJournal(
  foodJournalData: any
): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.')
      throw new Error('No user is currently signed in.');
    }
    const id = currentUser.uid;
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/foodIntake/user/${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(foodJournalData),
      }
    );
    logger.info(`Food intake journal entry created successfully for user ${id}`)
    if (!response.ok) {
      logger.error(`Failed to create food journal entry for user. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to create food journal entry for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error creating food journal entry:', error);
    throw error;
  }
}

// Function to make a PUT request to update an existing food journal entry
export async function updateFoodIntakeJournal(
  foodJournalId: string,
  updatedFoodJournalData: any
): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.')
      throw new Error('No user is currently signed in.');
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/foodIntake/${foodJournalId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedFoodJournalData),
      }
    );
    logger.info(`Food intake journal entry ${foodJournalId} updated successfully`)
    if (!response.ok) {
      logger.error(`Failed to update food journal entry ${foodJournalId} for user. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to update food journal entry ${foodJournalId} for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error updating food journal entry:', error);
    throw error;
  }
}

// Function to make a DELETE request to delete a food journal entry
export async function deleteFoodIntakeJournal(
  foodJournalId: string
): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.')
      throw new Error('No user is currently signed in.');
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/foodIntake/${foodJournalId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.info(`Food intake journal entry ${foodJournalId} deleted successfully`)
    if (response && response.status && !response.ok) {
      logger.error(`Failed to delete food journal entry. HTTP Status: ${response.status}`)
      throw new Error(`Failed to delete food journal entry. HTTP Status: ${response.status}`);
    } else if (response && response.status === 204) {
      logger.info(`Food journal entry ${foodJournalId} deleted successfully`)
      return { message: 'Food journal entry deleted successfully' };
    }
    return { message: 'Food journal entry deleted successfully' };
  } catch (error) {
    logger.error('Error deleting food journal entry:', error);
    throw error;
  }
}
