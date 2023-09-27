import {useAuth} from '@/app/contexts/AuthContext';
import {auth} from '../config/firebase'
export const updateUser = async (userData: any) => {
    const currentUser = auth.currentUser;
    if(!currentUser) throw new Error('No user is logged in');
    const uid = currentUser.uid;
    const token =  await currentUser.getIdToken();
    const url = `http://localhost:8000/api/users/${uid}`;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                 authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error('Failed to update user data');
        }
        const updatedUserData = await response.json();
        return updatedUserData;
    } catch (error) {
        console.error('Error updating user data:', error);
        throw error;
    }
};

export default updateUser;
