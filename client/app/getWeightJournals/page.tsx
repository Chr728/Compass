"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import GetWeightJournalsPage from "./getWeightJournalsPage";

export default function GetWeightJournals() {
	const router = useRouter();
	const { user } = useAuth();

	return <GetWeightJournalsPage />;
}
