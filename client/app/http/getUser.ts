import { auth } from '../config/firebase';
const logger = require('../../logger');

export async function getUser(retries = 3): Promise<any> {
    const url = process.env.NEXT_PUBLIC_API_URL
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            logger.error('No user is currently signed in.')
            throw new Error('No user is currently signed in.');
        }
        const id = currentUser.uid;
        const token = await currentUser.getIdToken();

        const response = await fetch(`${url}/api/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        logger.info(`User data fetched successfully for user ${id}`)

        if (!response.ok) {
            logger.error(`Failed to retrieve user data. HTTP Status: ${response.status}`)
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const userData = await response.json();
        return userData.data;
    } catch (error:any) {
        if (retries > 1) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // wait for 1 second
            return getUser(retries - 1); // retry
        } else {
            logger.error('Error fetching user profile:', error);
            throw new Error('Error fetching user profile');
        }
    }
}

export default getUser;
