import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CreateInsulinJournalPage from './createInsulinJournalPage';
import { createInsulinJournal } from '../http/diabeticJournalAPI';
import { useProp } from '../contexts/PropContext';


jest.mock("../contexts/PropContext", () => ({
    __esModule: true,
    useProp: jest.fn(() => ({
      handlePopUp: jest.fn(),
    })),
  }));

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

jest.mock('../http/diabeticJournalAPI', () => {
    return {
        createInsulinJournal: jest.fn()
    }
});

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

 
    test("All fields are displayed to the user", () => {
        render(<CreateInsulinJournalPage/>);
        const date = screen.getByLabelText("Date");
        const time  = screen.getByLabelText("Time");
        const typeOfInsulin = screen.getByLabelText("Type of Insulin");
        const unit = screen.getByLabelText("Units Given");
        const bodySite = screen.getByLabelText("Body Site");
        const notes  = screen.getByLabelText("Notes");

        expect(date).toBeInTheDocument();
        expect(time).toBeInTheDocument();
        expect(typeOfInsulin).toBeInTheDocument();
        expect(unit).toBeInTheDocument();
        expect(bodySite).toBeInTheDocument();
        expect(notes).toBeInTheDocument();
    })

    test("Error displayed if any of the fields are empty", async () => {
        render(<CreateInsulinJournalPage/>);
        const date = screen.getByLabelText("Date");
        fireEvent.blur(date);
        const time = screen.getByLabelText("Time");
        fireEvent.blur(time);
        const typeOfInsulin = screen.getByLabelText("Type of Insulin");
        fireEvent.blur(typeOfInsulin);
        const unit = screen.getByLabelText("Units Given");
        fireEvent.blur(unit);
        const bodySite = screen.getByLabelText("Body Site");
        fireEvent.blur(bodySite);
        const submitButton = screen.getByRole('button', { name: /submit/i });
        userEvent.click(submitButton);

        const errorMessages = await screen.findAllByText("This field can't be left empty.", { exact: false });
        expect(errorMessages.length).toBe(4);
      
        const error = errorMessages[0];
        expect(error).toBeInTheDocument();
      
        const error1 = errorMessages[1];
        expect(error1).toBeInTheDocument();
    })

    test("Units given cant be zero", async () => {
      render(<CreateInsulinJournalPage />);
      const unit = screen.getByLabelText("Units Given");
      await userEvent.type(unit, "0");
      fireEvent.blur(unit);
    
      const unitError = screen.getByLabelText("Units Given").nextElementSibling;
      expect(unitError.textContent).toBe("This field can't be left empty or zero.");
    
    });
    
    test("Units given cant be negative", async () => {
        render(<CreateInsulinJournalPage />);
        
        const unit = screen.getByLabelText("Units Given");
        userEvent.clear(unit);
        userEvent.type(unit, `${parseInt("-1")}`);
        fireEvent.blur(unit);
      
        await waitFor(() => {
            const unitError = screen.getByLabelText("Units Given").nextElementSibling;
            expect(unitError.textContent).toBe("You can't enter a negative unit or a unit of zero.");
        })
      });



    test("Submit button calls createInsulinjournal function", async () => {
        render(<CreateInsulinJournalPage/>);
        const date = screen.getByLabelText("Date");
        const time  = screen.getByLabelText("Time");
        const typeOfInsulin = screen.getByLabelText("Type of Insulin");
        const unit = screen.getByLabelText("Units Given");
        const bodySite = screen.getByLabelText("Body Site");
        const notes  = screen.getByLabelText("Notes");
        const submitButton = screen.getAllByRole('button')[2];

        await userEvent.type(date, "2023-09-09");
        await userEvent.type(time, "8:36")
        await userEvent.selectOptions(typeOfInsulin, "Fiasp (Insulin aspart)");
        await userEvent.type(unit, "20");
        await userEvent.selectOptions(bodySite, "Lower Back (left)");
        await userEvent.type(notes, "abc");

        await userEvent.click(submitButton);
        await waitFor(() => {
            expect(createInsulinJournal).toHaveBeenCalled();
            expect(mockRouter).toHaveBeenCalledWith('/getDiabeticJournals');
        })
    })

    test("Cancel button redirects to getDiabeticJournals page", async () => {
        render(<CreateInsulinJournalPage/>);
        const cancelButton = screen.getAllByRole('button')[1];
        await userEvent.click(cancelButton);
        await mockRouter;
        expect(mockRouter).toHaveBeenCalledWith('/getDiabeticJournals');
    })

    test("Back button redirects to getDiabeticJournals page", async () => {
        render(<CreateInsulinJournalPage/>);
        const backButton = screen.getAllByRole('button')[0];
        await userEvent.click(backButton);
        await mockRouter;
        expect(mockRouter).toHaveBeenCalledWith('/getDiabeticJournals');
    })

    describe("handlePopUp tests", () => {
        const mockHandlePopUp = jest.fn();
        useProp.mockReturnValue({ handlePopUp: mockHandlePopUp });
    
        afterEach(() => {
            jest.resetAllMocks();
          });
    
        test("handlePopUp is called when an error occurs", async () => {
            createInsulinJournal.mockImplementation(() => Promise.reject(new Error()));
        
            render(<CreateInsulinJournalPage />);
        
            const submitButton = screen.getAllByRole('button')[2];
        
            await userEvent.click(submitButton);
        
            await waitFor(() => {
                expect(mockHandlePopUp).toHaveBeenCalled();
            });
        });
    });