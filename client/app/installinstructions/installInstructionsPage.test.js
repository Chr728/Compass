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
    const androidButton = screen.getByText("Android");
    const iosButton = screen.getByText("iOS");

    expect(androidButton).toBeInTheDocument();
    expect(iosButton).toBeInTheDocument();
  });

  test("renders instructions after selecting a platform", () => {
    render(<InstallInstructions />);
    const androidButton = screen.getByText("Android");
    fireEvent.click(androidButton);

    // You can check for specific elements or texts within the Instructions component here
    const instructionText = screen.getByText(
      "Follow these steps to install on your android device:"
    );
    expect(instructionText).toBeInTheDocument();
  });

  test("allows navigation between steps in instructions", () => {
    render(<InstallInstructions />);
    const androidButton = screen.getByText("Android");
    fireEvent.click(androidButton);

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    // Assert that the content for the next step is rendered
    const stepTwoText = screen.getByText(
      "Follow these steps to install on your android device:"
    );
    expect(stepTwoText).toBeInTheDocument();
  });

  test("allows navigation back to platform selection", () => {
    render(<InstallInstructions />);
    const androidButton = screen.getByText("Android");
    fireEvent.click(androidButton);

    const backButton = screen.getByText("Back");
    fireEvent.click(backButton);

    // Assert that the platform selection buttons are rendered again
    const androidButtonAfterBack = screen.getByText("Android");
    const iosButtonAfterBack = screen.getByText("iOS");
    expect(androidButtonAfterBack).toBeInTheDocument();
    expect(iosButtonAfterBack).toBeInTheDocument();
  });

  test("Routes to settings page on button click", () => {
    const mockPush = jest.fn();
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));

    render(<InstallInstructions />);
    const backButton = screen.getByText("Install Instructions");

    fireEvent.click(backButton);
    expect(mockPush).toHaveBeenCalledWith("/login");
  });
});
