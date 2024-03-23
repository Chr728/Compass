"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import EmergencySituation from "./emergencySituation";

export default function GetEmergencySituation() {
	const router = useRouter();
	const { user } = useAuth();

	return <EmergencySituation />;
}
