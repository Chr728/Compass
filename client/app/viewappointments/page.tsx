"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import ViewAppointmentsPage from "./viewAppointmentsPage";

export default function ViewAppointments() {
	const router = useRouter();
	const { user } = useAuth();

	return <ViewAppointmentsPage />;
}
