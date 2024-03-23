"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import CreateWeightJournalPage from "./createWeightJournalPage";

export default function CreateWeightJournal() {
	const router = useRouter();
	const { user } = useAuth();

	return <CreateWeightJournalPage />;
}
