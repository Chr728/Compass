"use client";
import Link from "next/link";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import Menu from "../components/Menu";
import Switch from "@mui/material/Switch";
import React, { useEffect } from "react";
import {
  getNotificationPreference,
  updateNotificationPreference,
  createNotificationPreference,
} from "../http/notificationPreferenceAPI";
import { useAuth } from "../contexts/AuthContext";

// Logging out the user
export default function NotificationPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [checkedActivityReminders, setActivityReminders] = React.useState(true);
  const [checkedMedicationReminders, setMedicationReminders] =
    React.useState(true);
  const [checkedAppointmentReminders, setAppointmentReminders] =
    React.useState(true);
  const [checkedFoodIntakeReminders, setFoodIntakeReminders] =
    React.useState(true);

  const handleActivityRemindersChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setActivityReminders(event.target.checked);
  };

  const handleMedicationRemindersChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMedicationReminders(event.target.checked);
  };

  const handleAppointmentRemindersChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAppointmentReminders(event.target.checked);
  };

  const handleFoodIntakeRemindersChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFoodIntakeReminders(event.target.checked);
  };

  // Retrieve notification preference information, if it doesnt exist, create it
  useEffect(() => {
    async function fetchNotificationPreference() {
      try {
        const userId = user?.uid || "";
        const result = await getNotificationPreference();
        console.log("Retrieved notification preference of user:", result);
        if (result && result.data) {
          console.log(result.data.activityReminders);
          setActivityReminders(result.data.activityReminders);
          setMedicationReminders(result.data.medicationReminders);
          setAppointmentReminders(result.data.appointmentReminders);
          setFoodIntakeReminders(result.data.foodIntakeReminders);
          console.log("Notification preference information all set!");
        }
      } catch (error) {
        console.log("Error retrieving notification preference of user:", error);
        console.log(
          "No notification preference settings found for this user in the database. Creating an entry for the user."
        );
        // Notification preference doesn't exist, create it
        const createdResult = await createNotificationPreference(); // Assuming createNotificationPreference handles creation
        console.log("Notification preference created:", createdResult);
        location.reload();
      }
    }
    fetchNotificationPreference();
  }, []);

  const onSubmit = async () => {
    try {
      const data = {
        activityReminders: checkedActivityReminders,
        medicationReminders: checkedMedicationReminders,
        appointmentReminders: checkedAppointmentReminders,
        foodIntakeReminders: checkedFoodIntakeReminders,
      };
      const result = await updateNotificationPreference(data);
      console.log("Notification preference for user updated:", result);
    } catch (error) {
      console.error("Error updating notification preference for user:", error);
    }
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
          <span className="text-darkgrey text-base not-italic font-medium font-IBM Plex Sans text-lg ">
            Activity Reminders
          </span>
        </div>
        <div className="m-4">
          <Switch
            checked={checkedMedicationReminders}
            onChange={handleMedicationRemindersChange}
            inputProps={{ "aria-label": "MedicationSwitch" }}
          />
          <span className="text-darkgrey text-base not-italic font-medium font-IBM Plex Sans text-lg ">
            Medication Reminders
          </span>
        </div>
        <div className="m-4">
          <Switch
            checked={checkedAppointmentReminders}
            onChange={handleAppointmentRemindersChange}
            inputProps={{ "aria-label": "AppointmentSwitch" }}
          />
          <span className="text-darkgrey text-base not-italic font-medium font-IBM Plex Sans text-lg ">
            Appointment Reminders
          </span>
        </div>
        <div className="m-4">
          <Switch
            checked={checkedFoodIntakeReminders}
            onChange={handleFoodIntakeRemindersChange}
            inputProps={{ "aria-label": "FoodIntakeSwitch" }}
          />
          <span className="text-darkgrey text-base not-italic font-medium font-IBM Plex Sans text-lg ">
            Food Intake Reminders
          </span>
        </div>
        <div className="text-center mt-[100px]">
          <Button
            type="submit"
            text="Save"
            style={{ width: "50%" }}
            onClick={onSubmit}
          />
        </div>
        <div className="md:hidden">
          <Menu></Menu>
        </div>
      </div>
    </div>
  );
}
