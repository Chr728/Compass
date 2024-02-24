import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import EditMedication from "./page";
import { updateMedication } from "../../../http/medicationAPI";
import { useAuth } from "../../../contexts/AuthContext";
import { auth } from "../../../config/firebase";

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

describe("Edit medications page", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    useAuth.mockImplementation(() => {
      return {
        user: { uid: "AKSODN#KLAD12nkvs" },
      };
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    useAuth.mockImplementation(() => {
      return {
        user: null,
      };
    });
  });

  it("All fields are displayed to the user", async () => {
    render(<EditMedication params={{ medication: "123" }} />);
    await waitFor(async () => {
      const heading = screen.getByText("Edit Medication");
      const name = screen.getByLabelText(/Medication Name/i);
      const date = screen.getByLabelText(/Date Started/i);
      const expirationDate = screen.getByLabelText(/Expiration date/i);
      const time = screen.getByLabelText(/Time/i);
      const dosage = screen.getByLabelText(/Dosage/i);
      const unit = screen.getByLabelText(/Unit/i);
      const frequency = screen.getByLabelText(/Frequency/i);
      const route = screen.getByLabelText(/Route/i);
      const notes = screen.getByLabelText("Notes");

      expect(heading).toBeInTheDocument();
      expect(name).toBeInTheDocument();
      expect(date).toBeInTheDocument();
      expect(expirationDate).toBeInTheDocument();
      expect(time).toBeInTheDocument();
      expect(dosage).toBeInTheDocument();
      expect(unit).toBeInTheDocument();
      expect(frequency).toBeInTheDocument();
      expect(route).toBeInTheDocument();
      expect(notes).toBeInTheDocument();
    });
  });

  it("All buttons are displayed to the user", async () => {
    render(<EditMedication params={{ medication: "123" }} />);
    await waitFor(async () => {
      const cancelButton = screen.getAllByRole("button")[0];
      const submitButton = screen.getAllByRole("button")[1];
      expect(cancelButton).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();
    });
  });

  it("Error displayed if mandatory fields are left empty", async () => {
    render(<EditMedication params={{ medication: "123" }} />);
    const name = screen.getByRole("textbox", { name: /name/i });
    await userEvent.clear(name);
    fireEvent.blur(name);
    const dosage = screen.getByLabelText(/Dosage/i);
    await userEvent.clear(dosage);
    fireEvent.blur(dosage);
    const unit = screen.getByLabelText(/Unit/i);
    await userEvent.selectOptions(unit, [""]);
    fireEvent.blur(unit);
    const frequency = screen.getByLabelText(/Frequency/i);
    await userEvent.selectOptions(frequency, [""]);
    fireEvent.blur(frequency);
    const route = screen.getByLabelText(/Route/i);
    await userEvent.selectOptions(route, [""]);
    fireEvent.blur(route);

    const errorMessages = await screen.findAllByText(
      /This field cannot be left empty./i
    );

    expect(errorMessages.length).toBe(5);
  });

  it("Error displayed if dosage value is negative", async () => {
    render(<EditMedication params={{ medication: "123" }} />);
    await waitFor(async () => {
      const dosage = screen.getByLabelText(/Dosage/i);
      await userEvent.type(dosage, "-7");
      fireEvent.blur(dosage);
      const errorMessage = await screen.findByText(
        "This field cannot be negative or zero."
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it("Error displayed if dosage value is zero", async () => {
    render(<EditMedication params={{ medication: "123" }} />);
    await waitFor(async () => {
      const dosage = screen.getByLabelText(/Dosage/i);
      await userEvent.type(dosage, "0");
      fireEvent.blur(dosage);
      const errorMessage = await screen.findByText(
        "This field cannot be negative or zero."
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });

  it("Should update a medication entry", async () => {
    const mockUserId = "11";
    const mockMedicationID = "123";
    render(<EditMedication params={{ medication: "123" }} />);
    const name = screen.getByRole("textbox", { name: /name/i });
    const date = screen.getByLabelText(/Date Started/i);
    const expirationDate = screen.getByLabelText(/Expiration Date/i);
    const time = screen.getByLabelText(/Time/i);
    const dosage = screen.getByLabelText(/Dosage/i);
    const unit = screen.getByLabelText(/Unit/i);
    const frequency = screen.getByLabelText(/Frequency/i);
    const route = screen.getByLabelText(/Route/i);
    const notes = screen.getByLabelText("Notes");
    const submitButton = screen.getAllByRole("button")[2];

    await userEvent.type(name, "Zopiclone");
    await userEvent.type(date, "2023-09-09");
    await userEvent.type(expirationDate, "2023-09-09");
    await userEvent.type(dosage, "1");
    await userEvent.selectOptions(frequency, "Twice a day");

    const mockMedicationData = {
      name: name.value,
      date: date.value,
      expirationDate: expirationDate.value,
      time: time.value,
      dosage: dosage.value,
      unit: unit.value,
      frequency: frequency.value,
      route: route.value,
      notes: notes.value,
    };

    await userEvent.click(submitButton);

    const mockToken = "mockToken";
    const mockCurrentUser = {
      uid: mockUserId,
      getIdToken: jest.fn().mockResolvedValue(mockToken),
    };

    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(mockMedicationData),
    };

    const mockFetch = jest.fn().mockResolvedValue(mockResponse);
    global.fetch = mockFetch;

    Object.defineProperty(auth, "currentUser", {
      get: jest.fn().mockReturnValue(mockCurrentUser),
    });

    const result = await updateMedication(
      mockUserId,
      mockMedicationID,
      mockMedicationData
    );

    expect(mockFetch).toHaveBeenCalledWith(
      `${process.env.NEXT_PUBLIC_API_URL}/api/medication/${mockUserId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${mockToken}`,
        },
        body: '"123"',
      }
    );
    expect(result).toEqual(mockMedicationData);
  });

  it("Cancel button redirects to getMedications page", async () => {
    render(<EditMedication params={{ medication: "123" }} />);
    const cancelButton = screen.getAllByRole("button")[1];
    await userEvent.click(cancelButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalled();
  });
});
