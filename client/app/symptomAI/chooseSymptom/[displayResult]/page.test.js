import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DisplayResult from './page';

const mockRouter = jest.fn();
jest.mock("next/navigation", () => ({
	useRouter: () => {
		return {
			push: mockRouter,
		};
	},
}));

const userData = {
    uid: '1',
}

describe("Logged in user", () => { 
    jest.mock("../../../contexts/AuthContext", () => {
        return {
          useAuth: () =>{
            return {
                user: userData
            }
          }
        };
    });

    beforeEach(async () => {
        await act(async () => {
            render(<DisplayResult params = { { displayResult:  `[[\"abdominal%20pain\"],\"fungal%20infection\"]`} } />);
          });
    })

    it("Results are displayed to the user", () => {
        const symptoms = screen.getByText("abdominal pain");
        const prediction = screen.getByText("fungal infection");

        expect(symptoms).toBeInTheDocument();
        expect(prediction).toBeInTheDocument();
    })

    it("Return button redirects to health menu", async() => { 
        const returnButton = screen.getAllByRole("button")[1];
        userEvent.click(returnButton);
        await waitFor(() => {
            expect(mockRouter).toHaveBeenCalledWith('/health');
        })
    })

    it("Back button redirects to health menu", async() => { 
        const backButton = screen.getAllByRole("button")[0];
        await userEvent.click(backButton);
        await waitFor(() => {
            expect(mockRouter).toHaveBeenCalledWith('/health');
        })
    })
})