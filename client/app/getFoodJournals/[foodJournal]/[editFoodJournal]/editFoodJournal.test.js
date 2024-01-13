import {render, screen, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import EditFoodJournal from './page';
import { getFoodIntakeJournal, updateFoodIntakeJournal } from '../../../http/foodJournalAPI';
import { useAuth } from '../../../contexts/AuthContext';

const mockRouter = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));


const userData = {
  uid: '1',
} 
jest.mock("../../../contexts/AuthContext", () => {
  return {
    useAuth: jest.fn(),
  };
});


jest.mock('../../../http/foodJournalAPI', () => {
    return {
      getFoodIntakeJournal: () => {
            return {
                    success: "SUCCESS",
                    data: 
                        {
                          uid: '1',
                          date: '2014-01-01',
                          time: '08:36',
                          foodName: 'pasta',
                          mealType:'Lunch',
                          servingNumber: 2,
                          Notes : 'I am still Hungry'
                    }
            }
        },
        updateFoodJournal: jest.fn()
    }
});


jest.mock("../../../contexts/UserContext", () => {
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

describe("User is logged in", () => {
    
  beforeEach(async() => {
    useAuth.mockImplementation(() => {
        return {
            user: {
                uid: '1'
            }
        }
    })
  })

  test("Form submits correctly", async () =>{
      const updateFoodJournal = jest.fn();
      render(<EditFoodJournal params={{ foodJournal:'1'}}/>);
      await getFoodIntakeJournal();
      const date = screen.getByLabelText("Date");
      const time  = screen.getByLabelText("Time");
      const foodName = screen.getByLabelText("Name of Food");
      const mealType = screen.getByLabelText("Meal Type");
      const servingNumber = screen.getByLabelText("Number of Servings");
      const notes  = screen.getByLabelText("Notes");
      const submitButton = screen.getAllByRole('button')[2];

      expect(date).toBeInTheDocument();
      expect(time).toBeInTheDocument();
      expect(foodName).toBeInTheDocument();
      expect(mealType).toBeInTheDocument();
      expect(servingNumber).toBeInTheDocument();
      expect(notes).toBeInTheDocument();

      userEvent.click(submitButton);
      setTimeout(() => {
        expect(updateFoodJournal).toHaveBeenCalledTimes(1);
      }, 1000);
  })

  test("Cancel button works correctly", async () =>{
    render(<EditFoodJournal params={{ foodJournal:'1'}}/>);
      await getFoodIntakeJournal();
      const cancelButton = screen.getAllByRole('button')[1];
      await userEvent.click(cancelButton);
      await mockRouter;
      expect(mockRouter).toHaveBeenCalledWith(`/getFoodJournals/1`);
  })

  test("Back button works correctly", async () =>{
    render(<EditFoodJournal params={{ foodJournal:'1'}}/>);
      await getFoodIntakeJournal();
      const backButton = screen.getAllByRole('button')[0];
      await userEvent.click(backButton);
      await mockRouter;
      expect(mockRouter).toHaveBeenCalledWith(`/getFoodJournals/1`);
  })

  test("Submit button works correctly", async () =>{
    render(<EditFoodJournal params={{ foodJournal:'1'}}/>);
      await getFoodIntakeJournal();
      const submitButton = screen.getAllByRole('button')[2];
      await userEvent.click(submitButton);
      await mockRouter;
      expect(mockRouter).toHaveBeenCalledWith(`/getFoodJournals/1`);
  })
})

describe("User is not logged in", () => {
  
  beforeEach(async() => {
    useAuth.mockImplementation(() => {
        return {
            user: null
        }
    })
  })

  test("Error message is shown", async () => {
    render(<EditFoodJournal params={{ foodJournal:'1'}}/>);
    const errorText = await screen.findByText("Error 403 - Access Forbidden");
    const errorRedirectingText = await screen.findByText("Redirecting to Login Page...");
    expect(errorText).toBeInTheDocument();
    expect(errorRedirectingText).toBeInTheDocument();
  })
})