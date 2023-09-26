import {useAuth} from '@/app/contexts/AuthContext';

export const updateCurrentUser = async (userData: any) => {
    const {user} = useAuth();
    const uid = user?.uid;
    const url = `http://localhost:8000/api/users/${uid}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
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
