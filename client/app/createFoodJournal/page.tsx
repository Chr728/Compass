"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import CreateFoodJournalPage from "./createFoodJournalPage";

export default function CreateFoodJournal() {
	const router = useRouter();
	const { user } = useAuth();

	return <CreateFoodJournalPage />;
}
