"use client";
import { useUser } from "@/app/contexts/UserContext";
import NextImage from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import SingleEntry from "../components/SingleEntry";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
	const logger = require("../../logger");

	const router = useRouter();
	const { user } = useAuth();
	const { userInfo } = useUser();

	const [profile, setProfile] = useState<any>(null);

	useEffect(() => {
		if (userInfo) {
			setProfile(userInfo);
		} else {
			// Handle the error here by redirecting to the home page
			logger.error("User not found.");
			alert("User  not found.");
			router.push("/");
		}
	}, [userInfo, router]);

	return (
		<div className="bg-eggshell relative min-h-screen flex flex-col justify-center">
			<button onClick={() => router.push("/settings")}>
				<div style={{ marginTop: "-5%" }}>
					<Header headerText="View Profile"></Header>
				</div>
			</button>
			{profile && (
				<span className="rounded-2xl  mt-6 mb-10 mr-28 bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[600px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
					<div className="mt-3 relative">
						<SingleEntry
							label={"First Name :"}
							value={profile.firstName}></SingleEntry>
						<SingleEntry
							label={"Last Name :"}
							value={profile.lastName}></SingleEntry>
						<SingleEntry
							label={"Email :"}
							value={profile.email}></SingleEntry>
						<SingleEntry
							label={"Phone number :"}
							value={profile.phoneNumber}></SingleEntry>
						<SingleEntry
							label={"Birth Date :"}
							value={
								profile.birthDate
									? new Date(profile.birthDate)
											.toISOString()
											.split("T")[0]
									: ""
							}></SingleEntry>
						<SingleEntry
							label={"Sex :"}
							value={profile.sex}></SingleEntry>
					</div>

					<span>
						<NextImage
							src={profile}
							alt="profile"
							height={105}
							className="absolute inset-x-0 bottom-0 shrink-0"
						/>
						<div className="flex justify-center mt-6">
							<Link href="/editprofile" className="mt-6">
								<Button
									type="submit"
									text="Edit Profile"
									style={{
										width: "180px",
										alignContent: "center",
									}}
								/>
							</Link>
						</div>
					</span>
				</span>
			)}
		</div>
	);
}
