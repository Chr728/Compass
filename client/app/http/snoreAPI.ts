import { auth } from "../config/firebase";
const logger = require('../../logger');



// Function to send the recorded audio to the server for prediction
export async function sendAudio(audioBlob:any): Promise<any>{
	try{
		const currentUser = auth.currentUser;
        if (!currentUser) {
            logger.error('No user is currently signed in.');
            throw new Error("No user is currently signed in.");
        }
        const id = currentUser.uid;
        const token = await currentUser.getIdToken();

		const formData = new FormData();
		formData.append('file', audioBlob, 'recording.wav');
		
		const response = await fetch('http://${process.env.DEMO_HOST}:8080/SnoringAI', {
			method: 'POST',
			body: formData,
		});
		
		return response;
	} catch (error) {
        logger.error("Error sending audio:", error);
        throw error;
      }
}

// Function to get an individual audio entry
export async function getAudioEntry(audioEntryID: any): Promise<any> {
    try {
		const currentUser = auth.currentUser;
		if (!currentUser) {
			logger.error("No user is currently signed in.");
			throw new Error("No user is currently signed in.");
		}
		const id = currentUser.uid;
		const token = await currentUser.getIdToken();
        const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/snoringAI/${audioEntryID}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
        logger.info(`Audio entry fetched successfully for user ${id}`);
		if (!response.ok) {
			logger.error("Failed to retrieve a single audio entry for user");
			throw new Error(`Failed to retrieve a single audio entry for user`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		logger.error("Error fetching a single audio entry:", error);
		throw error;
	}
}




// Function to GET the list of all audio files
export async function getAudioEntries(): Promise<any> {
    try {
		const currentUser = auth.currentUser;
		if (!currentUser) {
			logger.error("No user is currently signed in.");
			throw new Error("No user is currently signed in.");
		}
		const id = currentUser.uid;
		const token = await currentUser.getIdToken();
        const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/snoringAI/user/${id}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
        logger.info(`All audio entries fetched successfully for user ${id}`);
		if (!response.ok) {
			logger.error("Failed to retrieve audio entries for user");
			throw new Error(`Failed to retrieve audio entries for user`);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		logger.error("Error fetching audio entries:", error);
		throw error;
	}
}


// Function to store an audio entry in the database
export async function createAudioEntry(audioFileData: any):Promise<any> {

    try {
		const currentUser = auth.currentUser;
		if (!currentUser) {
			logger.error("No user is currently signed in.");
			throw new Error("No user is currently signed in.");
		}
		const id = currentUser.uid;
		const token = await currentUser.getIdToken();

		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/api/snoringAI/user/${id}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(audioFileData),
			}
		);
		logger.info(`Audio entry created successfully for user ${id}`);
		if (!response.ok) {
			logger.error(
				`Failed to create audio entry for user. HTTP Status: ${response.status}`
			);
			throw new Error(
				`Failed to create audio entry for user. HTTP Status: ${response.status}`
			);
		}
		const data = await response.json();
		return data;
	} catch (error) {
		logger.error("Error creating audio entry:", error);
		throw error;
	}

}

// Function to delete an audio entry
export async function deleteAudioEntry(audioEntryID: string): Promise<any>{
	try {
		const currentUser = auth.currentUser;
		if (!currentUser) {
		  logger.error('No user is currently signed in.');
		  throw new Error('No user is currently signed in.');
		}
		const token = await currentUser.getIdToken();
		const response = await fetch(
		  `${process.env.NEXT_PUBLIC_API_URL}/api/snoringAI/${audioEntryID}`,
		  {
			  method: 'DELETE',
			  headers: {
				Authorization: `Bearer ${token}`,
			  },
		  }
		);
		logger.info(`Audio entry deleted successfully for user ${audioEntryID}`)
		if (!response.ok) {
		  logger.error(`Failed to delete the entry. HTTP Status: ${response.status}`);
		  throw new Error(
			`Failed to delete the entry. HTTP Status: ${response.status}`
		  );
		}
		return { message: 'Audio entry deleted successfully' };
	  } catch (error) {
		logger.error('Error deleting entry', error);
		throw error;
	  }
  }
  