"use client";
import Link from "next/link";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import Menu from "../components/Menu";
import Switch from "@mui/material/Switch";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Custom403 from '../pages/403';
import NotificationPage from "./notificationPage";

// Logging out the user
export default function Notification() {
  const router = useRouter();
  const { user } = useAuth()

  React.useEffect(() => {
    if (!user) 
      router.push("/login")
  }, [user])

  if (!user) {
    return <div><Custom403/></div>
  }

  return (
    <NotificationPage />  );
}
