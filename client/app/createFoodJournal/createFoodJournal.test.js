import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { auth } from "../config/firebase";
import { createFoodIntakeJournal } from "../http/foodJournalAPI";
import CreateFoodJournalPage from "./createFoodJournalPage";
import { useSearchParams } from "next/navigation";

const fakeUser = {
	uid: "1",
};

jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  useSearchParams: jest.fn(),
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
const mockRouter = jest.fn();
const mockSearchParams = jest.fn();

jest.mock("next/navigation", () => ({
	useRouter: () => {
		return {
			push: mockRouter,
		};
	},
	useSearchParams: () => {
		return {
			get: mockSearchParams
		}
	},
}));
describe("Food journal tests", () => {
	beforeEach(() => {
		// Setup fetch mock
		global.fetch = jest.fn();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("All fields are displayed to the user", () => {
		render(<CreateFoodJournalPage />);
		const date = screen.getByLabelText("Date");
		const time = screen.getByLabelText("Time");
		const foodName = screen.getByLabelText("Name of Food");
		const mealType = screen.getByLabelText("Meal Type");
		const servingsNumber = screen.getByLabelText("Number of Servings");
		const calorie = screen.getByLabelText("Calories");
		const notes = screen.getByLabelText("Notes");

		expect(date).toBeInTheDocument();
		expect(time).toBeInTheDocument();
		expect(foodName).toBeInTheDocument();
		expect(mealType).toBeInTheDocument();
		expect(servingsNumber).toBeInTheDocument();
		expect(calorie).toBeInTheDocument();
		expect(notes).toBeInTheDocument();
	});

	it("Error displayed if any of the fields are empty", async () => {
		render(<CreateFoodJournalPage />);
		const date = screen.getByLabelText("Date");
		fireEvent.blur(date);
		const time = screen.getByLabelText("Time");
		fireEvent.blur(time);
		const foodName = screen.getByLabelText("Name of Food");
		fireEvent.blur(foodName);
		const mealType = screen.getByLabelText("Meal Type");
		fireEvent.blur(mealType);
		const servingsNumber = screen.getByLabelText("Number of Servings");
		fireEvent.blur(servingsNumber);
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

	it("Servings number cant be zero", async () => {
		render(<CreateFoodJournalPage />);
		const servingsNumber = screen.getByLabelText("Number of Servings");
		await userEvent.type(servingsNumber, "0");
		fireEvent.blur(servingsNumber);

		const servingsNumberError =
			screen.getByLabelText("Number of Servings").nextElementSibling;
		expect(servingsNumberError.textContent).toBe(
			"This field can't be left empty or zero."
		);
	});

	it("Servings number cant be negative", async () => {
		render(<CreateFoodJournalPage />);

		const servingsNumber = screen.getByLabelText("Number of Servings");
		userEvent.clear(servingsNumber);
		userEvent.type(servingsNumber, `${parseInt("-1")}`);
		fireEvent.blur(servingsNumber);

		await waitFor(() => {
			const servingsNumberError =
				screen.getByLabelText("Number of Servings").nextElementSibling;
			expect(servingsNumberError.textContent).toBe(
				"You can't enter a negative servings number or a number of zero."
			);
		});
	});

	it("should create a food journal entry for the user", async () => {
		const mockUserId = "11";
		render(<CreateFoodJournalPage />);

		const date = screen.getByLabelText("Date");
		const time = screen.getByLabelText("Time");
		const foodName = screen.getByLabelText("Name of Food");
		const mealType = screen.getByLabelText("Meal Type");
		const servingsNumber = screen.getByLabelText("Number of Servings");
		const calorie = screen.getByLabelText("Calories");
		const notes = screen.getByLabelText("Notes");
		const submitButton = screen.getAllByRole("button")[2];

		await userEvent.type(date, "2023-09-09");
		await userEvent.type(time, "8:36");
		await userEvent.type(foodName, "Pasta");
		await userEvent.selectOptions(mealType, "Lunch");
		await userEvent.type(servingsNumber, "2");
		await userEvent.type(calorie, "100");
		await userEvent.type(notes, "abc");

		const mockFoodIntakeJournalData = {
			date: date.value,
			time: time.value,
			food: foodName.value,
			mealType: mealType.value,
			servingsNumber: servingsNumber.value,
			calorie: calorie.value,
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
			json: jest.fn().mockResolvedValue(mockFoodIntakeJournalData),
		};

		const mockFetch = jest.fn().mockResolvedValue(mockResponse);
		global.fetch = mockFetch;

		Object.defineProperty(auth, "currentUser", {
			get: jest.fn().mockReturnValue(mockCurrentUser),
		});

		const result = await createFoodIntakeJournal(
			mockUserId,
			mockFoodIntakeJournalData
		);

		expect(mockFetch).toHaveBeenCalledWith(
			`${process.env.NEXT_PUBLIC_API_URL}/api/journals/foodIntake/user/${mockUserId}`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${mockToken}`,
				},
				body: '"11"',
			}
		);
		expect(result).toEqual(mockFoodIntakeJournalData);
	});

	it("Cancel button redirects to getFoodJournals page", async () => {
		render(<CreateFoodJournalPage />);
		const cancelButton = screen.getAllByRole("button")[1];
		await userEvent.click(cancelButton);
		await mockRouter;
		expect(mockRouter).toHaveBeenCalledWith("/getFoodJournals");
	});
});

test("Back button redirects to getFoodJournals page", async () => {
	render(<CreateFoodJournalPage/>);
	const backButton = screen.getAllByRole('button')[0];
	await userEvent.click(backButton);
	await mockRouter;
	expect(mockRouter).toHaveBeenCalledWith('/getFoodJournals');
})