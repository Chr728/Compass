"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, {useEffect} from "react";
import { MdCalendarMonth, MdEditNote } from "react-icons/md";
import { useAuth } from "../contexts/AuthContext";
import introJs from "intro.js";
import {Steps} from "intro.js-react";
import {introductionSteps} from "../lib/IntroJs/IntroJs";

export default function MainMenu() {
	const { user } = useAuth();
	const router = useRouter();


	return (
		<div className="bg-eggshell min-h-screen flex flex-col pb-32">
			<div id="sections" className="grid grid-cols-2 gap-3 p-4 my-auto text-center">
				<div className="text-darkgrey font-bold col-span-2 text-[24px]">
					Welcome to Compass
				</div>
				<div className="text-grey font-sans font-semibold col-span-2">
					Quickstart Your Journey...
				</div>

				<div
					id="appointments-section"
					className="bg-red rounded-xl h-36 py-14 bg-opacity-90 hover:-translate-y-1.5"
					onClick={() => router.push("/viewappointments")}>
					Appointments
					<div className="flex text-2xl justify-center">
						<MdCalendarMonth/>
					</div>
				</div>

				<div
					className="bg-darkgrey rounded-xl h-36 py-14 bg-opacity-90 hover:-translate-y-1.5"
					onClick={() => router.push("/getMedications")}>
					Medications
					<div className="flex justify-center">
						<Image
							src="/icons/medication.svg"
							alt="Medicine icon"
							width={20}
							height={20}
						/>
					</div>
				</div>

				<div
					id="journals-section"
					className="bg-yellow rounded-xl h-36 py-14 bg-opacity-90 hover:translate-y-1.5"
					onClick={() => router.push("/journals")}>
					Journals
					<div className="flex text-3xl justify-center">
						<MdEditNote/>
					</div>
				</div>

				<div
					className="bg-green rounded-xl h-36 py-14 bg-opacity-90 hover:translate-y-1.5"
					onClick={() => router.push("/profile")}>
					Profile
					<div className="flex justify-center">
						<Image
							src="/icons/whiteMask.svg"
							alt="Profile icon"
							width={18}
							height={18}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
