"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import CreateBloodPressureJournalPage from "./createBloodPressureJournalPage";

export default function CreateBloodPressureJournal() {
	const router = useRouter();
	const { user } = useAuth();

	// React.useEffect(() => {
	// 	if (!user) router.push("/login");
	// }, [user]);

	// if (!user) {
	//   return <div><Custom403/></div>
	// }

	return <CreateBloodPressureJournalPage />;
}
