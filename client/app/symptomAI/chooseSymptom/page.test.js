import "@testing-library/jest-dom";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChooseSymptoms from './page';
import { sendSymptoms } from '../../http/symptomAPI';

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

jest.mock("../../http/symptomAPI", () => {
	return {
		sendSymptoms: jest.fn(),
	};
});


describe("Logged in user", () => {

    jest.mock("../../contexts/AuthContext", () => {
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
            render(<ChooseSymptoms />);
          });
    })

    it("Symptoms list is shown to the user", async() => {
        const listElement1 = screen.getByText("itching");
        const listElement2 = screen.getByText("skin rash");
        const listElement3 = screen.getByText("nodal skin eruptions");
        const listElement4 = screen.getByText("dischromic patches");

        expect(listElement1).toBeInTheDocument();
        expect(listElement2).toBeInTheDocument();
        expect(listElement3).toBeInTheDocument();
        expect(listElement4).toBeInTheDocument();

    } )

    it("Back button redirects to health menu", async() => {
        const backButton = screen.getAllByRole("button")[0];
        userEvent.click(backButton);
        await waitFor ( () => {
            expect(mockRouter).toHaveBeenCalledWith("/health");
        })
      
    })

    it("Reset button redirects to health menu", async() => {
        const resetButton = screen.getAllByRole("button")[1];
        userEvent.click(resetButton);
        await waitFor ( () => {
            expect(mockRouter).toHaveBeenCalledWith("/health");
        })
      
    })

    it('should handle successful submission', async () => {
        const text = screen.getByText("abdominal pain");
        const submitButton = screen.getAllByRole("button")[2];
        const selectedWords = ['abdominal pain'];
        const result = { result: 'fungal infection' };
        const response = { json: jest.fn().mockResolvedValue(result) };
    
        sendSymptoms.mockResolvedValue(response);

        await userEvent.click(text);

        mockRouter.mockClear();

        await userEvent.click(submitButton);


        await waitFor(() => {
          expect(sendSymptoms).toHaveBeenCalledWith(selectedWords);
          expect(mockRouter).toHaveBeenCalledTimes(1);
          expect(mockRouter).toHaveBeenCalledWith(`/symptomAI/chooseSymptom/[[\"abdominal%20pain\"],\"fungal%20infection\"]`);
        });
    })

    it("should delete the selected word", async() => {
        const symptom1 = screen.getByText("abdominal pain");
        const symptom2 = screen.getByText("obesity");
        const deletedWord = 'obesity'; // Word to be deleted

        await userEvent.click(symptom1);
        await userEvent.click(symptom2);

        const crossIcon = screen.getAllByAltText("Cross icon")[1];
    
        const symptomToDelete = screen.getAllByText(deletedWord)[1];
    
        userEvent.click(crossIcon);
    
        expect(screen.queryByText(symptomToDelete)).toBeNull();
    
      });
})