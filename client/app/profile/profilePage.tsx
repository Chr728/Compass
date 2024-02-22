import { useUser } from "@/app/contexts/UserContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import SingleEntry from "../components/SingleEntry";
import { useAuth } from "../contexts/AuthContext";

export default function Profile() {
	const router = useRouter();
	const { user } = useAuth();
	const { userInfo } = useUser();

	const [profile, setProfile] = useState<any>(null);

	useEffect(() => {
		if (userInfo) {
			setProfile(userInfo);
		} else {
			router.push("/");
		}
	}, [userInfo, router]);

	return (
		<div>
			<div
				className="bg-eggshell min-h-screen flex flex-col "
				style={{
					minHeight: "600px",
					height: "auto",
					backgroundImage: "url('/profile.svg')",
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}>
				<button onClick={() => router.push("/settings")}>
					<div>
						<Header headerText="View Profile"></Header>
					</div>
				</button>
				{profile && (
					<span className="rounded-2xl mt-6 mb-10 mr-28 bg-white flex flex-col m-auto w-full md:max-w-[800px] md:min-h-[600px] p-8 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
						<div className="mt-3 relative">
							{profile.sex === "female" && (
								<div className="flex justify-center">
									<img
										src="/female.jpg"
										alt="Female"
										className="rounded-full mt-1 "
										height={100}
										width={100}
									/>
								</div>
							)}
							{profile.sex === "male" && (
								<div className="flex justify-center">
									<img
										src="/male.jpg"
										alt="Male"
										className="rounded-full mt-1"
										height={100}
										width={100}
									/>
								</div>
							)}

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
					</span>
				)}
				<div className="flex justify-center mt-2">
					<Link href="/editprofile">
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
			</div>
		</div>
	);
}
