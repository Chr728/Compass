https: "use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import { useUser } from "../contexts/UserContext";

export default function AboutUsPage() {
	const logger = require("../../logger");
	const router = useRouter();
	const { userInfo } = useUser();

	useEffect(() => {
		if (!userInfo) {
			logger.warn("User not found.");
			alert("User not found.");
		}
	}, [userInfo, router]);

	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
				<button onClick={() => router.push("/settings")}>
					<Header headerText="User Testing"></Header>
				</button>
			</span>

			<div className="rounded-3xl bg-white flex flex-col mt-4 mb-44 w-full md:max-w-[800px] md:min-h-[550px] p-4 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
				<div className="font-bold text-start text-darkgrey p-3 text-[20px]">
					User Feedback Survey
				</div>
				<div className="flex justify-between items-center">
					<br></br> <br></br>
					<div className="font-bold text-start text-darkgrey p-4 text-[14px]">
						We would like to get your feedback please fill out the
						following annonymous survey :
						<Button
							type="button"
							text="Start Survey"
							style={{ width: "140px" }}
							onClick={() =>
								router.push(`forms.gle/8imvZJFK4C7zZ3iR6`)
							}
						/>
						<p
							className={
								"w-full h-full text-grey text-center mt-32"
							}>
							&copy; Compass 2024
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
