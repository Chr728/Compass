"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import GetMedicationsPage from "./getMedicationsPage";

export default function GetMedications() {
	const router = useRouter();
	const { user } = useAuth();

	return <GetMedicationsPage />;
}
