"use client";
import { useAuth } from "@/app/contexts/AuthContext";
import NextImage from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import appointments from "../../public/appointments.svg";
import locator from "../../public/locator.png";
import medications from "../../public/medications.svg";
import snore from "../../public/snore.svg";
import Header from "../components/Header";
import Custom403 from "../pages/403";

export default function Health() {
	const router = useRouter();
	const { user } = useAuth();

	useEffect(() => {
		if (!user) {
			router.push("/login");
		}
	}, [user]);

	if (!user) {
		return (
			<div>
				<Custom403 />
			</div>
		);
	}

	return (
		<div className="bg-eggshell p-2 min-h-screen flex flex-col">
			<div className="mb-10 flex flex-col w-full p-2">
				<div style={{ marginTop: "-5%" }}>
					<button
						className="mt-3 mb-4"
						onClick={() => router.push("/tpage")}>
						<Header headerText="Your Health"></Header>
					</button>

					<p className="text-darkgrey mb-4">
						Let Compass remove the hassle of recalling when to take
						your medications and when you have important medical
						appointments.
					</p>

					<Link href="/viewappointments">
						<div
							className="rounded-3xl  relative flex flex-col  w-full md:max-w-[800px] md:h-[600px] p-5 "
							style={{ backgroundColor: "#0880AE" }}>
							<div>
								<p className="text-[18px] text-white font-IBM Plex Sans font-bold text-start">
									Appointments
								</p>
								<p className="text-[14px] text-white pr-20 font-IBM Plex Sans  text-start">
									Reminders for important events.
								</p>
								<NextImage
									src={appointments}
									alt="appointments"
									height={100}
									className="absolute inset-y-0 right-4 shrink-0"
								/>
							</div>
						</div>
					</Link>
					<br></br>

					<Link href="/getMedications">
						<div
							className="rounded-3xl  relative flex flex-col  w-full md:max-w-[800px] md:h-[600px] p-5"
							style={{
								backgroundColor: "var(--Black, #2C2738)",
							}}>
							<div>
								<p className="text-[18px] text-white font-IBM Plex Sans font-bold text-start">
									Medications
								</p>
								<p className="text-[14px] text-white font-IBM Plex Sans  text-start">
									Never miss a crucial dose.
								</p>
								<NextImage
									src={medications}
									alt="medications"
									width={88}
									height={106}
									className="absolute inset-y-0 right-4 shrink-0"
								/>
							</div>
						</div>
					</Link>
					<br></br>

					<Link href="/clinicLocator">
						<div
							className="rounded-3xl  relative flex flex-col  w-full md:max-w-[800px] md:h-[600px] p-5 "
							style={{ backgroundColor: "#FF7171" }}>
							<div>
								<p className="text-[18px] text-white font-IBM Plex Sans font-bold text-start">
									Clinic Locator
								</p>
								<p className="text-[14px] text-white pr-20 font-IBM Plex Sans  text-start">
									Locate clinics near you.
								</p>
								<NextImage
									src={locator}
									alt="locator"
									height={120}
									className="absolute inset-y-0 right-0 shrink-0"
								/>
							</div>
						</div>
					</Link>
					<br></br>
					<Link href="/snoringAI">
						<div
							className="rounded-3xl  relative flex flex-col  w-full md:max-w-[800px] md:h-[600px] p-5 m-1"
							style={{ backgroundColor: "#7C9CBF" }}>
							<div>
								<p className="text-[18px] text-white font-IBM Plex Sans font-bold text-start">
									Snore AI
								</p>
								<p className="text-[14px] text-white pr-20 font-IBM Plex Sans  text-start">
									Doubting if you're snoring?
								</p>
								<NextImage
									src={snore}
									alt="snoring"
									height={100}
									className="absolute inset-y-0 right-4 shrink-0"
									style={{ top: "-12px" }}
								/>
							</div>
						</div>
					</Link>
					<br></br>
					<Link href="/emergencySituation">
						<div
							className="rounded-3xl  relative flex flex-col  w-full md:max-w-[800px] md:h-[600px] p-5 "
							style={{
								backgroundColor: "var(--Green, #4caf50)",
							}}>
							<div>
								<p className="text-[18px] text-white font-IBM Plex Sans font-bold text-start">
									Emergency Room Situation
								</p>
							</div>
						</div>
					</Link>
					<br></br>
				</div>

				<br></br>

				{/* link for snoring detection page to be added */}

				<br></br>
			</div>
		</div>
	);
}
