"use client";
import {
  createContext,
  useContext,
  FC,
  ReactNode,
  useState,
  useEffect,
} from "react";
import getUser from "@/app/http/getUser";
import updateUser from "@/app/http/updateUser";
import { useAuth } from "./AuthContext";
import { useRouter } from "next/navigation";
import { auth } from "@/app/config/firebase";
import { signOut } from "firebase/auth";
import { useProp } from "@/app/contexts/PropContext";
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

const logger = require("../../logger");
const UserContext = createContext<UserContextProps | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
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
  const router = useRouter();
  const { handlePopUp, loading, handleLoading } = useProp();
  useEffect(() => {
    const fetchUserData = () => {
      handleLoading(true);
      if (uid) {
        getUser()
          .then((userData) => {
            setUserInfo(userData);
            router.push("/tpage");
            handleLoading(false, 1000);
          })
          .catch((error) => {
            handlePopUp("error", error.message);
            signOut(auth);
          });
      } else {
        setUserInfo(null);
        handleLoading(false);
      }
    };
    if (user) {
      setTimeout(() => {
        fetchUserData();
      }, 500);
    } else {
      handleLoading(false);
    }
  }, [uid]);
  const updateCurrentUser = (userData: EditableUserAttributes) => {
    if (uid) {
      updateUser(userData)
        .then((response) => {
          logger.info("User updated successfully:", response);
          setUserInfo(response.data[1]);
        })
        .catch((error) => {
          logger.error("Error updating user:", error);
        });
    }
  };
  const value: UserContextProps = {
    userInfo,
    updateCurrentUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
