import { render, screen, fireEvent } from "@testing-library/react";
import { useRouter } from "next/navigation";
import Notification from "./page";
import "@testing-library/jest-dom";

//Mock useRouter from next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

//Mock back from next Router
const mockRouterBack = jest.fn();

//Setitng useRouter mock behaviour before executing tests
beforeAll(() => {
  useRouter.mockReturnValue({
    query: {},
    back: mockRouterBack,
  });
});

describe("Notification Settings Page", () => {
  //Test to check if page is rendered correctly with proper text and button
  test("Renders correct content and button", () => {
    render(<Notification></Notification>);
    const PushNotificationsHeader =
      screen.getAllByText(/Push Notifications/i)[0];
    const ActivityReminders = screen.getByText(/Activity Reminders/i);
    const MedicationReminders = screen.getByText(/Medication Reminders/i);
    const AppointmentReminders = screen.getByText(/Appointment Reminders/i);
    const FoodIntakeReminders = screen.getByText(/Food Intake Reminders/i);
    const BackButton = screen.getAllByRole("button")[0];
    const Save = screen.getAllByRole("button")[1];

    expect(PushNotificationsHeader).toBeInTheDocument();
    expect(ActivityReminders).toBeInTheDocument();
    expect(MedicationReminders).toBeInTheDocument();
    expect(AppointmentReminders).toBeInTheDocument();
    expect(FoodIntakeReminders).toBeInTheDocument();

    expect(BackButton).toBeInTheDocument();
    fireEvent.click(BackButton);
    expect(mockRouterBack).toHaveBeenCalledTimes(1);

    expect(Save).toBeInTheDocument();
    fireEvent.click(Save);
  });

  test("Check if switch button works", () => {
    render(<Notification></Notification>);
    const toggleButtonActvity = screen.getByLabelText("ActvitySwitch");
    const toggleButtonMedication = screen.getByLabelText("MedicationSwitch");
    const toggleButtonAppointment = screen.getByLabelText("AppointmentSwitch");
    const toggleButtonFoodIntake = screen.getByLabelText("FoodIntakeSwitch");
    expect(toggleButtonActvity).toBeChecked();
    expect(toggleButtonMedication).toBeChecked();
    expect(toggleButtonAppointment).toBeChecked();
    expect(toggleButtonFoodIntake).toBeChecked();
    fireEvent.click(toggleButtonActvity);
    fireEvent.click(toggleButtonMedication);
    fireEvent.click(toggleButtonAppointment);
    fireEvent.click(toggleButtonFoodIntake);
    expect(toggleButtonActvity).not.toBeChecked();
    expect(toggleButtonMedication).not.toBeChecked();
    expect(toggleButtonAppointment).not.toBeChecked();
    expect(toggleButtonFoodIntake).not.toBeChecked();
  });
});
