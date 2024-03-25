"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import AboutUsPage from "./aboutUsPage";

export default function GetAboutUs() {
	const router = useRouter();
	const { user } = useAuth();

	return <AboutUsPage />;
}
