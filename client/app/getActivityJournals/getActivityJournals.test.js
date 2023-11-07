import {render, screen,act} from '@testing-library/react';
import '@testing-library/jest-dom';
import GetActivityJournalsPage from './getActivityJournalsPage';
import {getActivityJournals} from '../http/activityJournalAPI';
import userEvent from '@testing-library/user-event';
import { deleteActivityJournal} from '../http/activityJournalAPI'; 

import { useRouter } from "next/router";
import { useUser } from '../contexts/UserContext';

beforeEach(async () => {
    await act(async () => {
        render(<GetActivityJournalsPage/>);
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


jest.mock('../http/activityJournalAPI', () => {
    return {
        getActivityJournals: () => {
            return {
                
                    success: "SUCCESS",
                    data: [
                        {
                            uid: '1',
                            date: '2014-01-01',
                            time: '08:36',
                            activity: 'running',
                            duration: 60,
                            Notes : 'I am feeling good today'
                    }
                ]
            }
        },
        deleteActivityJournal: async (activityJournalId) => {
            return {
                status: "SUCCESS",
                data: `Successfully deleted activity Journal.`,
            };
        },
    }
});
   

test("Add an entry button  functions correctly", async () => {
    setTimeout(() => {  
    const addButton = screen.getAllByRole('button')[1];
    userEvent.click(addButton);
    mockRouter;
        expect(mockRouter).toHaveBeenCalledWith('/createActivityJournal')  
    }, 1000);    
})




    test("Get Activity Journals list is displayed correctly", async () => {
         setTimeout(() => {  
        const date = screen.findByText('Jan 1, 2014');
        const activity = screen.findByText('running');
        const height = screen.findByText('60');

        expect(date).toBeInTheDocument();
        expect(activity).toBeInTheDocument();
             expect(height).toBeInTheDocument();
        }, 1000);
    })

   

    
     // checks the texts
     test("Message displayed", async () => {
        const message = screen.getByText(/Manage your daily activities to help you stay fit. People with active lifestyles are often happier and healthier./i);
        expect(message).toBeInTheDocument();
    })

