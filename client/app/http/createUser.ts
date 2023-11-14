import { auth } from '../config/firebase';
const logger = require('../../logger');

export const createUser = async (body:any) => {
    try {

        const currentUser = auth.currentUser;
        if (!currentUser) {
            logger.error('No user is currently signed in.');
            throw new Error('No user is currently signed in.');
        }
        const token = await currentUser.getIdToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        logger.http(`User created successfully`)

        if (!response.ok) {
            logger.error(`Failed to create user. HTTP Status: ${response.status}`);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const userData = await response.json();
        if (!userData) {
            logger.error('Response data is missing.');
            throw new Error('Response data is missing.');
        }
        return userData.data;

    } catch (error: any) {
        logger.error(`Error creating user: ${error.message}`);
        throw new Error(`Error creating user: ${error.message}`);
    }
}

export default createUser;
