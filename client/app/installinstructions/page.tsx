"use client";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function InstallInstructions() {
  const router = useRouter();
  const auth = useAuth();

  const [platform, setPlatform] = useState<"android" | "ios" | null>(null);

  const handleSelectPlatform = (selectedPlatform: "android" | "ios") => {
    setPlatform(selectedPlatform);
  };

  const handleResetPlatform = () => {
    setPlatform(null);
  };

  const Instructions = ({
    platform,
    onBack,
  }: {
    platform: "android" | "ios";
    onBack: () => void;
  }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const totalSteps = 3; // Total number of steps

    const handleNextStep = () => {
      setCurrentStep((prevStep) => (prevStep + 1) % totalSteps);
    };

    const handlePrevStep = () => {
      setCurrentStep((prevStep) => (prevStep - 1 + totalSteps) % totalSteps);
    };

    return (
      <div className="flex flex-col items-center">
        {/* Image */}
        <div className="mb-4">
          <img
            src={`/${platform}-step${currentStep + 1}.png`}
            alt={`${platform} Instruction ${currentStep + 1}`}
            className="w-full"
          />
        </div>
        {/* Instructions */}
        <div className="text-center mb-4">
          <p>Follow these steps to install on your {platform} device:</p>
          <ol className="list-decimal pl-4">
            {/* Add your specific instructions for each step here */}
          </ol>
        </div>
        {/* Step Navigation Buttons */}
        <div className="flex">
          <button
            onClick={handlePrevStep}
            disabled={currentStep === 0}
            className="mr-2"
          >
            Previous
          </button>
          <button
            onClick={handleNextStep}
            disabled={currentStep === totalSteps - 1}
          >
            Next
          </button>
        </div>
        {/* Back Button */}
        <button onClick={onBack}>Back</button>
      </div>
    );
  };

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
      <div>
        <button onClick={() => router.push("/login")}>
          <Header headerText="Install Instructions" />
        </button>
      </div>
      <div>
        {/* Platform Selection */}
        {platform === null && (
          <div className="flex mb-4">
            <button
              onClick={() => handleSelectPlatform("android")}
              className="mr-2"
            >
              Android
            </button>
            <button onClick={() => handleSelectPlatform("ios")}>iOS</button>
          </div>
        )}

        {/* Platform Instructions */}
        {platform !== null && (
          <Instructions platform={platform} onBack={handleResetPlatform} />
        )}
      </div>
    </div>
  );
}
