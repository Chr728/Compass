import {render, screen,act} from '@testing-library/react';
import '@testing-library/jest-dom';
import GetWeightJournals from './page';
import {getWeightJournals} from '../http/weightJournalAPI';
import userEvent from '@testing-library/user-event';

import { useRouter } from "next/router";
import { useUser } from '../contexts/UserContext';

beforeEach(async () => {
    await act(async () => {
        render(<GetWeightJournals/>);
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


jest.mock('../http/weightJournalAPI', () => {
    return {
        getWeightJournals: () => {
            return {
                
                    success: "SUCCESS",
                    data: [
                        {
                            uid: '1',
                            date: '2014-01-01',
                            time: '08:36',
                            weight: '75.5',
                            height: 1.65,
                            unit:'kg',
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
    expect(mockRouter).toHaveBeenCalledWith('/createWeightJournal')
})

    test("Get Weight Journals list is displayed correctly", async () => {
        const date = await screen.findByText('2014-01-01 08:36 AM');
        const weight = await screen.findByText('75.5');
        const height = await screen.findByText('1.65');

        expect(date).toBeInTheDocument();
        expect(weight).toBeInTheDocument();
        expect(height).toBeInTheDocument();
    })

   

    
     // checks the texts
     test("Message displayed", async () => {
        const message = screen.getByText(/Managing your weight helps you stay healthy./i);
        expect(message).toBeInTheDocument();
    })


     test("Message displayed", async () => {
        const message = screen.getByText(/our BMI can tell you if you’re at risk for certain health conditions like heart disease./i);
        expect(message).toBeInTheDocument();
    })