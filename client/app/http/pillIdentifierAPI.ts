import { auth } from "../config/firebase";
const logger = require('../../logger');

export async function sendImage(selectedImage: any, isBinary = false): Promise<any> {

    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            logger.error('No user is currently signed in.');
            throw new Error("No user is currently signed in.");
        }
        const id = currentUser.uid;
        const token = await currentUser.getIdToken();

        const formData = new FormData();
        if (isBinary) {
            formData.append('file', selectedImage, 'image.jpeg');
        } else { 
            formData.append('file', selectedImage);
        }
        
        const response = await fetch(`http://127.0.0.1:8080/PillAI`, {
            method: "POST",
            body:  formData
        });
        
        logger.info(`Image sent successfully for user ${id}`);
        if (!response.ok) {
        logger.error(`Failed to send image for user. HTTP Status: ${response.status}`)
        throw new Error(
            `Failed to send image for user. HTTP Status: ${response.status}`
        );
        }
        return response;
    } catch (error) {
        logger.error("Error sending image:", error);
        throw error;
      }
}
