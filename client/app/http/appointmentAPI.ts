export interface Appointment {
    appointmentWith: string;
    reason:string;
    date: string;
    time:string;
    notes:string;
    id: string;
    uid:string;
}

// Function to get all appointments of a user
export async function getAppointments(userId: string): Promise<any>{
    try {
        const response = await fetch(
            `http://localhost:8000/api/appointments/${userId}`
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

// Function to get a single appointment
export async function getAppointment(appointmentId: string ): Promise<any>{
  try {
    const response = await fetch(
      `http://localhost:8000/api/appointments/single/${appointmentId}`
    );if (!response.ok) {
      throw new Error(
        `Failed to fetch the appointment data. HTTP Status: ${response.status}`
      );
    }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching appointment data:', error);
      throw error;
      }

}

// Function to create a new appointment
export async function createAppointment(userId: string, appointmentData: any): Promise<any> {
    try {
       
        const response = await fetch(
          `http://localhost:8000/api/appointments/${userId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              
            },
            body: JSON.stringify(appointmentData),
          }
        );
        if (!response.ok) {
          throw new Error(
            `Failed to create appointment for user ${userId}. HTTP Status: ${response.status}`
          );
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error creating appointment', error);
        throw error;
      }
}

// Function to delete an appointment
export async function deleteAppointment(appointmentId: string): Promise<any>{
    try {
       
        const response = await fetch(
          `http://localhost:8000/api/appointments/single/${appointmentId}`,
          {
            method: 'DELETE',
          }
        );
        if (!response.ok) {
          throw new Error(
            `Failed to delete the appointment. HTTP Status: ${response.status}`
          );
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error deleting appointment', error);
        throw error;
      }
}