import { auth } from "../config/firebase";
const logger = require("../../logger");

// Function to make a GET request to retrieve all blood pressure journals for a user
export async function getBloodPressureJournals(): Promise<any> {
    try {
		const currentUser = auth.currentUser;
		if (!currentUser) {
			logger.error("No user is currently signed in.");
			throw new Error("No user is currently signed in.");
		}
		const id = currentUser.uid;
		const token = await currentUser.getIdToken();
        const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/bloodPressure/user/${id}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
        logger.info(`Blood pressure journals fetched successfully for user ${id}`);
		if (!response.ok) {
			logger.error("Failed to retrieve blood pressure journals for user");
			throw new Error(`Failed to retrieve blood pressure journals for user`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		logger.error("Error fetching blood pressure journals:", error);
		throw error;
	}
}


// Create Blood Pressure Journal Entry
export async function createBloodPressureJournal(journalData: any): Promise<any> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        logger.error('No user is currently signed in.');
        throw new Error('No user is currently signed in.');
      }
      const id = currentUser.uid;
      const token = await currentUser.getIdToken();
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/journals/bloodPressure/user/${id}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
              
            },
            body: JSON.stringify(journalData),
          }
        );
        logger.info(`Journal created successfully for user ${id}`)
        if (!response.ok) {
          logger.error(`Failed to create blood pressure journal for user`);
          throw new Error(
            `Failed to create blood pressure journal for user`
          );
        }
        const data = await response.json();
        return data;
      } catch (error) {
        logger.error('Error creating journal', error);
        throw error;
      }
}


// Function to GET a single blood pressure journal entry
export async function getBloodPressureJournal(
	bloodPressureJournal: string
): Promise<any> {
	try {
		const currentUser = auth.currentUser;
		if (!currentUser) {
			logger.error("No user is currently signed in.");
			throw new Error("No user is currently signed in.");
		}
		const token = await currentUser.getIdToken();

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/bloodPressure/${bloodPressureJournal}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
		logger.info(
			`Blood pressure journal fetched successfully for user ${bloodPressureJournal}`
		);
		if (!response.ok) {
			logger.error("Failed to retrieve blood pressure journal entry");
			throw new Error(`Failed to retrieve blood pressure journal entry`);
		}
		const data = await response.json();
    console.log(data);
		return data;
	} catch (error) {
		logger.error("Error fetching blood pressure journal entry:", error);
		throw error;
	}
}

// Function to delete a blood pressure journal entry
export async function deleteBloodPressureJournalEntry(bloodPressureJournalID: string): Promise<any>{
  try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        logger.error('No user is currently signed in.');
        throw new Error('No user is currently signed in.');
      }
      const token = await currentUser.getIdToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/journals/bloodPressure/${bloodPressureJournalID}`,
        {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
        }
      );
      logger.info(`Blood pressure entry deleted successfully for user ${bloodPressureJournalID}`)
      if (!response.ok) {
        logger.error(`Failed to delete the entry. HTTP Status: ${response.status}`);
        throw new Error(
          `Failed to delete the entry. HTTP Status: ${response.status}`
        );
      }
      return { message: 'Blood pressure entry deleted successfully' };
    } catch (error) {
      logger.error('Error deleting entry', error);
      throw error;
    }
}

// Function to update a blood pressure journal entry
export async function updateBloodPressureJournal(
	bloodPressureJournalID: string,
	updatedBloodPressureJournalData: any
): Promise<any> {
	try {
		const currentUser = auth.currentUser;
		if (!currentUser) {
			logger.error("No user is currently signed in.");
			throw new Error("No user is currently signed in.");
		}
		const token = await currentUser.getIdToken();

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/bloodPressure/${bloodPressureJournalID}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(updatedBloodPressureJournalData),
			}
		);
		logger.info(
			`Blood pressure journal entry updated successfully for user ${bloodPressureJournalID}`
		);
		if (!response.ok) {
			logger.error("Failed to update blood pressure journal entry");
			throw new Error(`Failed to update blood pressure journal entry`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		logger.error("Error updating blood pressure journal entry:", error);
		throw error;
	}
}