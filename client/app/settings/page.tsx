"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import SettingsPage from "./settingsPage";

export default function Setting() {
	const router = useRouter();
	const { logout, user } = useAuth();

	return <SettingsPage />;
}
