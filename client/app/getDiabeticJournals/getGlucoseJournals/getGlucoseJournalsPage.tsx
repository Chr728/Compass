"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdDeleteForever, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import Swal from "sweetalert2";
import Button from "../../components/Button";
import Header from "../../components/Header";
import { useAuth } from "../../contexts/AuthContext";
import { useProp } from "../../contexts/PropContext";
import { useUser } from "../../contexts/UserContext";
import { formatDate } from "../../helpers/utils/datetimeformat";
import {
	deleteGlucoseJournal,
	getGlucoseJournals,
} from "../../http/diabeticJournalAPI";

export default function GetGlucoseJournalsPage() {
	const logger = require("../../../logger");
	const router = useRouter();
	const { user } = useAuth();
	const { userInfo } = useUser();
	const [glucose, setglucose] = useState<any>(null);
	const { handlePopUp } = useProp();

	useEffect(() => {
		if (!userInfo) {
			logger.warn("User not found.");
			alert("User not found.");
		}
	}, [userInfo, router]);

	useEffect(() => {
		async function fetchGlucoseJournals() {
			try {
				const result = await getGlucoseJournals();
				logger.info("All Glucose journals entry retrieved:", result);
				setglucose(result.data);
			} catch (error) {
				handlePopUp("error", "Error retrieving glucose journal entry:");
			}
		}
		setTimeout(() => {
			fetchGlucoseJournals();
		}, 500);
	}, [user]);

	async function deleteGlucoseJournals(glucoseJournalId: string) {
		Swal.fire({
			text: "Are you sure you want to delete this glucose journal entry?",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Delete",
		}).then(async (result: { isConfirmed: any }) => {
			if (result.isConfirmed) {
				const deleteresult = await deleteGlucoseJournal(
					glucoseJournalId
				);
				const newData =
					glucose &&
					glucose.filter(
						(item: { id: string }) => item.id != glucoseJournalId
					);
				setglucose(newData);
				router.push("/getDiabeticJournals");
				Swal.fire({
					title: "Deleted!",
					text: "Your glucose journal entry has been deleted.",
					icon: "success",
				});
			}
		});
	}


	//Order by Date
	const [orderdate, setOrderDate] = useState(false)

	const handleOrderDate = () => {
		setOrderDate(!orderdate)
		if (!orderdate){
			const increasingOrderglucoseData = [...glucose].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
			setglucose(increasingOrderglucoseData)
		}
		else{
			const decreasingOrderglucoseData = [...glucose].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			setglucose(decreasingOrderglucoseData)
		}
	}

	//Order by blood glucose
	const [orderglucose, setOrderGlucose] = useState(false)

	const handleOrderGlucose = () => {
		setOrderGlucose(!orderglucose)
		if (!orderglucose){
			const increasingOrderglucoseData = [...glucose].sort((a,b) => a.bloodGlucose - b.bloodGlucose)
			setglucose(increasingOrderglucoseData)
		}
		else{
			const decreasingOrderglucoseData = [...glucose].sort((a,b) => b.bloodGlucose - a.bloodGlucose)
			setglucose(decreasingOrderglucoseData)
		}
	}


	//Order by meal time
	const [ordermealtime, setOrderMealTime] = useState(false)

	const handleOrderMealTime = () => {
		setOrderMealTime(!ordermealtime)
		if (!ordermealtime){
			const increasingOrderglucoseData = [...glucose].sort((a,b) => (a.mealTime).toLowerCase() < (b.mealTime).toLowerCase() ? -1 : 1)
			setglucose(increasingOrderglucoseData)
		}
		else{
			const decreasingOrderglucoseData = [...glucose].sort((a,b) => (a.mealTime).toLowerCase() > (b.mealTime).toLowerCase() ? -1 : 1)
			setglucose(decreasingOrderglucoseData)
		}
	}

	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
				<button onClick={() => router.push("/journals")}>
					<Header headerText="Diabetes Journal "></Header>
				</button>
			</span>
			<p className="font-sans text-darkgrey ml-5 text-[14px]">
				Keep track of your insulin doses and glucose measurements to
				ensure a healthy lifestyle.
			</p>
			<br></br>
			{glucose && (
				<div className="rounded-3xl bg-white flex flex-col mt-4 mb-6 w-full md:max-w-[800px] md:min-h-[550px] p-4 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
					<label className="text-darkgrey font-bold text-[22px] mb-3">
						Glucose Measurement
					</label>
					<div className="flex justify-between items-center">
						<div>
							<Button
								type="button"
								text="Add an Entry"
								style={{
									width: "120px",
									fontSize: "14px",
									padding: "1px 10px",
								}}
								onClick={() =>
									router.push(`/createGlucoseJournal`)
								}
							/>
						</div>
					</div>
					<br></br>
					<div
						className="flex"
						style={{ justifyContent: "space-between" }}>
						<div className="flex-2" style={{ marginRight: "5%" }}>
							<div className="font-sans  text-darkgrey font-bold text-[18px] text-center">
								Date
								<button onClick={handleOrderDate}>
									{orderdate ? <MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" /> : <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />  }
								</button>		
							</div>
						</div>
						<div className="flex-2" style={{ marginRight: "1%" }}>
							<div className="font-sans  text-darkgrey font-bold text-[18px] text-center">
								Meal Time
								<button onClick={handleOrderMealTime}>
									{ordermealtime ? <MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" /> : <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />  }
								</button>
							</div>
						</div>
						<div className="flex-2" style={{ marginRight: "11%" }}>
							<div className="font-sans  text-darkgrey font-bold text-[18px] text-center">
								Glucose
								<button onClick={handleOrderGlucose}>
									{orderglucose ? <MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" /> : <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />  }
								</button>
							</div>
						</div>
					</div>
					{glucose.map((item: any, index: number) => (
						<div
							key={item.glucoseJournalId}
							className={`flex justify-between items-center mt-3`}
							style={{
								backgroundColor:
									index % 2 === 0 ? "white" : "#DBE2EA",
							}}
							onClick={() =>
								router.push(
									`/getDiabeticJournals/getGlucoseJournals/${item.id}`
								)
							}>
							<div className="flex-2">
								<p className="font-sans font-medium text-darkgrey text-[14px] text-center">
									{`${formatDate(item.date)}`}
								</p>
							</div>
							<div className="flex-1">
								<p className="ml-3 font-sans font-medium text-darkgrey text-[14px] text-center">
									{item.mealTime}
								</p>
							</div>
							<div className="flex-1">
								<p className="ml-4 font-sans font-medium text-darkgrey text-[14px] text-center">
									{item.bloodGlucose}
								</p>
							</div>

							<div
								className="flex icons"
								style={{
									marginLeft: "5px",
									marginRight: "5px",
								}}>
								<div className="icon" id="Trash Icon">
									<MdDeleteForever
										style={{
											color: "var(--Red, #FF7171)",
											width: "25px",
											height: "30px",
										}}
										onClick={(event) => {
											event.stopPropagation();
											deleteGlucoseJournals(item.id);
										}}
									/>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
