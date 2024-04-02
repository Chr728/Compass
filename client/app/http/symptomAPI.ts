import { auth } from "../config/firebase";
const logger = require('../../logger');

// Function to send the symptom list to the server for prediction
export async function sendSymptoms(symptoms:any): Promise<any>{
	try{
		const currentUser = auth.currentUser;
        if (!currentUser) {
            logger.error('No user is currently signed in.');
            throw new Error("No user is currently signed in.");
        }
        const id = currentUser.uid;
        const token = await currentUser.getIdToken();

        const payload = {
            "symptoms": symptoms
          }; 
        const payloadString = JSON.stringify(payload);
		
		const response = await fetch('http://${process.env.DEMO_HOST}:8080/SymptomChecker', {
			method: 'POST',
            body: payloadString,
            headers: {
              'Content-Type': 'application/json'
            }
		});
		return response;
	} catch (error) {
        logger.error("Error sending symptoms list:", error);
        throw error;
      }
}
