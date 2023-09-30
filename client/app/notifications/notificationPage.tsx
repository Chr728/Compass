"use client";
import Link from "next/link";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import Menu from "../components/Menu";
import Switch from "@mui/material/Switch";
import React from "react";

// Logging out the user
export default function NotificationPage() {
  const router = useRouter();

  const SaveNotification = () => {};

  const [checkedActivityReminders, setActivityReminders] = React.useState(true);
  const [checkedMedicationReminders, setMedicationReminders] =
    React.useState(true);
  const [checkedAppointmentReminders, setAppointmentReminders] =
    React.useState(true);
  const [checkedFoodIntakeReminders, setFoodIntakeReminders] =
    React.useState(true);

  const handleActivityRemindersChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setActivityReminders(event.target.checked);
  };

  const handleMedicationRemindersChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMedicationReminders(event.target.checked);
  };

  const handleAppointmentRemindersChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAppointmentReminders(event.target.checked);
  };

  const handleFoodIntakeRemindersChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFoodIntakeReminders(event.target.checked);
  };

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
      <button onClick={() => router.back()}>
        <Header headerText="Push Notifications"></Header>
      </button>
      <div className="rounded-3xl bg-white flex flex-col m-auto w-full sm:max-w-[800px] h-[500px] p-8 mt-20 shadow-sm ">
        <div className="m-4">
          <Switch
            checked={checkedActivityReminders}
            onChange={handleActivityRemindersChange}
            inputProps={{ "aria-label": "ActvitySwitch" }}
          />
          <span className="text-gray-600 text-base not-italic font-medium font-IBM Plex Sans text-lg ">
            Activity Reminders
          </span>
        </div>
        <div className="m-4">
          <Switch
            checked={checkedMedicationReminders}
            onChange={handleMedicationRemindersChange}
            inputProps={{ "aria-label": "MedicationSwitch" }}
          />
          <span className="text-gray-600 text-base not-italic font-medium font-IBM Plex Sans text-lg ">
            Medication Reminders
          </span>
        </div>
        <div className="m-4">
          <Switch
            checked={checkedAppointmentReminders}
            onChange={handleAppointmentRemindersChange}
            inputProps={{ "aria-label": "AppointmentSwitch" }}
          />
          <span className="text-gray-600 text-base not-italic font-medium font-IBM Plex Sans text-lg ">
            Appointment Reminders
          </span>
        </div>
        <div className="m-4">
          <Switch
            checked={checkedFoodIntakeReminders}
            onChange={handleFoodIntakeRemindersChange}
            inputProps={{ "aria-label": "FoodIntakeSwitch" }}
          />
          <span className="text-gray-600 text-base not-italic font-medium font-IBM Plex Sans text-lg ">
            Food Intake Reminders
          </span>
        </div>
        <div className="text-center mt-[100px]">
          <Button type="submit" text="Save" style={{ width: "50%" }} />
        </div>
        <div className="md:hidden">
          <Menu></Menu>
        </div>
      </div>
    </div>
  );
}