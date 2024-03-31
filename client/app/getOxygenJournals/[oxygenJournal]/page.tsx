"use client";
import SingleEntry from "@/app/components/SingleEntry";
import SpanHeader from "@/app/components/SpanHeader";
import {
	formatDate,
	formatMilitaryTime,
} from "@/app/helpers/utils/datetimeformat";
import { getO2SaturationJournal } from "@/app/http/oxygenJournalAPI";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useProp } from "../../contexts/PropContext";

export default function GetOxygenJournal({
	params: { oxygenJournal },
}: {
	params: { oxygenJournal: string };
}) {
	const logger = require("../../../logger");
	const { user } = useAuth();
	const router = useRouter();
	const [journal, setJournal] = useState<any>(null);
	const { handlePopUp } = useProp();

	async function fetchOxygenJournalEntry() {
		try {
			const result = await getO2SaturationJournal(oxygenJournal);
			logger.info("oxygen journal entry retrieved:", result);
			setJournal(result.data);
		} catch (error) {
			handlePopUp("error", "Error retrieving oxygen journal entry:");
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
				fetchOxygenJournalEntry();
			}, 1000);
		}
	}, [user, oxygenJournal]);

	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<SpanHeader
				onClick={() => router.push("/getOxygenJournals")}
				headerText="View O2 Saturation Entry"></SpanHeader>
			{journal && (
				<span className="rounded-2xl  mt-6 mb-10 mr-28 bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[600px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
					<div className="mt-3 relative">
						<SingleEntry
							label={"Date:"}
							value={formatDate(journal.date)}></SingleEntry>
						<SingleEntry
							label={"Time:"}
							value={formatMilitaryTime(
								journal.time
							)}></SingleEntry>
						<SingleEntry
							label={"O\u2082 Saturation:"}
							value={`${journal.o2sat}`}></SingleEntry>
						<SingleEntry
							label={"Pulse Rate:"}
							value={journal.pulse}></SingleEntry>
						<SingleEntry
							label={"Activity Level:"}
							value={journal.activityLevel}></SingleEntry>
						<SingleEntry
							label={"Notes:"}
							value={journal.notes}></SingleEntry>
					</div>
					<div className="mt-10 pb-4 self-center">
						<Button
							type="button"
							text="Edit"
							style={{ width: "140px" }}
							onClick={() =>
								router.push(
									`/getOxygenJournals/${oxygenJournal}/${oxygenJournal}`
								)
							}
						/>
						<Button
							type="button"
							text="Cancel"
							style={{
								width: "140px",
								backgroundColor: "var(--Red, #FF7171)",
								marginLeft: "8px",
							}}
							onClick={() => router.push(`/getOxygenJournals`)}
						/>
					</div>
				</span>
			)}
		</div>
	);
}
