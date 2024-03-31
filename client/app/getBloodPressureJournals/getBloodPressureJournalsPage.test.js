import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import GetBloodPressureJournalsPage from "./getBloodPressureJournalsPage";
import { useAuth } from "../contexts/AuthContext";
import { getBloodPressureJournals } from "../http/bloodPressureJournalAPI";

const mockRouter = jest.fn();
jest.mock("next/navigation", () => ({
	useRouter: () => {
		return {
			push: mockRouter,
		};
	},
}));

jest.mock("../contexts/AuthContext", () => {
	return {
		useAuth: jest.fn(),
	};
});

jest.mock("../http/bloodPressureJournalAPI", () => {
	return {
		getBloodPressureJournals: jest.fn().mockResolvedValue({
			success: "SUCCESS",
			data: [
				{
					uid: "1",
					date: "2014-01-01",
					time: "08:36",
					systolic: "120",
                    diastolic: "80",
					pulse: 20,
					Notes: "Note",
				},
			],
		}),

		deleteBloodPressureJournalEntry: async (bloodPressureJournalID) => {
			return {
				status: "SUCCESS",
				data: `Successfully deleted blood pressure journal.`,
			};
		},
	};
});


describe("User is logged in", () => {

    beforeEach(async () => {

        useAuth.mockImplementation(() => {
            return {
                user: {
                    uid: "1",
                },
            };
        });

        await act(async () => {
            render(<GetBloodPressureJournalsPage />);
        });
    })

	afterEach(() => {
		jest.resetAllMocks();
	});

    it("Header text displayed correctly", async () => {
		const header = screen.getByText(
			/Maintain your blood pressure at a healthy level at all times and keep track of your results here./i
		);
		expect(header).toBeInTheDocument();
	});

    it("Fetches blood pressure journals correctly", async () => {
		await waitFor(() => {
			expect(getBloodPressureJournals).toHaveBeenCalled();
		});
	});

    it("Add an entry button functions correctly", async () => {
		setTimeout(() => {
			const addButton = screen.getAllByRole("button")[1];
			userEvent.click(addButton);
			mockRouter;
			expect(mockRouter).toHaveBeenCalledWith("/createBloodPressureJournal");
		}, 1000);
	});

    it("Back button functions correctly", async () => {
		const backButton = screen.getAllByRole("button")[0];
		await userEvent.click(backButton);
		await waitFor(() => {
			expect(mockRouter).toHaveBeenCalledWith("/journals");
		});
	});

    it("Blood pressure journals list is displayed correctly", async () => {
		setTimeout(() => {
			const date = screen.findByText("Jan 1, 2014");
			const time = screen.findByText("8h36");
			const bloodPressure = screen.findByText("120/80");
            const pulse = screen.findByText("20");

			expect(date).toBeInTheDocument();
			expect(time).toBeInTheDocument();
			expect(bloodPressure).toBeInTheDocument();
            expect(pulse).toBeInTheDocument();
		}, 1000);
	});

	it("Selecting all rows and deleting selected rows", async () => {
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
				const journalEntriesAfterDeletion =
					screen.queryAllByTestId("bp-entry");
				expect(journalEntriesAfterDeletion.length).toBe(0);
			});
		}, 1000);
	})


})
