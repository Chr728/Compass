"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import Custom403 from '../../pages/403';
import GetGlucoseJournalsPage from "./getGlucoseJournalsPage";

export default function GetGlucoseJournals() {
  const router = useRouter();
  const { user } = useAuth()

  React.useEffect(() => {
    if (!user) 
      router.push("/login")
  }, [user])

  return <GetGlucoseJournalsPage />  
}
