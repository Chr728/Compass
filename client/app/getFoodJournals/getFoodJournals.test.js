import {render, screen,act} from '@testing-library/react';
import '@testing-library/jest-dom';
import GetFoodJournalsPage from './getFoodJournalsPage';
import {getFoodIntakeJournals} from '../http/foodJournalAPI';
import { deleteFoodIntakeJournal} from '../http/foodJournalAPI'; 
import userEvent from '@testing-library/user-event';
import { useRouter } from "next/router";
import { useUser } from '../contexts/UserContext';

beforeEach(async () => {
    await act(async () => {
        render(<GetFoodJournalsPage/>);
      });
})

const mockRouter= jest.fn();
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


jest.mock('../http/foodJournalAPI', () => {
    return {
        getFoodIntakeJournals: () => {
            return {
                
                    success: "SUCCESS",
                    data: [
                        {
                            uid: '1',
                            date: '2014-01-01',
                            time: '08:36',
                            foodName: 'pasta',
                            servingNumber: 2,
                            mealType:'Lunch',
                            Notes : 'I am feeling good today'
                    }
                ]
            }
        },

        deleteFoodJournal: async (foodJournalId) => {
            return {
                status: "SUCCESS",
                data: `Successfully deleted Food Journal.`,
            };
        },
    }
});
   



test("Add an entry button  functions correctly", async() => {
    const addButton = screen.getAllByRole('button')[1];
    await userEvent.click(addButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith('/createFoodJournal')
})



    test("Get Food Journals list is displayed correctly", async () => {
        const date = await screen.findByText('2014-01-01 08:36 AM');
        const foodName = await screen.findByText('pasta');

        expect(date).toBeInTheDocument();
        expect(foodName).toBeInTheDocument();
    })

   

    
     // checks the texts
     test("Message displayed", async () => {
        const message = screen.getByText(/Keep track of what you eat each day./i);
        expect(message).toBeInTheDocument();
    })


     test("Message displayed", async () => {
        const message = screen.getByText(/Remember, eating healthy is all about eating the right foods in the right amounts./i);
        expect(message).toBeInTheDocument();
    })