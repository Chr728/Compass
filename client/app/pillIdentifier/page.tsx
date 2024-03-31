"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import PillIdentifierPage from "./pillIdentifierPage";

export default function GetMedications() {
	const router = useRouter();
	const { user } = useAuth();

	return <PillIdentifierPage />;
}
