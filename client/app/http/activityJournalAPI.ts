import { log } from 'console';
import {auth} from '../config/firebase';
const logger = require('../../logger');

// Function to make a GET request to retrieve all activity journals for a user
export async function getActivityJournals(): Promise<any> {
    try {

        const currentUser = auth.currentUser;
        if (!currentUser) {
            logger.error('No user is currently signed in.');
            throw new Error('No user is currently signed in.');
        }
        const id = currentUser.uid;
        const token = await currentUser.getIdToken();

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/journals/activity/user/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        logger.http(`Activity journals fetched successfully for user ${id}`)
        if (!response.ok) {
            logger.error('Failed to retrieve activity journals for user');
            throw new Error(
                `Failed to retrieve activity journals for user`
            );
        }
        const data = await response.json();
        return data;
    } catch (error) {
        logger.error('Error fetching activity journals:', error);
        throw error;
    }
}

// Function to make a GET request to retrieve a specific activity journal entry
export async function getActivityJournal(activityJournalId: string): Promise<any> {
    try {

        const currentUser = auth.currentUser;
        if (!currentUser) {
            logger.error('No user is currently signed in.');
            throw new Error('No user is currently signed in.');
        }
        const token = await currentUser.getIdToken();

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/journals/activity/${activityJournalId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        logger.http(`Activity journal fetched successfully for user ${activityJournalId}`)
        if (!response.ok) {
            logger.error('Failed to retrieve activity journal entry');
            throw new Error(
                `Failed to retrieve activity journal entry`
            );
        }
        const data = await response.json();
        return data;
    } catch (error) {
        logger.error('Error fetching activity journal entry:', error);
        throw error;
    }
}

// Function to make a POST request to create a new activity journal entry
export async function createActivityJournal(activityJournalData: any): Promise<any> {
    try {

        const currentUser = auth.currentUser;
        if (!currentUser) {
            logger.error('No user is currently signed in.');
            throw new Error('No user is currently signed in.');
        }
        const id = currentUser.uid;
        const token = await currentUser.getIdToken();

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/journals/activity/user/${id}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(activityJournalData),
            }
        );
        logger.http(`Activity journal entry created successfully for user ${id}`)
        if (!response.ok) {
            logger.error('Failed to create activity journal entry');
            throw new Error(
                `Failed to create activity journal entry`
            );
        }
        const data = await response.json();
        return data;
    } catch (error) {
        logger.error('Error creating activity journal entry:', error);
        throw error;
    }
}

// Function to make a PUT request to update an existing activity journal entry
export async function updateActivityJournal(
    activityJournalId: string,
    updatedActivityJournalData: any
): Promise<any> {
    try {

        const currentUser = auth.currentUser;
        if (!currentUser) {
            logger.error('No user is currently signed in.');
            throw new Error('No user is currently signed in.');
        }
        const token = await currentUser.getIdToken();

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/journals/activity/${activityJournalId}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updatedActivityJournalData),
            }
        );
        logger.http(`Activity journal entry updated successfully for user ${activityJournalId}`)
        if (!response.ok) {
            logger.error('Failed to update activity journal entry');
            throw new Error(
                `Failed to update activity journal entry`
            );
        }
        const data = await response.json();
        return data;
    } catch (error) {
        logger.error('Error updating activity journal entry:', error);
        throw error;
    }
}

// Function to make a DELETE request to delete a activity journal entry
export async function deleteActivityJournal(activityJournalId: string): Promise<any> {
    try {

        const currentUser = auth.currentUser;
        if (!currentUser) {
            logger.error('No user is currently signed in.');
            throw new Error('No user is currently signed in.');
        }
        const token = await currentUser.getIdToken();

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/journals/activity/${activityJournalId}`,
            {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );
        logger.http(`Activity journal entry deleted successfully for user ${activityJournalId}`)
        if (!response.ok) {
            logger.error('Failed to delete activity journal entry');
            throw new Error(
                `Failed to delete activity journal entry`
            );
        }
        return {message: 'Activity journal entry deleted successfully'};
    } catch (error) {
        logger.error('Error deleting activity journal entry:', error);
        throw error;
    }
}
