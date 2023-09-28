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
   userInfo: UserAttributes,
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

const initialState: UserAttributes = {
    id: 0,
    uid: '',
    email: '',
    firstName: '',
    lastName: '',
    streetAddress: '',
    city: '',
    province: '',
    postalCode: '',
    phoneNumber: '',
    birthDate: new Date(),
    sex: '',
}

export const UserProvider:FC<UserProviderProps> = ({ children }) => {
    const { user } = useAuth(); // Get the user from AuthContext
    const [userInfo, setUserInfo] = useState<UserAttributes>(initialState);
    const uid = user ? user.uid : null; // Access the UID if the user is authenticated
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchUserData = () => {
            if (uid) {
                getUser(uid).then((userData) => {
                    setLoading(true)
                    setUserInfo(userData.data);
                    setLoading(false);
                }).catch((error) => {
                    console.error('Error fetching user data:', error);
                });
            }else{
                setLoading(false);
            }
        }
        if(user){
            fetchUserData()
        }else{
            setLoading(false)
        }
    }, [uid]);
    const updateCurrentUser = (userData: EditableUserAttributes) => {
        if(uid) {
            updateUser(userData).then((response) => {
                const {data} = response
                setUserInfo(data[1]);
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

    return <UserContext.Provider value={value}>{!loading && children}</UserContext.Provider>;
};
