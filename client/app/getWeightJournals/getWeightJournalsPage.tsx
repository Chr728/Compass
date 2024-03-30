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
import GeneralEntry from "../components/GeneralEntry";
import SpanHeader from "../components/SpanHeader";
import { useAuth } from "../contexts/AuthContext";
import { useProp } from "../contexts/PropContext";
import { useUser } from "../contexts/UserContext";
import {
	formatDate,
	formatMilitaryTime,
} from "../helpers/utils/datetimeformat";
import {
	deleteWeightJournal,
	getWeightJournals,
} from "../http/weightJournalAPI";

export default function GetWeightJournalsPage() {
	const logger = require("../../logger");
	const router = useRouter();
	const { user } = useAuth();
	const { userInfo } = useUser();
	const [weight, setweight] = useState<any>(null);
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
		async function fetchWeightJournals() {
			try {
				const result = await getWeightJournals();
				logger.info("All Weight journals entry retrieved:", result);
				setweight(result.data);
			} catch (error) {
				handlePopUp("error", "Error retrieving weight journal entry:");
			}
		}
		setTimeout(() => {
			fetchWeightJournals();
		}, 500);
	}, [user]);
	useEffect(() => {
		renderGraph();
	}, [weight]);

	const renderGraph = () => {
		try {
			const canvas = document.getElementById(
				"weightChart"
			) as HTMLCanvasElement | null;
			if (canvas) {
				const ctx = canvas.getContext("2d");
				if (ctx) {
					const weights = weight.map(
						(item: { weight: number }) => item.weight
					);

					if (chartInstance) {
						chartInstance.destroy();
					}

					setTimeout(() => {
						chartInstance = new Chart(ctx, {
							type: "line",
							data: {
								labels: weight.map(
									(item: any, index: number) => index + 1
								),
								datasets: [
									{
										label: "Weight",
										data: weights,
										borderColor: "rgba(75, 192, 192, 1)",
										tension: 0.1,
									},
								],
							},
							options: {
								scales: {
									y: {
										beginAtZero: true,
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
					"Could not find canvas element with id 'weightChart'."
				);
			}
		} catch (error) {
			console.error("Error rendering graph:", error);
		}
	};

	const deleteSelectedRows = async () => {
		Swal.fire({
			text: "Are you sure you want to delete this weight journal entry?",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Delete",
		}).then(async (result: { isConfirmed: any }) => {
			if (result.isConfirmed) {
				for (const id of selectedRows) {
					const deleteresult = await deleteWeightJournal(id);
				}

				const newData = weight.filter(
					(item: { id: string }) => !selectedRows.includes(item.id)
				);
				setweight(newData);
				setSelectedRows([]);

				router.push("/getWeightJournals");
				Swal.fire({
					title: "Deleted!",
					text: "Your weight journal entry has been deleted.",
					icon: "success",
				});
			}
		});
	};

	const handleSelectAll = () => {
		if (selectAll) {
			setSelectedRows([]);
		} else {
			const allIds = weight.map((item: { id: string }) => item.id);
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
	async function deleteWeightJournals(weightJournalId: string) {
		Swal.fire({
			text: "Are you sure you want to delete this weight journal entry?",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Delete",
		}).then(async (result: { isConfirmed: any }) => {
			if (result.isConfirmed) {
				const deleteresult = await deleteWeightJournal(weightJournalId);
				const newData =
					weight &&
					weight.filter(
						(item: { id: string }) => item.id != weightJournalId
					);
				setweight(newData);
				router.push("/getWeightJournals");
				Swal.fire({
					title: "Deleted!",
					text: "Your weight journal entry has been deleted.",
					icon: "success",
				});
			}
		});
	}

	const [orderdate, setOrderdate] = useState(false);

	const handleOrderDate = () => {
		setOrderdate(!orderdate);
		if (!orderdate && Array.isArray(weight)) {
			const increasingweightData = [...weight].sort(
				(a, b) =>
					new Date(a.date.substring(0, 10) + "T" + a.time).getTime() -
					new Date(b.date.substring(0, 10) + "T" + b.time).getTime()
			);
			setweight(increasingweightData);
		} else if (Array.isArray(weight)) {
			const decreasingOrderweightData = [...weight].sort(
				(a, b) =>
					new Date(b.date.substring(0, 10) + "T" + b.time).getTime() -
					new Date(a.date.substring(0, 10) + "T" + a.time).getTime()
			);
			setweight(decreasingOrderweightData);
		}
	};

	const [orderBMI, setOrderBMI] = useState(false);

	const handleOrderBMI = () => {
		setOrderBMI(!orderBMI);
		if (!orderBMI) {
			const increasingweightData = [...weight].sort(
				(a, b) =>
					parseFloat((a.weight / (a.height / 100) ** 2).toFixed(2)) -
					parseFloat((b.weight / (b.height / 100) ** 2).toFixed(2))
			);

			setweight(increasingweightData);
		} else {
			const decreasingOrderweightData = [...weight].sort(
				(a, b) =>
					parseFloat((b.weight / (b.height / 100) ** 2).toFixed(2)) -
					parseFloat((a.weight / (a.height / 100) ** 2).toFixed(2))
			);
			setweight(decreasingOrderweightData);
		}
	};

	const [orderweight, setOrderWeight] = useState(false);

	const handleOrderWeight = () => {
		setOrderWeight(!orderweight);
		if (!orderweight) {
			const increasingweightData = [...weight].sort(
				(a, b) => a.weight - b.weight
			);
			setweight(increasingweightData);
		} else {
			const decreasingOrderweightData = [...weight].sort(
				(a, b) => b.weight - a.weight
			);
			setweight(decreasingOrderweightData);
		}
	};

	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<SpanHeader
				onClick={() => router.push("/journals")}
				headerText="Weight Journals"></SpanHeader>
			<p className="font-sans text-darkgrey ml-5 text-[14px]">
				Managing your weight helps you stay healthy.
			</p>
			<br></br>
			<p className="font-sans text-darkgrey ml-5 text-[14px]">
				Your BMI can tell you if you’re at risk for certain health
				conditions like heart disease.
			</p>

			{weight && (
				<div className="rounded-3xl bg-white flex flex-col mt-4 mb-44 w-full md:max-w-[800px] md:min-h-[550px] p-4 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
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
									router.push(`/createWeightJournal`)
								}
							/>
						</div>
						<div className="flex items-center">
							<p className="font-sans text-darkgrey ml-2 font-bold text-[14px]">
								Your height:
							</p>
							{weight.length > 0 && weight[0].height && (
								<p className="font-sans text-darkgrey mr-8 font-medium text-[14px]">
									{weight[weight.length - 1].height}cm
								</p>
							)}
						</div>
					</div>
					<br></br>
					<div style={{ marginBottom: "5px", padding: "3px" }}>
						<canvas id="weightChart"></canvas>
					</div>
					<div
						className="flex"
						style={{ justifyContent: "space-between" }}>
						<div className="flex-2" style={{ marginRight: "12%" }}>
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

						<div className="flex-2" style={{ marginRight: "2%" }}>
							<div className="font-sans  text-darkgrey font-bold text-[18px] text-center">
								BMI
								<button
									onClick={handleOrderBMI}
									aria-label="orderBMI">
									{orderBMI ? (
										<MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" />
									) : (
										<MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
									)}
								</button>
							</div>
						</div>
						<div className="flex-2" style={{ marginRight: "10%" }}>
							<div className="font-sans  text-darkgrey font-bold text-[18px] text-center">
								Weight
								<button
									onClick={handleOrderWeight}
									aria-label="orderWeight">
									{orderweight ? (
										<MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" />
									) : (
										<MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
									)}
								</button>
							</div>
						</div>
						<div className="flex-2">
							<input
								type="checkbox"
								checked={selectAll}
								onChange={handleSelectAll}
							/>
						</div>
					</div>
					{weight.map((item: any, index: number) => (
						<div
							key={item.weightJournalId}
							className={`flex justify-between items-center mt-3`}
							style={{
								backgroundColor:
									index % 2 === 0 ? "white" : "#DBE2EA",
							}}
							data-testid="weight-entry"
							onClick={() =>
								router.push(`/getWeightJournals/${item.id}`)
							}>
							<GeneralEntry
								value1={`${formatDate(
									item.date
								)} ${formatMilitaryTime(item.time)}`}
								value2={(
									item.weight /
									(item.height / 100) ** 2
								).toFixed(2)}
								value3={item.weight}></GeneralEntry>

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
											deleteWeightJournals(item.id);
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
			)}
		</div>
	);
}
