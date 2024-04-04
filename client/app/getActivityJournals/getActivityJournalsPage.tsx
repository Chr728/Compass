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
import { formatDate } from "../helpers/utils/datetimeformat";
import {
	deleteActivityJournal,
	getActivityJournals,
} from "../http/activityJournalAPI";

export default function GetActivityJournalsPage() {
	const logger = require("../../logger");
	const router = useRouter();
	const { user } = useAuth();
	const { userInfo } = useUser();
	const [activity, setactivity] = useState<any>(null);
	const { handlePopUp } = useProp();
	const [selectAll, setSelectAll] = useState(false);
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	useEffect(() => {
		if (!userInfo) {
			logger.warn("User not found.");
			alert("User not found.");
		}
	}, [userInfo, router]);

	useEffect(() => {
		async function fetchActivityJournals() {
			try {
				const result = await getActivityJournals();
				logger.info("All Activity journals entry retrieved:", result);
				setactivity(result.data);
			} catch (error) {
				handlePopUp(
					"error",
					"Error retrieving activity journal entry:"
				);
			}
		}
		setTimeout(() => {
			fetchActivityJournals();
		}, 1000);
	}, [user]);

	const deleteSelectedRows = async () => {
		Swal.fire({
			text: "Are you sure you want to delete this activity journal entry?",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Delete",
		}).then(async (result: { isConfirmed: any }) => {
			if (result.isConfirmed) {
				for (const id of selectedRows) {
					const deleteresult = await deleteActivityJournal(id);
				}

				const newData = activity.filter(
					(item: { id: string }) => !selectedRows.includes(item.id)
				);
				setactivity(newData);
				setSelectedRows([]);

				router.push("/getActivityJournals");
				Swal.fire({
					title: "Deleted!",
					text: "Your activity journal entry has been deleted.",
					icon: "success",
				});
			}
		});
	};

	const handleSelectAll = () => {
		if (selectAll) {
			setSelectedRows([]);
		} else {
			const allIds = activity.map((item: { id: string }) => item.id);
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
	async function deleteActivityJournals(activityJournalId: string) {
		Swal.fire({
			text: "Are you sure you want to delete this activity journal entry?",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Delete",
		}).then(async (result: { isConfirmed: any }) => {
			if (result.isConfirmed) {
				const deleteresult = await deleteActivityJournal(
					activityJournalId
				);
				const newData =
					activity &&
					activity.filter(
						(item: { id: string }) => item.id != activityJournalId
					);
				setactivity(newData);
				router.push("/getActivityJournals");
				Swal.fire({
					title: "Deleted!",
					text: "Your activity journal entry has been deleted.",
					icon: "success",
				});
			} else {
				router.push("/getActivityJournals");
			}
		});
	}

	const [orderdate, setOrderDate] = useState(false);

	const handleOrderDate = () => {
		setOrderDate(!orderdate);
		if (!orderdate) {
			const increasingOrderactivityData = [...activity].sort(
				(a, b) =>
					new Date(a.date).getTime() - new Date(b.date).getTime()
			);
			setactivity(increasingOrderactivityData);
		} else {
			const decreasingOrderactivityData = [...activity].sort(
				(a, b) =>
					new Date(b.date).getTime() - new Date(a.date).getTime()
			);
			setactivity(decreasingOrderactivityData);
		}
	};

	const [orderactivity, setOrderActivity] = useState(false);

	const handleOrderActivity = () => {
		setOrderActivity(!orderactivity);
		if (!orderactivity) {
			const increasingOrderactivityData = [...activity].sort((a, b) =>
				a.activity.toLowerCase() < b.activity.toLowerCase() ? -1 : 1
			);
			setactivity(increasingOrderactivityData);
		} else {
			const decreasingOrderactivityData = [...activity].sort((a, b) =>
				a.activity.toLowerCase() > b.activity.toLowerCase() ? -1 : 1
			);
			setactivity(decreasingOrderactivityData);
		}
	};

	const [orderduration, setOrderDuration] = useState(false);

	const handleOrderUnit = () => {
		setOrderDuration(!orderduration);
		if (!orderduration) {
			const increasingOrderactivityData = [...activity].sort(
				(a, b) => a.duration - b.duration
			);
			setactivity(increasingOrderactivityData);
		} else {
			const decreasingOrderactivityData = [...activity].sort(
				(a, b) => b.duration - a.duration
			);
			setactivity(decreasingOrderactivityData);
		}
	};
	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<SpanHeader
				onClick={() => router.push("/journals")}
				headerText="Activity Journals"></SpanHeader>
			<p className="font-sans  text-darkgrey ml-5 p-5  text-[14px]">
				Manage your daily activities to help you stay fit. People with
				active lifestyles are often happier and healthier.{" "}
			</p>
			<br></br>

			{activity && (
				<div className="rounded-3xl bg-white flex flex-col mt-4 mb-44 w-full md:max-w-[800px] md:min-h-[550px] p-4 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
					<div className="flex justify-between items-center">
						<div>
							<Button
								type="button"
								text="Add an Entry"
								style={{ width: "120px", fontSize: "14px" }}
								onClick={() =>
									router.push(`/createActivityJournal`)
								}
							/>
						</div>
					</div>
					<br></br>

					<div
						className="flex"
						style={{ justifyContent: "space-between" }}>
						<div className="flex-2">
							<div className="font-sans  font-bold text-darkgrey text-[18px] text-center ">
								Date
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
						<div className="flex-2">
							<div className="font-sans  font-bold  text-darkgrey text-[18px] ml-14 text-center">
								Activity
								<button
									onClick={handleOrderActivity}
									aria-label="orderActivity">
									{orderactivity ? (
										<MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" />
									) : (
										<MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
									)}
								</button>
							</div>
						</div>
						<div className="flex-2">
							<div className="font-sans font-bold text-darkgrey text-[18px] ml-2 text-center">
								Duration
								<button
									onClick={handleOrderUnit}
									aria-label="orderUnit">
									{orderduration ? (
										<MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" />
									) : (
										<MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
									)}
								</button>
							</div>
						</div>
						<div
							className="flex-2 mt-2 mr-2"
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

					{activity.map((item: any, index: number) => (
						<div
							key={item.activityJournalId}
							className={`flex justify-between items-center mt-3`}
							style={{
								backgroundColor:
									index % 2 === 0 ? "white" : "#DBE2EA",
							}}
							data-testid="activity-entry"
							onClick={() =>
								router.push(`/getActivityJournals/${item.id}`)
							}>
							<div className="flex-2">
								<p className="font-sans  font-medium text-darkgrey text-[14px]  text-center ">
									{formatDate(item.date)}
								</p>
							</div>
							<div className="flex-1">
								<p className="font-sans ml-5 font-medium text-darkgrey text-[14px] text-center">
									{item.activity.length > 10 ? (
										<span className="break-words">
											{item.activity}
										</span>
									) : (
										item.activity
									)}
								</p>
							</div>

							<div className="flex-1">
								<p className="font-sans ml-3 font-medium text-darkgrey text-[14px]  text-center">
									{item.duration}
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
											deleteActivityJournals(item.id);
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
