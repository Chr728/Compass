import "@testing-library/jest-dom";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getO2SaturationJournals } from "../http/oxygenJournalAPI";
import GetOxygenJournalsPage from "./getOxygenJournalsPage";

beforeEach(async () => {
	await act(async () => {
		render(<GetOxygenJournalsPage />);
	});
});

afterEach(() => {
	cleanup();
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

jest.mock("../http/oxygenJournalAPI", () => {
	return {
		getO2SaturationJournals: jest.fn().mockResolvedValue({
			success: "SUCCESS",
			data: [
				{
					uid: "1",
					date: "2014-01-01",
					time: "8:36",
					o2sat: "96",
					pulse: 101,
					unit: "At rest",
					Notes: "Test",
				},
			],
		}),

		deleteOxygenJournal: async (oxygenJournalId) => {
			return {
				status: "SUCCESS",
				data: `Successfully deleted oxygen Journal.`,
			};
		},
	};
});

test("Fetches oxygen entries correctly", async () => {
	await act(async () => {
		jest.advanceTimersByTime(1000);
	});
	await waitFor(() => {
		expect(getO2SaturationJournals).toHaveBeenCalled();
	});
});

test("Add an entry button  functions correctly", async () => {
	setTimeout(() => {
		const addButton = screen.getAllByRole("button")[1];
		userEvent.click(addButton);
		mockRouter;
		expect(mockRouter).toHaveBeenCalledWith("/createOxygenJournal");
	}, 1000);
});

test("Get Oxygen Journals list is displayed correctly", async () => {
	setTimeout(() => {
		const date = screen.findByText("Jan 1, 2014 8h36");
		const o2sat = screen.findByText("96");
		const pulse = screen.findByText("101");

		expect(date).toBeInTheDocument();
		expect(o2sat).toBeInTheDocument();
		expect(pulse).toBeInTheDocument();
	}, 1000);
});

// checks the texts
test("Message displayed", async () => {
	const message = screen.getByText(
		/With your pulse oximeter, log your observations here in one go!/i
	);
	expect(message).toBeInTheDocument();
});

test("Get Oxygen order Journals list is displayed correctly", async () => {
	setTimeout(async () => {
		const date = screen.findByText("Jan 1, 2014");
		const time = await screen.findByText("8h36");
		const o2sat = screen.findByText("96");
		const pulse = screen.findByText("101");

		expect(date).toBeInTheDocument();
		expect(time).toBeInTheDocument();
		expect(o2sat).toBeInTheDocument();
		expect(pulse).toBeInTheDocument();

		const orderDate = screen.getByLabelText("orderDate");
		await userEvent.click(orderDate);
		await userEvent.click(orderDate);
		const orderO2 = screen.getByLabelText("orderO2");
		await userEvent.click(orderO2);
		await userEvent.click(orderO2);
		const orderPulse = screen.getByLabelText("orderPulse");
		await userEvent.click(orderPulse);
		await userEvent.click(orderPulse);
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
				screen.queryAllByTestId("oxygen-entry");
			expect(weightEntriesAfterDeletion.length).toBe(0);
		});
	}, 1000);
});
