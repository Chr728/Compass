import { auth } from "../config/firebase";
const logger = require("pino")();

// Function to make a GET request to retrieve all oxygen journals for a user
export async function getOxygenJournals(): Promise<any> {
	try {
		const currentUser = auth.currentUser;
		if (!currentUser) {
			logger.error("No user is currently signed in.");
			throw new Error("No user is currently signed in.");
		}
		const id = currentUser.uid;
		const token = await currentUser.getIdToken();

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/o2Saturation/user/${id}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (response.ok) {
			logger.info(`Oxygen journals fetched successfully for user ${id}`);
			const data = await response.json();
			return data;
		} else {
			logger.error(
				`Failed to retrieve oxygen journals for user. HTTP Status: ${response.status}`
			);
			throw new Error(
				`Failed to retrieve oxygen journals for user. HTTP Status: ${response.status}`
			);
		}
	} catch (error) {
		logger.error("Error fetching oxygen journals:", error);
		throw error;
	}
}

// Function to make a GET request to retrieve a specific oxygen journal entry
export async function getOxygenJournal(oxygenJournalId: string): Promise<any> {
	try {
		const currentUser = auth.currentUser;
		if (!currentUser) {
			logger.error("No user is currently signed in.");
			throw new Error("No user is currently signed in.");
		}
		const token = await currentUser.getIdToken();

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/o2Saturation/${oxygenJournalId}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
		logger.info(
			`Oxygen journal entry fetched successfully for user ${oxygenJournalId}`
		);
		if (!response.ok) {
			logger.error(
				`Failed to retrieve oxygen journal entry ${oxygenJournalId} for user. HTTP Status: ${response.status}`
			);
			throw new Error(
				`Failed to retrieve oxygen journal entry ${oxygenJournalId} for user. HTTP Status: ${response.status}`
			);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		logger.error("Error fetching oxygen journal entry:", error);
		throw error;
	}
}

// Function to make a POST request to create a new oxygen journal entry
export async function createOxygenJournal(
	oxygenJournalData: any
): Promise<any> {
	try {
		const currentUser = auth.currentUser;
		if (!currentUser) {
			logger.error("No user is currently signed in.");
			throw new Error("No user is currently signed in.");
		}
		const id = currentUser.uid;
		const token = await currentUser.getIdToken();

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/o2Saturation/user/${id}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(oxygenJournalData),
			}
		);
		logger.info(`Oxygen journal entry created successfully for user ${id}`);
		if (!response.ok) {
			logger.error(
				`Failed to create oxygen journal entry for user. HTTP Status: ${response.status}`
			);
			throw new Error(
				`Failed to create oxygen journal entry for user. HTTP Status: ${response.status}`
			);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		logger.error("Error creating oxygen journal entry:", error);
		throw error;
	}
}

// Function to make a PUT request to update an existing oxygen journal entry
export async function updateOxygenJournal(
	oxygenJournalId: string,
	updatedOxygenJournalData: any
): Promise<any> {
	try {
		const currentUser = auth.currentUser;
		if (!currentUser) {
			logger.error("No user is currently signed in.");
			throw new Error("No user is currently signed in.");
		}
		const token = await currentUser.getIdToken();

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/o2Saturation/${oxygenJournalId}`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(updatedOxygenJournalData),
			}
		);
		logger.info(
			`Oxygen journal entry updated successfully for user ${oxygenJournalId}`
		);
		if (!response.ok) {
			logger.error(
				`Failed to update oxygen journal entry ${oxygenJournalId} for user. HTTP Status: ${response.status}`
			);
			throw new Error(
				`Failed to update oxygen journal entry ${oxygenJournalId} for user. HTTP Status: ${response.status}`
			);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		logger.error("Error updating oxygen journal entry:", error);
		throw error;
	}
}

// Function to make a DELETE request to delete a oxygen journal entry
export async function deleteOxygenJournal(
	oxygenJournalId: string
): Promise<any> {
	try {
		const currentUser = auth.currentUser;
		if (!currentUser) {
			logger.error("No user is currently signed in.");
			throw new Error("No user is currently signed in.");
		}
		const token = await currentUser.getIdToken();

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/o2Saturation/${oxygenJournalId}`,
			{
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		logger.info(
			`Oxygen journal entry deleted successfully for user ${oxygenJournalId}`
		);
		if (response && response.status && !response.ok) {
			logger.error(
				`Failed to delete oxygen journal entry. HTTP Status: ${response.status}`
			);
			throw new Error(
				`Failed to delete oxygen journal entry. HTTP Status: ${response.status}`
			);
		} else if (response && response.status === 204) {
			logger.info("Oxygen journal entry deleted successfully");
			return { message: "Oxygen journal entry deleted successfully" };
		}
		return { message: "Oxygen journal entry deleted successfully" };
	} catch (error) {
		logger.error("Error deleting oxygen journal entry:", error);
		throw error;
	}
}
