import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CreateWeightJournalPage from './createWeightJournalPage';
import { createWeightJournal } from '../http/weightJournalAPI';
import { auth } from '../config/firebase';

const fakeUser = {
    uid: "1"
}
jest.mock('../contexts/AuthContext', () => {
    return {
        useAuth: () => {
            return {
                user : fakeUser
            }
        }
    }
});

// jest.mock('../http/weightJournalAPI', () => {
//     return {
//         createWeightJournal: jest.fn()
//     }
// });

const mockRouter= jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

jest.mock("../contexts/UserContext", () => {
    return {
      useUser: () =>{
        return {
            userInfo: {
                uid: '1',
            }
        }
      }
    };
  });



describe("weight journal tests", () => {

    beforeEach(() => {
        global.fetch = jest.fn();
      });
    
      afterEach(() => {
        jest.resetAllMocks();
      });
    
    it('weight journal entry is created', async () => {

        render(<CreateWeightJournalPage />);

        const date = screen.getByLabelText("Date");
        const time = screen.getByLabelText("Time");
        const weight = screen.getByLabelText("Weight");
        const height = screen.getByLabelText("Height (in centimeters)");
        const unit = screen.getByLabelText("Unit");
        const notes = screen.getByLabelText("Notes");
        const submitButton = screen.getAllByRole("button")[2];

        await userEvent.type(date, "2023-09-09");
        await userEvent.type(time, "8:36")
        await userEvent.type(weight, "171");
        await userEvent.type(height, "1.75");
        await userEvent.selectOptions(unit, "kg");
        await userEvent.type(notes, "abc");

        const mockWeightJournalData = {
            date: date.value,
            time: time.vaue,
            weight: weight.value,
            height: height.value,
            unit: unit.value,
            notes: notes.value,
        };
        
        await userEvent.click(submitButton);

        const mockUserId = '11';
       
        const mockToken = 'mockToken';
        const mockCurrentUser = {
          uid: mockUserId,
          getIdToken: jest.fn().mockResolvedValue(mockToken),
        };
    
        Object.defineProperty(auth, 'currentUser', {
          get: jest.fn().mockReturnValue(mockCurrentUser),
        });
    
        const mockResponse = {
          ok: true,
          json: jest.fn().mockResolvedValue(mockWeightJournalData),
        };
        const mockFetch = jest.fn().mockResolvedValue(mockResponse);
        global.fetch = mockFetch;
    
        const result = await createWeightJournal(mockUserId, mockWeightJournalData);
    
        expect(mockFetch).toHaveBeenCalledWith(
          `${process.env.NEXT_PUBLIC_API_URL}/api/journals/weight/user/${mockUserId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${mockToken}`,
            },
            body: "\"11\"",
          }
        );
        expect(result).toEqual(mockWeightJournalData);
      });


 
    it("All fields are displayed to the user", () => {
        render(<CreateWeightJournalPage />);
        const date = screen.getByLabelText("Date");
        const time = screen.getByLabelText("Time");
        const weight = screen.getByLabelText("Weight");
        const height = screen.getByLabelText("Height (in centimeters)");
        const unit = screen.getByLabelText("Unit");
        const notes = screen.getByLabelText("Notes");

        expect(date).toBeInTheDocument();
        expect(time).toBeInTheDocument();
        expect(weight).toBeInTheDocument();
        expect(height).toBeInTheDocument();
        expect(unit).toBeInTheDocument();
        expect(notes).toBeInTheDocument();
    })

    it("Error displayed if any of the fields are empty", async () => {
        render(<CreateWeightJournalPage />);
        const date = screen.getByLabelText("Date");
        fireEvent.blur(date);
        const time = screen.getByLabelText("Time");
        fireEvent.blur(time);
        const weight = screen.getByLabelText("Weight");
        fireEvent.blur(weight);
        const unit = screen.getByLabelText("Unit");
        fireEvent.blur(unit);
        const height = screen.getByLabelText("Height (in centimeters)");
        fireEvent.blur(height);
        const submitButton = screen.getByRole('button', { name: /submit/i });
        userEvent.click(submitButton);

        const errorMessages = await screen.findAllByText("This field can't be left empty.", { exact: false });
        expect(errorMessages.length).toBe(3);
      
        const error = errorMessages[0];
        expect(error).toBeInTheDocument();
      
        const error1 = errorMessages[1];
        expect(error1).toBeInTheDocument();
    })

    it("Height or weight cant be zero", async () => {
        render(<CreateWeightJournalPage />);
        const weight = screen.getByLabelText("Weight");
        await userEvent.type(weight, "0");
        fireEvent.blur(weight);
    
        const weightError = screen.getByLabelText("Weight").nextElementSibling;
        expect(weightError.textContent).toBe("This field can't be left empty or zero.");
    
        const height = screen.getByLabelText("Height (in centimeters)");
        await userEvent.type(height, "0");
        fireEvent.blur(height);
    
        const heightError = screen.getByLabelText("Height (in centimeters)").nextElementSibling;
        expect(heightError.textContent).toBe("This field can't be left empty or zero.");
    });
    
    it("Height or weight cant be negative", async () => {
        render(<CreateWeightJournalPage />);
        
        const weight = screen.getByLabelText("Weight");
        userEvent.clear(weight);
        userEvent.type(weight, `${parseInt("-1")}`);
        fireEvent.blur(weight);
      
        await waitFor(() => {
            const weightError = screen.getByLabelText("Weight").nextElementSibling;
            expect(weightError.textContent).toBe("You can't enter a negative weight or a weight of zero.");
        })
      
        const height = screen.getByLabelText("Height (in centimeters)");
        userEvent.clear(height);
        userEvent.type(height, `${parseInt("-1")}`);
        fireEvent.blur(height);

        await waitFor(() => {
            const heightError = screen.getByLabelText("Height (in centimeters)").nextElementSibling;
            expect(heightError.textContent).toBe("You can't enter a negative height or a height of zero.");
        })
    });

    it("Cancel button redirects to getWeightJournals page", async () => {
        render(<CreateWeightJournalPage />);
        const cancelButton = screen.getAllByRole('button')[1];
        await userEvent.click(cancelButton);
        await mockRouter;
        expect(mockRouter).toHaveBeenCalledWith('/getWeightJournals');
    })

})