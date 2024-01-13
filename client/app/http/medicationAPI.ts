import { auth } from '../config/firebase';
const logger = require('../../logger');

// Function to make a GET request to retrieve all Medications for a user
export async function getMedications(): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.')
      throw new Error('No user is currently signed in.');
    }
    const id = currentUser.uid;
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/medication/user/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      logger.info(`medication entries fetched successfully for user ${id}`)
      const data = await response.json();
      return data;
    } else {
      logger.error(`Failed to retrieve Medications for user. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to retrieve Medications for user. HTTP Status: ${response.status}`
      );
    }
  } catch (error) {
    logger.error('Error fetching Medications:', error);
    throw error;
  }
}

// Function to make a GET request to retrieve a specific Medication entry
export async function getMedication(medicationId: string): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.')
      throw new Error('No user is currently signed in.');
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/medication/${medicationId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.info(`medication  entry fetched successfully`)
    if (!response.ok) {
      logger.error(`Failed to retrieve Medication entry data. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to retrieve Medication entry data. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error fetching Medication entry:', error);
    throw error;
  }
}

// Function to make a POST request to create a new Medication entry
export async function createMedication(
  medicationData: any
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/medication/user/${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(medicationData),
      }
    );
    logger.info(`medication  entry created successfully for user ${id}`)
    if (!response.ok) {
      logger.error(`Failed to create Medication entry for user. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to create Medication entry for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error creating Medication entry:', error);
    throw error;
  }
}

// Function to make a PUT request to update an existing Medication entry
export async function updateMedication(
  medicationId: string,
  updatedmedicationData: any
): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.')
      throw new Error('No user is currently signed in.');
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/medication/${medicationId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedmedicationData),
      }
    );
    logger.info(`medication entry ${medicationId} updated successfully`)
    if (!response.ok) {
      logger.error(`Failed to update Medication entry for user. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to update Medication entry for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error updating Medication entry:', error);
    throw error;
  }
}

// Function to make a DELETE request to delete a Medication entry
export async function deleteMedication(
  medicationId: string
): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.')
      throw new Error('No user is currently signed in.');
    }
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/medication/${medicationId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.info(`medication intake journal entry ${medicationId} deleted successfully`)
    if (response && response.status && !response.ok) {
      logger.error(`Failed to delete Medication entry. HTTP Status: ${response.status}`)
      throw new Error(`Failed to delete Medication entry. HTTP Status: ${response.status}`);
    } else if (response && response.status === 204) {
      logger.info(`Medication entry ${medicationId} deleted successfully`)
      return { message: 'Medication entry deleted successfully' };
    }
    return { message: 'Medication entry deleted successfully' };
  } catch (error) {
    logger.error('Error deleting Medication entry:', error);
    throw error;
  }
}
