import { auth } from '../config/firebase';
const logger = require('../../logger');

// Function to make a GET request to retrieve all speed dials for a user
export async function getSpeedDials(): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.')
      throw new Error('No user is currently signed in.');
    }
    const id = currentUser.uid;
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/speed-dials/${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.info(`Speed dial entries fetched successfully for user ${id}`)
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      logger.error(`Failed to retrieve speed dial entries for user. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to retrieve speed dial entries for user. HTTP Status: ${response.status}`
      );
    }
  } catch (error) {
    logger.error('Error fetching speed dial entries:', error);
    throw error;
  }
}

// Function to make a GET request to retrieve a specific speed dial entry
export async function getSpeedDial(speedDialId: string): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.')
      throw new Error('No user is currently signed in.');
    }

    const id = currentUser.uid;
    const token = await currentUser.getIdToken();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/speed-dials/${id}/${speedDialId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.info(`Speed dial entry ${speedDialId} fetched successfully`)
    if (!response.ok) {
      logger.error(`Failed to retrieve speed dial entry data. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to retrieve speed dial entry data. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error fetching speed dial entry:', error);
    throw error;
  }
}

// Function to make a POST request to create a new speed dial entry
export async function createSpeedDial(
  speedDialData: any
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/speed-dials/${id}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(speedDialData),
      }
    );
    logger.info(`Speed dial entry created successfully for user ${id}`)
    if (!response.ok) {
      logger.error(`Failed to create speed dial entry for user. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to create speed dial entry for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error creating speed dial entry:', error);
    throw error;
  }
}

// Function to make a PUT request to update an existing speed dial entry
export async function updateSpeedDial(
  speedDialId: string,
  updatedSpeedDialData: any
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/speed-dials/${id}/${speedDialId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedSpeedDialData),
      }
    );
    logger.info(`Speed dial entry ${speedDialId} updated successfully`)
    if (!response.ok) {
      logger.error(`Failed to update speed dial entry ${speedDialId} for user. HTTP Status: ${response.status}`)
      throw new Error(
        `Failed to update speed dial entry ${speedDialId} for user. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error updating speed dial entry:', error);
    throw error;
  }
}

// Function to make a DELETE request to delete a speed dial entry
export async function deleteSpeedDial(
  speedDialId: string
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/speed-dials/${id}/${speedDialId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.info(`Speed dial entry ${speedDialId} deleted successfully`)
    if (response && response.status && !response.ok) {
      logger.error(`Failed to delete speed dial entry. HTTP Status: ${response.status}`)
      throw new Error(`Failed to delete speed dial entry. HTTP Status: ${response.status}`);
    } else if (response && response.status === 204) {
      logger.info(`Speed dial entry ${speedDialId} deleted successfully`)
      return { message: 'Speed dial entry deleted successfully' };
    }
    return { message: 'Speed dial entry deleted successfully' };
  } catch (error) {
    logger.error('Error deleting speed dial entry:', error);
    throw error;
  }
}
