import { auth } from '../config/firebase';
const logger = require("pino")();

export async function getMoodJournals(): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error("No user is currently signed in.")
      throw new Error('No user is currently signed in.');
    }
    const id = currentUser.uid;
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/mood/user/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.http(`Mood journals fetched successfully for user ${id}`)
    if (!response.ok) {
      logger.error(`Failed to retrieve mood journals for user ${id}`)
      throw new Error(`Failed to retrieve mood journals for user`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error fetching mood journals:', error);
    throw error;
  }
}
export async function getMoodJournal(moodJournalId: string): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error("No user is currently signed in.")
      throw new Error('No user is currently signed in.');
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/mood/${moodJournalId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.http(`Mood journal fetched successfully for user ${moodJournalId}`)
    if (!response.ok) {
      logger.error(`Failed to retrieve mood journal for user ${moodJournalId}`)
      throw new Error(`Failed to retrieve mood journal entry`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error fetching mood journal:', error);
    throw error;
  }
}
export async function createMoodJournal(moodJournal: any): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error("No user is currently signed in.")
      throw new Error('No user is currently signed in.');
    }
    const id = currentUser.uid;
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/mood/user/${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(moodJournal),
      }
    );
    logger.http(`Mood journal created successfully for user ${id}`)
    if (!response.ok) {
      logger.error(`Failed to create mood journal for user ${id}`)
      throw new Error(`Failed to create mood journal entry`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error creating mood journal:', error);
    throw error;
  }
}

export async function updateMoodJournal(
  moodJournalId: string,
  updatedMoodJournalData: any
): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error("No user is currently signed in.")
      throw new Error('No user is currently signed in.');
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/mood/${moodJournalId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedMoodJournalData),
      }
    );
    logger.http(`Mood journal updated successfully for user ${moodJournalId}`)
    if (!response.ok) {
      logger.error(`Failed to update mood journal for user ${moodJournalId}`)
      throw new Error(`Failed to update mood journal entry`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error updating mood journal:', error);
    throw error;
  }
}

export async function deleteMoodJournal(moodJournalId: string): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error("No user is currently signed in.")
      throw new Error('No user is currently signed in.');
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/journals/mood/${moodJournalId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.http(`Mood journal deleted successfully for user ${moodJournalId}`)
    if (!response.ok) {
      logger.error(`Failed to delete mood journal for user ${moodJournalId}`)
      throw new Error(`Failed to delete mood journal entry`);
    }
  } catch (error) {
    logger.error('Error deleting mood journal:', error);
    throw error;
  }
}
