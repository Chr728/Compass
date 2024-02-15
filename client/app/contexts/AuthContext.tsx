'use client';

import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { auth } from '@/app/config/firebase';
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';

import createUser from '@/app/http/createUser';
import { createUserAttributes } from '@/app/lib/Models/User';
import { useProp } from './PropContext';

const logger = require('../../logger');
interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => Promise<void>;
  error: string | null;
  signUp: (data: createUserAttributes) => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    logger.error('useAuth must be used within an AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
interface AuthProviderProps {
  children?: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const { handleLoading, handlePopUp } = useProp();

  const login = (email: string, password: string) => {
    setDataLoaded(false);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        handleLoading(false);
        // Signed in
        setError(null);
      })
      .catch((error) => {
        setError('Invalid User Credentials. Please try again.');
        const errorCode = error.code;
        const errorMessage = error.message;
        logger.error(errorCode, errorMessage);
        setDataLoaded(true);
        handlePopUp('error', errorMessage);
        handleLoading(false);
      });
  };

  const logout = async () => {
    try {
      handleLoading(true);
      await signOut(auth);
      handleLoading(false);
      router.push('/logout');
      logger.info('Sign-out successful.');
    } catch (error: any) {
      // Handle errors gracefully
      logger.error('Error signing out:', error);
      handlePopUp('error', 'Error signing out:' + error.message);
    }
  };
  const signUp = (values: createUserAttributes) => {
    handleLoading(true);
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setError(null);
        const data = values;
        data.uid = user.uid;
        createUser(data)
          .then((res) => {
            if (res !== null) {
              handleLoading(false);

              router.push('/tpage');
            }
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            logger.error(errorCode, errorMessage);
            handlePopUp('error', errorMessage);
            handleLoading(false);
          });
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          setError('Email address is already in use.');
        } else {
          setError(error.message);
        }
        const errorCode = error.code;
        const errorMessage = error.message;
        logger.error(errorCode, errorMessage);
        handlePopUp('error', errorMessage);
        setDataLoaded(true);
        handleLoading(false);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      // Specify the type here
      setUser(user);
        setDataLoaded(true);
      handleLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextProps = {
    user,
    login,
    logout,
    error,
    signUp,
  };

  return <AuthContext.Provider value={value}>{dataLoaded && children}</AuthContext.Provider>;
};

export default AuthContext;
