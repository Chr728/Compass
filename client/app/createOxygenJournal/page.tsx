"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import CreateOxygenJournalPage from "./createOxygenJournalPage";

export default function CreateOxygenJournal() {
	const router = useRouter();
	const { user } = useAuth();

	return <CreateOxygenJournalPage />;
}
