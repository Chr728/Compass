"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import ViewMoodJournalsPage from "./viewMoodJournalsPage";

export default function GetMoodJournals() {
	const router = useRouter();
	const { user } = useAuth();

	return <ViewMoodJournalsPage />;
}
