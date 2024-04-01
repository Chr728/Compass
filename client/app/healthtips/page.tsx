"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { useProp } from "../contexts/PropContext";
import { useUser } from "../contexts/UserContext";
import { getHealthTips } from "../http/healthTipsAPI";

export default function Healthtips() {
  const moment = require("moment-timezone");
  const logger = require("../../logger");
  const router = useRouter();
  const { user } = useAuth();
  const { userInfo } = useUser();
  const [healthTips, setHealthTips] = useState<any>(null);
  const [randomizedTips, setRandomizedTips] = useState<{
    [category: string]: string;
  }>({});
  const { handlePopUp } = useProp();
  const [formattedDate, setFormattedDate] = useState("");

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
    if (!healthTips) {
      setRandomizedTips({ "No tips found": "No tips were found." });
      return;
    }

    const categoriesWithTips = [
      { name: "angertips", data: healthTips.angertips },
      { name: "anxietytips", data: healthTips.anxietytips },
      { name: "attentiontips", data: healthTips.attentiontips },
      { name: "depressiontips", data: healthTips.depressiontips },
      { name: "overwhelmedtips", data: healthTips.overwhelmedtips },
      { name: "sleeptips", data: healthTips.sleeptips },
      { name: "tiredtips", data: healthTips.tiredtips },
    ];

    const categoriesWithNonNullData = categoriesWithTips.filter(
      (category) => category.data !== null
    );

    if (categoriesWithNonNullData.length === 0) {
      setRandomizedTips({ "No tips found": "No tips were found." });
      return;
    }

    const selectedCategories: string[] = categoriesWithNonNullData.map(
      (category) => category.name
    );

    const shuffledCategories = selectedCategories
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const randomTips: { [category: string]: string } = {};

    shuffledCategories.forEach((category) => {
      const tipsJSON = healthTips[category];
      if (!tipsJSON) return; // Skip if tipsJSON is null

      const tipsObject = JSON.parse(tipsJSON);
      const tipKeys = Object.keys(tipsObject);
      if (tipKeys.length === 0) return; // Skip if tipsObject has no keys

      const randomTipKey = tipKeys[Math.floor(Math.random() * tipKeys.length)];
      const randomTip = tipsObject[randomTipKey];

      randomTips[category] = randomTip;
    });
    setRandomizedTips(randomTips);
  };

  // Use effect to randomize tips everytime page is reloaded
  useEffect(() => {
    if (healthTips) {
      const formattedDate = moment(healthTips.date)
        .tz("America/Toronto")
        .format("YYYY-MM-DD");
      setFormattedDate(formattedDate);
      displayRandomTips();
      window.addEventListener("beforeunload", displayRandomTips);
      return () => {
        window.removeEventListener("beforeunload", displayRandomTips);
      };
    }
  }, [healthTips]);

  // useEffect to calculate the necessary height for the tips container
  useEffect(() => {
    // Get a reference to the <div> element containing health tips
    const healthTipsDiv = document.getElementById("healthTipsDiv");

    // Check if healthTipsDiv exists before proceeding
    if (healthTipsDiv) {
      // Get the height of the <div> element
      const healthTipsDivHeight = healthTipsDiv.clientHeight;

      // Get a reference to the <img> element
      const imgElement = document.getElementById("tipContainer");

      // Check if imgElement exists before setting its height
      if (imgElement) {
        // Set the height of the <img> element
        imgElement.style.height = `${healthTipsDivHeight * 1.6}px`;

        console.log("HEIGHT OF CONTAINER: ", healthTipsDivHeight);
      }
    }
  }, []);

  return (
    <div
      className="bg-eggshell p-2 min-h-screen flex flex-col"
      style={{ minHeight: "100vh", overflow: "auto" }}
    >
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
        Your health tips based on some of your stress signals. New tips are
        created for you when you add a new mood journal entry. Note that these
        tips should not be used as medical advice, but are only a suggestion to
        improve your day and life.
      </p>
      <br></br>

      <div className="flex-grow flex justify-center relative">
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
              src="/healthTipRectangle.png"
              alt="Rectangle"
              className="w-full h-full"
              id="tipContainer"
            />
            <div
              id="healthTipsDiv"
              className="absolute top-[43%] left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <p
                data-testid="health-tips-subtitle"
                className="font-bold text-darkgrey mb-4 text-center"
              >
                Health Tips:
              </p>
              {healthTips ? (
                <div>
                  <p
                    data-testid="health-tips-description"
                    className="font-bold text-darkgrey mb-4 text-center font-size-small"
                    style={{ fontSize: "0.8rem" }}
                  >
                    Your mood journal from {formattedDate} and {healthTips.time}{" "}
                    has been assessed
                  </p>
                  <ul className="list-disc text-sm text-center font-bold text-darkgrey">
                    {Object.entries(randomizedTips).map(([category, tip]) => (
                      <ul key={category} style={{ fontSize: "0.8rem" }}>
                        <strong>Tips:</strong> {tip}
                      </ul>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="flex justify-center font-bold text-darkgrey mb-4 text-center">
                  <p>
                    No tips have arrived. Please create a mood journal entry
                  </p>
                </div>
              )}
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
            <div className="md:hidden" style={{ paddingBottom: "80px" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
