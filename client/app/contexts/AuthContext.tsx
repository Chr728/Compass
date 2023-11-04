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
  const [loading, setLoading] = useState(true);
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
              console.error("Service Worker or controller is not available.");
            }
          } else if (permission === "denied") {
            // Permission has been denied.
            console.log("Notification permission denied.");
          } else if (permission === "default") {
            // The user closed the permission dialog without making a choice.
            console.log("Notification permission dismissed.");
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
          console.error("Service Worker or controller is not available.");
        }
      }
    }
  };

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
        console.error(errorCode, errorMessage);
      });
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Sign-out successful.
      // Unsubscribe a user from push notifications
      if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          action: "unsubscribeFromPush",
        });
      }

      router.push("/logout");
      console.log("Sign-out successful.");
    } catch (error) {
      // Handle errors gracefully
      console.error("Error signing out:", error);
    }
  };

  const signUp = (values: createUserAttributes) => {
    createUserWithEmailAndPassword(auth, values.email, values.password)
      .then(async (userCredential) => {
        setLoading(true);
        // Signed in
        const user = userCredential.user;
        setError(null);
        const userToken = await userCredential.user.getIdToken();
        const data = values;
        data.uid = user.uid;
        createUser(data)
          .then((res) => {
            if (res !== null) {
              // Notification preference doesn't exist, create it
              createNotificationPreference();
              // Subscribe user to push notifications if allowed
              subscribeToPushNotifications(userCredential.user.uid, userToken);
              setLoading(false);
              router.push("/tpage");
            }
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
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
      });
  };

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
    signUp,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
