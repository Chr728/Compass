"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import PillIdentifierPage from "./pillIdentifierPage";

export default function PillIdentifier() {
	const router = useRouter();
	const { user } = useAuth();

	return <PillIdentifierPage />;
}
