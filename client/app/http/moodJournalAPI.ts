import { auth } from '../config/firebase';

export async function getMoodJournals(): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
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
    if (!response.ok) {
      throw new Error(`Failed to retrieve mood journals for user`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching mood journals:', error);
    throw error;
  }
}
export async function getMoodJournal(moodJournalId: string): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
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
    if (!response.ok) {
      throw new Error(`Failed to retrieve mood journal entry`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching mood journal:', error);
    throw error;
  }
}
export async function createMoodJournal(moodJournal: any): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
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
    if (!response.ok) {
      throw new Error(`Failed to create mood journal entry`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating mood journal:', error);
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
    if (!response.ok) {
      throw new Error(`Failed to update mood journal entry`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating mood journal:', error);
    throw error;
  }
}

export async function deleteMoodJournal(moodJournalId: string): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
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
    if (!response.ok) {
      throw new Error(`Failed to delete mood journal entry`);
    }
  } catch (error) {
    console.error('Error deleting mood journal:', error);
    throw error;
  }
}
