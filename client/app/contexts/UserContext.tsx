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
    const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      handleLoading(true);
      if (uid) {
        getUser()
            .then((userData) => {
              setUserInfo(userData);
              handleLoading(false, 1000);
            })
            .catch((error) => {
              handlePopUp("error", error.message);
              signOut(auth);
            })
            .finally(() => {
              setIsDataLoaded(true); // Set the data loaded flag to true
            });
      } else {
        setUserInfo(null);
        handleLoading(false);
        setIsDataLoaded(true); // Set the data loaded flag to true
      }
    };

    if (user) {
      (async () => {
        await fetchUserData();
      })();
    } else {
      handleLoading(false);
      setIsDataLoaded(true); // Set the data loaded flag to true even if there's no user
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

  return <UserContext.Provider value={value}>{isDataLoaded && children}</UserContext.Provider>;
};
