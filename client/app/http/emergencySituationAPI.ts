import { auth } from "../config/firebase";
const logger = require("../../logger");

// Function to make a GET request to retrieve all emergency rooms
export async function scrape(): Promise<any> {
	try {
		const currentUser = auth.currentUser;
		if (!currentUser) {
			logger.error("No user is currently signed in.");
			throw new Error("No user is currently signed in.");
		}
		const id = currentUser.uid;
		const token = await currentUser.getIdToken();

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/emergencyRoomData/`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
		if (response.ok) {
			logger.info(`info fetched successfully for user ${id}`);
			const data = await response.json();
			return data;
		} else {
			logger.error(
				`Failed to retrieve emergency situation HTTP Status: ${response.status}`
			);
			throw new Error(
				`Failed to retrieve  emergency situation  HTTP Status: ${response.status}`
			);
		}
	} catch (error) {
		logger.error("Error fetching  emergency situation :", error);
		throw error;
	}
}
