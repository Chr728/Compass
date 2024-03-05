"use client";
import Header from "@/app/components/Header";
import SingleEntry from "@/app/components/SingleEntry";
import {
	formatDate,
	formatMilitaryTime,
} from "@/app/helpers/utils/datetimeformat";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useProp } from "../../contexts/PropContext";
import { getFoodIntakeJournal } from "../../http/foodJournalAPI";

export default function GetFoodJournal({
	params: { foodJournal },
}: {
	params: { foodJournal: string };
}) {
	const logger = require("../../../logger");
	const { user } = useAuth();
	const router = useRouter();
	const [food, setfood] = useState<any>(null);
	const { handlePopUp } = useProp();

	async function fetchFoodJournal() {
		try {
			const result = await getFoodIntakeJournal(foodJournal);
			logger.info("Food journal entry retrieved:", result);
			setfood(result.data);
		} catch (error) {
			handlePopUp("error", "Error retrieving food journal entry:");
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
			setTimeout(() => {
				fetchFoodJournal();
			}, 1000);
		}
	}, []);

	// if (!user) {
	//   return <div><Custom403/></div>
	// }

	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
				<button onClick={() => router.push("/getFoodJournals")}>
					<Header headerText="View the Food Journal"></Header>
				</button>
			</span>

			{food && (
				<span className="rounded-2xl  mt-6 mb-10 mr-28 bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[600px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
					<div className="mt-3 relative">
						<SingleEntry
							label={"Date:"}
							value={formatDate(food.date)}></SingleEntry>
						<SingleEntry
							label={"Time:"}
							value={formatMilitaryTime(food.time)}></SingleEntry>
						<SingleEntry
							label={"Name of Food:"}
							value={food.foodName}></SingleEntry>
						<SingleEntry
							label={"Meal Type:"}
							value={food.mealType}></SingleEntry>
						<SingleEntry
							label={"Number of Servings:"}
							value={food.servingNumber}></SingleEntry>
						<SingleEntry
							label={"Calories:"}
							value={food.calorie}></SingleEntry>

						<SingleEntry
							label={"Notes:"}
							value={food.notes}></SingleEntry>
					</div>
					<div className="mt-10 pb-4 self-center">
						<Button
							type="button"
							text="Edit"
							style={{ width: "140px" }}
							onClick={() =>
								router.push(
									`/getFoodJournals/${foodJournal}/${foodJournal}`
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
							onClick={() => router.push(`/getFoodJournals`)}
						/>
					</div>
				</span>
			)}
		</div>
	);
}
