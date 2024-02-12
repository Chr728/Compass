"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import EditProfilePage from "./editProfilePage";

// Logging out the user
export default function EditProfile() {
	const router = useRouter();
	const { user } = useAuth();

	React.useEffect(() => {
		if (!user) router.push("/login");
	}, [user]);

	// if (!user) {
	//   return <div><Custom403/></div>
	// }

	return <EditProfilePage />;
}
