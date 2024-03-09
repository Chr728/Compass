import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditOxygenJournal from "./page";
import { useAuth } from "../../../contexts/AuthContext";
import { getO2SaturationJournal } from "../../../http/oxygenJournalAPI";

const mockRouter = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => {
    return {
      push: mockRouter,
    };
  },
}));

jest.mock("../../../contexts/AuthContext", () => {
  return {
    useAuth: jest.fn(),
  };
});

jest.mock("../../../http/oxygenJournalAPI", () => {
  return {
    getO2SaturationJournal: jest.fn().mockResolvedValue({
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
    updateO2SaturationJournal: jest.fn(),
  };
});

describe("User is logged in", () => {
  beforeEach(async () => {
    useAuth.mockImplementation(() => {
      return {
        user: {
          uid: "1",
        },
      };
    });
  });

  it("Form submits correctly", async () => {
    const updateO2SaturationJournal = jest.fn();
    render(<EditOxygenJournal params={{ oxygenJournal: "1" }} />);
    await getO2SaturationJournal();
    const date = screen.getByLabelText("Date");
    const time = screen.getByLabelText("Time");
    const oxygenSaturation = screen.getByLabelText(/Oxygen Saturation/i);
    const pulse = screen.getByLabelText(/Pulse Rate/i);
    const notes = screen.getByLabelText("Notes");
    const submitButton = screen.getAllByRole("button")[2];

    expect(date).toBeInTheDocument();
    expect(time).toBeInTheDocument();
    expect(oxygenSaturation).toBeInTheDocument();
    expect(pulse).toBeInTheDocument();
    expect(notes).toBeInTheDocument();

    userEvent.click(submitButton);
    setTimeout(() => {
      expect(updateO2SaturationJournal).toHaveBeenCalledTimes(1);
    }, 1000);
  });

  it("Cancel button works correctly", async () => {
    render(<EditOxygenJournal params={{ oxygenJournal: "1" }} />);
    await getO2SaturationJournal();
    const cancelButton = screen.getAllByRole("button")[1];
    await userEvent.click(cancelButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith(`/getOxygenJournals/1`);
  });

  it("Back button works correctly", async () => {
    render(<EditOxygenJournal params={{ oxygenJournal: "1" }} />);
    await getO2SaturationJournal();
    const backButton = screen.getAllByRole("button")[0];
    await userEvent.click(backButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith(`/getOxygenJournals/1`);
  });

  it("Submit button works correctly", async () => {
    render(<EditOxygenJournal params={{ oxygenJournal: "1" }} />);
    await getO2SaturationJournal();
    const submitButton = screen.getAllByRole("button")[2];
    await userEvent.click(submitButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith(`/getOxygenJournals/1`);
  });
});
