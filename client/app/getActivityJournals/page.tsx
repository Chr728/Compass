"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import GetActivityJournalsPage from "./getActivityJournalsPage";

export default function GetActivityJournals() {
	const router = useRouter();
	const { user } = useAuth();

	return <GetActivityJournalsPage />;
}
