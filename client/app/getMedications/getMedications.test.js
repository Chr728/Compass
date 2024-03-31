import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getMedications } from "../http/medicationAPI";
import GetMedicationsPage from "./getMedicationsPage";

beforeEach(async () => {
	await act(async () => {
		render(<GetMedicationsPage />);
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

jest.mock("../http/medicationAPI", () => {
	return {
		getMedications: jest.fn().mockResolvedValue({
			success: "SUCCESS",
			data: [
				{
					uid: "1",
					medicationName: "Advil",
					dateStarted: "2014-01-01",
					time: "08:36",
					dosage: 60,
					unit: "milligram (mg)",
					frequency: "Six times a day",
					route: "Rectal",
					Notes: "Test medication",
				},
			],
		}),

		deleteMedication: async (medicationId) => {
			return {
				status: "SUCCESS",
				data: `Successfully deleted medication.`,
			};
		},
	};
});

test("Fetches medications correctly", async () => {
	await act(async () => {
		jest.advanceTimersByTime(500);
	});
	await waitFor(() => {
		expect(getMedications).toHaveBeenCalled();
	});
});

test("Add an entry button functions correctly", async () => {
	setTimeout(() => {
		const addButton = screen.getAllByRole("button")[1];
		userEvent.click(addButton);
		mockRouter;
		expect(mockRouter).toHaveBeenCalledWith("/createMedication");
	}, 1000);
});

test("Get medications list is displayed correctly", async () => {
	setTimeout(async () => {
		const name = await screen.findByText("advil");
		const dosage = await screen.findByText("60");
		const route = await screen.findByText("Rectal");

		expect(name).toBeInTheDocument();
		expect(dosage).toBeInTheDocument();
		expect(route).toBeInTheDocument();
	}, 1000);
});

test("Message displayed", async () => {
	const message = screen.getByText(
		/Keep track of all medications you take and follow the progress through the time./i
	);
	expect(message).toBeInTheDocument();
});

test("Back button functions correctly", async () => {
	const backButton = screen.getAllByRole("button")[0];
	userEvent.click(backButton);
	await waitFor(() => {
		expect(mockRouter).toHaveBeenCalledWith("/health");
	});
});

test("Get Medication order  list is displayed correctly", async () => {
	setTimeout(async () => {
		const name = screen.findByText("Tylanol");
		const route = screen.findByText("Oral");
		const dosage = screen.findByText("400");

		expect(name).toBeInTheDocument();
		expect(route).toBeInTheDocument();
		expect(dosage).toBeInTheDocument();

		const orderName = screen.getByLabelText("orderDate");
		await userEvent.click(orderName);
		await userEvent.click(orderName);
		const orderRoute = screen.getByLabelText("orderRoute");
		await userEvent.click(orderRoute);
		await userEvent.click(orderRoute);
		const orderDosage = screen.getByLabelText("orderDosage");
		await userEvent.click(orderDosage);
		await userEvent.click(orderDosage);
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
				screen.queryAllByTestId("medication-entry");
			expect(weightEntriesAfterDeletion.length).toBe(0);
		});
	}, 1000);
});
