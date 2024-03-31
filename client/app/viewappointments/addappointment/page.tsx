"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import AddAppointmentPage from "./addAppointmentPage";

export default function AddAppointments() {
	const router = useRouter();
	const { user } = useAuth();

	React.useEffect(() => {
		if (!user) router.push("/login");
	}, [user]);

	return <AddAppointmentPage />;
}
