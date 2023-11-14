"use client";

import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { auth } from "@/app/config/firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import createUser from "@/app/http/createUser";
import { createUserAttributes } from "@/app/lib/Models/User";
import { useProp } from "./PropContext";

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
    throw new Error("useAuth must be used within an AuthProvider");
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
  const { handleLoading, handlePopUp } = useProp();

  const login = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Signed in
        setError(null);
      })
      .catch((error) => {
        setError("Invalid User Credentials. Please try again.");
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error(errorCode, errorMessage);
        handlePopUp("error", errorMessage);
        handleLoading(false);
      });
  };

  const logout = async () => {
    try {
      handleLoading(true);
      await signOut(auth);
      handleLoading(false);
      router.push("/logout");
      console.log("Sign-out successful.");
    } catch (error: any) {
      // Handle errors gracefully
      console.error("Error signing out:", error);
      handlePopUp("error", "Error signing out:" + error.message);
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
              router.push("/tpage");
            }
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
            handlePopUp("error", errorMessage);
            handleLoading(false);
          });
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          setError("Email address is already in use.");
        } else {
          setError(error.message);
        }
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
        handlePopUp("error", errorMessage);
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      // Specify the type here
      setUser(user);
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
