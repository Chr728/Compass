import {render, screen,act} from '@testing-library/react';
import '@testing-library/jest-dom';
import GetWeightJournals from './page';
import {getWeightJournals} from '../http/weightJournalAPI';
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
                            userId: '1',
                            date: '2014-01-01',
                            time: '8:36',
                            weight: 75.5,
                            height: 1.65,
                            unit:'kg',
                            Notes : 'I am feeling good today'
                    }
                ]
            }
        }
    }
});
   
    test("Get Weight Journals list is displayed correctly", async () => {
        await  getWeightJournals();
        const date = await screen.findByText('2014-01-01');
        const time = await screen.findByText('08:36 AM');
        const weight = await screen.findByNumber(75.5);
        const height = await screen.findByNumber(1.65);

        expect(date).toBeInTheDocument();
        expect(time).toBeInTheDocument();
        expect(weight).toBeInTheDocument();
        expect(height).toBeInTheDocument();

    })


    