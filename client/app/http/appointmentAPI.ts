import { auth } from '../config/firebase';
export interface Appointment {
    appointmentWith: string;
    reason:string;
    date: string;
    time:string;
    notes:string;
    id: string;
    uid:string;
}

const logger = require('../../logger');


// Function to get all appointments of a user
export async function getAppointments(userId: string): Promise<any>{
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
        logger.http(`Appointments fetched successfully for user ${userId}`)
        if (!response.ok) {
          logger.error(`Failed to retrieve appointment. HTTP Status: ${response.status}`);
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
export async function getAppointment(appointmentId: string ): Promise<any>{
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
    logger.http(`Appointment fetched successfully for user ${appointmentId}`)
    if (!response.ok) {
      logger.error(`Failed to retrieve appointment. HTTP Status: ${response.status}`);
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
export async function createAppointment(userId: string, appointmentData: any): Promise<any> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        logger.error('No user is currently signed in.');
        throw new Error('No user is currently signed in.');
      }
      const id = currentUser.uid;
      const token = await currentUser.getIdToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${userId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
              
            },
            body: JSON.stringify(appointmentData),
          }
        );
        logger.http(`Appointment created successfully for user ${userId}`)
        if (!response.ok) {
          logger.error(`Failed to create appointment for user ${userId}. HTTP Status: ${response.status}`);
          throw new Error(
            `Failed to create appointment for user ${userId}. HTTP Status: ${response.status}`
          );
        }
        const data = await response.json();
        return data;
      } catch (error) {
        logger.error('Error creating appointment', error);
        throw error;
      }
}

// Function to delete an appointment
export async function deleteAppointment(appointmentId: string): Promise<any>{
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
        logger.http(`Appointment deleted successfully for user ${appointmentId}`)
        if (!response.ok) {
          logger.error(`Failed to delete the appointment. HTTP Status: ${response.status}`);
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
export async function updateAppointment(appointmentId: string, appointmentData: any): Promise<any> {
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
    logger.http(`Appointment updated successfully for user ${appointmentId}`)
    if (!response.ok) {
      logger.error(`Failed to update the appointment. HTTP Status: ${response.status}`);
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