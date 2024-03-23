"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import PrivacyPage from "./privacyPage";

export default function GetPrivacyPage() {
	const router = useRouter();
	const { user } = useAuth();

	return <PrivacyPage />;
}
