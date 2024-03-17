"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SwiperCore from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import "./styles.css";

import { Navigation, Pagination } from "swiper/modules";
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
	const { handlePopUp } = useProp();

	useEffect(() => {
		if (!userInfo) {
			logger.warn("User not found.");
			alert("User not found.");
		}
	}, [userInfo, router]);
	SwiperCore.use([Navigation, Pagination]);

	const [emergency, setemergency] = useState<any>(null);

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
	console.log("emergency:", emergency?.at(0));
	const formatTime = (timestamp: number) => {
		const date = new Date(timestamp);
		const hours = date.getHours();
		const minutes = date.getMinutes();
		const seconds = date.getSeconds();

		return `${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`;
	};

	return (
		<>
			<div className="relative bg-eggshell min-h-screen flex flex-col">
				<span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
					<button onClick={() => router.push("/health")}>
						<Header headerText="Emergency Rooms"></Header>
					</button>
				</span>
				<div className="font-bold text-start text-darkgrey p-3 text-[20px]">
					Last Updated:{" "}
					{emergency?.at(0)
						? formatTime(emergency.at(0).last_updated)
						: ""}
				</div>

				<Swiper
					navigation
					pagination={{ clickable: true }}
					className="mySwiper">
					{emergency &&
						Array.from({
							length: Math.ceil(emergency.length / 10),
						}).map((_, index) => (
							<SwiperSlide key={index}>
								<div
									className="rounded-3xl bg-white flex flex-col mt-4 mb-44 w-full md:max-w-[800px] md:min-h-[550px] p-4 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
									data-carousel-item="active">
									{emergency
										.slice(index * 10, (index + 1) * 10)
										.map(
											(item: any, innerIndex: number) => (
												<div
													className="rounded-3xl relative bg-white flex flex-col mt-4 mb-5 w-full md:max-w-[800px] md:min-h-[550px] p-2 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]"
													key={innerIndex}>
													{/* Render individual item */}
													<div>
														<div className="flex justify-between pr-10">
															<div>
																<p className="font-sans font-bold text-darkgrey text-[16px] text-start">
																	{
																		item.hospital_name
																	}
																</p>
																<p className="font-sans font-medium text-darkgrey text-[14px] text-start">
																	{
																		item.hospital_address
																	}
																</p>
																<p className="font-sans font-medium text-darkgrey text-[14px] text-start">
																	{
																		item.arrondissementLines
																	}
																</p>
															</div>
															<div className="flex items-end absolute top-0 right-0 pl-3">
																{parseFloat(
																	item.stretcher_occupancy
																) <= 70 && (
																	<div
																		style={{
																			backgroundColor:
																				"var(--Green, #14A38B)",
																			width: "50px",
																			height: "50px",
																			borderRadius:
																				"50%",
																			display:
																				"flex",
																			justifyContent:
																				"center",
																			alignItems:
																				"center",
																			color: "black",
																			fontWeight:
																				"bold",
																			fontSize:
																				"14px",
																		}}>
																		{
																			item.stretcher_occupancy
																		}
																	</div>
																)}
															</div>
															<div className="flex items-end absolute top-0 right-0 pl-3">
																{parseFloat(
																	item.stretcher_occupancy
																) >= 70 &&
																	parseFloat(
																		item.stretcher_occupancy
																	) <= 99 && (
																		<div
																			style={{
																				backgroundColor:
																					"var(--Yellow, #F2AC57)",
																				width: "50px",
																				height: "50px",
																				borderRadius:
																					"50%",
																				display:
																					"flex",
																				justifyContent:
																					"center",
																				alignItems:
																					"center",
																				color: "black",
																				fontWeight:
																					"bold",
																				fontSize:
																					"14px",
																			}}>
																			{
																				item.stretcher_occupancy
																			}
																		</div>
																	)}
															</div>

															<div className="flex items-end absolute top-0 right-0 pl-3">
																{parseFloat(
																	item.stretcher_occupancy
																) >= 100 && (
																	<div
																		style={{
																			backgroundColor:
																				"var(--Red, #FF7171)",
																			width: "50px",
																			height: "50px",
																			borderRadius:
																				"50%",
																			display:
																				"flex",
																			justifyContent:
																				"center",
																			alignItems:
																				"center",
																			color: "black",
																			fontWeight:
																				"bold",
																			fontSize:
																				"14px",
																		}}>
																		{
																			item.stretcher_occupancy
																		}
																	</div>
																)}
															</div>
														</div>
													</div>

													<div className="font-sans font-bold text-darkgrey text-[14px] text-start">
														<label className="font-sans font-bold text-darkgrey text-[14px]  ">
															Est. Wait Time:
														</label>
														<span className="font-sans font-medium text-darkgrey text-[14px]">
															{item.waiting_time}
														</span>
													</div>

													<div className="font-sans font-bold text-darkgrey text-[14px] text-start">
														<label className="font-sans font-bold text-darkgrey text-[14px] ">
															No. of People
															Waiting to See a
															Doctor:
														</label>{" "}
														<span className="font-sans font-medium text-darkgrey text-[14px]">
															{
																item.waiting_people
															}
														</span>
													</div>

													<div className="font-sans font-bold text-darkgrey text-[14px] text-start">
														<label className="font-sans font-bold text-darkgrey text-[14px] ">
															No. of People in the
															Emergency Room:
														</label>
														<span className="font-sans font-medium text-darkgrey text-[14px]">
															{item.total_people}
														</span>
													</div>
												</div>
											)
										)}
								</div>
							</SwiperSlide>
						))}
				</Swiper>
			</div>
		</>
	);
}
