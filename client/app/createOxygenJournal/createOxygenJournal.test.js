import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { auth } from "../config/firebase";
import { createO2SaturationJournal } from "../http/oxygenJournalAPI";

import CreateOxygenJournalPage from "./createOxygenJournalPage";
const fakeUser = {
	uid: "1",
};
jest.mock("../contexts/AuthContext", () => {
	return {
		useAuth: () => {
			return {
				user: fakeUser,
			};
		},
	};
});

const mockRouter = jest.fn();

jest.mock("next/navigation", () => ({
	useRouter: () => {
		return {
			push: mockRouter,
		};
	},
}));

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

describe("oxygen journal tests", () => {
	beforeEach(() => {
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("oxygen journal entry is created", async () => {
		render(<CreateOxygenJournalPage />);

		const date = screen.getByLabelText("Date");
		const time = screen.getByLabelText("Time");
		const o2sat = screen.getByLabelText("Oxygen Saturation");
		const pulse = screen.getByLabelText("Pulse Rate");
		const activitylevel = screen.getByLabelText("Activity Level");
		const notes = screen.getByLabelText("Notes");
		const submitButton = screen.getAllByRole("button")[2];

		await userEvent.type(date, "2023-09-09");
		await userEvent.type(time, "8:36");
		await userEvent.type(o2sat, "95");
		await userEvent.type(pulse, "85");
		await userEvent.selectOptions(activitylevel, "At rest");
		await userEvent.type(notes, "abc");

		const mockOxygenJournalData = {
			date: date.value,
			time: time.vaue,
			o2sat: o2sat.value,
			pulse: pulse.value,
			activitylevel: activitylevel.value,
			notes: notes.value,
		};

		await userEvent.click(submitButton);

		const mockUserId = "11";

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
			json: jest.fn().mockResolvedValue(mockOxygenJournalData),
		};
		const mockFetch = jest.fn().mockResolvedValue(mockResponse);
		global.fetch = mockFetch;

		const result = await createO2SaturationJournal(
			mockUserId,
			mockOxygenJournalData
		);

		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/o2Saturation/user/${mockUserId}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${mockToken}`,
				},
				body: '"11"',
			}
		);
		expect(result).toEqual(mockOxygenJournalData);
	});

	it("All fields are displayed to the user", () => {
		render(<CreateOxygenJournalPage />);
		const date = screen.getByLabelText("Date");
		const time = screen.getByLabelText("Time");
		const o2sat = screen.getByLabelText("Oxygen Saturation");
		const pulse = screen.getByLabelText("Pulse Rate");
		const activitylevel = screen.getByLabelText("Activity Level");
		const notes = screen.getByLabelText("Notes");

		expect(date).toBeInTheDocument();
		expect(time).toBeInTheDocument();
		expect(o2sat).toBeInTheDocument();
		expect(pulse).toBeInTheDocument();
		expect(activitylevel).toBeInTheDocument();
		expect(notes).toBeInTheDocument();
	});

	it("Error displayed if any of the fields are empty", async () => {
		render(<CreateOxygenJournalPage />);
		const date = screen.getByLabelText("Date");
		fireEvent.blur(date);
		const time = screen.getByLabelText("Time");
		fireEvent.blur(time);
		const o2sat = screen.getByLabelText("Oxygen Saturation");
		fireEvent.blur(o2sat);
		const activitylevel = screen.getByLabelText("Activity Level");
		fireEvent.blur(activitylevel);
		const pulse = screen.getByLabelText("Pulse Rate");
		fireEvent.blur(pulse);
		const submitButton = screen.getByRole("button", { name: /submit/i });
		userEvent.click(submitButton);

		const errorMessages = await screen.findAllByText(
			"This field can't be left empty.",
			{ exact: false }
		);
		expect(errorMessages.length).toBe(3);

		const error = errorMessages[0];
		expect(error).toBeInTheDocument();

		const error1 = errorMessages[1];
		expect(error1).toBeInTheDocument();
	});

	it("o2sat or pulse cant be zero", async () => {
		render(<CreateOxygenJournalPage />);
		const o2sat = screen.getByLabelText("Oxygen Saturation");
		await userEvent.type(o2sat, "0");
		fireEvent.blur(o2sat);

		const o2satError =
			screen.getByLabelText("Oxygen Saturation").nextElementSibling;
		expect(o2satError.textContent).toBe(
			"This field can't be left empty or zero."
		);

		const pulse = screen.getByLabelText("Pulse Rate");
		await userEvent.type(pulse, "0");
		fireEvent.blur(pulse);

		const pulseError =
			screen.getByLabelText("Pulse Rate").nextElementSibling;
		expect(pulseError.textContent).toBe(
			"This field can't be left empty or zero."
		);
	});

	it("o2sat or pulse cant be negative", async () => {
		render(<CreateOxygenJournalPage />);

		const o2sat = screen.getByLabelText("Oxygen Saturation");
		userEvent.clear(o2sat);
		userEvent.type(o2sat, `${parseInt("-1")}`);
		fireEvent.blur(o2sat);

		await waitFor(() => {
			const o2satError =
				screen.getByLabelText("Oxygen Saturation").nextElementSibling;
			expect(o2satError.textContent).toBe(
				"You can't enter a negative Oxygen Saturation level or a level of Saturation of zero."
			);
		});

		const pulse = screen.getByLabelText("Pulse Rate");
		userEvent.clear(pulse);
		userEvent.type(pulse, `${parseInt("-1")}`);
		fireEvent.blur(pulse);

		await waitFor(() => {
			const pulseError =
				screen.getByLabelText("Pulse Rate").nextElementSibling;
			expect(pulseError.textContent).toBe(
				"You can't enter a negative pulse or a pulse of zero."
			);
		});
	});

	it("Cancel button redirects to getOxygenJournals page", async () => {
		render(<CreateOxygenJournalPage />);
		const cancelButton = screen.getAllByRole("button")[1];
		await userEvent.click(cancelButton);
		await mockRouter;
		expect(mockRouter).toHaveBeenCalledWith("/getOxygenJournals");
	});
});
