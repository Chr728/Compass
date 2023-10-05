import { auth } from '../config/firebase';

export async function getUser() {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('No user is currently signed in.');
        }
        const id = currentUser.uid;
        const token = await currentUser.getIdToken();

        const response = await fetch(`http://localhost:8000/api/users/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const userData = await response.json();
        return userData.data;
    } catch (error:any) {
        throw new Error('Error fetching user profile');
    }
}

export default getUser;
