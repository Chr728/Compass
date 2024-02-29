import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useUser } from "../contexts/UserContext";
import { getActivityJournals } from "../http/activityJournalAPI";
import GetActivityJournalsPage from "./getActivityJournalsPage";

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
		useUser: jest.fn(),
	};
});

jest.mock("../http/activityJournalAPI", () => {
	return {
		getActivityJournals: jest.fn().mockResolvedValue({
			success: "SUCCESS",
			data: [
				{
					uid: "1",
					date: "2014-01-01",
					time: "08:36",
					activity: "running",
					duration: 60,
					Notes: "I am feeling good today",
				},
			],
		}),

		deleteActivityJournal: async (activityJournalId) => {
			return {
				status: "SUCCESS",
				data: `Successfully deleted activity Journal.`,
			};
		},
	};
});

describe("User is logged in", () => {
	beforeEach(async () => {
		useUser.mockImplementation(() => {
			return {
				userInfo: {
					uid: "1",
				},
			};
		});

		await act(async () => {
			render(<GetActivityJournalsPage />);
		});
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	test("Fetches activity journals correctly", async () => {
		await act(async () => {
			jest.advanceTimersByTime(500);
		});
		await waitFor(() => {
			expect(getActivityJournals).toHaveBeenCalled();
		});
	});

	test("Add an entry button  functions correctly", async () => {
		setTimeout(() => {
			const addButton = screen.getAllByRole("button")[1];
			userEvent.click(addButton);
			mockRouter;
			expect(mockRouter).toHaveBeenCalledWith("/createActivityJournal");
		}, 1000);
	});

	test("Get Activity Journals list is displayed correctly", async () => {
		setTimeout(() => {
			const date = screen.findByText("Jan 1, 2014");
			const activity = screen.findByText("running");
			const height = screen.findByText("60");

			expect(date).toBeInTheDocument();
			expect(activity).toBeInTheDocument();
			expect(height).toBeInTheDocument();
		}, 1000);
	});

	// checks the texts
	test("Message displayed", async () => {
		const message = screen.getByText(
			/Manage your daily activities to help you stay fit. People with active lifestyles are often happier and healthier./i
		);
		expect(message).toBeInTheDocument();
	});

	test("Back button functions correctly", async () => {
		const backButton = screen.getAllByRole("button")[0];
		await userEvent.click(backButton);
		await waitFor(() => {
			expect(mockRouter).toHaveBeenCalledWith("/journals");
		});
	});
});

test("Get Activity order Journals list is displayed correctly", async () => {
	setTimeout(async () => {
		const date = screen.findByText("Jan 1, 2014");
		const activity = screen.findByText("running");
		const duration = screen.findByText("60");

		expect(date).toBeInTheDocument();
		expect(activity).toBeInTheDocument();
		expect(duration).toBeInTheDocument();

		const orderDate = screen.getByLabelText("orderDate");
		await userEvent.click(orderDate);
		await userEvent.click(orderDate);
		const orderActivity = screen.getByLabelText("orderActivity");
		await userEvent.click(orderActivity);
		await userEvent.click(orderActivity);
		const orderDuration = screen.getByLabelText("orderDuration");
		await userEvent.click(orderDuration);
		await userEvent.click(orderDuration);
	}, 1000);
});
