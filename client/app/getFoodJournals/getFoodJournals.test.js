import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getFoodIntakeJournals } from "../http/foodJournalAPI";
import GetFoodJournalsPage from "./getFoodJournalsPage";

beforeEach(async () => {
	await act(async () => {
		render(<GetFoodJournalsPage />);
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

jest.mock("../http/foodJournalAPI", () => {
	return {
		getFoodIntakeJournals: jest.fn().mockResolvedValue({
			success: "SUCCESS",
			data: [
				{
					uid: "1",
					date: "2014-01-01",
					time: "8:36",
					foodName: "pasta",
					servingNumber: 2,
					mealType: "Lunch",
					Notes: "I am feeling good today",
				},
			],
		}),

		deleteFoodJournal: async (foodJournalId) => {
			return {
				status: "SUCCESS",
				data: `Successfully deleted Food Journal.`,
			};
		},
	};
});

test("Fetches food journals correctly", async () => {
	await act(async () => {
		jest.advanceTimersByTime(500);
	});
	await waitFor(() => {
		expect(getFoodIntakeJournals).toHaveBeenCalled();
	});
});

test("Add an entry button functions correctly", async () => {
	setTimeout(() => {
		const addButton = screen.getAllByRole("button")[1];
		userEvent.click(addButton);
		expect(mockRouter).toHaveBeenCalledWith("/createFoodJournal");
	}, 1000);
});

test("Get Food order Journals list is displayed correctly", async () => {
	setTimeout(async () => {
		const date = screen.findByText("Jan 1, 2014");
		const time = await screen.findByText("8h36");
		const foodName = screen.findByText("pizza");

		expect(date).toBeInTheDocument();
		expect(time).toBeInTheDocument();
		expect(foodName).toBeInTheDocument();
		const canvasElement = screen.getByTestId("foodChart");
		expect(canvasElement).toBeInTheDocument();
		const orderDate = screen.getByLabelText("orderDate");
		await userEvent.click(orderDate);
		await userEvent.click(orderDate);
		const orderName = screen.getByLabelText("orderName");
		await userEvent.click(orderName);
		await userEvent.click(orderName);
	}, 1000);
});

test("Get Food Journals list is displayed correctly", async () => {
	setTimeout(() => {
		const date = screen.findByText("Jan 1, 2014 8h36");
		const foodName = screen.findByText("pasta");

		expect(date).toBeInTheDocument();
		expect(foodName).toBeInTheDocument();
	}, 1000);
});

// checks the texts
test("Message displayed", async () => {
	const message = screen.getByText(/Keep track of what you eat each day./i);
	expect(message).toBeInTheDocument();
});

test("Message displayed", async () => {
	const message = screen.getByText(
		/Remember, eating healthy is all about eating the right foods in the right amounts./i
	);
	expect(message).toBeInTheDocument();
});

test("Back button functions correctly", async () => {
	const backButton = screen.getAllByRole("button")[0];
	userEvent.click(backButton);
	await waitFor(() => {
		expect(mockRouter).toHaveBeenCalledWith("/journals");
	});
});
