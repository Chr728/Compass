import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import { useAuth } from "../contexts/AuthContext";
import Health from "./HealthPage";

const mockRouter = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => {
    return {
      push: mockRouter,
    };
  },
}));

jest.mock("../contexts/AuthContext", () => {
  return {
    useAuth: jest.fn(),
  };
});

describe("Health Menu Test", () => {
  it("All elements are displayed to the user", async () => {
    useAuth.mockImplementation(() => {
      return {
        user: { uid: "AKSODN#KLAD12nkvs" },
      };
    });
    render(<Health />);
    await waitFor(async () => {
      const heading = screen.getByText("Your Health");
      const subheading = screen.getByText(
        "Let Compass remove the hassle of recalling when to take your medications and when you have important medical appointments."
      );
      const appointmentBox = screen.getAllByRole("link")[0];
      const medicationBox = screen.getAllByRole("link")[1];
      const snoreDetectionBox = screen.getAllByRole("link")[2];
      const emergencySituation = screen.getAllByRole("link")[3];
      const healthTipsBox = screen.getAllByRole("link")[4];

      expect(heading).toBeInTheDocument();
      expect(subheading).toBeInTheDocument();
      expect(appointmentBox).toBeInTheDocument();
      expect(medicationBox).toBeInTheDocument();
      expect(snoreDetectionBox).toBeInTheDocument();
      expect(emergencySituation).toBeInTheDocument();
      expect(healthTipsBox).toBeInTheDocument();
    });
  });

  it("User not logged in", async () => {
    useAuth.mockImplementation(() => {
      return {
        user: null,
      };
    });
    render(<Health />);
    const text = await screen.findByText("Error 403 - Access Forbidden");
    expect(text).toBeInTheDocument();
  });
});
