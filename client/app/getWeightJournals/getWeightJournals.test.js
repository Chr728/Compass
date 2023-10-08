import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import GetWeightJournals from '../getWeightJournals/page';
import { useRouter } from "next/router";

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

jest.mock("../contexts/AuthContext", () => {
    return {
      useAuth: () =>{
        return {
            user: userData
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
        render(<GetWeightJournals/>);
        const date = await screen.findByText('Jan 1, 2014,');
        const time = await screen.findByText('8h36');
        const weight = await screen.findByNumber(75.5);
        const height = await screen.findByNumber(1.65);

        expect(date).toBeInTheDocument();
        expect(time).toBeInTheDocument();
        expect(weight).toBeInTheDocument();
        expect(height).toBeInTheDocument();

    })