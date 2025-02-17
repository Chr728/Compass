"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import Custom403 from '../../pages/403';
import GetInsulinJournalsPage from "./getInsulinJournalsPage";

export default function GetInsulinJournals() {
  const router = useRouter();
  const { user } = useAuth()

  React.useEffect(() => {
    if (!user) 
      router.push("/login")
  }, [user])

  return (
    <GetInsulinJournalsPage />  );
}
