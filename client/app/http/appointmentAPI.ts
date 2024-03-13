import { auth } from '../config/firebase';

export interface Appointment {
  appointmentWith: string;
  reason: string;
  date: string;
  time: string;
  notes: string;
  id: string;
  uid: string;
}

const logger = require('../../logger');

// Function to get all appointments of a user
export async function getAppointments(userId: string): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.');
      throw new Error('No user is currently signed in.');
    }
    const token = await currentUser.getIdToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.info(`Appointments fetched successfully for user ${userId}`);
    if (!response.ok) {
      logger.error(
        `Failed to retrieve appointment. HTTP Status: ${response.status}`
      );
      throw new Error(
        `Failed to retrieve appointment. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error fetching appointments:', error);
    throw error;
  }
}

// Function to get a single appointment
export async function getAppointment(appointmentId: string): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.');
      throw new Error('No user is currently signed in.');
    }
    const token = await currentUser.getIdToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/single/${appointmentId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.info(`Appointment fetched successfully for user ${appointmentId}`);
    if (!response.ok) {
      logger.error(
        `Failed to retrieve appointment. HTTP Status: ${response.status}`
      );
      throw new Error(
        `Failed to fetch the appointment data. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error fetching appointment data:', error);
    throw error;
  }
}

// Function to create a new appointment
export async function createAppointment(
  userId: string,
  appointmentData: any
): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.');
      throw new Error('No user is currently signed in.');
    }
    const id = currentUser.uid;
    const token = await currentUser.getIdToken();

    // Extract frequency and quantity from appointmentData
    const { frequency, quantity, date, ...rest } = appointmentData;

    // Calculate dates based on frequency and quantity if they are provided and valid
    const dates = [];
    if (
      frequency &&
      quantity &&
      typeof frequency === 'string' &&
      typeof quantity === 'number'
    ) {
      const startDate = new Date(date);
      const frequencyInMillis = getFrequencyInMilliseconds(frequency);
      for (let i = 0; i < quantity; i++) {
        dates.push(new Date(startDate.getTime() + i * frequencyInMillis));
      }
    } else {
      // If frequency or quantity is null or not valid, simply use the provided date
      dates.push(new Date(date));
    }

    // Split dates into batches of 5
    const dateBatches = [];
    for (let i = 0; i < dates.length; i += 5) {
      dateBatches.push(dates.slice(i, i + 5));
    }

    // Make API calls to create appointments for each batch
    const responseData = [];
    for (const batch of dateBatches) {
      const promises = batch.map(async (appointmentDate) => {
        const data = {
          ...rest,
          frequency,
          quantity,
          date: appointmentDate.toISOString(), // Convert date to ISO string format
        };
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${userId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          }
        );

        if (!response.ok) {
          logger.error(
            `Failed to create appointment for user ${userId}. HTTP Status: ${response.status}`
          );
          throw new Error(
            `Failed to create appointment for user ${userId}. HTTP Status: ${response.status}`
          );
        }

        return await response.json();
      });

      // Wait for all promises in the batch to resolve
      const batchResponse = await Promise.all(promises);
      responseData.push(...batchResponse);
    }

    logger.info(`Appointments created successfully for user ${userId}`);

    return responseData;
  } catch (error) {
    logger.error('Error creating appointments', error);
    throw error;
  }
}

// Helper function to get frequency in milliseconds
export function getFrequencyInMilliseconds(frequency: string): number {
  switch (frequency) {
    case 'daily':
      return 24 * 60 * 60 * 1000; // 1 day
    case 'weekly':
      return 7 * 24 * 60 * 60 * 1000; // 1 week
    case 'bi-weekly':
      return 14 * 24 * 60 * 60 * 1000; // 2 weeks
    case 'monthly':
      return 30 * 24 * 60 * 60 * 1000; // 1 month (approximately)
    case 'yearly':
      return 365 * 24 * 60 * 60 * 1000; // 1 year (approximately)
    default:
      throw new Error('Invalid frequency');
  }
}

// Function to delete an appointment
export async function deleteAppointment(appointmentId: string): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.');
      throw new Error('No user is currently signed in.');
    }
    const token = await currentUser.getIdToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/single/${appointmentId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    logger.info(`Appointment deleted successfully for user ${appointmentId}`);
    if (!response.ok) {
      logger.error(
        `Failed to delete the appointment. HTTP Status: ${response.status}`
      );
      throw new Error(
        `Failed to delete the appointment. HTTP Status: ${response.status}`
      );
    }
    // const data = await response.json();
    // return data;
    return { message: 'Appointment entry deleted successfully' };
  } catch (error) {
    logger.error('Error deleting appointment', error);
    throw error;
  }
}

// Function to update an existing appointment
export async function updateAppointment(
  appointmentId: string,
  appointmentData: any
): Promise<any> {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      logger.error('No user is currently signed in.');
      throw new Error('No user is currently signed in.');
    }
    const token = await currentUser.getIdToken();
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/single/${appointmentId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(appointmentData),
      }
    );
    logger.info(`Appointment updated successfully for user ${appointmentId}`);
    if (!response.ok) {
      logger.error(
        `Failed to update the appointment. HTTP Status: ${response.status}`
      );
      throw new Error(
        `Failed to update the appointment. HTTP Status: ${response.status}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    logger.error('Error updating appointment', error);
    throw error;
  }
}
