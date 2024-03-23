"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../components/Button";
import Header from "../components/Header";
import { useAuth } from "../contexts/AuthContext";
import { useProp } from "../contexts/PropContext";
import { useUser } from "../contexts/UserContext";
import {
  formatDate,
  formatMilitaryTime,
} from "../helpers/utils/datetimeformat";
import { getHealthTips } from "../http/healthTipsAPI";

export default function Healthtips() {
  const logger = require("../../logger");
  const router = useRouter();
  const { user } = useAuth();
  const { userInfo } = useUser();
  const [oxygen, setoxygen] = useState<any>(null);
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
        setoxygen(result.data);
      } catch (error) {
        handlePopUp("error", "Error retrieving health tip entry:");
      }
    }
    setTimeout(() => {
      fetchHealthTips();
    }, 1000);
  }, [user]);

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
      <span className="flex items-baseline font-bold text-darkgrey text-[24px] mx-4 mt-4 mb-4">
        <button onClick={() => router.push("/health")}>
          <Header headerText="Health Tips"></Header>
        </button>
      </span>
      <p className="font-sans text-darkgrey ml-5 text-[14px]">
        With your pulse oximeter, log your observations here in one go!
      </p>
      <br></br>

      {oxygen && (
        <div className="rounded-3xl bg-white flex flex-col mt-4 mb-44 w-full md:max-w-[800px] md:min-h-[550px] p-4 shadow-[0_32px_64px_0_rgba(44,39,56,0.08),0_16px_32px_0_rgba(44,39,56,0.04)]">
          <div className="flex justify-between items-center">
            <Button
              type="button"
              text="Add an Entry"
              style={{
                width: "120px",
                fontSize: "14px",
                padding: "1px 10px",
              }}
              onClick={() => router.push(`/createOxygenJournal`)}
            />
          </div>
          <br></br>
          <div className="flex" style={{ justifyContent: "space-between" }}>
            <div className="flex-2" style={{ marginRight: "12%" }}>
              <div className="font-sans  text-darkgrey font-bold text-[18px] text-center">
                Date/Time
                <button onClick={handleOrderDate} aria-label="orderDate">
                  {orderdate ? (
                    <MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" />
                  ) : (
                    <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex-2" style={{ marginRight: "2%" }}>
              <div className="font-sans  text-darkgrey font-bold text-[18px] text-center">
                O<sub>2</sub>
                <button onClick={handleOrderO2} aria-label="orderO2">
                  {orderO2 ? (
                    <MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" />
                  ) : (
                    <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
                  )}
                </button>
              </div>
            </div>
            <div className="flex-2" style={{ marginRight: "10%" }}>
              <div className="font-sans  text-darkgrey font-bold text-[18px] text-center">
                Pulse
                <button onClick={handleOrderPulse} aria-label="orderOxygen">
                  {orderPulse ? (
                    <MdKeyboardArrowUp className="inline-block text-lg text-darkgrey" />
                  ) : (
                    <MdKeyboardArrowDown className="inline-block text-lg text-darkgrey" />
                  )}
                </button>
              </div>
            </div>
          </div>
          {oxygen.map((item: any, index: number) => (
            <div
              key={item.oxygenJournalId}
              className={`flex justify-between items-center mt-3`}
              style={{
                backgroundColor: index % 2 === 0 ? "white" : "#DBE2EA",
              }}
              onClick={() => router.push(`/getOxygenJournals/${item.id}`)}
            >
              <div className="flex-2">
                <p className="font-sans font-medium text-darkgrey text-[14px] text-center">
                  {`${formatDate(item.date)} ${formatMilitaryTime(item.time)}`}
                </p>
              </div>
              <div className="flex-2">
                <p className="mr-2 font-sans font-medium text-darkgrey text-[14px] text-center">
                  {item.o2sat}
                </p>
              </div>
              <div className="flex-2">
                <p className="ml-3 font-sans font-medium text-darkgrey text-[14px] text-center">
                  {item.pulse}
                </p>
              </div>

              <div
                className="flex icons"
                style={{
                  marginLeft: "5px",
                  marginRight: "5px",
                }}
              >
                <div className="icon" id="Trash Icon">
                  <MdDeleteForever
                    style={{
                      color: "var(--Red, #FF7171)",
                      width: "25px",
                      height: "30px",
                    }}
                    onClick={(event) => {
                      event.stopPropagation();
                      deleteOxygenJournals(item.id);
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
