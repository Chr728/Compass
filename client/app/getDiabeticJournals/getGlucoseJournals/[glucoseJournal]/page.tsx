"use client";
import SingleEntry from "@/app/components/SingleEntry";
import SpanHeader from "@/app/components/SpanHeader";
import { formatDate } from "@/app/helpers/utils/datetimeformat";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import { useAuth } from "../../../contexts/AuthContext";
import { getGlucoseJournal } from "../../../http/diabeticJournalAPI";

export default function GetGlucoseJournal({
	params: { glucoseJournal },
}: {
	params: { glucoseJournal: string };
}) {
	const logger = require("../../../../logger");
	const { user } = useAuth();
	const router = useRouter();
	const [glucose, setglucose] = useState<any>(null);

	async function fetchGlucoseJournal() {
		try {
			const result = await getGlucoseJournal(glucoseJournal);
			logger.info("Glucose journal entry retrieved:", result);
			setglucose(result.data);
		} catch (error) {
			logger.error("Error retrieving Glucose journal entry:", error);
		}
	}

	useEffect(() => {
		if (!user) {
			router.push("/login");
			logger.warn("User not found.");
			alert("User not found.");
		}
		if (user) {
			setTimeout(() => {
				fetchGlucoseJournal();
			}, 1000);
		}
	}, []);

	// if (!user) {
	//   return <div><Custom403/></div>
	// }

	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<SpanHeader
				onClick={() => router.push("/getDiabeticJournals")}
				headerText="View the Glucose Journal"></SpanHeader>
			{glucose && (
				<span className="rounded-2xl  mt-6 mb-10 mr-28 bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[600px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
					<div className="mt-3 relative">
						<SingleEntry
							label={"Date:"}
							value={formatDate(glucose.date)}></SingleEntry>
						<SingleEntry
							label={"Meal Time:"}
							value={glucose.mealTime}></SingleEntry>
						<SingleEntry
							label={"Blood Glucose:"}
							value={glucose.bloodGlucose}></SingleEntry>
						<SingleEntry
							label={"Unit:"}
							value={glucose.unit}></SingleEntry>
						<SingleEntry
							label={"Notes:"}
							value={glucose.notes}></SingleEntry>
					</div>
					<div className="mt-10 pb-4 self-center">
						<Button
							type="button"
							text="Edit"
							style={{ width: "140px" }}
							onClick={() =>
								router.push(
									`/getDiabeticJournals/getGlucoseJournals/${glucoseJournal}/${glucoseJournal}`
								)
							}
						/>
						<Button
							type="button"
							text="Cancel"
							style={{
								width: "140px",
								backgroundColor: "var(--Red, #FF7171)",
								marginLeft: "12px",
							}}
							onClick={() => router.push(`/getDiabeticJournals`)}
						/>
					</div>
				</span>
			)}
		</div>
	);
	// }
}
