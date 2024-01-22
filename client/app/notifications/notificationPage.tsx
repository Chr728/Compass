"use client";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import Button from "../components/Button";
import Switch from "@mui/material/Switch";
import React, { useEffect, useState } from "react";
import {
  getNotificationPreference,
  updateNotificationPreference,
  createNotificationPreference,
} from "../http/notificationPreferenceAPI";
import { useAuth } from "../contexts/AuthContext";
import { Alert } from "@mui/material";
import { useProp } from "../contexts/PropContext";
import { subscribeToPushNotifications } from "./pushNotificationService";

// Logging out the user
export default function NotificationPage() {
  const logger = require("../../logger");
  const router = useRouter();
  const { user } = useAuth();
  const { handlePopUp } = useProp();

  // Alerts
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);

  const [checkedActivityReminders, setActivityReminders] =
    React.useState(false);
  const [checkedMedicationReminders, setMedicationReminders] =
    React.useState(false);
  const [checkedAppointmentReminders, setAppointmentReminders] =
    React.useState(false);
  const [checkedFoodIntakeReminders, setFoodIntakeReminders] =
    React.useState(false);
  const [checkedBloodGlucoseReminders, setBloodGlucoseReminders] =
    React.useState(false);

  const [checkedInsulinInjectionReminders, setInsulinInjectionReminders] =
    React.useState(false);

  const [checkedSubscriptionReminders, setSubscriptionReminders] =
    React.useState(false);

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

  const handleBloodGlucoseReminders = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBloodGlucoseReminders(event.target.checked);
  };

  const handleInsulinInjectionReminders = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInsulinInjectionReminders(event.target.checked);
  };

  const handleSubcriptionReminders = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSubscriptionReminders(event.target.checked);
    subscribeToPushNotifications(handlePopUp, setSubscriptionReminders);
  };

  // Retrieve notification preference information, if it doesnt exist, create it
  useEffect(() => {
    async function fetchNotificationPreference() {
      const data = {
        permissionGranted: false,
        activityReminders: false,
        medicationReminders: false,
        appointmentReminders: false,
        foodIntakeReminders: false,
        glucoseMeasurementReminders: false,
        insulinDosageReminders: false,
      };
      // Get current notification permissions
      if ("Notification" in window) {
        const currentPermission = Notification.permission;
        if (currentPermission === "default" || currentPermission === "denied") {
          // Reset all values to false if subscription is set to false and update the user's information in the database
          try {
            // Attempt to get current information
            const existingPreferences = await getNotificationPreference();

            // Set all to false
            if (existingPreferences && existingPreferences.data) {
              try {
                setSubscriptionReminders(false);
                setActivityReminders(false);
                setMedicationReminders(false);
                setAppointmentReminders(false);
                setFoodIntakeReminders(false);
                setBloodGlucoseReminders(false);
                setInsulinInjectionReminders(false);
                const updatedData = {
                  permissionGranted: false,
                  activityReminders: checkedActivityReminders,
                  medicationReminders: checkedMedicationReminders,
                  appointmentReminders: checkedAppointmentReminders,
                  foodIntakeReminders: checkedFoodIntakeReminders,
                  glucoseMeasurementReminders: checkedBloodGlucoseReminders,
                  insulinDosageReminders: checkedInsulinInjectionReminders,
                };

                const result = await updateNotificationPreference(updatedData);
              } catch (error) {
                logger.error(
                  "Error updating notification preference for user:",
                  error
                );
                setErrorAlert(true);
              }
            }
          } catch (error) {
            try {
              const createdResult = await createNotificationPreference(data);
            } catch (error) {
              logger.error(
                "Error creating notification preference for user:",
                error
              );
            }
          }
        } else {
          try {
            // Retrieve user current values
            setSubscriptionReminders(true);
            const userId = user?.uid || "";
            const result = await getNotificationPreference();
            logger.info("Retrieved notification preference of user:", result);
            if (result && result.data) {
              logger.info(result.data.activityReminders);
              setActivityReminders(result.data.activityReminders);
              setMedicationReminders(result.data.medicationReminders);
              setAppointmentReminders(result.data.appointmentReminders);
              setFoodIntakeReminders(result.data.foodIntakeReminders);
              setBloodGlucoseReminders(result.data.glucoseMeasurementReminders);
              setInsulinInjectionReminders(result.data.insulinDosageReminders);
              logger.info("Notification preference information all set!");

              // Check if previous permission was not granted
              if (result.data.permissionGranted === false) {
                if (
                  "serviceWorker" in navigator &&
                  navigator.serviceWorker.controller
                ) {
                  // Create subscription object for users
                  navigator.serviceWorker.controller.postMessage({
                    action: "subscribeToPush",
                  });

                  // Update info in database
                  result.data.permissionGranted = true;
                  await updateNotificationPreference(result.data);
                }
              }
            }
          } catch (error) {
            // Notification preference doesn't exist, create it
            try {
              const createdResult = await createNotificationPreference(data); // Assuming createNotificationPreference handles creation
              if (
                "serviceWorker" in navigator &&
                navigator.serviceWorker.controller
              ) {
                // Create subscription object for users
                navigator.serviceWorker.controller.postMessage({
                  action: "subscribeToPush",
                });
              }
            } catch (error) {
              logger.error(
                "Error creating notification preference of user:",
                error
              );
            }
          }
        }
      }
    }
    fetchNotificationPreference();
  }, []);

  const onSubmit = async () => {
    try {
      // Check if user is subscribed to push notifications first
      const currentPermission = Notification.permission;
      if (currentPermission === "default" || currentPermission === "denied") {
        setSubscriptionReminders(false);
        setActivityReminders(false);
        setMedicationReminders(false);
        setAppointmentReminders(false);
        setFoodIntakeReminders(false);
        setBloodGlucoseReminders(false);
        setInsulinInjectionReminders(false);
        handlePopUp(
          "error",
          "Please enable browser notifications before changing any of the preference settings"
        );
      } else {
        const data = {
          permissionGranted: true,
          activityReminders: checkedActivityReminders,
          medicationReminders: checkedMedicationReminders,
          appointmentReminders: checkedAppointmentReminders,
          foodIntakeReminders: checkedFoodIntakeReminders,
          glucoseMeasurementReminders: checkedBloodGlucoseReminders,
          insulinDosageReminders: checkedInsulinInjectionReminders,
        };
        const result = await updateNotificationPreference(data);
        setSuccessAlert(true);
      }
    } catch (error) {
      logger.error("Error updating notification preference for user:", error);
      setErrorAlert(true);
    }
  };

  return (
    <div className="bg-eggshell min-h-screen flex flex-col">
      <div>
        <button onClick={() => router.push("/settings")}>
          <Header headerText="Push Notifications" />
        </button>
      </div>
      <div>
        {/* Success Alert */}
        {successAlert && (
          <Alert
            onClose={() => {
              setSuccessAlert(false);
            }}
            variant="outlined"
            severity="success"
          >
            Preference saved!
          </Alert>
        )}

        {/* Error Alert */}
        {errorAlert && (
          <Alert
            onClose={() => {
              setErrorAlert(false);
            }}
            variant="outlined"
            severity="error"
          >
            Preference failed to save!
          </Alert>
        )}
      </div>
      <div className="rounded-3xl bg-white flex flex-col m-auto w-full md:max-w-[800px] md:h-[600px] p-8 mt-2">
        <div className="m-4">
          <Switch
            checked={checkedSubscriptionReminders}
            onChange={handleSubcriptionReminders}
            inputProps={{ "aria-label": "SubscriptionSwitch" }}
          />
          <span className="text-darkgrey text-base not-italic font-medium font-IBM Plex Sans text-lg ">
            Enable Push Notifications
          </span>
        </div>
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
        <div className="m-4">
          <Switch
            checked={checkedBloodGlucoseReminders}
            onChange={handleBloodGlucoseReminders}
            inputProps={{ "aria-label": "BloodGlucoseSwitch" }}
          />
          <span className="text-darkgrey text-base not-italic font-medium font-IBM Plex Sans text-lg ">
            Blood Glucose Reminders
          </span>
        </div>
        <div className="m-4">
          <Switch
            checked={checkedInsulinInjectionReminders}
            onChange={handleInsulinInjectionReminders}
            inputProps={{ "aria-label": "InsulinInjectionSwitch" }}
          />
          <span className="text-darkgrey text-base not-italic font-medium font-IBM Plex Sans text-lg ">
            Insulin Injection Reminders
          </span>
        </div>
        <div className="text-center">
          <Button
            type="submit"
            text="Save"
            style={{ width: "50%", height: "50px" }}
            onClick={onSubmit}
          />
        </div>
      </div>
      <div className="md:hidden">
        <br></br>
        <br></br>
        <br></br>
      </div>
    </div>
  );
}
