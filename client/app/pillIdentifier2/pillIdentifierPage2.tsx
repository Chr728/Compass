"use client";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import Header from "../components/Header";
import { useUser } from "../contexts/UserContext";

export default function PillIdentifierPage() {
	const logger = require("../../logger");
	const router = useRouter();
	const { userInfo } = useUser();

	// useEffect(() => {
	// 	if (!userInfo) {
	// 		logger.warn("User not found.");
	// 		alert("User not found.");
	// 	}
	// }, [userInfo, router]);

	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
				<button onClick={() => router.push("/pillIdentifierPage2")}>
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
						The app doesn't provide a 100% guarantee when
						identifying medications.
					</li>
					<li>The app provides you a score of the closest match.</li>
					<li>Take pictures against a clear background.</li>
					<li>Capsules are not yet supported.</li>
				</ul>
			</div>

			<div className="mt-10 pb-4 self-center">
				<Button
					type="button"
					text="Submit"
					style={{ width: "140px" }}
					// onClick={() =>
					// 	router.push(
					// 		`/getWeightJournals/${weightJournal}/${weightJournal}`
					// 	)
					// }
				/>
			</div>
			<div className="mt-10 pb-4 self-center">
				<Button
					type="button"
					text="Choose another image"
					style={{ width: "140px" }}
				/>
			</div>
			<div className="mt-10 pb-4 self-center">
				<Button
					type="button"
					text="Cancel"
					style={{
						width: "140px",
						backgroundColor: "var(--Red, #FF7171)",
						marginLeft: "12px",
					}}
					onClick={() => router.push(`/getMedications`)}
				/>
			</div>
		</div>
	);
}
