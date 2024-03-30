import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useProp } from "../contexts/PropContext";
import { createGlucoseJournal } from "../http/diabeticJournalAPI";
import CreateGlucoseJournalPage from "./createGlucoseJournalPage";

jest.mock("../contexts/PropContext", () => ({
	__esModule: true,
	useProp: jest.fn(() => ({
		handlePopUp: jest.fn(),
	})),
}));

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

jest.mock("../http/diabeticJournalAPI", () => {
	return {
		createGlucoseJournal: jest.fn(),
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

test("All fields are displayed to the user", () => {
	render(<CreateGlucoseJournalPage />);
	const date = screen.getByLabelText("Date");
	const mealTime = screen.getByLabelText("Meal Time");
	const bloodGlucose = screen.getByLabelText("Blood Glucose");
	const unit = screen.getByLabelText("Unit");
	const notes = screen.getByLabelText("Notes");

	expect(date).toBeInTheDocument();
	expect(mealTime).toBeInTheDocument();
	expect(bloodGlucose).toBeInTheDocument();
	expect(unit).toBeInTheDocument();
	expect(notes).toBeInTheDocument();
});

test("Error displayed if any of the fields are empty", async () => {
	render(<CreateGlucoseJournalPage />);
	const date = screen.getByLabelText("Date");
	fireEvent.blur(date);
	const mealTime = screen.getByLabelText("Meal Time");
	fireEvent.blur(mealTime);
	const bloodGlucose = screen.getByLabelText("Blood Glucose");
	fireEvent.blur(bloodGlucose);
	const unit = screen.getByLabelText("Unit");
	fireEvent.blur(unit);
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

test("Blood Glucose cant be zero", async () => {
	render(<CreateGlucoseJournalPage />);
	const bloodGlucose = screen.getByLabelText("Blood Glucose");
	await userEvent.type(bloodGlucose, "0");
	fireEvent.blur(bloodGlucose);

	const bloodGlucoseError =
		screen.getByLabelText("Blood Glucose").nextElementSibling;
	expect(bloodGlucoseError.textContent).toBe(
		"This field can't be left empty or zero."
	);
});

test("Blood Glucose cant be negative", async () => {
	render(<CreateGlucoseJournalPage />);

	const bloodGlucose = screen.getByLabelText("Blood Glucose");
	userEvent.clear(bloodGlucose);
	userEvent.type(bloodGlucose, `${parseInt("-1")}`);
	fireEvent.blur(bloodGlucose);

	await waitFor(() => {
		const bloodGlucoseError =
			screen.getByLabelText("Blood Glucose").nextElementSibling;
		expect(bloodGlucoseError.textContent).toBe(
			"You can't enter a negative Blood Glucose or a Blood Glucose of zero."
		);
	});
});

test("Submit button calls createGlucosejournal function", async () => {
	render(<CreateGlucoseJournalPage />);

	await mockRouter;

	const date = screen.getByLabelText("Date");
	const mealTime = screen.getByLabelText("Meal Time");
	const bloodGlucose = screen.getByLabelText("Blood Glucose");
	const unit = screen.getByLabelText("Unit");
	const notes = screen.getByLabelText("Notes");
	const submitButton = screen.getAllByRole("button")[2];

	await userEvent.type(date, "2023-09-09");
	await userEvent.selectOptions(mealTime, "2hrs after breakfast");
	await userEvent.type(bloodGlucose, "85");
	await userEvent.selectOptions(unit, "mmol/L");
	await userEvent.type(notes, "abc");

	await userEvent.click(submitButton);
	await waitFor(() => {
		expect(createGlucoseJournal).toHaveBeenCalled();
		expect(mockRouter).toHaveBeenCalledWith("/getDiabeticJournals");
	});
});

test("Cancel button redirects to getDiabeticJournals page", async () => {
	render(<CreateGlucoseJournalPage />);
	const cancelButton = screen.getAllByRole("button")[1];
	await userEvent.click(cancelButton);
	await mockRouter;
	expect(mockRouter).toHaveBeenCalledWith("/getDiabeticJournals");
});

test("Back button redirects to getDiabeticJournals page", async () => {
	render(<CreateGlucoseJournalPage />);
	const backButton = screen.getAllByRole("button")[0];
	await userEvent.click(backButton);
	await mockRouter;
	expect(mockRouter).toHaveBeenCalledWith("/getDiabeticJournals");
});

describe("handlePopUp tests", () => {
	const mockHandlePopUp = jest.fn();
	useProp.mockReturnValue({ handlePopUp: mockHandlePopUp });

	afterEach(() => {
		jest.resetAllMocks();
	});

	test("handlePopUp is called when an error occurs", async () => {
		createGlucoseJournal.mockImplementation(() =>
			Promise.reject(new Error())
		);

		render(<CreateGlucoseJournalPage />);

		const submitButton = screen.getAllByRole("button")[2];

		await userEvent.click(submitButton);

		await waitFor(() => {
			expect(mockHandlePopUp).toHaveBeenCalled();
		});
	});
});
