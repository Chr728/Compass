import {render, screen,act} from '@testing-library/react';
import '@testing-library/jest-dom';
import GetActivityJournals from './page';
import {getActivityJournals} from '../http/activityJournalAPI';
import userEvent from '@testing-library/user-event';

import { useRouter } from "next/router";
import { useUser } from '../contexts/UserContext';

beforeEach(async () => {
    await act(async () => {
        render(<GetActivityJournals/>);
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
        }
    }
});
   

test("Add an entry button  functions correctly", async() => {
    const addButton = screen.getAllByRole('button')[1];
    await userEvent.click(addButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith('/createActivityJournal')
})




    test("Get Activity Journals list is displayed correctly", async () => {
        const date = await screen.findByText('2014-01-01');
        const activity = await screen.findByText('running');
        const height = await screen.findByText('60');

        expect(date).toBeInTheDocument();
        expect(activity).toBeInTheDocument();
        expect(height).toBeInTheDocument();
    })

   

    
     // checks the texts
     test("Message displayed", async () => {
        const message = screen.getByText(/Manage your daily activities to help you stay fit. People with active lifestyles are often happier and healthier./i);
        expect(message).toBeInTheDocument();
    })

