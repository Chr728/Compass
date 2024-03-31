https: "use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Button from "../components/Button";
import SpanHeader from "../components/SpanHeader";
import { useUser } from "../contexts/UserContext";

export default function UserTestingPage() {
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
			<SpanHeader
				onClick={() => router.push("/settings")}
				headerText="User Testing"></SpanHeader>
			<div className="rounded-3xl bg-white flex flex-col mt-4 mb-44 w-full md:max-w-[800px] md:min-h-[550px] p-4 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
				<div className="font-bold text-start text-darkgrey p-3 text-[20px]">
					User Feedback Survey
				</div>
				<div className="flex justify-between items-center">
					<br></br> <br></br>
					<div className="font-bold text-start text-darkgrey p-4 text-[14px]">
						We always value your suggestions and any feedback you
						can tell. Please fill out the following annonymous
						survey. Thank you!
						<Button
							type="button"
							text="Start Survey"
							style={{ width: "110px", marginTop: "30px" }}
							onClick={() =>
								window.open(
									"https://forms.gle/8imvZJFK4C7zZ3iR6",
									"_blank"
								)
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
