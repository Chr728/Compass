"use client";
import SingleEntry from "@/app/components/SingleEntry";
import SpanHeader from "@/app/components/SpanHeader";
import {
	formatDate,
	formatMilitaryTime,
} from "@/app/helpers/utils/datetimeformat";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useProp } from "../../contexts/PropContext";
import { getWeightJournal } from "../../http/weightJournalAPI";

export default function GetWeightJournal({
	params: { weightJournal },
}: {
	params: { weightJournal: string };
}) {
	const logger = require("../../../logger");
	const { user } = useAuth();
	const router = useRouter();
	const [weight, setweight] = useState<any>(null);
	const { handlePopUp } = useProp();

	async function fetchWeightJournal() {
		try {
			const result = await getWeightJournal(weightJournal);
			logger.info("Weight journal entry retrieved:", result);
			setweight(result.data);
		} catch (error) {
			handlePopUp("error", "Error retrieving weight journal entry:");
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
				fetchWeightJournal();
			}, 1000);
		}
	}, []);

	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<SpanHeader
				onClick={() => router.push("/getWeightJournals")}
				headerText="View the Weight Journal"></SpanHeader>

			{weight && (
				<span className="rounded-2xl  mt-6 mb-10 mr-28 bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[600px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
					<div className="mt-3 relative">
						<SingleEntry
							label={"Date:"}
							value={formatDate(weight.date)}></SingleEntry>
						<SingleEntry
							label={"Time:"}
							value={formatMilitaryTime(
								weight.time
							)}></SingleEntry>
						<SingleEntry
							label={"Weight:"}
							value={weight.weight}></SingleEntry>
						<SingleEntry
							label={"Unit:"}
							value={weight.unit}></SingleEntry>
						<SingleEntry
							label={"Height:"}
							value={weight.height}></SingleEntry>
						<SingleEntry
							label={"Notes:"}
							value={weight.notes}></SingleEntry>
					</div>
					<div className="mt-10 pb-4 self-center">
						<Button
							type="button"
							text="Edit"
							style={{ width: "140px" }}
							onClick={() =>
								router.push(
									`/getWeightJournals/${weightJournal}/${weightJournal}`
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
							onClick={() => router.push(`/getWeightJournals`)}
						/>
					</div>
				</span>
			)}
		</div>
	);
	// }
}
