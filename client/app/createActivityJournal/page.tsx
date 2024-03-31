"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import CreateActivityJournalPage from "./createActivityJournalPage";

export default function CreateActivityJournal() {
	const router = useRouter();
	const { user } = useAuth();

	return <CreateActivityJournalPage />;
}
