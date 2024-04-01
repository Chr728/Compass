import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getGlucoseJournals } from "../../http/diabeticJournalAPI";
import GetGlucoseJournalsPage from "./getGlucoseJournalsPage";

beforeEach(async () => {
	await act(async () => {
		render(<GetGlucoseJournalsPage />);
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

const userData = {
	uid: "1",
};

jest.mock("../../contexts/UserContext", () => {
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

jest.mock("../../http/diabeticJournalAPI", () => {
	return {
		getGlucoseJournals: jest.fn().mockResolvedValue({
			success: "SUCCESS",
			data: [
				{
					uid: "1",
					date: "2014-01-01",
					mealTime: "Before lunch",
					bloodGlucose: 23,
					unit: "mg/dL",
					Notes: "I am feeling good today",
				},
			],
		}),

		deleteGlucoseJournal: async (glucoseJournalId) => {
			return {
				status: "SUCCESS",
				data: `Successfully deleted Glucose Journal.`,
			};
		},
	};
});

test("Fetches glucose journals correctly", async () => {
	await act(async () => {
		jest.advanceTimersByTime(500);
	});
	await waitFor(() => {
		expect(getGlucoseJournals).toHaveBeenCalled();
	});
});

test("Add an entry button  functions correctly", async () => {
	setTimeout(() => {
		const addButton = screen.getAllByRole("button")[1];
		userEvent.click(addButton);
		mockRouter;
		expect(mockRouter).toHaveBeenCalledWith("/createGlucoseJournal");
	}, 1000);
});

test("Get Glucose Journals list is displayed correctly", async () => {
	setTimeout(async () => {
		const date = screen.findByText("Jan 1, 2014");
		const mealTime = screen.findByText("Before lunch");
		const bloodGlucose = screen.findByText("23");

		expect(date).toBeInTheDocument();
		expect(mealTime).toBeInTheDocument();
		expect(bloodGlucose).toBeInTheDocument();

		const orderDate = screen.getByLabelText("orderDate");
		await userEvent.click(orderDate);
		await userEvent.click(orderDate);
		const orderMeal = screen.getByLabelText("orderMeal");
		await userEvent.click(orderMeal);
		await userEvent.click(orderMeal);
		const orderGlucose = screen.getByLabelText("orderGlucose");
		await userEvent.click(orderGlucose);
		await userEvent.click(orderGlucose);
	}, 1000);
});

// checks the texts
test("Message displayed", async () => {
	const message = screen.getByText(
		/Keep track of your insulin doses and glucose measurements to ensure a healthy lifestyle./i
	);
	expect(message).toBeInTheDocument();
});

test("Selecting all rows and deleting selected rows", async () => {
	setTimeout(async () => {
		const selectAllCheckbox = screen.getAllByRole("checkbox")[0];
		userEvent.click(selectAllCheckbox);

		const checkboxes = screen.getAllByRole("checkbox");
		checkboxes.forEach((checkbox) => {
			expect(checkbox).toBeChecked();
		});

		const deleteButton = screen.getByRole("button", {
			name: "Delete Selected Rows",
		});
		userEvent.click(deleteButton);

		const confirmButton = await screen.findByText("Delete");
		userEvent.click(confirmButton);

		await waitFor(() => {
			const weightEntriesAfterDeletion =
				screen.queryAllByTestId("glucose-entry");
			expect(weightEntriesAfterDeletion.length).toBe(0);
		});
	}, 1000);
});
