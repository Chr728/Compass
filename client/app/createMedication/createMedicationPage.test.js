import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { auth } from "../config/firebase";
import { useAuth } from "../contexts/AuthContext";
import { createMedication } from "../http/medicationAPI";
import CreateMedicationPage from "./createMedicationPage";

// Mock sessionStorage
const mockSessionStorage = {
	getItem: jest.fn(),
};
Object.defineProperty(window, "sessionStorage", {
	value: mockSessionStorage,
});

describe("CreateMedicationPage", () => {
	test("renders image when imageDataUrl is available", () => {
		// Set up mocked imageDataUrl
		const imageDataUrl = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQE...";
		mockSessionStorage.getItem.mockReturnValue(imageDataUrl);

		// Render the component
		render(<CreateMedicationPage />);

		// Assert the presence of the image
		const pillImage = screen.getByAltText("Selected Image");
		expect(pillImage).toBeInTheDocument();
		expect(pillImage).toBeVisible();
		expect(pillImage).toHaveAttribute(
			"src",
			decodeURIComponent(imageDataUrl)
		);
		expect(pillImage).toHaveAttribute("width", "250");
		expect(pillImage).toHaveAttribute("height", "250");
	});

	test("does not render image when imageDataUrl is not available", () => {
		// Ensure no imageDataUrl is provided
		mockSessionStorage.getItem.mockReturnValue(null);

		// Render the component
		render(<CreateMedicationPage />);

		// Assert that the image is not rendered
		const pillImage = screen.queryByAltText("Selected Image");
		expect(pillImage).not.toBeInTheDocument();
	});
});

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

describe("Medication tests for logged in user", () => {
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
	});

	it("All fields are displayed to the user", () => {
		render(<CreateMedicationPage />);
		const heading = screen.getByText("Add Other Medications");
		const name = screen.getByLabelText(/Medication Name/i);
		const date = screen.getByLabelText(/Date Started/i);
		const time = screen.getByLabelText(/Time/i);
		const dosage = screen.getByLabelText(/Dosage/i);
		const unit = screen.getByLabelText(/Unit/i);
		const frequency = screen.getByLabelText(/Frequency/i);
		const route = screen.getByLabelText(/Route/i);
		const notes = screen.getByLabelText("Notes");
		expect(heading).toBeInTheDocument();
		expect(name).toBeInTheDocument();
		expect(date).toBeInTheDocument();
		expect(time).toBeInTheDocument();
		expect(dosage).toBeInTheDocument();
		expect(unit).toBeInTheDocument();
		expect(frequency).toBeInTheDocument();
		expect(route).toBeInTheDocument();
		expect(notes).toBeInTheDocument();
	});

	test("All buttons are displayed to the user", () => {
		render(<CreateMedicationPage />);
		const cancelButton = screen.getAllByRole("button")[0];
		const submitButton = screen.getAllByRole("button")[1];
		expect(cancelButton).toBeInTheDocument();
		expect(submitButton).toBeInTheDocument();
	});

	it("Error displayed if mandatory fields are left empty", async () => {
		render(<CreateMedicationPage />);
		const name = screen.getByRole("textbox", { name: /name/i });
		fireEvent.blur(name);
		const date = screen.getByLabelText(/Date Started/i);
		fireEvent.blur(date);
		const time = screen.getByLabelText(/Time/i);
		fireEvent.blur(time);
		const dosage = screen.getByLabelText(/Dosage/i);
		fireEvent.blur(dosage);
		const unit = screen.getByLabelText(/Unit/i);
		fireEvent.blur(unit);
		const frequency = screen.getByLabelText(/Frequency/i);
		fireEvent.blur(frequency);
		const route = screen.getByLabelText(/Route/i);
		fireEvent.blur(route);

		const errorMessages = await screen.findAllByText(
			"This field cannot be left empty."
		);
		expect(errorMessages.length).toBe(7);
	});

	it("Error displayed if dosage value is negative", async () => {
		render(<CreateMedicationPage />);
		const dosage = screen.getByLabelText(/Dosage/i);
		await userEvent.type(dosage, "-7");
		fireEvent.blur(dosage);
		const errorMessage = await screen.findByText(
			"This field cannot be negative or zero."
		);
		expect(errorMessage).toBeInTheDocument();
	});

	it("Error displayed if dosage value is zero", async () => {
		render(<CreateMedicationPage />);
		const dosage = screen.getByLabelText(/Dosage/i);
		await userEvent.type(dosage, "0");
		fireEvent.blur(dosage);
		const errorMessage = await screen.findByText(
			"This field cannot be negative or zero."
		);
		expect(errorMessage).toBeInTheDocument();
	});

	it("Should create a medication entry", async () => {
		const mockUserId = "11";
		render(<CreateMedicationPage />);
		const name = screen.getByRole("textbox", { name: /name/i });
		const date = screen.getByLabelText(/Date Started/i);
		const time = screen.getByLabelText(/Time/i);
		const dosage = screen.getByLabelText(/Dosage/i);
		const unit = screen.getByLabelText(/Unit/i);
		const frequency = screen.getByLabelText(/Frequency/i);
		const route = screen.getByLabelText(/Route/i);
		const notes = screen.getByLabelText(/Notes/i);
		const submitButton = screen.getAllByRole("button")[2];

		await userEvent.type(name, "Zopiclone");
		await userEvent.type(date, "2023-09-09");
		await userEvent.type(dosage, "1");
		await userEvent.selectOptions(frequency, "Twice a day");

		const mockMedicationData = {
			name: name.value,
			date: date.value,
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

		const result = await createMedication(mockUserId, mockMedicationData);

		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/medication/user/${mockUserId}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${mockToken}`,
				},
				body: '"11"',
			}
		);
		expect(result).toEqual(mockMedicationData);
	});

	it("Cancel button redirects to getMedications page", async () => {
		render(<CreateMedicationPage />);
		const cancelButton = screen.getAllByRole("button")[1];
		await userEvent.click(cancelButton);
		await mockRouter;
		expect(mockRouter).toHaveBeenCalledWith("/getMedications");
	});
});
