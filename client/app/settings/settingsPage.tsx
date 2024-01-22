"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import RedButton from "../components/RedButton";
import { useAuth } from "../contexts/AuthContext";

export default function SettingsPage() {
	const router = useRouter();
	const { logout, user } = useAuth();

	return (
		<div className="bg-eggshell min-h-screen flex flex-col">
			<button onClick={() => router.push("/tpage")}>
				<Header headerText="Settings"></Header>
			</button>
			<div className="rounded-3xl bg-white flex flex-col m-auto w-full md:max-w-[800px] md:h-[600px] p-8">
				<span className="text-base not-italic font-normal font-IBM Plex Sans text-grey m-2">
					Your account
				</span>

				<Link href="/profile">
					<div className="flex items-center m-2">
						<Image
							src="/icons/Mask.svg"
							alt="Profile icon"
							width={24}
							height={24}
							className="mr-3"
						/>

						<span className="text-2xl not-italic font-bold font-IBM Plex Sans text-darkgrey">
							Your Profile
						</span>
					</div>
				</Link>

				<Link
					href={{
						pathname: "/forgotpassword",
						query: {
							loggedIn: true,
						},
					}}>
					<div className="flex items-center m-2">
						<Image
							src="/icons/vpn_key.svg"
							alt="Password icon"
							width={24}
							height={24}
							className="mr-3"
						/>
						<span className="text-2xl not-italic font-bold font-IBM Plex Sans text-darkgrey">
							Change your password
						</span>
					</div>
				</Link>

				<hr className="h-px w-336 text-darkgrey m-2"></hr>

				<span className="text-base not-italic font-normal font-IBM Plex Sans text-grey m-2">
					How you use Compass
				</span>

				<Link href="/notifications">
					<div className="flex items-center m-2">
						<Image
							src="/icons/NotificationBell.svg"
							alt="Notifications icon"
							width={24}
							height={24}
							className="mr-3"
						/>
						<span className="text-2xl not-italic font-bold font-IBM Plex Sans text-darkgrey m-2">
							Push notifications
						</span>
					</div>
				</Link>

				<hr className="h-px w-336 text-darkgrey m-2"></hr>

				<span className="text-base not-italic font-normal font-IBM Plex Sans text-grey m-2">
					More Info
				</span>

				<Link href="/aboutUs">
					<div className="flex items-center m-2">
						<Image
							src="/icons/AboutIcon.svg"
							alt="About icon"
							width={24}
							height={24}
							className="mr-3"
						/>
						<span className="text-2xl not-italic font-bold font-IBM Plex Sans text-darkgrey">
							About Compass
						</span>
					</div>
				</Link>
				<Link href="/privacy">
					<div className="flex items-center m-2">
						<span className="text-2xl not-italic font-bold font-IBM Plex Sans text-darkgrey">
							Privacy Policy
						</span>
					</div>
				</Link>
				<Link href="/logout">
					<div className="text-center mt-[100px] ">
						<RedButton
							type="button"
							text="Sign Out"
							style={{
								width: "50%",
							}}></RedButton>
					</div>
				</Link>
			</div>

			<div className="md:hidden">
				<br></br>
				<br></br>
				<br></br>
			</div>
		</div>
	);
}
