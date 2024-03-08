import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import GetOxygenJournal from "./page";
import { useAuth } from "../../contexts/AuthContext";

const mockRouter = jest.fn();
const mockUsePathname = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => {
    return {
      push: mockRouter,
    };
  },
  usePathname: () => mockUsePathname(),
}));

jest.mock("../../contexts/AuthContext", () => {
  return {
    useAuth: jest.fn(),
  };
});

jest.mock("../../http/oxygenJournalAPI", () => {
  return {
    getBloodPressureJournal: jest.fn().mockResolvedValue({
      success: "SUCCESS",
      data: {
        id: "1",
        date: "Jan 1,2014",
        time: "8:36",
        o2sat: 120,
        pulse: "80",
        notes: "this is a note",
      },
    }),
  };
});

describe("Getting a oxygen journal", () => {
  beforeEach(() => {
    useAuth.mockImplementation(() => {
      return {
        user: { uid: "AKSODN#KLAD12nkvs" },
      };
    });
  });

  it("All fields are is displayed correctly", async () => {
    render(<GetOxygenJournal params={{ oxygenJournal: "1" }} />);
    setTimeout(() => {
      expect(screen.getByText(/Date:/i)).toBeInTheDocument();
      expect(screen.getByText(/Time:/i)).toBeInTheDocument();
      expect(screen.getByText(/O\u2082 Saturation:/i)).toBeInTheDocument();
      expect(screen.getByText(/Pulse Rate:/i)).toBeInTheDocument();
      expect(screen.getByText(/Activity Level:/i)).toBeInTheDocument();
      expect(screen.getByText(/Notes/i)).toBeInTheDocument();
      expect(screen.getByText("Jan 1, 2014")).toBeInTheDocument();
      expect(screen.getByText("8h36")).toBeInTheDocument();
      expect(screen.getByText("120")).toBeInTheDocument();
      expect(screen.getByText("80")).toBeInTheDocument();
      expect(screen.getByText("this is a note")).toBeInTheDocument();
    }, 1000);
  });

  it("Cancel button functions correctly", async () => {
    render(<GetOxygenJournal params={{ oxygenJournal: "1" }} />);
    setTimeout(() => {
      const cancelButton = screen.getAllByRole("button")[2];
      userEvent.click(cancelButton);
      expect(mockRouter).toHaveBeenCalledWith("/getOxygenJournals");
    }, 1000);
  });

  it("Back button redirects to main journals view", async () => {
    render(<GetOxygenJournal params={{ oxygenJournal: "1" }} />);
    const button = screen.getAllByRole("button")[0];
    await userEvent.click(button);
    expect(mockRouter).toHaveBeenCalledWith("/getOxygenJournals");
  });
});
