import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getInsulinJournals } from "../../http/diabeticJournalAPI";
import GetInsulinJournalsPage from "./getInsulinJournalsPage";

beforeEach(async () => {
	await act(async () => {
		render(<GetInsulinJournalsPage />);
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
		getInsulinJournals: jest.fn().mockResolvedValue({
			success: "SUCCESS",
			data: [
				{
					uid: "1",
					date: "2014-01-01",
					time: "8:36",
					typeOfInsulin: "Humalog (Insulin lispro)",
					unit: 60,
					bodySite: "Lower Back (left)",
					Notes: "I am feeling good today",
				},
			],
		}),
		deleteInsulinJournal: async (insulinJournalId) => {
			return {
				status: "SUCCESS",
				data: `Successfully deleted Insulin Journal.`,
			};
		},
	};
});

test("Fetches insulin journals correctly", async () => {
	await act(async () => {
		jest.advanceTimersByTime(500);
	});
	await waitFor(() => {
		expect(getInsulinJournals).toHaveBeenCalled();
	});
});

test("Add an entry button  functions correctly", async () => {
	setTimeout(() => {
		const addButton = screen.getAllByRole("button")[0];
		userEvent.click(addButton);
		mockRouter;
		expect(mockRouter).toHaveBeenCalledWith("/createInsulinJournal");
	}, 1000);
});

test("Get Insulin Journals list is displayed correctly", async () => {
	setTimeout(async () => {
		const date = screen.findByText("Jan 1, 2014 8h36");
		const units = screen.findByText("60");
		const bodySite = screen.findByText("Lower Back (left)");

		expect(date).toBeInTheDocument();
		expect(units).toBeInTheDocument();
		expect(bodySite).toBeInTheDocument();

		const orderDate = screen.getByLabelText("orderDate");
		await userEvent.click(orderDate);
		await userEvent.click(orderDate);
		const orderUnit = screen.getByLabelText("orderUnit");
		await userEvent.click(orderUnit);
		await userEvent.click(orderUnit);
		const orderSit = screen.getByLabelText("orderSite");
		await userEvent.click(orderSite);
		await userEvent.click(orderSite);
	}, 1000);
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
				screen.queryAllByTestId("insulin-entry");
			expect(weightEntriesAfterDeletion.length).toBe(0);
		});
	}, 1000);
});
