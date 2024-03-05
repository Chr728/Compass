"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import GetOxygenJournalsPage from "./getOxygenJournalsPage";

export default function GetOxygenJournals() {
	const router = useRouter();
	const { user } = useAuth();

	return <GetOxygenJournalsPage />;
}
