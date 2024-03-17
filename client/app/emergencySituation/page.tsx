"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import EmergencySituation from "./emergencySituation";

export default function GetFoodJournals() {
	const router = useRouter();
	const { user } = useAuth();

	return <EmergencySituation />;
}
