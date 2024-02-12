"use client";
import { useUser } from "@/app/contexts/UserContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import ProfilePage from "./profilePage";

export default function Profile() {
	const router = useRouter();
	const { user } = useAuth();
	const { userInfo } = useUser();

	const [profile, setProfile] = useState<any>(null);

	useEffect(() => {
		setProfile(userInfo);
	}, [userInfo]);

	React.useEffect(() => {
		if (!user) router.push("/login");
	}, [user]);

	// if (!user) {
	//   return <div><Custom403/></div>
	// }

	return (
		<div>
			<ProfilePage />
		</div>
	);
}
