import "@testing-library/jest-dom";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { getHealthNews } from "../http/healthNewsAPI";
import HealthNews from "./healthNews";

jest.mock("../contexts/PropContext", () => ({
  __esModule: true,
  useProp: jest.fn(() => ({
    handlePopUp: jest.fn(),
  })),
}));

beforeEach(async () => {
	await act(async () => {
		render(<HealthNews />);
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

jest.mock("../http/healthNewsAPI", () => {
	return {
		getHealthNews: jest.fn().mockResolvedValue({
			success: "SUCCESS",
			data: [
				{

				},
			],
		}),
	};
});

test("Fetches health news correctly", async () => {
	await act(async () => {
		jest.advanceTimersByTime(500);
	});
	await waitFor(() => {
		expect(getHealthNews).toHaveBeenCalled();
	});
});

test("Back button functions correctly", async () => {
	const backButton = screen.getAllByRole("button")[0];
	userEvent.click(backButton);
	await waitFor(() => {
		expect(mockRouter).toHaveBeenCalledWith("/health");
	});
});