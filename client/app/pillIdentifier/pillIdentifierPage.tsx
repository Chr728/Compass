"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { useProp } from "../contexts/PropContext";
import { useUser } from "../contexts/UserContext";

export default function PillIdentifierPage() {
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

	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
				<button onClick={() => router.push("/getMedications")}>
					<Header headerText="Pill Identifier"></Header>
				</button>
			</span>
			<p className="font-sans  text-darkgrey ml-5 p-1  text-[16px]">
				Use our advanced AI to identify any pills or tablets you may
				have in hand.
			</p>
			<div>
				<ul className="font-sans list-disc  text-darkgrey ml-5 p-1 mt-1 text-[14px]">
					<li>
						The app doesn't provide a 100% guarantee when identifying medications.
					</li>
					<li>The app provides you a score of the closest match.</li>
					<li>Take pictures against a clear background.</li>
					<li>Capsules are not yet supported.</li>
				</ul>
			</div>

			<div
				className=" mb-5 w-full text-center"
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
				}}>
				<img
					src="/compass-removebg.png"
					alt="Logo"
					className="smallImage"
					width={250}
					height={150}
				>
			</div>
		</div>
	);
}
					

