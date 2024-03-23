"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import CreateBloodPressureJournalPage from "./createBloodPressureJournalPage";

export default function CreateBloodPressureJournal() {
	const router = useRouter();
	const { user } = useAuth();

	return <CreateBloodPressureJournalPage />;
}
