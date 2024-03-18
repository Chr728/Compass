"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";

export default function MainMenu() {
	const { user } = useAuth();
	const router = useRouter();

	// React.useEffect(() => {
	// 	if (!user) router.push("/login");
	// }, [user]);

	// if (!user) {
	//   return <div><Custom403/></div>
	// }

	return (
		<div className="bg-eggshell min-h-screen flex flex-col pb-32">
			<div id={'sections'} className="grid grid-cols-2 gap-3 p-4 my-auto text-center">
				<div className="text-darkgrey font-bold col-span-2 text-[24px]">
					Welcome to Compass
				</div>
				<div className="text-grey font-sans font-semibold col-span-2">
					Quickstart Your Journey...
				</div>
				<div
					className="bg-red rounded-xl h-36 py-2 bg-opacity-90 hover:-translate-y-1.5"
					onClick={() => router.push("/viewappointments")}>
					<div className="flex justify-center">
						<Image
							src="/appointments.svg"
							alt="Appointments icon"
							width={50}
							height={50}
						/>
					</div>
					Appointments
				</div>

				<div
					className="bg-darkgrey rounded-xl h-36 py-2 bg-opacity-90 hover:-translate-y-1.5"
					onClick={() => router.push("/getMedications")}>
					<div className="flex justify-center">
						<Image
							src="/medications.svg"
							alt="Medicine icon"
							width={85}
							height={85}
						/>
					</div>
					Medications
				</div>

				<div
					id={'journals-section'}
					className="bg-yellow rounded-xl h-36 py-2 bg-opacity-90 hover:translate-y-1.5"
					onClick={() => router.push("/journals")}>
					<div className="flex justify-center">
						<Image
							src="/icons/journals.svg"
							alt="Journal icon"
							width={105}
							height={105}
						/>
					</div>
					Journals
				</div>

				<div
					className="bg-green rounded-xl h-36 py-2 bg-opacity-90 hover:translate-y-1.5"
					onClick={() => router.push("/profile")}>
					<div className="flex justify-center">
						<Image
							src="/icons/profile.svg"
							alt="Profile icon"
							width={100}
							height={100}
						/>
					</div>
					Profile
				</div>
			</div>
		</div>
	);
}