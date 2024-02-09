"use client";
import Header from "@/app/components/Header";
import SingleEntry from "@/app/components/SingleEntry";
import {
	formatDate,
	formatMilitaryTime,
} from "@/app/helpers/utils/datetimeformat";
import Custom403 from "@/app/pages/403";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useProp } from "../../contexts/PropContext";
import { getMedication } from "../../http/medicationAPI";

export default function GetMedication({
	params: { medication },
}: {
	params: { medication: string };
}) {
	const logger = require("../../../logger");
	const { user } = useAuth();
	const router = useRouter();
	const [medicationdata, setmedicationdata] = useState<any>(null);
	const { handlePopUp } = useProp();

	async function fetchMedication() {
		try {
			const result = await getMedication(medication);
			logger.info("Medication entry retrieved:", result);
			setmedicationdata(result.data);
		} catch (error) {
			handlePopUp("error", "Error retrieving medication journal entry:");
		}
	}
	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		if (!user) {
			router.push("/login");
			logger.warn("User not found.");
			alert("User not found.");
		}
		if (user) {
			fetchMedication();
		}
	}, []);

	if (!user) {
		return (
			<div>
				<Custom403 />
			</div>
		);
	}

	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
				<button onClick={() => router.push("/getMedications")}>
					<Header headerText="View the Medication"></Header>
				</button>
			</span>

			{medicationdata && (
				<span className="rounded-2xl  mt-6 mb-10 mr-28 bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[600px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
					<div className="mt-3 relative">
						{medicationdata.image && (
							<img
								src={`${process.env.NEXT_PUBLIC_API_URL}/${medicationdata.image}`}
								alt="Medication Image"
								className="smallImage"
								width={350}
								height={250}
							/>
						)}

						<SingleEntry
							label={"Medication Name:"}
							value={medicationdata.medicationName}></SingleEntry>
						<SingleEntry
							label={"Start Date:"}
							value={formatDate(
								medicationdata.dateStarted
							)}></SingleEntry>
						<SingleEntry
							label={"Time:"}
							value={formatMilitaryTime(
								medicationdata.time
							)}></SingleEntry>
						<SingleEntry
							label={"Dosage:"}
							value={medicationdata.dosage}></SingleEntry>
						<SingleEntry
							label={"Unit:"}
							value={medicationdata.unit}></SingleEntry>
						<SingleEntry
							label={"Frequency:"}
							value={medicationdata.frequency}></SingleEntry>
						<SingleEntry
							label={"Route:"}
							value={medicationdata.route}></SingleEntry>
						<SingleEntry
							label={"Notes:"}
							value={medicationdata.notes}></SingleEntry>
					</div>
					<div className="mt-10 pb-4 self-center">
						<Button
							type="button"
							text="Edit"
							style={{ width: "140px" }}
							onClick={() =>
								router.push(
									`/getMedications/${medication}/${medication}`
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
							onClick={() => router.push(`/getMedications`)}
						/>
					</div>
				</span>
			)}
		</div>
	);
}
