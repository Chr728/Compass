"use client";
import React from "react";
import ProfileIcon from "../../public/icons/Mask.svg";
import Image from "next/image";
import RedButton from "../components/RedButton";
import Button from "../components/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Menu from "../components/Menu";
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
