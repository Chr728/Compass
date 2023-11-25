"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import Custom403 from "../pages/403";
import SettingsPage from "./settingsPage";

export default function Setting() {
  const router = useRouter();
  const { logout, user } = useAuth();

  React.useEffect(() => {
    if (!user) 
      router.push("/login")
  }, [user])

  if (!user) {
    return <div><Custom403/></div>
  }

  return (
    <SettingsPage />
      );
}
