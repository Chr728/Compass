import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAuth } from "../../contexts/AuthContext";
import { scrape } from "../../http/emergencySituationAPI";
import EmergencySituation from "./page";

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
		scrape: jest.fn().mockResolvedValue({
			success: "SUCCESS",
			data: {
				last_updated: "00:05",
				hospital_name: "Cite de la sante",
				hospital_address: "444 rue de la sante",
				waiting_time: "2:45",
				waiting_people: "34",
				total_people: "89",
				stretcher_occupancy: "20%",
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
		render(<EmergencySituation />);
		await act(async () => {
			jest.advanceTimersByTime(2000);
		});
		await waitFor(() => {
			expect(scrape).toHaveBeenCalled();
		});
	});

	it("All fields are is displayed correctly", async () => {
		render(<EmergencySituation params={{ activityJournal: "1" }} />);
		setTimeout(() => {
			expect(screen.getByText(/Date:/i)).toBeInTheDocument();
			expect(screen.getByText("Time:")).toBeInTheDocument();
			expect(screen.getByText("Activity:")).toBeInTheDocument();
			expect(screen.getByText("Duration(min):")).toBeInTheDocument();
			expect(screen.getByText("Notes:")).toBeInTheDocument();
			expect(screen.getByText("00:05")).toBeInTheDocument();
			expect(screen.getByText("Cite de la sante")).toBeInTheDocument();
			expect(screen.getByText("2:45")).toBeInTheDocument();
			expect(screen.getByText("444 rue de la sante")).toBeInTheDocument();
			expect(screen.getByText("34")).toBeInTheDocument();
			expect(screen.getByText("89")).toBeInTheDocument();
			expect(screen.getByText("20%")).toBeInTheDocument();
		}, 1000);
	});

	it("Cancel button functions correctly", async () => {
		render(<EmergencySituation params={{ activityJournal: "1" }} />);
		setTimeout(() => {
			const cancelButton = screen.getAllByRole("button")[2];
			userEvent.click(cancelButton);
			expect(mockRouter).toHaveBeenCalledWith("/getActivityJournals");
		}, 1000);
	});

	it("Back button redirects to main journals view", async () => {
		render(<EmergencySituation params={{ activityJournal: "1" }} />);
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
