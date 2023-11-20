import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import NotificationPage from "./notificationPage";
import "@testing-library/jest-dom";
import { useUser } from "../contexts/UserContext";
import {
  getNotificationPreference,
  updateNotificationPreference,
  createNotificationPreference,
} from "../http/notificationPreferenceAPI";

//Mock useRouter from next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

//Mock back from next Router
const mockRouter = jest.fn();

//Setitng useRouter mock behaviour before executing tests
beforeAll(() => {
  useRouter.mockReturnValue({
    query: {},
    push: mockRouter,
  });
});

const userData = {
  uid: "1",
};

//Mock user
jest.mock("../contexts/UserContext", () => {
  return {
    useUser: () => {
      return {
        userInfo: {
          uid: "1",
        },
      };
    },
  };
});

//Mock http request to get notification preferences
jest.mock("../http/notificationPreferenceAPI", () => {
  return {
    getNotificationPreference: () => {
      return {
        status: "SUCCESS",
        data: [
          {
            uid: "1",
            activityReminders: true,
            appointmentReminders: true,
            foodIntakeReminders: true,
            medicationReminders: true,
          },
        ],
      };
    },
    updateNotificationPreference: jest.fn(),
    createNotificationPreference: jest.fn(),
  };
});

describe("Notification Settings Page", () => {
  //Test to check if page is rendered correctly with proper text and button
  test("Renders correct content and button", async () => {
    render(<NotificationPage />);
    global.alert = jest.fn();
    const PushNotificationsHeader =
      screen.getAllByText(/Push Notifications/i)[0];
    const SubscriptionReminder = screen.getByText(/Enable Push Notifications/i);
    const ActivityReminders = screen.getByText(/Activity Reminders/i);
    const MedicationReminders = screen.getByText(/Medication Reminders/i);
    const AppointmentReminders = screen.getByText(/Appointment Reminders/i);
    const FoodIntakeReminders = screen.getByText(/Food Intake Reminders/i);
    const BloodGlucoseReminders = screen.getByText(/Blood Glucose Reminders/i);
    const InsulinInjectionReminders = screen.getByText(
      /Insulin Injection Reminders/
    );
    const BackButton = screen.getAllByRole("button")[0];
    const Save = screen.getAllByRole("button")[1];

    expect(PushNotificationsHeader).toBeInTheDocument();
    expect(SubscriptionReminder).toBeInTheDocument();
    expect(ActivityReminders).toBeInTheDocument();
    expect(MedicationReminders).toBeInTheDocument();
    expect(AppointmentReminders).toBeInTheDocument();
    expect(FoodIntakeReminders).toBeInTheDocument();
    expect(BloodGlucoseReminders).toBeInTheDocument();
    expect(InsulinInjectionReminders).toBeInTheDocument();

    expect(BackButton).toBeInTheDocument();
    await mockRouter();
    expect(mockRouter).toHaveBeenCalledTimes(1);

    expect(Save).toBeInTheDocument();
    fireEvent.click(Save);
    await updateNotificationPreference;
  });

  test("Check if switch button works", () => {
    render(<NotificationPage />);
    const toggleButtonSubscription =
      screen.getByLabelText("SubscriptionSwitch");
    const toggleButtonActvity = screen.getByLabelText("ActvitySwitch");
    const toggleButtonMedication = screen.getByLabelText("MedicationSwitch");
    const toggleButtonAppointment = screen.getByLabelText("AppointmentSwitch");
    const toggleButtonFoodIntake = screen.getByLabelText("FoodIntakeSwitch");
    const toggleButtonBloodGlucose =
      screen.getByLabelText("BloodGlucoseSwitch");
    const toggleButtonInsulinDosage = screen.getByLabelText(
      "InsulinInjectionSwitch"
    );
    expect(toggleButtonSubscription).not.toBeChecked();
    expect(toggleButtonActvity).toBeChecked();
    expect(toggleButtonMedication).toBeChecked();
    expect(toggleButtonAppointment).toBeChecked();
    expect(toggleButtonFoodIntake).toBeChecked();
    expect(toggleButtonBloodGlucose).toBeChecked();
    expect(toggleButtonInsulinDosage).toBeChecked();
    fireEvent.click(toggleButtonSubscription);
    fireEvent.click(toggleButtonActvity);
    fireEvent.click(toggleButtonMedication);
    fireEvent.click(toggleButtonAppointment);
    fireEvent.click(toggleButtonFoodIntake);
    fireEvent.click(toggleButtonBloodGlucose);
    fireEvent.click(toggleButtonInsulinDosage);
    expect(toggleButtonSubscription).toBeChecked();
    expect(toggleButtonActvity).not.toBeChecked();
    expect(toggleButtonMedication).not.toBeChecked();
    expect(toggleButtonAppointment).not.toBeChecked();
    expect(toggleButtonFoodIntake).not.toBeChecked();
    expect(toggleButtonBloodGlucose).not.toBeChecked();
    expect(toggleButtonInsulinDosage).not.toBeChecked();
  });

  test("Calls router's push method on button click", () => {
    render(<NotificationPage />);
    const button = screen.getByText("Save");
    fireEvent.click(button);
    expect(mockRouter).toHaveBeenCalled();
  });

  test("Routes to settings page on button click", () => {
    const mockPush = jest.fn();
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));

    render(<NotificationPage />);
    const backButton = screen.getByText("Push Notifications");

    fireEvent.click(backButton);
    expect(mockPush).toHaveBeenCalledWith("/settings");
  });
});
