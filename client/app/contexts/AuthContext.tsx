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

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => Promise<void>;
  error: string | null;
  signUp: (data:any) => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
interface AuthProviderProps {
  children?: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const login = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        setError(null);
        router.push('/tpage');

        // ...
      })
      .catch((error) => {
        setError("Invalid User Credentials. Please try again.");
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
      });
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Sign-out successful.
      router.push('/logout');
      console.log('Sign-out successful.');
    } catch (error) {
      // Handle errors gracefully
      console.error('Error signing out:', error);
    }
  };

  const signUp = (values:any) => {
    createUserWithEmailAndPassword(auth, values.email, values.password).then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      const data = {
        uid:user.uid,
        email: values.email,
        firstName: values.fname,
        lastName: values.lname,
        streetAddress: values.street,
        city: values.city,
        province: values.province,
        postalCode: values.postalCode,
        phoneNumber: values.phone,
        birthDate: values.birthdate,
        sex: values.sex,
      }

      createUser(data).then((res) => {
        router.push('/');
      }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      })
    }).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    })
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      // Specify the type here
      setUser(user);
      setLoading(false);
      setError(null);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextProps = {
    user,
    login,
    logout,
    error,
    signUp
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
