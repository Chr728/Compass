import {createContext, useContext, FC, ReactNode, useState, useEffect} from 'react';
import getUser from '@/app/http/getUser';
import { useAuth } from './AuthContext';

type UserAttributes = {
    id: number;
    uid: string;
    email: string;
    firstName: string;
    lastName: string;
    streetAddress: string;
    city: string;
    province: string;
    postalCode: string;
    phoneNumber: string;
    birthDate: Date;
    sex: string;
};

interface UserContextProps {
   userInfo: UserAttributes | null
   updateUser: (userData: UserAttributes) => Promise<any>;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

interface UserProviderProps {
    children? :ReactNode;
}

export const UserProvider:FC<UserProviderProps> = ({ children }) => {
    const { user } = useAuth(); // Get the user from AuthContext
    const [userInfo, setUserInfo] = useState<UserAttributes | null>(null);
    const uid = user ? user.uid : null; // Access the UID if the user is authenticated
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchUserData = () => {
            if (uid) {
                getUser(uid).then((userData) => {
                    setUserInfo(userData.data);
                    setLoading(false);
                }).catch((error) => {
                    console.error('Error fetching user data:', error);
                });
            }
        }
       fetchUserData()
    }, [user]);
    const updateUser : (userData: UserAttributes) => Promise<UserAttributes> = async (userData: UserAttributes) => {
        try {
            if (uid) {
                const updatedUserData = await updateUser(userData);
                setUserInfo(updatedUserData);
                return updatedUserData;
            } else {
                throw new Error('User is not authenticated');
            }
        } catch (error) {
            console.error('Error updating user data:', error);
            throw error;
        }
    };
    const value: UserContextProps = {
       userInfo,
       updateUser,
    };

    return <UserContext.Provider value={value}>{!loading && children}</UserContext.Provider>;
};
