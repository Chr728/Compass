"use client";
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
import { deleteMedication, getMedications } from "../http/medicationAPI";

export default function GetMedicationsPage() {
	const logger = require("../../logger");
	const router = useRouter();
	const { user } = useAuth();
	const { userInfo } = useUser();
	const [medication, setmedication] = useState<any>(null);
	const { handlePopUp } = useProp();

	useEffect(() => {
		if (!userInfo) {
			logger.warn("User not found.");
			alert("User not found.");
		}
	}, [userInfo, router]);

	useEffect(() => {
		async function fetchMedications() {
			try {
				const result = await getMedications();
				logger.info("All medications entry retrieved:", result);
				setmedication(result.data);
			} catch (error) {
				handlePopUp(
					"error",
					"Error retrieving medication journal entry:"
				);
			}
		}
		setTimeout(() => {
			fetchMedications();
		}, 500);
	}, [user]);

	async function deleteMedications(medicationId: string) {
		Swal.fire({
			text: "Are you sure you want to delete this medication entry?",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Delete",
		}).then(async (result: { isConfirmed: any }) => {
			if (result.isConfirmed) {
				const deleteresult = await deleteMedication(medicationId);
				const newData =
					medication &&
					medication.filter(
						(item: { id: string }) => item.id != medicationId
					);
				setmedication(newData);
				router.push("/getMedications");
				Swal.fire({
					title: "Deleted!",
					text: "Your medication entry has been deleted.",
					icon: "success",
				});
			}
		});
	}

	const [ordername, setOrderName] = useState(false);

	const handleOrderName = () => {
		setOrderName(!ordername);
		if (!ordername) {
			const increasingOrdermedicationData = [...medication].sort((a, b) =>
				a.medicationName.toLowerCase() < b.medicationName.toLowerCase()
					? -1
					: 1
			);
			setmedication(increasingOrdermedicationData);
		} else {
			const decreasingOrdermedicationData = [...medication].sort((a, b) =>
				a.medicationName.toLowerCase() > b.medicationName.toLowerCase()
					? -1
					: 1
			);
			setmedication(decreasingOrdermedicationData);
		}
	};

	const [orderactivity, setOrderActivity] = useState(false);

	const handleOrderRoute = () => {
		setOrderActivity(!orderactivity);
		if (!orderactivity) {
			const increasingOrdermedicationData = [...medication].sort((a, b) =>
				a.route.toLowerCase() < b.route.toLowerCase() ? -1 : 1
			);
			setmedication(increasingOrdermedicationData);
		} else {
			const decreasingOrdermedicationData = [...medication].sort((a, b) =>
				a.route.toLowerCase() > b.route.toLowerCase() ? -1 : 1
			);
			setmedication(decreasingOrdermedicationData);
		}
	};

	const [orderduration, setOrderDuration] = useState(false);

	const handleOrderDosage = () => {
		setOrderDuration(!orderduration);
		if (!orderduration) {
			const increasingOrdermedicationData = [...medication].sort(
				(a, b) => a.dosage - b.dosage
			);
			setmedication(increasingOrdermedicationData);
		} else {
			const decreasingOrdermedicationData = [...medication].sort(
				(a, b) => b.dosage - a.dosage
			);
			setmedication(decreasingOrdermedicationData);
		}
	};
	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<SpanHeader
				onClick={() => router.push("/health")}
				headerText="Medications"></SpanHeader>
			<p className="font-sans  text-darkgrey ml-5 p-5  text-[14px]">
				Keep track of all medications you take and follow the progress
				through the time.
			</p>
			<br />
			{medication && (
				<div className="rounded-3xl bg-white flex flex-col mt-4 mb-44 w-full md:max-w-[800px] md:min-h-[550px] p-4 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
					<div className="flex justify-between items-center">
						<div>
							<Button
								type="button"
								text="Add an Entry"
								style={{ width: "120px", fontSize: "14px" }}
								onClick={() => router.push(`/createMedication`)}
							/>
						</div>
						<div>
							<Button
								type="button"
								text="Identify a Pill"
								style={{
									width: "120px",
									fontSize: "14px",
									float: "right",
								}}
								onClick={() => router.push(`/pillIdentifier`)}
							/>
						</div>
					</div>
					<br></br>

					<div
						className="flex"
						style={{ justifyContent: "space-between" }}>
						<div className="flex-1">
							<div className="font-sans ml-1 font-bold text-darkgrey text-[18px] text-start ">
								Name
								<button
									onClick={handleOrderName}
									aria-label="orderName">
									{orderactivity ? (
										<MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" />
									) : (
										<MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
									)}
								</button>
							</div>
						</div>
						<div className="flex-2">
							<div className="font-sans  font-bold  text-darkgrey text-[18px] ml-1 text-start">
								Dosage
								<button
									onClick={handleOrderDosage}
									aria-label="orderDosage">
									{orderduration ? (
										<MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" />
									) : (
										<MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
									)}
								</button>
							</div>
						</div>
						<div className="flex-1" style={{ marginRight: "5%" }}>
							<div className="font-sans font-bold text-darkgrey text-[18px] ml-3 text-start">
								Route
								<button
									onClick={handleOrderRoute}
									aria-label="orderRoute">
									{orderactivity ? (
										<MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" />
									) : (
										<MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
									)}
								</button>
							</div>
						</div>
					</div>

					{medication.map((item: any, index: number) => (
						<div
							key={item.medicationId}
							className={`flex justify-between items-center mt-3`}
							style={{
								backgroundColor:
									index % 2 === 0 ? "white" : "#DBE2EA",
							}}
							onClick={() =>
								router.push(`/getMedications/${item.id}`)
							}>
							<div className="flex-1">
								<p className="font-sans  ml-2 font-medium text-darkgrey text-[14px]  text-start ">
									{item.medicationName.length > 8 ? (
										<span className="break-words">
											{item.medicationName}
										</span>
									) : (
										item.medicationName
									)}
								</p>
							</div>
							<div className="flex-1">
								<p className="font-sans ml-5  font-medium text-darkgrey text-[14px] text-center">
									{item.dosage}
								</p>
							</div>

							<div className="flex-1">
								<p className="font-sans ml-2 mr-1 font-medium text-darkgrey text-[14px]  text-center">
									{item.route}
								</p>
							</div>

							<div
								className="flex icons"
								style={{
									marginLeft: "5px",
									marginRight: "5px",
									marginTop: "-2%",
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
											deleteMedications(item.id);
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
