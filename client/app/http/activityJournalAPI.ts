import { auth } from '../config/firebase';

// Function to make a GET request to retrieve all activity journals for a user
export async function getActivityJournals(userId: string): Promise<any> {
    try {

        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('No user is currently signed in.');
        }
        const id = currentUser.uid;
        const token = await currentUser.getIdToken();

        const response = await fetch(
            `http://localhost:8000/api/journals/activity/user/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        if (!response.ok) {
            throw new Error(
                `Failed to retrieve activity journals for user ${userId}. HTTP Status: ${response.status}`
            );
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching activity journals:', error);
        throw error;
    }
}

// Function to make a GET request to retrieve a specific activity journal entry
export async function getActivityJournal(
    userId: string,
    activityJournalId: string
): Promise<any> {
    try {

        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('No user is currently signed in.');
        }
        const token = await currentUser.getIdToken();

        const response = await fetch(
            `http://localhost:8000/api/journals/activity/${activityJournalId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        if (!response.ok) {
            throw new Error(
                `Failed to retrieve activity journal entry ${activityJournalId} for user ${userId}. HTTP Status: ${response.status}`
            );
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching activity journal entry:', error);
        throw error;
    }
}

// Function to make a POST request to create a new activity journal entry
export async function createActivityJournal(
    userId: string,
    activityJournalData: any
): Promise<any> {
    try {

        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('No user is currently signed in.');
        }
        const id = currentUser.uid;
        const token = await currentUser.getIdToken();

        const response = await fetch(
            `http://localhost:8000/api/journals/activity/user/${id}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(activityJournalData),
            }
        );
        if (!response.ok) {
            throw new Error(
                `Failed to create activity journal entry for user ${userId}. HTTP Status: ${response.status}`
            );
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating activity journal entry:', error);
        throw error;
    }
}

// Function to make a PUT request to update an existing activity journal entry
export async function updateActivityJournal(
    userId: string,
    activityJournalId: string,
    updatedActivityJournalData: any
): Promise<any> {
    try {

        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('No user is currently signed in.');
        }
        const token = await currentUser.getIdToken();

        const response = await fetch(
            `http://localhost:8000/api/journals/activity/${activityJournalId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedActivityJournalData),
            }
        );
        if (!response.ok) {
            throw new Error(
                `Failed to update activity journal entry ${activityJournalId} for user ${userId}. HTTP Status: ${response.status}`
            );
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating activity journal entry:', error);
        throw error;
    }
}

// Function to make a DELETE request to delete a activity journal entry
export async function deleteActivityJournal(
    userId: string,
    activityJournalId: string
): Promise<any> {
    try {

        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('No user is currently signed in.');
        }
        const token = await currentUser.getIdToken();

        const response = await fetch(
            `http://localhost:8000/api/journals/activity/${activityJournalId}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        if (!response.ok) {
            throw new Error(
                `Failed to delete activity journal entry ${activityJournalId} for user ${userId}. HTTP Status: ${response.status}`
            );
        }
        return { message: 'Activity journal entry deleted successfully' };
    } catch (error) {
        console.error('Error deleting activity journal entry:', error);
        throw error;
    }
}
