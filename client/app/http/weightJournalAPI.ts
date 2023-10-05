import { auth } from '../config/firebase';

// Function to make a GET request to retrieve all weight journals for a user
export async function getWeightJournals(userId: string): Promise<any> {
  try {

    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in.');
    }
    const id = currentUser.uid;
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `http://localhost:8000/api/journals/weight/user/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to retrieve weight journals for user ${userId}. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weight journals:', error);
    throw error;
  }
}

// Function to make a GET request to retrieve a specific weight journal entry
export async function getWeightJournal(
  userId: string,
  weightJournalId: string
): Promise<any> {
  try {

    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in.');
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `http://localhost:8000/api/journals/weight/${weightJournalId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
        }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to retrieve weight journal entry ${weightJournalId} for user ${userId}. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching weight journal entry:', error);
    throw error;
  }
}

// Function to make a POST request to create a new weight journal entry
export async function createWeightJournal(
  userId: string,
  weightJournalData: any
): Promise<any> {
  try {

    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in.');
    }
    const id = currentUser.uid;
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `http://localhost:8000/api/journals/weight/user/${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(weightJournalData),
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to create weight journal entry for user ${userId}. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating weight journal entry:', error);
    throw error;
  }
}

// Function to make a PUT request to update an existing weight journal entry
export async function updateWeightJournal(
  userId: string,
  weightJournalId: string,
  updatedWeightJournalData: any
): Promise<any> {
  try {

    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in.');
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `http://localhost:8000/api/journals/weight/${weightJournalId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedWeightJournalData),
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to update weight journal entry ${weightJournalId} for user ${userId}. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating weight journal entry:', error);
    throw error;
  }
}

// Function to make a DELETE request to delete a weight journal entry
export async function deleteWeightJournal(
  userId: string,
  weightJournalId: string
): Promise<any> {
  try {

    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('No user is currently signed in.');
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `http://localhost:8000/api/journals/weight/${weightJournalId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to delete weight journal entry ${weightJournalId} for user ${userId}. HTTP Status: ${response.status}`
      );
    }
    return { message: 'Weight journal entry deleted successfully' };
  } catch (error) {
    console.error('Error deleting weight journal entry:', error);
    throw error;
  }
}
