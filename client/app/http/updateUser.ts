import {auth} from '../config/firebase'
const logger = require('pino')();

export const updateUser = async (userData: any) => {
    const currentUser = auth.currentUser;
    if(!currentUser) {
        logger.error('No user is currently signed in.')
        throw new Error('No user is logged in');
    }
    const uid = currentUser.uid;
    const token =  await currentUser.getIdToken();
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/users/${uid}`;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                 authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        });

        logger.http(`User data updated successfully for user ${uid}`)

        if (!response.ok) {
            logger.error(`Failed to update user data. HTTP Status: ${response.status}`)
            throw new Error('Failed to update user data');
        }
        const updatedUserData = await response.json();
        return updatedUserData;
    } catch (error) {
        logger.error('Error updating user data:', error);
        throw error;
    }
};

export default updateUser;
