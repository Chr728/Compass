"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "swiper/css";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { useProp } from "../contexts/PropContext";
import { useUser } from "../contexts/UserContext";
import { scrape } from "../http/emergencySituationAPI";
export default function EmergencySituation() {
	const logger = require("../../logger");
	const router = useRouter();
	const { user } = useAuth();

	const { userInfo } = useUser();
	const [emergency, setemergency] = useState<any>(null);
	const { handlePopUp } = useProp();
	useEffect(() => {
		if (!userInfo) {
			logger.warn("User not found.");
			alert("User not found.");
		}
	}, [userInfo, router]);

	useEffect(() => {
		async function fetchEmergencyInfo() {
			try {
				const userId = user?.uid || "";
				const result = await scrape();
				logger.info("All info retrieved:", result);

				console.log("jhgukgukgukgug", result);

				console.log("Type of result:", typeof result.data);

				setemergency(result);
			} catch (error) {
				handlePopUp("error", "Error retrieving info:");
			}
		}

		fetchEmergencyInfo();
	}, [user]);
	console.log("emergency:", emergency);

	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
				<button onClick={() => router.push("/health")}>
					<Header headerText="Emergency Rooms"></Header>
				</button>
			</span>
			<div className="font-bold text-start text-darkgrey p-3 text-[20px]">
				Last Updated
			</div>

			{emergency && (
				<div className="rounded-3xl bg-white flex flex-col mt-4 mb-44 w-full md:max-w-[800px] md:min-h-[550px] p-4 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
					{emergency.map((item: any, index: number) => (
						<div
							className="rounded-3xl relative bg-white flex flex-col mt-4 mb-5 w-full md:max-w-[800px] md:min-h-[550px] p-2 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
							key={index}>
							<div>
								<div className="flex justify-between pr-10">
									<div>
										<p className="font-sans font-bold text-darkgrey text-[16px] text-start">
											{item.hospital_name}
										</p>
										<p className="font-sans font-medium text-darkgrey text-[14px] text-start">
											{item.hospital_address}
										</p>
										<p className="font-sans font-medium text-darkgrey text-[14px] text-start">
											{item.arrondissementLines}
										</p>
									</div>
									<div className="flex items-end absolute top-0 right-0 pl-3">
										{parseFloat(item.stretcher_occupancy) <=
											70 && (
											<div
												style={{
													backgroundColor:
														"var(--Green, #14A38B)",
													width: "50px",
													height: "50px",
													borderRadius: "50%",
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													color: "black",
													fontWeight: "bold",
													fontSize: "14px",
												}}>
												{item.stretcher_occupancy}
											</div>
										)}
									</div>
									<div className="flex items-end absolute top-0 right-0 pl-3">
										{parseFloat(item.stretcher_occupancy) >=
											70 &&
											parseFloat(
												item.stretcher_occupancy
											) <= 99 && (
												<div
													style={{
														backgroundColor:
															"var(--Yellow, #F2AC57)",
														width: "50px",
														height: "50px",
														borderRadius: "50%",
														display: "flex",
														justifyContent:
															"center",
														alignItems: "center",
														color: "black",
														fontWeight: "bold",
														fontSize: "14px",
													}}>
													{item.stretcher_occupancy}
												</div>
											)}
									</div>

									<div className="flex items-end absolute top-0 right-0 pl-3">
										{parseFloat(item.stretcher_occupancy) >=
											100 && (
											<div
												style={{
													backgroundColor:
														"var(--Red, #FF7171)",
													width: "50px",
													height: "50px",
													borderRadius: "50%",
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													color: "black",
													fontWeight: "bold",
													fontSize: "14px",
												}}>
												{item.stretcher_occupancy}
											</div>
										)}
									</div>
								</div>
								<br />
								<div>
									<p className="font-sans font-medium text-darkgrey text-[14px] text-start">
										Est. Wait Time: {item.waiting_time}
									</p>
								</div>
								<br />
								<div>
									<p className="font-sans font-medium text-darkgrey text-[14px] text-start">
										No. of People Waiting to See a Doctor:
										{item.waiting_people}
									</p>
								</div>
								<br />
								<div>
									<p className="font-sans font-medium text-darkgrey text-[14px] text-start">
										No. of People in the Emergency Room:
										{item.total_people}
									</p>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
