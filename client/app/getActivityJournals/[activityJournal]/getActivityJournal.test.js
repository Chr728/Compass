import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAuth } from "../../contexts/AuthContext";
import { getActivityJournal } from "../../http/activityJournalAPI";
import GetActivityJournal from "./page";

const mockRouter = jest.fn();
const mockUsePathname = jest.fn();

jest.mock("next/navigation", () => ({
	useRouter: () => {
		return {
			push: mockRouter,
		};
	},
	usePathname: () => mockUsePathname(),
}));

jest.mock("../../contexts/AuthContext", () => {
	return {
		useAuth: jest.fn(),
	};
});

jest.mock("../../http/activityJournalAPI", () => {
	return {
		getActivityJournal: jest.fn().mockResolvedValue({
			success: "SUCCESS",
			data: {
				id: "1",
				date: "Jan 1,2014",
				time: "8:36",
				activity: "activity",
				duration: "3",
				notes: "this is a note",
			},
		}),
	};
});
describe("Getting an activity journal", () => {
	beforeEach(() => {
		useAuth.mockImplementation(() => {
			return {
				user: { uid: "AKSODN#KLAD12nkvs" },
			};
		});
	});

	it("Fetches activity journal correctly", async () => {
		render(<GetActivityJournal params={{ activityJournal: "1" }} />);
		await act(async () => {
			jest.advanceTimersByTime(2000);
		});
		await waitFor(() => {
			expect(getActivityJournal).toHaveBeenCalled();
		});
	});

	it("All fields are is displayed correctly", async () => {
		render(<GetActivityJournal params={{ activityJournal: "1" }} />);
		setTimeout(() => {
			expect(screen.getByText(/Date:/i)).toBeInTheDocument();
			expect(screen.getByText("Time:")).toBeInTheDocument();
			expect(screen.getByText("Activity:")).toBeInTheDocument();
			expect(screen.getByText("Duration(min):")).toBeInTheDocument();
			expect(screen.getByText("Notes:")).toBeInTheDocument();
			expect(screen.getByText("Jan 1, 2014")).toBeInTheDocument();
			expect(screen.getByText("8h36")).toBeInTheDocument();
			expect(screen.getByText("Swimming")).toBeInTheDocument();
			expect(screen.getByText("45")).toBeInTheDocument();
			expect(screen.getByText("notes")).toBeInTheDocument();
		}, 1000);
	});

	it("Cancel button functions correctly", async () => {
		render(<GetActivityJournal params={{ activityJournal: "1" }} />);
		setTimeout(() => {
			const cancelButton = screen.getAllByRole("button")[2];
			userEvent.click(cancelButton);
			expect(mockRouter).toHaveBeenCalledWith("/getActivityJournals");
		}, 1000);
	});

	it("Back button redirects to main journals view", async () => {
		render(<GetActivityJournal params={{ activityJournal: "1" }} />);
		const button = screen.getAllByRole("button")[0];
		await userEvent.click(button);
		expect(mockRouter).toHaveBeenCalledWith("/getActivityJournals");
	});

	it("Edit button functions correctly", async () => {
		render(<GetActivityJournal params={{ activityJournal: "1" }} />);
		setTimeout(async () => {
			const editButton = screen.getAllByRole("button")[1];
			userEvent.click(editButton);
			await waitFor(() => {
				expect(mockRouter).toHaveBeenCalledWith(
					"/getActivityJournals/1/1"
				);
			});
		}, 1000);
	});
});

test("Get Activity Journals list is displayed correctly", async () => {
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
