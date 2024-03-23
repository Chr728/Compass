"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import GetGlucoseJournalsPage from "./getGlucoseJournals/getGlucoseJournalsPage";
import GetInsulinJournalsPage from "./getInsulinJournals/getInsulinJournalsPage";

export default function GetDiabeticJournals() {
	const router = useRouter();
	const { user } = useAuth();

	return (
		<>
			<GetGlucoseJournalsPage />

			<GetInsulinJournalsPage />
		</>
	);
}
