import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SymptomMainPage from './symptomMainPage'

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
    jest.mock("../contexts/AuthContext", () => {
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
            render(<SymptomMainPage />);
          });
    })

    it("Disclaimer is shown to the user", () => {

        const text1 = screen.getByText(/We know you might be worried you are sick and knowing what is wrong may give you a better idea on how to take care of yourself./i)
        const text2 = screen.getByText(/Pick out all the signs and symptoms you are currently feeling and our AI will try its best to make an approximate prediction./i)
        const text3 = screen.getByText(/Usage of this AI is subject to agreement to the following terms and conditions:/i)
        const condition1 = screen.getByText(/The result that will not be displayed is not a diagnosis./i)
        const condition2 = screen.getByText(/This checkup is for informational purposes and is not a replacement to qualified medical opinion./i)
        const condition3 = screen.getByText(/Information that you provide is anonymous and not shared with anyone. We do not store any information on our server./i)
        const condition4 = screen.getByText(/If you need immediate medical attention, please contact emergency medical services right away./i)
        const agreementBox = screen.getByText(/I agree to the aforementioned terms and conditions./i)
        const submitButton = screen.getAllByRole('button')[1];

        expect(text1).toBeInTheDocument();
        expect(text2).toBeInTheDocument();
        expect(text3).toBeInTheDocument();
        expect(condition1).toBeInTheDocument();
        expect(condition2).toBeInTheDocument();
        expect(condition3).toBeInTheDocument();
        expect(condition4).toBeInTheDocument();
        expect(agreementBox).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    })

    it("Error message displayed if checkbox not ticked", async() => {
    
        const submitButton = screen.getAllByRole('button')[1];
        userEvent.click(submitButton);

        const errorText = await screen.findByText(/Must agree to proceed./i)
        expect(errorText).toBeInTheDocument();
    })

    it("Back button redirects to health menu", async() => {
        const backButton = screen.getAllByRole('button')[0];
        userEvent.click(backButton);
        await waitFor(() => {
            expect(mockRouter).toBeCalledWith('/health');
        })
    })

    it("Redirected to choose symptoms page upon clicking Start", async() => {
        const checkbox = screen.getByRole('checkbox');
        const submitButton = screen.getAllByRole('button')[1];
        userEvent.click(checkbox);
        userEvent.click(submitButton);

        setTimeout( async() => {
            expect(mockRouter).toBeCalledWith('/symptomAI/chooseSymptom');
        }, 1000)
       
    })
})