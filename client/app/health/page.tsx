"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import Health from "./HealthPage";

export default function HealthView() {
	const router = useRouter();
	const { user } = useAuth();

	return <Health />;
}
