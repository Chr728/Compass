import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CreateFoodJournalPage from './createFoodJournalPage';
import {createFoodIntakeJournal} from '../http/foodJournalAPI';


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

jest.mock('../http/foodJournalAPI', () => {
    return {
        createFoodIntakeJournal: jest.fn()
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



const { createFoodJournal} = require('../http/foodJournalAPI');
 
    test("All fields are displayed to the user", () => {
        render(<CreateFoodJournalPage/>);
        const date = screen.getByLabelText("Date");
        const time  = screen.getByLabelText("Time");
        const foodName = screen.getByLabelText("Name of Food");
        const mealType = screen.getByLabelText("Meal Type");
        const servingsNumber = screen.getByLabelText("Number of Servings");
        const notes  = screen.getByLabelText("Notes");

        expect(date).toBeInTheDocument();
        expect(time).toBeInTheDocument();
        expect(foodName).toBeInTheDocument();
        expect(mealType).toBeInTheDocument();
        expect(servingsNumber).toBeInTheDocument();
        expect(notes).toBeInTheDocument();
    })

    test("Error displayed if any of the fields are empty", async () => {
        render(<CreateFoodJournalPage/>);
        const date = screen.getByLabelText("Date");
        fireEvent.blur(date);
        const time = screen.getByLabelText("Time");
        fireEvent.blur(time);
        const foodName = screen.getByLabelText("Name of Food");
        fireEvent.blur(foodName);
        const mealType = screen.getByLabelText("Meal Type");
        fireEvent.blur(mealType);
        const servingsNumber = screen.getByLabelText("Number of Servings");
        fireEvent.blur(servingsNumber);
        const submitButton = screen.getByRole('button', { name: /submit/i });
        userEvent.click(submitButton);

        const errorMessages = await screen.findAllByText("This field can't be left empty.", { exact: false });
        expect(errorMessages.length).toBe(3);
      
        const error = errorMessages[0];
        expect(error).toBeInTheDocument();
      
        const error1 = errorMessages[1];
        expect(error1).toBeInTheDocument();
    })

    test("Servings number cant be zero", async () => {
      render(<CreateFoodJournalPage />);
      const servingsNumber = screen.getByLabelText("Number of Servings");
      await userEvent.type(servingsNumber, "0");
      fireEvent.blur(servingsNumber);
    
      const servingsNumberError = screen.getByLabelText("Number of Servings").nextElementSibling;
      expect(servingsNumberError.textContent).toBe("This field can't be left empty or zero.");
    
    });
    
    test("Servings number cant be negative", async () => {
        render(<CreateFoodJournalPage />);
        
        const servingsNumber = screen.getByLabelText("Number of Servings");
        userEvent.clear(servingsNumber);
        userEvent.type(servingsNumber, `${parseInt("-1")}`);
        fireEvent.blur(servingsNumber);
      
        await waitFor(() => {
            const servingsNumberError = screen.getByLabelText("Number of Servings").nextElementSibling;
            expect(servingsNumberError.textContent).toBe("You can't enter a negative servings number or a number of zero.");
        })
      });



    test("Submit button calls createfoodjournal function", async () => {
        render(<CreateFoodJournalPage/>);
        const date = screen.getByLabelText("Date");
        const time  = screen.getByLabelText("Time");
        const foodName = screen.getByLabelText("Name of Food");
        const mealType = screen.getByLabelText("Meal Type");
        const servingsNumber = screen.getByLabelText("Number of Servings");
        const notes  = screen.getByLabelText("Notes");
        const submitButton = screen.getAllByRole('button')[1];

        await userEvent.type(date, "2023-09-09");
        await userEvent.type(time, "8:36")
        await userEvent.type(foodName, "Pasta");
        await userEvent.type(mealType, "Lunch");
        await userEvent.type(servingsNumber, "2");
        await userEvent.type(notes, "abc");

        await userEvent.click(submitButton);
        await createFoodIntakeJournal();
        await mockRouter;

        expect(createFoodIntakeJournal).toHaveBeenCalledTimes(1);
        expect(mockRouter).toHaveBeenCalledWith('/getFoodJournals');
    })

    test("Cancel button redirects to getFoodJournals page", async () => {
        render(<CreateFoodJournalPage/>);
        const cancelButton = screen.getAllByRole('button')[1];
        await userEvent.click(cancelButton);
        await mockRouter;
        expect(mockRouter).toHaveBeenCalledWith('/getFoodJournals');
    })