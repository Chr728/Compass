"use client";
import React, { useState, useEffect } from "react";
import NextImage from "next/image";
import compassImage from "../../public/compass-removebg.png";
import Onboarding from "./onboarding";

const Welcome = () => {
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Wait for 3 seconds
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  return isLoading ? (
    // If page is still loading then splash screen
    <div className="motion-safe:animate-pulse bg-eggshell min-h-screen flex justify-center items-center">
      <div>
        <NextImage src={compassImage} alt="Compass Logo" />
      </div>
    </div>
  ) : (
    // If page is not loading then show the welcome screen
    <div>
      <Onboarding />
    </div>
  );
};

export default Welcome;
