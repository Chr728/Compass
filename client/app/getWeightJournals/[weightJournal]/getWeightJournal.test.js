import {render, screen, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GetWeightJournal from './page';
import {getWeightJournal,getWeightJournals} from '../../http/weightJournalAPI';
import { useRouter } from "next/navigation";
import { useUser } from '../../contexts/UserContext';

const mockRouter = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

jest.mock('../../http/weightJournalAPI', () => {
    return {
        getWeightJournal: () => {
            return {
                    success: "SUCCESS",
                    data: 
                        {
                            id: '1',
                            date: 'Jan 1,2014',
                            time: '08:36',
                            weight: '186',
                            unit: 'lb',
                            height: '174',
                            notes: 'notes'
                    }
            }
        }
    }
});


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


test("User data is displayed correctly", async () => {
    render(<GetWeightJournal params={{ weightJournal:'1' }}/>);
    setTimeout(() => {
        expect(screen.getByText("Date:")).toBeInTheDocument();
        expect(screen.getByText("Time:")).toBeInTheDocument();
        expect(screen.getByText("Weight:")).toBeInTheDocument();
        expect(screen.getByText("Height:")).toBeInTheDocument();
        expect(screen.getByText("Unit:")).toBeInTheDocument();
        expect(screen.getByText("Notes:")).toBeInTheDocument();
        expect(screen.getByText("Jan 1,2014")).toBeInTheDocument();
        expect(screen.getByText("8h36")).toBeInTheDocument();
        expect(screen.getByText("186")).toBeInTheDocument();
        expect(screen.getByText("lb")).toBeInTheDocument();
        expect(screen.getByText("174")).toBeInTheDocument();
        expect(screen.getByText("notes")).toBeInTheDocument();
    }, 1000);
})

test("Cancel button functions correctly", async() => {
    render(<GetWeightJournal params={{ weightJournal:'1' }}/>);
    setTimeout(() => {
        const cancelButton = screen.getAllByRole('button')[2];
        userEvent.click(cancelButton);
        mockRouter;
        expect(mockRouter).toHaveBeenCalledWith('/getWeightJournals')
    }, 1000);
})

test("Update button functions correctly", async() => {
    render(<GetWeightJournal params={{ weightJournal:'1' }}/>);
    setTimeout(() => {
        const updateButton = screen.getAllByRole('button')[1];
        userEvent.click(updateButton);
        mockRouter;
        expect(mockRouter).toHaveBeenCalledWith('/editWeightJournals/1')
    }, 1000);
})