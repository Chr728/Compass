"use client";
import Chart from "chart.js/auto";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	MdDeleteForever,
	MdKeyboardArrowDown,
	MdKeyboardArrowUp,
} from "react-icons/md";
import Swal from "sweetalert2";
import Button from "../components/Button";
import SpanHeader from "../components/SpanHeader";
import { useAuth } from "../contexts/AuthContext";
import { useProp } from "../contexts/PropContext";
import { useUser } from "../contexts/UserContext";
import {
	formatDate,
	formatMilitaryTime,
} from "../helpers/utils/datetimeformat";
import {
	deleteFoodIntakeJournal,
	getFoodIntakeJournals,
} from "../http/foodJournalAPI";

export default function GetFoodJournalsPage() {
	const logger = require("../../logger");
	const router = useRouter();
	const { user } = useAuth();
	const { userInfo } = useUser();
	const [food, setfood] = useState<any>(null);
	const { handlePopUp } = useProp();
	const [selectAll, setSelectAll] = useState(false);
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	let chartInstance: Chart<"line", any, unknown> | null = null;

	useEffect(() => {
		if (!userInfo) {
			logger.warn("User not found.");
			alert("User not found.");
		}
	}, [userInfo, router]);

	useEffect(() => {
		async function fetchFoodJournals() {
			try {
				const userId = user?.uid || "";
				const result = await getFoodIntakeJournals();
				logger.info("All Food journals entry retrieved:", result);
				setfood(result.data);
			} catch (error) {
				handlePopUp("error", "Error retrieving food journal entry:");
			}
		}
		setTimeout(() => {
			fetchFoodJournals();
		}, 500);
	}, [user]);

	useEffect(() => {
		renderGraph();
	}, [food]);

	const renderGraph = () => {
		try {
			const canvas = document.getElementById(
				"foodChart"
			) as HTMLCanvasElement | null;
			if (canvas) {
				const ctx = canvas.getContext("2d");
				if (ctx) {
					const calories = food.map(
						(item: { calorie: number }) => item.calorie
					);

					if (chartInstance) {
						chartInstance.destroy();
					}

					setTimeout(() => {
						chartInstance = new Chart(ctx, {
							type: "line",
							data: {
								labels: food.map(
									(item: any, index: number) => index + 1
								),
								datasets: [
									{
										label: "Calorie",
										data: calories,
										borderColor: "rgba(75, 192, 192, 1)",
										tension: 0.1,
									},
								],
							},
							options: {
								scales: {
									y: {
										beginAtZero: true,
										title: {
											display: true,
											text: "Calories",
										},
										ticks: {
											stepSize: 100,
										},
									},
									x: {
										title: {
											display: true,
											text: "Row Index",
										},
									},
								},
							},
						});
					}, 100);
				} else {
					console.error(
						"Could not get 2D context for canvas element."
					);
				}
			} else {
				console.error(
					"Could not find canvas element with id 'foodChart'."
				);
			}
		} catch (error) {
			console.error("Error rendering graph:", error);
		}
	};
	const deleteSelectedRows = async () => {
		Swal.fire({
			text: "Are you sure you want to delete this food journal entry?",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Delete",
		}).then(async (result: { isConfirmed: any }) => {
			if (result.isConfirmed) {
				for (const id of selectedRows) {
					const deleteresult = await deleteFoodIntakeJournal(id);
				}

				const newData = food.filter(
					(item: { id: string }) => !selectedRows.includes(item.id)
				);
				setfood(newData);
				setSelectedRows([]);

				router.push("/getFoodJournals");
				Swal.fire({
					title: "Deleted!",
					text: "Your food journal entry has been deleted.",
					icon: "success",
				});
			}
		});
	};

	const handleSelectAll = () => {
		if (selectAll) {
			setSelectedRows([]);
		} else {
			const allIds = food.map((item: { id: string }) => item.id);
			setSelectedRows(allIds);
		}
		setSelectAll(!selectAll);
	};

	const handleCheckboxChange = (id: string) => {
		if (selectedRows.includes(id)) {
			setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
		} else {
			setSelectedRows([...selectedRows, id]);
		}
	};
	async function deleteFoodJournals(foodJournalId: string) {
		Swal.fire({
			text: "Are you sure you want to delete this food journal entry?",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Delete",
		}).then(async (result: { isConfirmed: any }) => {
			if (result.isConfirmed) {
				const deleteresult = await deleteFoodIntakeJournal(
					foodJournalId
				);
				const newData =
					food &&
					food.filter(
						(item: { id: string }) => item.id != foodJournalId
					);
				setfood(newData);
				router.push("/getFoodJournals");
				Swal.fire({
					title: "Deleted!",
					text: "Your food journal entry has been deleted.",
					icon: "success",
				});
			}
		});
	}

	const [orderdate, setOrderdate] = useState(false);

	const handleOrderDate = () => {
		setOrderdate(!orderdate);
		if (!orderdate && Array.isArray(food)) {
			const increasingfoodData = [...food].sort(
				(a, b) =>
					new Date(a.date.substring(0, 10) + "T" + a.time).getTime() -
					new Date(b.date.substring(0, 10) + "T" + b.time).getTime()
			);
			setfood(increasingfoodData);
		} else if (Array.isArray(food)) {
			const decreasingOrderfoodData = [...food].sort(
				(a, b) =>
					new Date(b.date.substring(0, 10) + "T" + b.time).getTime() -
					new Date(a.date.substring(0, 10) + "T" + a.time).getTime()
			);
			setfood(decreasingOrderfoodData);
		}
	};

	const [ordername, setOrderName] = useState(false);

	const handleOrderName = () => {
		setOrderName(!ordername);
		if (!ordername) {
			const increasingOrderfoodData = [...food].sort((a, b) =>
				a.activity.toLowerCase() < b.activity.toLowerCase() ? -1 : 1
			);
			setfood(increasingOrderfoodData);
		} else {
			const decreasingOrderfoodData = [...food].sort((a, b) =>
				a.activity.toLowerCase() > b.activity.toLowerCase() ? -1 : 1
			);
			setfood(decreasingOrderfoodData);
		}
	};

	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<SpanHeader
				onClick={() => router.push("/journals")}
				headerText="Food Journals"></SpanHeader>
			<p className="font-sans text-darkgrey ml-5 text-[14px]">
				Keep track of what you eat each day.
			</p>
			<br></br>
			<p className="font-sans text-darkgrey ml-5 text-[14px]">
				Remember, eating healthy is all about eating the right foods in
				the right amounts.
			</p>
			<div className="rounded-3xl bg-white flex flex-col mt-4 mb-44 w-full md:max-w-[800px] md:min-h-[550px] p-4 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
				<div className="flex justify-between items-center">
					<div>
						<Button
							id={"add-meal"}
							type="button"
							text="Add an Entry"
							style={{
								width: "120px",
								fontSize: "14px",
								padding: "1px 10px",
							}}
							onClick={() => router.push(`/createFoodJournal`)}
						/>
					</div>
				</div>
				<br></br>
				<div style={{ marginBottom: "5px", padding: "3px" }}>
					<canvas id="foodChart"></canvas>
				</div>
				<div
					id={"filter"}
					className="flex"
					style={{ justifyContent: "space-between" }}>
					<div className="flex-2" style={{ marginRight: "14%" }}>
						<div className="font-sans  text-darkgrey font-bold text-[18px] text-center">
							Date/Time
							<button
								onClick={handleOrderDate}
								aria-label="orderDate">
								{orderdate ? (
									<MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" />
								) : (
									<MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
								)}
							</button>
						</div>
					</div>
					<div className="flex-2" style={{ marginRight: "19%" }}>
						<div className="font-sans  text-darkgrey font-bold text-[18px] text-center">
							Food Item
							<button
								onClick={handleOrderName}
								aria-label="orderName">
								{ordername ? (
									<MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" />
								) : (
									<MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
								)}
							</button>
						</div>
					</div>
					<div
						className="flex-2 mt-2 mr-1"
						style={{ display: "flex", alignItems: "center" }}>
						<div style={{ marginLeft: "auto" }}>
							<input
								type="checkbox"
								checked={selectAll}
								onChange={handleSelectAll}
							/>
						</div>
					</div>
				</div>
				{food &&
					food.map((item: any, index: number) => (
						<div
							key={item.foodJournalId}
							className={`flex justify-between items-center mt-3`}
							style={{
								backgroundColor:
									index % 2 === 0 ? "white" : "#DBE2EA",
							}}
							data-testid="food-entry"
							onClick={() =>
								router.push(`/getFoodJournals/${item.id}`)
							}>
							<div className="flex-2">
								<p className="font-sans font-medium text-darkgrey text-[14px] text-center">
									{`${formatDate(
										item.date
									)} ${formatMilitaryTime(item.time)}`}
								</p>
							</div>
							<div className="flex-2">
								<p className="ml-4 font-sans font-medium text-darkgrey text-[14px] text-center">
									{item.foodName}
								</p>
							</div>

							<div
								className="flex icons"
								style={{
									marginLeft: "5px",
									marginRight: "5px",
								}}>
								<div className="icon">
									<MdDeleteForever
										style={{
											color: "var(--Red, #FF7171)",
											width: "25px",
											height: "30px",
										}}
										onClick={(event) => {
											event.stopPropagation();
											deleteFoodJournals(item.id);
										}}
									/>
								</div>
								<div className="flex-1 mt-1">
									<input
										type="checkbox"
										checked={selectedRows.includes(item.id)}
										onClick={(event) => {
											event.stopPropagation();
											handleCheckboxChange(item.id);
										}}
									/>
								</div>
							</div>
						</div>
					))}
				{selectedRows.length > 0 && (
					<div className="mt-5 pb-4 self-center">
						<Button
							type="button"
							text="Delete Selected Rows"
							style={{
								width: "120px",
								fontSize: "14px",
								padding: "1px 10px",
							}}
							onClick={deleteSelectedRows}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
