"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { useProp } from "../contexts/PropContext";
import { useUser } from "../contexts/UserContext";
import { getEmergencySituation } from "../http/emergencySituationAPI";
export default function AboutUsPage() {
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
				const result = await getEmergencySituation();
				logger.info("All info retrieved:", result);
				setemergency(result.data);
			} catch (error) {
				handlePopUp("error", "Error retrieving info:");
			}
		}
		setTimeout(() => {
			fetchEmergencyInfo();
		}, 500);
	}, [user]);

	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
				<button onClick={() => router.push("/settings")}>
					<Header headerText="Emergency Rooms"></Header>
				</button>
			</span>
			<div className="font-bold text-start text-darkgrey p-3 text-[20px]">
				Last Updated
			</div>
			{emergency &&
				emergency.map((item: any, index: number) => (
					<div className="rounded-3xl bg-white flex flex-col mt-4 mb-44 w-full md:max-w-[800px] md:min-h-[550px] p-4 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
						<div
							key={item.hospital_name}
							className={`flex justify-between items-center mt-3`}
							style={{
								backgroundColor:
									index % 2 === 0 ? "white" : "#DBE2EA",
							}}>
							<div className="flex-2">
								<p className="font-sans font-medium text-darkgrey text-[14px] text-center">
									{item.hospital_name}
								</p>
							</div>
						</div>
					</div>
				))}
		</div>
	);
}
