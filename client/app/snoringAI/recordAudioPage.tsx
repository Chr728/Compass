"use client";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import localforage from "localforage";
import { default as Image, default as NextImage } from "next/image";
import { useRouter } from "next/navigation";
import Peaks from "peaks.js";
import { useEffect, useRef, useState } from "react";
import { MdKeyboardArrowDown } from "react-icons/md";
import Swal from "sweetalert2";
import Header from "../components/Header";
import RedButton from "../components/RedButton";
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
import "./WaveformView.css";

<script src="https://unpkg.com/peaks.js/dist/peaks.js"></script>;
declare global {
	interface Window {
		webkitAudioContext: typeof AudioContext;
	}
}

export default function RecordAudioPage() {
	const peaksRef = useRef(null);
	const [audio, setaudio] = useState<any>(null);
	const waveformContainerRef = useRef(null);
	const [selectedAudioBlobURL, setSelectedAudioBlobURL] = useState<
		string | null
	>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const audioRef = useRef(null); // Create a ref for the audio element

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
				console.log("Adir", entryData.data);
				const audioURL = entryData.data.filename;
				const binaryResult = entryData.data.result;
				console.log(audioURL, binaryResult);

				// loadAudioAndRenderWaveform(audioURL, binaryResult);
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

	console.log("HEEEEEEEEEE", entries);
	// loadAudioAndRenderWaveform(
	// 	URL.createObjectURL(entryData.data.filename),
	// 	entryData.data.result
	// );

	const handlePlayClick = async (
		audioTimestamp: string,
		binaryResult: string[]
	) => {
		console.log("Filename: ", audioTimestamp);
		console.log("Result: ", binaryResult);
		// Retrieve the audio blob from IndexedDB
		const audioBlob = (await localforage.getItem(audioTimestamp)) as Blob;
		console.log("AudioBlob: ", audioBlob);

		// Create a URL for the blob
		const blobURL = URL.createObjectURL(audioBlob);

		// Create a new audio element and set its source to the blob URL
		const audioElement = new Audio(blobURL);

		// Play the audio
		audioElement.play();
		loadAudioAndRenderWaveform(audioTimestamp, binaryResult);
	};

	const loadAudioAndRenderWaveform = async (
		audioTimestamp: string,
		binaryResult: string[]
	) => {
		const overviewContainer = document.getElementById("overview-container");
		console.log("audioTimestamp", audioTimestamp);
		const audioBlob = (await localforage.getItem(audioTimestamp)) as Blob;
		if (!overviewContainer) {
			console.error("Error: Overview container not found.");
			return;
		}

		// Create an audio element and load the audio blob
		console.log(audioBlob);
		const blobURL = URL.createObjectURL(audioBlob);
		const audioElement = new Audio(blobURL);

		audioElement.addEventListener("loadedmetadata", () => {
			Peaks.init({}, (error: any, peaksInstance: any) => {
				if (error) {
					console.error("Error initializing Peaks.js:", error);
				} else {
					console.log("Peaks.js initialized successfully");
					peaksInstance.load([audioTimestamp]);
					const hasSnoringDetected = binaryResult.some(
						(value) => parseInt(value) === 1
					);
					if (hasSnoringDetected) {
						peaksInstance.zoomview.setWaveformColor("green");
					} else {
						peaksInstance.zoomview.setWaveformColor("red");
					}
				}
			});
		});

		audioElement.load();
	};

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
				console.log("JIAYI ", results);
				const data = {
					date: currentRecordingDate,
					filename: timestamp, // save the timestamp as the filename
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
			<span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-2">
				<button onClick={() => router.push("/health")}>
					<Header headerText="Snoringdddddddddd AI"></Header>
				</button>
			</span>
			{/* <canvas id="waveformCanvas" width="500" height="500"></canvas>{" "} */}
			<div
				id="zoomview-container"
				style={{ width: "100%", height: "auto" }}></div>
			<div
				id="overview-container"
				style={{ width: "100%", height: "auto" }}></div>
			<audio id="audio">
				<source src="sample.mp3" type="audio/wav" />
				<source src="sample.ogg" type='audio/ogg codecs="vorbis"' />
			</audio>
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
										{/* Submit button should save and submit the audio both */}
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
								<Table stickyHeader aria-label="sticky table">
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
														{formatDate(row.date)}
													</TableCell>
													<TableCell>
														{row.result}
													</TableCell>

													<TableCell>
														<div className="flex items-center">
															<Image
																src="/icons/resultDisplay.svg"
																alt="Play icon to display results"
																width={10}
																height={10}
																className="mr-4 md:hidden"
																style={{
																	width: "auto",
																	height: "auto",
																	cursor: "pointer",
																}}
																onClick={() =>
																	handlePlayClick(
																		row.filename,
																		JSON.parse(
																			row.result
																		)
																	)
																}
															/>

															{/* Adjust width and height as needed */}
															{/* Container for Peaks.js waveform */}
															{/* <div id="waveform-container">
																<div id="overview-container"></div>
															</div> */}
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
		</div>
	);
}

// const handlePlayClick = async (audioTimestamp: string, binaryResult: string[]) => {
// 	console.log("Filename: ", audioTimestamp);
// 	console.log("Result: ", binaryResult);
// 	// Retrieve the audio blob from IndexedDB
// 	const audioBlob = await localforage.getItem(audioTimestamp) as Blob;
// 	console.log("AudioBlob: ", audioBlob)

// 	// Create a URL for the blob
// 	const blobURL = URL.createObjectURL(audioBlob);

// 	// Create a new audio element and set its source to the blob URL
// 	const audioElement = new Audio(blobURL);

// 	// Play the audio
// 	audioElement.play();
// 	// loadAudioAndRenderWaveform(audioTimestamp, binaryResult);
// };

// const loadAudioAndRenderWaveform = async (
// 	audioTimestamp: string,
// 	binaryResult: string[]
// ) => {
// 	const overviewContainer = document.getElementById("overview-container");
// 	console.log("audioTimestamp", audioTimestamp);
// 	const audioBlob = await localforage.getItem(audioTimestamp) as Blob;
// 	if (!overviewContainer) {
// 		console.error("Error: Overview container not found.");
// 		return;
// 	}

// 	// Create an audio element and load the audio blob
// 	console.log(audioBlob);
// 	const blobURL = URL.createObjectURL(audioBlob);
// 	const audioElement = new Audio(blobURL);

// 	audioElement.addEventListener("loadedmetadata", () => {
// 		Peaks.init({}, (error: any, peaksInstance: any) => {
// 			if (error) {
// 				console.error("Error initializing Peaks.js:", error);
// 			} else {
// 				console.log("Peaks.js initialized successfully");
// 				peaksInstance.load([audioTimestamp]);
// 				const hasSnoringDetected = binaryResult.some(
// 					(value) => parseInt(value) === 1
// 				);
// 				if (hasSnoringDetected) {
// 					peaksInstance.zoomview.setWaveformColor("green");
// 				} else {
// 					peaksInstance.zoomview.setWaveformColor("red");
// 				}
// 			}
// 		});
// 	});

// 	audioElement.load();
// };

// // Function to render waveform
// 	const renderWaveform = (audioURL: string) => {
// 		const canvas = document.getElementById(
// 			"waveformCanvas"
// 		) as HTMLCanvasElement;
// 		const ctx = canvas.getContext("2d");
// 		const audio = new Audio(audioURL);

// 		audio.addEventListener("loadedmetadata", () => {
// 			const duration = audio.duration;
// 			const width = canvas.width;
// 			const height = canvas.height;
// 			if (ctx === null) {
// 				return;
// 			}
// 			ctx.clearRect(0, 0, width, height);

// 			audio.addEventListener("play", () => {
// 				const draw = () => {
// 					const currentTime = audio.currentTime;
// 					const x = (currentTime / duration) * width;

// 					ctx.clearRect(0, 0, width, height);
// 					ctx.fillStyle = "#ccc"; // Default color
// 					ctx.fillRect(0, 0, x, height);

// 					requestAnimationFrame(draw);
// 				};

// 				draw();
// 			});

// 			audio.play();
// 		});
// 	};
