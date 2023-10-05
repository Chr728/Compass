import { auth } from '../config/firebase';

export const createUser = async (body:any) => {
    try {

        const currentUser = auth.currentUser;
        if (!currentUser) {
            throw new Error('No user is currently signed in.');
        }
        const token = await currentUser.getIdToken();

        const response = await fetch("http://localhost:8000/api/users", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const userData = await response.json();
        return userData.data;
    } catch (error) {
        throw new Error('Error creating user');

    }
}

export default createUser;
