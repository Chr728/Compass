import {render, screen,act} from '@testing-library/react';
import '@testing-library/jest-dom';
import GetGlucoseJournalsPage from './getGlucoseJournalsPage';
import {getGlucoseJournals} from '../../http/diabeticJournalAPI';
import { deleteGlucoseJournal} from '../../http/diabeticJournalAPI'; 
import userEvent from '@testing-library/user-event';
import { useRouter } from "next/router";
import { useUser } from '../../contexts/UserContext';


beforeEach(async () => {
    await act(async () => {
        render(<GetGlucoseJournalsPage/>);
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

jest.mock("../../contexts/UserContext", () => {
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


jest.mock('../../http/diabeticJournalAPI', () => {
    return {
        getGlucoseJournals: () => {
            return {
                
                    success: "SUCCESS",
                    data: [
                        {
                            uid: '1',
                            date: '2014-01-01',
                            mealTime: 'Before lunch',
                            bloodGlucose: 23,
                            unit:'mg/dL',
                            Notes : 'I am feeling good today'
                    }
                ]
            }
        },

        deleteGlucoseJournal: async (glucoseJournalId) => {
            return {
                status: "SUCCESS",
                data: `Successfully deleted Glucose Journal.`,
            };
        },
    }
});
   



test("Add an entry button  functions correctly", async() => {
    const addButton = screen.getAllByRole('button')[1];
    await userEvent.click(addButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith('/createGlucoseJournal')
})



    test("Get Glucose Journals list is displayed correctly", async () => {
        const date = await screen.findByText('Jan 1, 2014');
        const mealTime = await screen.findByText('Before lunch');
        const bloodGlucose = await screen.findByText('23');

        expect(date).toBeInTheDocument();
        expect(mealTime).toBeInTheDocument();
        expect(bloodGlucose).toBeInTheDocument();
    })

   

    
     // checks the texts
     test("Message displayed", async () => {
        const message = screen.getByText(/Keep track of your insulin doses and glucose measurements to ensure a healthy lifestyle./i);
        expect(message).toBeInTheDocument();
    })


    