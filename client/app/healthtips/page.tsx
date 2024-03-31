"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { useProp } from "../contexts/PropContext";
import { useUser } from "../contexts/UserContext";
import { getHealthTips } from "../http/healthTipsAPI";

export default function Healthtips() {
  const logger = require("../../logger");
  const router = useRouter();
  const { user } = useAuth();
  const { userInfo } = useUser();
  const [healthTips, setHealthTips] = useState<any>(null);
  const [randomizedTips, setRandomizedTips] = useState<{
    [category: string]: string;
  }>({});
  const { handlePopUp } = useProp();

  useEffect(() => {
    if (!userInfo) {
      logger.warn("User not found.");
      alert("User not found.");
    }
  }, [userInfo, router]);

  useEffect(() => {
    async function fetchHealthTips() {
      try {
        const result = await getHealthTips();
        logger.info("All health tips entry retrieved:", result);
        setHealthTips(result.data);
      } catch (error) {
        handlePopUp("error", "Error retrieving health tip entry:");
      }
    }
    setTimeout(() => {
      fetchHealthTips();
    }, 1000);
  }, [user]);

  const displayRandomTips = () => {
    if (!healthTips) return;

    const selectedCategories = [
      { name: "angertips", data: healthTips.angertips },
      { name: "anxietytips", data: healthTips.anxietytips },
      { name: "attentiontips", data: healthTips.attentiontips },
      { name: "depressiontips", data: healthTips.depressiontips },
      { name: "overwhelmedtips", data: healthTips.overwhelmedtips },
      { name: "sleeptips", data: healthTips.sleeptips },
      { name: "tiredtips", data: healthTips.tiredtips },
    ];

    // Filter out categories with null or empty data
    const nonEmptyCategories = selectedCategories.filter(
      (category) => category.data
    );

    // Extract category names
    const categoryNames = nonEmptyCategories.map((category) => category.name);

    const shuffledCategories = categoryNames
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const randomTips: { [category: string]: string } = {};

    shuffledCategories.forEach((category) => {
      const tipsJSON = healthTips[category];
      const tipsObject = JSON.parse(tipsJSON);

      const tipKeys = Object.keys(tipsObject);
      const randomTipKey = tipKeys[Math.floor(Math.random() * tipKeys.length)];
      const randomTip = tipsObject[randomTipKey];

      randomTips[category] = randomTip;
    });

    setRandomizedTips(randomTips);
  };

  // Use effect to randomize tips everytime page is reloaded
  useEffect(() => {
    if (healthTips) {
      displayRandomTips();
      window.addEventListener("beforeunload", displayRandomTips);
      return () => {
        window.removeEventListener("beforeunload", displayRandomTips);
      };
    }
  }, [healthTips]);

  return (
    <div className="bg-eggshell p-2 min-h-screen flex flex-col">
      <span
        data-testid="health-tips-title"
        className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4"
      >
        <button onClick={() => router.push("/health")}>
          <Header headerText="Health Tips"></Header>
        </button>
      </span>
      <p
        data-testid="health-tips-body"
        className="font-sans text-darkgrey ml-5 text-[14px]"
      >
        Your health tips based on your current mood. New tips are created for
        you when you add an item in your mood journal.
      </p>
      <br></br>

      <div className="flex-grow flex justify-center relative">
        {healthTips && (
          <div className="flex justify-center">
            <div
              className="relative"
              style={{
                marginTop: "",
                marginLeft: "2px auto",
                marginRight: "2px auto",
                maxWidth: "100%",
                height: "450px",
              }}
            >
              <img
                src="/healthTipBubble.png"
                alt="Speech bubble"
                className="w-full h-full"
                style={{ height: "550px" }}
              />
              <div className="absolute top-[43%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <p
                  data-testid="health-tips-subtitle"
                  className="font-bold text-darkgrey mb-4 text-center"
                >
                  Health Tips:
                </p>
                <ul className="list-disc text-sm text-center font-bold text-darkgrey">
                  {Object.entries(randomizedTips).map(([category, tip]) => (
                    <ul key={category} style={{ fontSize: "0.8rem" }}>
                      <strong>Tips:</strong> {tip}
                    </ul>
                  ))}
                </ul>
              </div>
              <img
                src="/healthTipHuman.jpg"
                alt="Human pointing upward"
                className="bottom-0 left-0 ml-4 mb-4 w-24"
                style={{
                  marginLeft: "5px",
                  width: "120px",
                  height: "120px",
                }}
              />
              <div
                className="md:hidden"
                style={{ paddingBottom: "80px" }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
