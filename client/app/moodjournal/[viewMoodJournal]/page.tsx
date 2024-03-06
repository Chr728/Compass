"use client";
import Header from "@/app/components/Header";
import {
	formatDate,
	formatMilitaryTime,
} from "@/app/helpers/utils/datetimeformat";
import Typography from "@mui/material/Typography";
import Chart from "chart.js/auto";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../contexts/UserContext";
import { getMoodJournal } from "../../http/moodJournalAPI";

export default function GetMoodJournal({
	params: { viewMoodJournal },
}: {
	params: { viewMoodJournal: string };
}) {
	const logger = require("../../../logger");
	const { user } = useAuth();
	const router = useRouter();
	const { userInfo } = useUser();
	const [mood, setMood] = useState<any>(null);
	let chartInstance: Chart<"line", any, unknown> | null = null;

	async function fetchMoodJournal() {
		try {
			const result = await getMoodJournal(viewMoodJournal);
			logger.info("Mood journal entry retrieved:", result);
			const updatedStressSignals = JSON.parse(result.data.stressSignals);
			const updatedMoodData = {
				...result.data,
				stressSignals: updatedStressSignals,
			};
			logger.info("Updated mood data:", updatedMoodData);
			setMood(updatedMoodData);
		} catch (error) {
			logger.error("Error retrieving mood journal entry:", error);
		}
	}

	useEffect(() => {
		renderGraph();
	}, [mood]); // Re-render the graph when the mood data changes

	const renderGraph = () => {
		const canvas = document.getElementById(
			"moodChart"
		) as HTMLCanvasElement | null;
		if (canvas) {
			const ctx = canvas.getContext("2d");
			if (ctx) {
				const moodValues = mood.map((item: { howAreYou: string }) => {
					switch (item.howAreYou) {
						case "Awesome":
							return 5;
						case "Good":
							return 4;
						case "Meh":
							return 3;
						case "Bad":
							return 2;
						case "Awful":
							return 1;
					}
				});

				// Destroy existing chart instance if exists
				if (chartInstance) {
					chartInstance.destroy();
				}

				setTimeout(() => {
					chartInstance = new Chart(ctx, {
						type: "line",
						data: {
							labels: mood.map(
								(item: any, index: number) => index + 1
							),
							datasets: [
								{
									label: "Mood",
									data: moodValues,
									borderColor: "rgba(75, 192, 192, 1)",
									tension: 0.1,
								},
							],
						},
						options: {
							scales: {
								y: {
									beginAtZero: true,
									suggestedMax: 5, // Maximum value of y-axis
								},
							},
						},
					});
				}, 100);
			} else {
				console.error("Could not get 2D context for canvas element.");
			}
		} else {
			console.error("Could not find canvas element with id 'moodChart'.");
		}
	};

	useEffect(() => {
		if (!user) {
			router.push("/login");
			alert("User not found.");
		}
		if (user) {
			fetchMoodJournal();
		}
	}, []);

	return (
		mood && (
			<div className="bg-eggshell min-h-screen flex flex-col">
				<span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
					<button onClick={() => router.push("/moodjournal")}>
						<Header headerText="View Journal Entry"></Header>
					</button>
				</span>

				<div
					className="w-11/12 rounded-3xl 
              bg-white flex flex-col space-y-4 mt-2 self-center	text-black
              shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
					style={{ overflowY: "auto", maxHeight: "480px" }}>
					<div style={{ marginBottom: "10px", padding: "3px" }}>
						<canvas id="weightChart"></canvas>
					</div>
					<Typography variant="body1" ml={2} mt={2} color="black">
						<b>Date:</b> {formatDate(mood.date)}
					</Typography>
					<Typography variant="body1" ml={2} mt={2} color="black">
						<b>Time:</b> {formatMilitaryTime(mood.time)}
					</Typography>
					<Typography variant="body1" ml={2} color="black">
						<b>How Were You:</b> {mood.howAreYou}
					</Typography>
					<Typography variant="body1" ml={2} color="black">
						<b>Stress Signals:</b>
					</Typography>
					<Typography variant="body1" ml={4} color="black">
						<b>I feel tired:</b> {mood.stressSignals.tired}
					</Typography>
					<Typography variant="body1" ml={4} color="black">
						<b>I'm not sleeping well:</b> {mood.stressSignals.tired}
					</Typography>
					<Typography variant="body1" ml={4} color="black">
						<b>I'm not hungry:</b> {mood.stressSignals.tired}
					</Typography>
					<Typography variant="body1" ml={4} color="black">
						<b>I ate too much:</b> {mood.stressSignals.tired}
					</Typography>
					<Typography variant="body1" ml={4} color="black">
						<b>I feel sad or depressed:</b>{" "}
						{mood.stressSignals.tired}
					</Typography>
					<Typography variant="body1" ml={4} color="black">
						<b>I feel like things are just too much:</b>{" "}
						{mood.stressSignals.tired}
					</Typography>
					<Typography variant="body1" ml={4} color="black">
						<b>I have trouble paying attention:</b>{" "}
						{mood.stressSignals.tired}
					</Typography>
					<Typography variant="body1" ml={4} color="black">
						<b>I feel nervous or anxious:</b>{" "}
						{mood.stressSignals.tired}
					</Typography>
					<Typography variant="body1" ml={4} color="black">
						<b>I feel angry or irritated:</b>{" "}
						{mood.stressSignals.tired}
					</Typography>
					<Typography variant="body1" ml={4} color="black">
						<b>I get headaches and/or colds:</b>{" "}
						{mood.stressSignals.tired}
					</Typography>
					<Typography variant="body1" ml={4} color="black">
						<b>Notes:</b> {mood.notes}
					</Typography>

					<div className="mt-10 pb-4 self-center">
						<Button
							type="button"
							text="Edit"
							style={{ width: "140px" }}
							onClick={() =>
								router.push(
									`/moodjournal/${viewMoodJournal}/${viewMoodJournal}`
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
							onClick={() => router.push(`/moodjournal`)}
						/>
					</div>
				</div>
			</div>
		)
	);
}
