"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import CreateMedicationPage from "./createMedicationPage";

export default function CreateMedication() {
	const router = useRouter();
	const { user } = useAuth();

	return <CreateMedicationPage />;
}
