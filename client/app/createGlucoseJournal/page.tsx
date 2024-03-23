"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import CreateGlucoseJournalPage from "./createGlucoseJournalPage";

export default function CreateGlucoseJournal() {
	const router = useRouter();
	const { user } = useAuth();

	return <CreateGlucoseJournalPage />;
}
