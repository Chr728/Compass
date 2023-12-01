"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Custom403 from '../pages/403';
import CreateContactPage from './createContact';

export default function CreateContact() {
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
    <CreateContactPage />  );
}
