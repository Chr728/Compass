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
import { createNotificationPreference } from "../http/notificationPreferenceAPI";
import { useProp } from "./PropContext";

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
    logger.error("useAuth must be used within an AuthProvider");
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
  const subscribeToPushNotifications = (userUID: any, userToken: any) => {
    // Ask user permission for push notifications
    if ("Notification" in window) {
      const currentPermission = Notification.permission;
      // Ask permission if its set to default or denied
      if (currentPermission === "default" || currentPermission === "denied") {
        Notification.requestPermission().then(function (permission) {
          if (permission === "granted") {
            // Permission has been granted. Send request to create subscription object for user
            if (
              "serviceWorker" in navigator &&
              navigator.serviceWorker.controller
            ) {
              // Request user to turn on their notifications
              navigator.serviceWorker.controller.postMessage({
                action: "subscribeToPush",
                userUID: userUID,
                userToken: userToken,
              });
            } else {
              // Handle the case where serviceWorker or controller is not available.
              logger.error("Service Worker or controller is not available.");
            }
          } else if (permission === "denied") {
            // Permission has been denied.
            logger.warn("Notification permission denied.");
          } else if (permission === "default") {
            // The user closed the permission dialog without making a choice.
            logger.warn("Notification permission dismissed.");
          }
        });
      } else {
        if (
          "serviceWorker" in navigator &&
          navigator.serviceWorker.controller
        ) {
          // Request user to turn on their notifications
          navigator.serviceWorker.controller.postMessage({
            action: "subscribeToPush",
            userUID: userUID,
            userToken: userToken,
          });
        } else {
          // Handle the case where serviceWorker or controller is not available.
          logger.error("Service Worker or controller is not available.");
        }
      }
    }
  };
  const { handleLoading, handlePopUp } = useProp();

  const login = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        setError(null);
        const userToken = await userCredential.user.getIdToken();
        // Subscribe user to push notifications if allowed
        subscribeToPushNotifications(userCredential.user.uid, userToken);
      })
      .catch((error) => {
        setError("Invalid User Credentials. Please try again.");
        const errorCode = error.code;
        const errorMessage = error.message;
        logger.error(errorCode, errorMessage);
        handlePopUp('error', errorMessage);
        handleLoading(false);
      });
  };

  const logout = async () => {
    try {
      // Unsubscribe a user from push notifications
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          action: "unsubscribeFromPush",
        });
      }
      handleLoading(true);
      await signOut(auth);
      handleLoading(false);
      router.push("/logout");
      logger.info("Sign-out successful.");
    } catch (error: any) {
      // Handle errors gracefully
      logger.error("Error signing out:", error);
      handlePopUp("error", "Error signing out:" + error.message);
    }
  };

  const signUp = (values: createUserAttributes) => {
    handleLoading(true);
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        setError(null);
        const userToken = await userCredential.user.getIdToken();
        const data = values;
        data.uid = user.uid;
        await createUser(data)
          .then(async (res) => {
            if (res !== null) {
              // Notification preference doesn't exist, create it
              await createNotificationPreference(
                userCredential.user.uid,
                userToken
              );
              // Subscribe user to push notifications if allowed
              subscribeToPushNotifications(userCredential.user.uid, userToken);
              handleLoading(false);
              router.push("/tpage");
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
        if (error.code === "auth/email-already-in-use") {
          setError("Email address is already in use.");
        } else {
          setError(error.message);
        }
        const errorCode = error.code;
        const errorMessage = error.message;
        logger.error(errorCode, errorMessage);
        handlePopUp('error', errorMessage);
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
