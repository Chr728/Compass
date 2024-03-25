"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import CreateInsulinJournalPage from "./createInsulinJournalPage";

export default function CreateInsulinJournal() {
	const router = useRouter();
	const { user } = useAuth();

	return <CreateInsulinJournalPage />;
}
