import {createContext, useContext, FC, ReactNode, useState, useEffect} from 'react';
import getUser from '@/app/http/getUser';
import updateUser from '@/app/http/updateUser';
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

type EditableUserAttributes = {
    firstName?: string;
    lastName?: string;
    streetAddress?: string;
    city?: string;
    province?: string;
    postalCode?: string;
    phoneNumber?: string;
    birthDate?: Date;
    sex?: string;
}

interface UserContextProps {
   userInfo: UserAttributes | null
    updateCurrentUser: (userData: EditableUserAttributes) => void;
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
    }, [uid]);
    const updateCurrentUser = (userData: EditableUserAttributes) => {
        if(uid) {
            updateUser(userData).then((response) => {
                console.log('User updated successfully:', response);
            }).catch((error) => {
                console.error('Error updating user:', error);
            })
        }
    }
    const value: UserContextProps = {
       userInfo,
       updateCurrentUser,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
