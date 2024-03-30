"use client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chart from "chart.js/auto";
import localforage from "localforage";
import { default as Image, default as NextImage } from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import Swal from "sweetalert2";
import Button from "../components/Button";
import RedButton from "../components/RedButton";
import SpanHeader from "../components/SpanHeader";
import { useAuth } from "../contexts/AuthContext";
import { useProp } from "../contexts/PropContext";
import {
	formatDate,
	formatDateYearMonthDate,
} from "../helpers/utils/datetimeformat";
import {
	createAudioEntry,
	deleteAudioEntry,
	getAudioEntries,
	getAudioEntry,
	sendAudio,
} from "../http/snoreAPI";

export default function RecordAudioPage() {
	const [audio, setaudio] = useState<any>(null);
	const [selectedAudioBlobURL, setSelectedAudioBlobURL] = useState<
		string | null
	>(null);

	const logger = require("../../logger");
	const { user } = useAuth();
	const { handlePopUp } = useProp();
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const [recording, setRecording] = useState(false);
	const [itemRecorded, setItemRecorded] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);
	const [timer, setTimer] = useState(0);
	const [currentRecordingDate, setCurrentRecordingDate] =
		useState<string>("");
	const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(
		null
	);
	const [recordedAudioBlob, setRecordedAudioBlob] = useState<Blob | null>(
		null
	);
	const [entries, setEntries] = useState<any>();
	const [timestamp, setTimestamp] = useState<string>("");

	async function deleteAudioEntryFunction(audioEntryID: string) {
		Swal.fire({
			text: "Are you sure you want to delete this audio entry?",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Delete",
		}).then(async (result: { isConfirmed: any }) => {
			// Retrieving the audio entry to be deleted
			const entryToBeDeleted = await getAudioEntry(audioEntryID);
			if (result.isConfirmed) {
				const deleteresult = await deleteAudioEntry(audioEntryID);

				const audioEntry = entryToBeDeleted.data;
				const existingAudioData = JSON.parse(
					localStorage.getItem("savedAudio") || "[]"
				);
				const deletedEntry = existingAudioData.find(
					(item: any) => item === audioEntry.filename
				);
				if (deletedEntry) {
					const updatedAudioData = existingAudioData.filter(
						(item: any) => item !== deletedEntry
					);
					localStorage.setItem(
						"savedAudio",
						JSON.stringify(updatedAudioData)
					);
				}

				const newEntries = await getAudioEntries();
				setEntries(newEntries.data);
				router.push("/snoringAI");
				Swal.fire({
					title: "Deleted!",
					text: "Your audio entry has been deleted.",
					icon: "success",
				});
			} else {
				router.push("/snoringAI");
			}
		});
	}

	useEffect(() => {
		if (!user) router.push("/login");
	}, [user]);

	useEffect(() => {
		let interval: any;

		if (recording) {
			interval = setInterval(() => {
				setTimer((prevTimer) => prevTimer + 1);
			}, 1000);
		} else {
			clearInterval(interval);
			setTimer(0);
		}

		return () => clearInterval(interval);
	}, [recording]);

	useEffect(() => {
		async function fetchAudioEntries() {
			try {
				const userId = user?.uid || "";
				const entryData = await getAudioEntries();
				logger.info("All entries retrieved:", entryData.data);
				setEntries(entryData.data);

				const audioURL = entryData.data.filename;
				const binaryResult = entryData.data.result;

				setaudio(URL.createObjectURL(entryData.data));
			} catch (error) {
				logger.error("Error fetching journal", error);
			}
		}
		fetchAudioEntries();
	}, [user, itemRecorded]);

	const formatTimer = (seconds: any) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${
			remainingSeconds < 10 ? "0" : ""
		}${remainingSeconds}`;
	};

	const router = useRouter();

	const handleRecordClick = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});

			const mediaRecorder = new MediaRecorder(stream);
			mediaRecorderRef.current = mediaRecorder;

			setCurrentRecordingDate(formatDateYearMonthDate(new Date()));

			mediaRecorder.ondataavailable = async (event) => {
				if (event.data.size > 0) {
					const audioBlob = new Blob([event.data], {
						type: "audio/wav",
					});
					const timestamp = new Date().toISOString();

					// Save the Blob in IndexedDB with the timestamp as the key
					await localforage.setItem(timestamp, audioBlob);
					setRecordedAudioBlob(audioBlob);
					setTimestamp(timestamp); // save the timestamp to be used later in submission if it happens
				}
			};

			mediaRecorder.start();
			setRecording(true);
		} catch (error) {
			console.error("Error accessing microphone:", error);
		}
	};

	const handleStopClick = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.onstop = () => {
				mediaRecorderRef.current = null;
			};

			mediaRecorderRef.current.stop();
			setRecording(false);
			setItemRecorded(true);

			if (timerInterval !== null) {
				clearInterval(timerInterval);
				setTimerInterval(null);
			}
		}
	};
	const handleCancelClick = () => {
		setItemRecorded(false);
		setRecordedAudioBlob(null);
		setRecording(false);
	};

	const [chartInstance, setChartInstance] = useState<Chart | null>(null);
	const [showGraph, setShowGraph] = useState(false);

	const handlePlayClick = async (
		audioTimestamp: string,
		binaryResult: string[]
	) => {
		const audioBlob = (await localforage.getItem(audioTimestamp)) as Blob;

		const blobURL = URL.createObjectURL(audioBlob);

		const audioElement = new Audio(blobURL);

		clearChart();

		plotParabolicGraph(binaryResult);
	};

	const plotParabolicGraph = (binaryResult: string[]) => {
		const canvas = document.getElementById(
			"parabolic-graph"
		) as HTMLCanvasElement;
		if (!canvas) {
			console.error("Canvas element not found");
			return;
		}

		const ctx = canvas.getContext("2d");
		if (!ctx) {
			console.error("Canvas context not available");
			return;
		}

		const duration = binaryResult.length * 16;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const timeAxis: number[] = [];
		const amplitude: number[] = [];

		for (let t = 0; t < duration; t += 16) {
			timeAxis.push(t);
			const index = Math.floor(t / 16);
			if (index >= binaryResult.length) {
				console.log("Reached end of binary result data");
				break;
			}
			const binaryValue = binaryResult[index];
			const numericValue = parseInt(binaryValue, 10);
			amplitude.push(numericValue);
		}

		const newChartInstance = new Chart(ctx, {
			type: "line",
			data: {
				labels: timeAxis,
				datasets: [
					{
						label: "Graph",
						data: amplitude,
						borderColor: "red",
						borderWidth: 2,
						tension: 0.3,
					},
					{
						label: "Snoring Detected",
						data: amplitude.map((value) =>
							value === 1 ? 1 : null
						),
						backgroundColor: "#00FF00",
						borderColor: "#00FF00",
						borderWidth: 0.01,
						type: "bar",
					},
				],
			},
			options: {
				scales: {
					x: {
						title: {
							display: true,
							text: "Time (s)",
						},
						ticks: {
							stepSize: 16, // Each tick represents 16 seconds
						},
					},
					y: {
						title: {
							display: true,
							text: "Amplitude",
						},
						min: 0,
						max: 1,
						ticks: {
							stepSize: 1,
						},
					},
				},
			},
		});

		setChartInstance(newChartInstance);
	};

	const clearChart = () => {
		if (chartInstance) {
			chartInstance.destroy();
		}
	};

	const handleBackButtonClick = () => {
		setShowGraph(false);
	};
	useEffect(() => {
		return () => {
			if (chartInstance) {
				chartInstance.destroy();
			}
		};
	}, []);
	const handleSubmit = async () => {
		const existingAudioData = JSON.parse(
			localStorage.getItem("savedAudio") || "[]"
		);

		if (recordedAudioBlob) {
			const blobURL = URL.createObjectURL(recordedAudioBlob);
			existingAudioData.push(blobURL);
			localStorage.setItem(
				"savedAudio",
				JSON.stringify(existingAudioData)
			);

			try {
				const response = await sendAudio(recordedAudioBlob);
				const results = await response.json();
				const resultsArray = results.results;
				const snoringDetected = resultsArray.includes(1);
				const data = {
					date: currentRecordingDate,
					filename: timestamp,
					result: JSON.stringify(resultsArray),
				};
				const result = await createAudioEntry(data);

				setRecording(false);
				setItemRecorded(false);
			} catch (error) {
				handlePopUp("error", "Error creating audio entry.");
			}
		}
	};

	return (
		<div className="bg-eggshell min-h-screen flex flex-col w-full overflow-y-auto">
			<SpanHeader
				onClick={() => router.push("/health")}
				headerText="Snoring AI"></SpanHeader>
			{!showGraph ? (
				<div className="flex flex-col justify-center">
					{(recording || itemRecorded) && (
						<>
							{currentRecordingDate && (
								<p className="text-sm text-darkgrey mt-1 mx-auto">
									Recording Date: {currentRecordingDate}
								</p>
							)}
							<div className="flex flex-col p-4">
								<NextImage
									src="/icons/microphone.svg"
									alt="Microphone Icon"
									width={100}
									height={100}
									className={
										!itemRecorded ? "animate-pulse" : " "
									}
									style={{ width: "100%", height: "auto" }}
								/>
								{isPlaying && (
									<p className="text-sm text-darkgrey mt-1">
										Playing
									</p>
								)}
								{!isPlaying && (
									<div className="mt-2 text-center text-red mb-4">
										{formatTimer(timer)}
									</div>
								)}

								<div className="flex flex-col space-y-2 mt-auto mb-24 items-center">
									{!itemRecorded && (
										<RedButton
											type="button"
											text="Stop"
											onClick={handleStopClick}
										/>
									)}
									{itemRecorded && (
										<>
											<RedButton
												type="button"
												text="Submit"
												onClick={handleSubmit}
											/>
										</>
									)}

									<RedButton
										type="button"
										text="Cancel"
										onClick={handleCancelClick}
									/>
								</div>
							</div>
						</>
					)}

					{!recording && !itemRecorded && (
						<>
							<div
								className="relative self-center"
								onClick={handleRecordClick}>
								<NextImage
									src="/icons/record.svg"
									alt="Record Audio Icon"
									width={250}
									height={250}
									style={{ width: "auto", height: "auto" }}
								/>
								<p className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-[24px] text-white font-bold">
									Record
								</p>
							</div>
							<div className="alternatingRowColor h-[440px]">
								<TableContainer sx={{ maxHeight: 440 }}>
									<Table
										stickyHeader
										aria-label="sticky table">
										<TableHead>
											<TableRow>
												<TableCell>
													<div className="font-bold">
														Date
														<button aria-label="recordingDate">
															<MdKeyboardArrowDown className="inline-block text-2xl text-darkgrey" />
														</button>
													</div>
												</TableCell>
												<TableCell>
													<div className="font-bold">
														Result
														<button aria-label="recordingResult">
															<MdKeyboardArrowDown className="inline-block text-2xl text-darkgrey" />
														</button>
													</div>
												</TableCell>
												<TableCell></TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{entries &&
												Array.isArray(entries) &&
												entries.map((row, index) => (
													<TableRow key={index}>
														<TableCell
															component="th"
															scope="row">
															{formatDate(
																row.date
															)}
														</TableCell>
														<TableCell>
															{JSON.parse(
																row.result
															).includes(1)
																? "Snoring Detected"
																: "No Snoring Detected"}
														</TableCell>

														<TableCell>
															<div className="flex items-center">
																<div>
																	<Image
																		src="/icons/resultDisplay.svg"
																		alt="Play icon to display results"
																		width={
																			10
																		}
																		height={
																			10
																		}
																		className="mr-4 md:hidden"
																		style={{
																			width: "auto",
																			height: "auto",
																			cursor: "pointer",
																		}}
																		onClick={() => {
																			setShowGraph(
																				true
																			);
																			handlePlayClick(
																				row.filename,
																				JSON.parse(
																					row.result
																				)
																			);
																		}}
																		data-testid="play-icon"
																	/>
																</div>

																<Image
																	src="/icons/trash.svg"
																	alt="Trash icon"
																	width={10}
																	height={10}
																	className="mr-4 md:hidden"
																	style={{
																		width: "auto",
																		height: "auto",
																	}}
																	onClick={(
																		event
																	) => {
																		event.stopPropagation();
																		deleteAudioEntryFunction(
																			row.id
																		);
																	}}
																/>
															</div>
														</TableCell>
													</TableRow>
												))}{" "}
										</TableBody>
									</Table>
								</TableContainer>
							</div>
						</>
					)}
				</div>
			) : (
				<div>
					<canvas
						id="parabolic-graph"
						width="500"
						height="350"
						data-testid="parabolic-graph"></canvas>

					<div className="items-center">
						<Button
							type="button"
							text="Go Back"
							onClick={handleBackButtonClick}
							style={{
								width: "140px",
							}}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
