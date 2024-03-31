"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import GetFoodJournalsPage from "./getFoodJournalsPage";

export default function GetFoodJournals() {
	const router = useRouter();
	const { user } = useAuth();

	return <GetFoodJournalsPage />;
}
