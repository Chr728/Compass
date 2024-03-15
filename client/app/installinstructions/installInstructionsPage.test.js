import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import InstallInstructions from "./page";
import { useRouter } from "next/navigation";

//Mock useRouter from next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Install instructions page", () => {
  test("renders platform selection buttons", () => {
    render(<InstallInstructions />);
    const appLogo = screen.getByAltText("App Logo");
    const androidButton = screen.getByText("Android");
    const iosButton = screen.getByText("iOS");

    expect(appLogo).toBeInTheDocument();
    expect(androidButton).toBeInTheDocument();
    expect(iosButton).toBeInTheDocument();
  });

  test("allows platform selection for android", () => {
    render(<InstallInstructions />);
    const androidButton = screen.getByText("Android");

    fireEvent.click(androidButton);
    expect(
      screen.queryByText("Please choose the platform of your choice")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Android")).not.toBeInTheDocument();
    expect(screen.queryByText("iOS")).not.toBeInTheDocument();
  });

  test("allows platform selection for ios", () => {
    render(<InstallInstructions />);
    const iosButton = screen.getByText("iOS");

    fireEvent.click(iosButton);
    expect(
      screen.queryByText("Please choose the platform of your choice")
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Android")).not.toBeInTheDocument();
    expect(screen.queryByText("iOS")).not.toBeInTheDocument();
  });

  test("handles going back from instructions", () => {
    render(<InstallInstructions />);
    const androidButton = screen.getByText("Android");
    fireEvent.click(androidButton);

    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);

    // Your assertions for returning to platform selection
    const androidButtonAgain = screen.getByText("Android");
    expect(androidButtonAgain).toBeInTheDocument();
  });

  test("handles back button click in instructions", () => {
    render(<InstallInstructions />);
    const androidButton = screen.getByText("Android");

    fireEvent.click(androidButton);

    const backButton = screen.getByText("Back");

    // Navigate to a different step
    fireEvent.click(screen.getByText("Next"));

    // Click the back button
    fireEvent.click(backButton);

    // Should go back to platform selection
    expect(
      screen.getByText("Please choose the platform of your choice")
    ).toBeInTheDocument();
  });

  test("Routes to settings page on button click", () => {
    const mockPush = jest.fn();
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));

    render(<InstallInstructions />);
    const backButton = screen.getByText("Installation Instructions");

    fireEvent.click(backButton);
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
