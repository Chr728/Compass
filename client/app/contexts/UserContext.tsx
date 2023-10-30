'use client';
import {
  createContext,
  useContext,
  FC,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import getUser from '@/app/http/getUser';
import updateUser from '@/app/http/updateUser';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import { auth } from '@/app/config/firebase';
import { signOut } from 'firebase/auth';
import {useProp} from '@/app/contexts/PropContext';

type UserAttributes = {
  id: number;
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  birthDate: Date;
  sex: string;
};

type EditableUserAttributes = {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  birthDate?: Date;
  sex?: string;
};

interface UserContextProps {
  userInfo: UserAttributes | null;
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
  children?: ReactNode;
}

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const { user } = useAuth(); // Get the user from AuthContext
  const [userInfo, setUserInfo] = useState<UserAttributes | null>(null);
  // can remove the following line as we check for user in req. maybe no more use for user const too.
  const uid = user ? user.uid : null; // Access the UID if the user is authenticated
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const {handleError} = useProp();
  useEffect(() => {
    const fetchUserData = () => {
      if (uid) {
        getUser()
          .then((userData) => {
            setLoading(true);
            setUserInfo(userData);
            setLoading(false);
            router.push('/tpage');
          })
          .catch((error) => {
           handleError(error.message);
            signOut(auth);
          });
      } else {
        setUserInfo(null);
        setLoading(false);
      }
    };
    if (user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [uid]);
  const updateCurrentUser = (userData: EditableUserAttributes) => {
    if (uid) {
      updateUser(userData)
        .then((response) => {
          console.log('User updated successfully:', response);
          setUserInfo(response.data[1]);
        })
        .catch((error) => {
         console.error('Error updating user:', error)
        });
    }
  };
  const value: UserContextProps = {
    userInfo,
    updateCurrentUser,
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
};
