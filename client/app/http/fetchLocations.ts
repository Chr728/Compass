import {auth} from "@/app/config/firebase";
import logger from "@/logger";

require('dotenv').config({
    path: '../../.env'
})

const fetchLocations = async (latitude: number, longitude: number, type: string) => {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            logger.error('No user is currently signed in.')
            throw new Error('No user is currently signed in.');
        }
        const token = await currentUser.getIdToken();

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/locations?latitude=${latitude}&longitude=${longitude}&type=${type}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            logger.error(`Failed to retrieve locations. HTTP Status: ${response.status}`)
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch(err: any) {
        logger.error('Error fetching locations:', err);
        throw new Error('Error fetching locations');
    }
}

export default fetchLocations;
