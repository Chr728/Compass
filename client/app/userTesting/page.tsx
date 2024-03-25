"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import UserTestingPage from "./userTestingPage";

export default function GetUserTesting() {
	const router = useRouter();
	const { user } = useAuth();

	return <UserTestingPage />;
}
