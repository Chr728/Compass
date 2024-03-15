import "@testing-library/jest-dom";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getWeightJournals } from "../http/weightJournalAPI";
import GetWeightJournalsPage from "./getWeightJournalsPage";

beforeEach(async () => {
	await act(async () => {
		render(<GetWeightJournalsPage />);
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

jest.mock("../http/weightJournalAPI", () => {
	return {
		getWeightJournals: jest.fn().mockResolvedValue({
			success: "SUCCESS",
			data: [
				{
					uid: "1",
					date: "2014-01-01",
					time: "8:36",
					weight: "75.5",
					height: 1.65,
					unit: "kg",
					Notes: "I am feeling good today",
				},
			],
		}),

		deleteWeightJournal: async (weightJournalId) => {
			return {
				status: "SUCCESS",
				data: `Successfully deleted weight Journal.`,
			};
		},
	};
});

test("Fetches weight entries correctly", async () => {
	await act(async () => {
		jest.advanceTimersByTime(500);
	});
	await waitFor(() => {
		expect(getWeightJournals).toHaveBeenCalled();
	});
});

test("Add an entry button  functions correctly", async () => {
	setTimeout(() => {
		const addButton = screen.getAllByRole("button")[1];
		userEvent.click(addButton);
		mockRouter;
		expect(mockRouter).toHaveBeenCalledWith("/createWeightJournal");
	}, 1000);
});

test("Get Weight Journals list is displayed correctly", async () => {
	setTimeout(() => {
		const date = screen.findByText("Jan 1, 2014 8h36");
		const weight = screen.findByText("75.5");
		const height = screen.findByText("1.65cm");
		const canvasElement = screen.getByTestId("weightChart");
		expect(canvasElement).toBeInTheDocument();
		expect(date).toBeInTheDocument();
		expect(weight).toBeInTheDocument();
		expect(height).toBeInTheDocument();
	}, 1000);
});

// checks the texts
test("Message displayed", async () => {
	const message = screen.getByText(
		/Managing your weight helps you stay healthy./i
	);
	expect(message).toBeInTheDocument();
});

test("Message displayed", async () => {
	const message = screen.getByText(
		/our BMI can tell you if you’re at risk for certain health conditions like heart disease./i
	);
	expect(message).toBeInTheDocument();
});

test("Get Weight order Journals list is displayed correctly", async () => {
	setTimeout(async () => {
		const date = screen.findByText("Jan 1, 2014");
		const time = await screen.findByText("8h36");
		const BMI = screen.findByText("19.2");
		const weight = screen.findByText("62");

		expect(date).toBeInTheDocument();
		expect(time).toBeInTheDocument();
		expect(BMI).toBeInTheDocument();
		expect(weight).toBeInTheDocument();

		const orderDate = screen.getByLabelText("orderDate");
		await userEvent.click(orderDate);
		await userEvent.click(orderDate);
		const orderBMI = screen.getByLabelText("orderBMI");
		await userEvent.click(orderBMI);
		await userEvent.click(orderBMI);
		const orderWeight = screen.getByLabelText("orderWeight");
		await userEvent.click(orderWeight);
		await userEvent.click(orderWeight);
	}, 1000);
});
