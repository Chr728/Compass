import {render, screen, waitFor, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GetActivityJournal from './page';
import {getActivityJournal} from '../../http/activityJournalAPI';
import {useUser} from '../../contexts/UserContext';

const mockRouter = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

jest.mock('../../http/activityJournalAPI', () => {
    return {
        getActivityJournal: () => {
            return {
                    success: "SUCCESS",
                    data: 
                        {
                            id: '1',
                            date: 'Jan 1,2014',
                            time: '8:36',
                            activity: 'Swimming',
                            duration: 45,
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
    render(<GetActivityJournal params={{ activityJournal:'1' }}/>);
    setTimeout(() => {
        expect(screen.getByText(/Date:/i)).toBeInTheDocument();
        expect(screen.getByText("Time:")).toBeInTheDocument();
        expect(screen.getByText("Activity:")).toBeInTheDocument();
        expect(screen.getByText("Duration(min):")).toBeInTheDocument();
        expect(screen.getByText("Notes:")).toBeInTheDocument();
        expect(screen.getByText("Jan 1, 2014")).toBeInTheDocument();
        expect(screen.getByText("8h36")).toBeInTheDocument();
        expect(screen.getByText("Swimming")).toBeInTheDocument();
        expect(screen.getByText("45")).toBeInTheDocument();
        expect(screen.getByText("notes")).toBeInTheDocument();
    }, 1000);
})

test("Cancel button functions correctly", async() => {
    render(<GetActivityJournal params={{ activityJournal:'1' }}/>);
    setTimeout(() => {
        const cancelButton = screen.getAllByRole('button')[0];
        userEvent.click(cancelButton);
        mockRouter;
        expect(mockRouter).toHaveBeenCalledWith('/getActivityJournals')
    }, 1000);
})

test("Update button functions correctly", async() => {
    render(<GetActivityJournal params={{ activityJournal:'1' }}/>);
    setTimeout(() => {
        const updateButton = screen.getAllByRole('button')[1];
        userEvent.click(updateButton);
        mockRouter;
        expect(mockRouter).toHaveBeenCalledWith('/editActivityJournals/1')
    }, 1000);
})