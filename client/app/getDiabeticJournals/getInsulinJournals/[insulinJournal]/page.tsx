"use client";
import Menu from "@/app/components/Menu";
import SingleEntry from "@/app/components/SingleEntry";
import SpanHeader from "@/app/components/SpanHeader";
import {
	formatDate,
	formatMilitaryTime,
} from "@/app/helpers/utils/datetimeformat";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../../../components/Button";
import { useAuth } from "../../../contexts/AuthContext";
import { useProp } from "../../../contexts/PropContext";
import { getInsulinJournal } from "../../../http/diabeticJournalAPI";

export default function GetInsulinJournal({
	params: { insulinJournal },
}: {
	params: { insulinJournal: string };
}) {
	const logger = require("../../../../logger");
	const { user } = useAuth();
	const router = useRouter();
	const [insulin, setinsulin] = useState<any>(null);
	const { handlePopUp } = useProp();

	async function fetchInsulinJournal() {
		try {
			const result = await getInsulinJournal(insulinJournal);
			logger.info("Insulin journal entry retrieved successfully.");
			setinsulin(result.data);
		} catch (error) {
			handlePopUp("error", "Error retrieving insulin journal entry:");
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
				fetchInsulinJournal();
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
				headerText="View the Insulin Journal "></SpanHeader>

			{insulin && (
				<span className="rounded-2xl  mt-6 mb-10 mr-28 bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[600px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
					<div className="mt-3 relative">
						<SingleEntry
							label={"Date:"}
							value={formatDate(insulin.date)}></SingleEntry>
						<SingleEntry
							label={"Time:"}
							value={formatMilitaryTime(
								insulin.time
							)}></SingleEntry>
						<SingleEntry
							label={"Type:"}
							value={insulin.typeOfInsulin}></SingleEntry>
						<SingleEntry
							label={"Units:"}
							value={insulin.unit}></SingleEntry>
						<SingleEntry
							label={"Body Site:"}
							value={insulin.bodySite}></SingleEntry>
						<SingleEntry
							label={"Notes:"}
							value={insulin.notes}></SingleEntry>
					</div>
					<div className="mt-10 pb-4 self-center">
						<Button
							type="button"
							text="Edit"
							style={{ width: "140px" }}
							onClick={() =>
								router.push(
									`/getDiabeticJournals/getInsulinJournals/${insulinJournal}/${insulinJournal}`
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
							onClick={() => router.push(`/getDiabeticJournals`)}
						/>
					</div>
				</span>
			)}
			<div className="mt-8">
				<div className={`xl:max-w-[1280px] w-full  menu-container`}>
					<Menu />
				</div>
			</div>
		</div>
	);
	// }
}
