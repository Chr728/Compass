"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/Button";
import Header from "../../components/Header";

export default function ChooseSymptoms() {
    const logger = require("../../../logger");
	const router = useRouter();
	const { user } = useAuth();

    useEffect(() => {
		if (!user) {
			logger.warn("User not found.");
			alert("User not found.");
		}
	}, [user, router]);

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
        <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
            <button onClick={() => router.push("/health")}>
                <Header headerText="Choose Your Symptoms"></Header>
            </button>
        </span>
      
    </div>
  )
}
