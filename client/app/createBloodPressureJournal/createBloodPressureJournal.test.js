import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { auth } from "../config/firebase";
import CreateBloodPressureJournalPage from "./createBloodPressureJournalPage";
import { createBloodPressureJournal } from "../http/bloodPressureJournalAPI";



const mockRouter = jest.fn();

const fakeUser = {
	uid: "1",
};

jest.mock("next/navigation", () => ({
	useRouter: () => {
		return {
			push: mockRouter,
		};
	},
}));

jest.mock("../contexts/AuthContext", () => {
	return {
		useAuth: () => {
			return {
				user: fakeUser,
			};
		},
	};
});

describe("Blood Pressure Journal tests", () => {
	beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("Blood pressure journal entry is created on submitting", async () => {
		const mockUserId = "11";
		render(<CreateBloodPressureJournalPage />);

		const submitButton = screen.getByRole("button", { name: /Submit/i });
		const date = screen.getByLabelText("Date");
		const time = screen.getByLabelText("Time");
		const bloodPressure = screen.getByLabelText("Blood Pressure");
		const pulse = screen.getByLabelText("Pulse Rate");
		const notes = screen.getByLabelText("Notes");

		await userEvent.type(date, "2023-09-09");
		await userEvent.type(time, "8:36");
		await userEvent.type(bloodPressure, "120/80");
		await userEvent.type(pulse, "20");
		await userEvent.type(notes, "abc");

		const mockBloodPressureJournalData = {
			date: date.value,
			time: time.value,
			bloodPressure: bloodPressure.value,
			pulse: pulse.value,
			notes: notes.value,
		};

		await userEvent.click(submitButton);

		const mockToken = "mockToken";
		const mockCurrentUser = {
			uid: mockUserId,
			getIdToken: jest.fn().mockResolvedValue(mockToken),
		};

		Object.defineProperty(auth, "currentUser", {
			get: jest.fn().mockReturnValue(mockCurrentUser),
		});

		const mockResponse = {
			ok: true,
			json: jest.fn().mockResolvedValue(mockBloodPressureJournalData),
		};
		const mockFetch = jest.fn().mockResolvedValue(mockResponse);
		global.fetch = mockFetch;

		const result = await createBloodPressureJournal(
			mockUserId,
			mockBloodPressureJournalData
		);

		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/bloodPressure/user/${mockUserId}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${mockToken}`,
				},
				body: '"11"',
			}
		);
		expect(result).toEqual(mockBloodPressureJournalData);
	});

	it("All fields are displayed to the user", () => {
		render(<CreateBloodPressureJournalPage />);
		const date = screen.getByLabelText("Date");
		const time = screen.getByLabelText("Time");
		const bloodPressure = screen.getByLabelText("Blood Pressure");
		const pulse = screen.getByLabelText("Pulse Rate");
		const notes = screen.getByLabelText("Notes");

		expect(date).toBeInTheDocument();
		expect(time).toBeInTheDocument();
		expect(bloodPressure).toBeInTheDocument();
		expect(pulse).toBeInTheDocument();
		expect(notes).toBeInTheDocument();
	});

	it("Error displayed if any of the fields are empty", async () => {
		render(<CreateBloodPressureJournalPage />);
		const date = screen.getByLabelText("Date");
		fireEvent.blur(date);
		const time = screen.getByLabelText("Time");
		fireEvent.blur(time);
		const bloodPressure = screen.getByLabelText("Blood Pressure");
		fireEvent.blur(bloodPressure);
		const pulse = screen.getByLabelText("Pulse Rate");
		fireEvent.blur(pulse);
		const submitButton = screen.getByRole("button", { name: /submit/i });
		userEvent.click(submitButton);

		const errorMessages = await screen.findAllByText(
			"This field can't be left empty.",
			{ exact: false }
		);
		expect(errorMessages.length).toBe(4);

		const error = errorMessages[0];
		expect(error).toBeInTheDocument();

		const error1 = errorMessages[1];
		expect(error1).toBeInTheDocument();

        const error2 = errorMessages[2];
		expect(error2).toBeInTheDocument();

        const error3 = errorMessages[3];
		expect(error3).toBeInTheDocument();
	});

	it("Blood Pressure cannot be in the wrong format", async () => {
		render(<CreateBloodPressureJournalPage />);
		const bloodPressure = screen.getByLabelText("Blood Pressure");
		await userEvent.type(bloodPressure, "0");
		fireEvent.blur(bloodPressure);

		const bloodPressureError = screen.getByLabelText("Blood Pressure").nextElementSibling;
		expect(bloodPressureError.textContent).toBe(
			"Blood pressure must be of the correct format (e.g. 120/80)."
		);
	});

	it("Cancel button redirects to getBloodPressureJournals page", async () => {
		render(<CreateBloodPressureJournalPage />);
		const cancelButton = screen.getAllByRole("button")[1];
		await userEvent.click(cancelButton);
		await mockRouter;
		expect(mockRouter).toHaveBeenCalledWith("/getBloodPressureJournals");
	});
});

test("Back button redirects to getBloodPressureJournals page", async () => {
	render(<CreateBloodPressureJournalPage/>);
	const backButton = screen.getAllByRole('button')[0];
	await userEvent.click(backButton);
	await mockRouter;
	expect(mockRouter).toHaveBeenCalledWith('/getBloodPressureJournals');
})
