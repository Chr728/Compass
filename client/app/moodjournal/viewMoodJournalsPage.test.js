import "@testing-library/jest-dom";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { deleteMoodJournal } from "../http/moodJournalAPI";
import ViewMoodJournalsPage from "./viewMoodJournalsPage.tsx";

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

jest.mock("../contexts/AuthContext", () => {
	return {
		useAuth: () => {
			return {
				user: userData,
			};
		},
	};
});

beforeEach(async () => {
	await act(async () => {
		render(<ViewMoodJournalsPage />);
	});
});

jest.mock("../http/moodJournalAPI", () => {
	return {
		getMoodJournals: () => {
			return {
				success: "SUCCESS",
				data: [
					{
						date: "2023-10-17T00:00:00.000Z",
						howAreYou: "awesome",
						id: 4,
						notes: "abcd",
						stressSignals: {
							tired: "always",
							sleep: "often",
							hunger: "always",
							overeating: "often",
							depressed: "always",
							pressure: "sometimes",
							anxiety: "always",
							attention: "sometimes",
							anger: "always",
							headache: "never",
						},
						time: "10:00:00",
					},
				],
			};
		},

		deleteMoodJournal: async (moodJournalId) => {
			return {
				status: "SUCCESS",
				data: `Successfully deleted mood journal entry.`,
			};
		},
	};
});

test("Mood journal is displayed correctly", async () => {
	setTimeout(() => {
		const date = screen.findByText("Oct 17, 2023");
		const notes = screen.findByText("abcd");
		const canvasElement = screen.getByTestId("moodChart");
		expect(canvasElement).toBeInTheDocument();
		expect(date).toBeInTheDocument();
		expect(notes).toBeInTheDocument();
	}, 500);
});

test("Clicking on the delete button calls the delete function", async () => {
	setTimeout(() => {
		const deleteBtn = screen.getByText("Delete");
		const moodJournalId = "1";
		userEvent.click(deleteBtn);
		const result = deleteMoodJournal(moodJournalId);
		expect(result.status).toEqual("SUCCESS");
		expect(result.data).toEqual("Successfully deleted mood journal entry.");
	}, 500);
});

test("Click on the filters", async () => {
	const orderDate = screen.getByLabelText("orderDate");
	await userEvent.click(orderDate);
	await userEvent.click(orderDate);
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
			const moodEntriesAfterDeletion =
				screen.queryAllByTestId("mood-entry");
			expect(moodEntriesAfterDeletion.length).toBe(0);
		});
	}, 1000);
})
