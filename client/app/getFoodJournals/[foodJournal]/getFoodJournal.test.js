import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAuth } from "../../contexts/AuthContext";
import { getFoodIntakeJournal } from "../../http/foodJournalAPI";
import GetFoodJournal from "./page";

const mockRouter = jest.fn();

jest.mock("next/navigation", () => ({
	useRouter: () => {
		return {
			push: mockRouter,
		};
	},
}));

jest.mock("../../http/foodJournalAPI", () => {
	return {
		getFoodIntakeJournal: jest.fn().mockResolvedValue({
			success: "SUCCESS",
			data: {
				uid: "1",
				date: "Jan 1, 2014",
				time: "08:36",
				foodName: "pasta",
				servingNumber: 2,
				calorie: 100,
				mealType: "Lunch",
				notes: "I am still Hungry",
			},
		}),
	};
});

jest.mock("../../contexts/AuthContext", () => {
	return {
		useAuth: jest.fn(),
	};
});

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

describe("User is logged in", () => {
	beforeEach(() => {
		useAuth.mockImplementation(() => {
			return {
				user: {
					uid: "1",
				},
			};
		});
	});

	test("User data is displayed correctly", async () => {
		render(<GetFoodJournal params={{ foodJournal: "1" }} />);
		await waitFor(
			() => {
				expect(screen.getByText("Date:")).toBeInTheDocument();
				expect(screen.getByText("Time:")).toBeInTheDocument();
				expect(screen.getByText("Name of Food:")).toBeInTheDocument();
				expect(screen.getByText("Meal Type:")).toBeInTheDocument();
				expect(
					screen.getByText("Number of Servings:")
				).toBeInTheDocument();
				expect(screen.getByText("Calories:")).toBeInTheDocument();
				expect(screen.getByText("Notes:")).toBeInTheDocument();
				expect(screen.getByText("Jan 1, 2014")).toBeInTheDocument();
				expect(screen.getByText("8h36")).toBeInTheDocument();
				expect(screen.getByText("pasta")).toBeInTheDocument();
				expect(screen.getByText("Lunch")).toBeInTheDocument();
				expect(screen.getByText("2")).toBeInTheDocument();
				expect(screen.getByText("100")).toBeInTheDocument();
				expect(
					screen.getByText("I am still Hungry")
				).toBeInTheDocument();
			},
			{ timeout: 2000 }
		);
	});

	test("Cancel button functions correctly", async () => {
		render(<GetFoodJournal params={{ foodJournal: "1" }} />);
		setTimeout(() => {
			const cancelButton = screen.getAllByRole("button")[2];
			userEvent.click(cancelButton);
			mockRouter;
			expect(mockRouter).toHaveBeenCalledWith("/getFoodJournals");
		}, 1000);
	});

	test("Update button functions correctly", async () => {
		render(<GetFoodJournal params={{ foodJournal: "1" }} />);
		setTimeout(() => {
			const updateButton = screen.getAllByRole("button")[1];
			userEvent.click(updateButton);
			mockRouter;
			expect(mockRouter).toHaveBeenCalledWith("/editFoodJournals/1");
		}, 1000);
	});

	test("Fetches food journal correctly", async () => {
		render(<GetFoodJournal params={{ foodJournal: "1" }} />);
		await act(async () => {
			jest.advanceTimersByTime(1000);
		});
		await waitFor(() => {
			expect(getFoodIntakeJournal).toHaveBeenCalled();
		});
	});
});
