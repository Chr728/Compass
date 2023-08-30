import React, {createContext, FC, ReactNode, useContext, useEffect, useState} from 'react';
import {auth} from '@/app/config/firebase';
import {
  UserCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut, onAuthStateChanged,
  User
} from 'firebase/auth';



interface AuthContextProps {
  user: User | null;
  signup: (email: string, password: string) => void;
  login: (email: string, password: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

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

  const signup = (email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
      console.log('signed up')
      // Signed in
      const user = userCredential.user;
      // ...
    })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage)
          // ..
        });;
  };

  const login = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
    })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });;
  };

  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => { // Specify the type here
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextProps = {
    user,
    signup,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export default AuthContext
