"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import GetBloodPressureJournalsPage from "./getBloodPressureJournalsPage";

export default function GetBloodPressureJournals() {
	const router = useRouter();
	const { user } = useAuth();

	return <GetBloodPressureJournalsPage />;
}
