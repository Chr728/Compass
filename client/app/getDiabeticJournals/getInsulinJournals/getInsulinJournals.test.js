import {render, screen,act} from '@testing-library/react';
import '@testing-library/jest-dom';
import GetInsulinJournalsPage from './getInsulinJournalsPage';
import {getInsulinJournals} from '../../http/diabeticJournalAPI';
import userEvent from '@testing-library/user-event';
import { deleteInsulinJournal} from '../../http/diabeticJournalAPI'; 

import { useRouter } from "next/router";
import { useUser } from '../../contexts/UserContext';

beforeEach(async () => {
    await act(async () => {
        render(<GetInsulinJournalsPage/>);
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
        getInsulinJournals: () => {
            return {
                
                    success: "SUCCESS",
                    data: [
                        {
                            uid: '1',
                            date: '2014-01-01',
                            time: '8:36',
                            typeOfInsulin: 'Humalog (Insulin lispro)',
                            unit: 60,
                            bodySite: 'Lower Back (left)',
                            Notes : 'I am feeling good today'
                    }
                ]
            }
        },
        deleteInsulinJournal: async (insulinJournalId) => {
            return {
                status: "SUCCESS",
                data: `Successfully deleted Insulin Journal.`,
            };
        },
    }
});
   

test("Add an entry button  functions correctly", async() => {
     setTimeout(() => {  
    const addButton = screen.getAllByRole('button')[0];
    userEvent.click(addButton);
    mockRouter;
         expect(mockRouter).toHaveBeenCalledWith('/createInsulinJournal')
    }, 1000);
})




    test("Get Insulin Journals list is displayed correctly", async () => {
         setTimeout(() => {  
        const date = screen.findByText('Jan 1, 2014 8h36');
        const units = screen.findByText('60');
        const bodySite = screen.findByText('Lower Back (left)');

        expect(date).toBeInTheDocument();
        expect(units).toBeInTheDocument();
             expect(bodySite).toBeInTheDocument();
        }, 1000);
    })

   

    

