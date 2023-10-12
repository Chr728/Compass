import {render, screen, act} from '@testing-library/react';
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

const userData = {
    uid: '1',
} 

jest.mock("../../contexts/AuthContext", () => {
    return {
    useAuth: () =>{
        return {
            user: userData
        }
    }
    };
});

jest.mock('../../http/activityJournalAPI', () => {
    return {
        getActivityJournal: () => {
            return {
                    success: "SUCCESS",
                    data: 
                        {
                            id: '1',
                            date: '2014-01-01',
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
    await getActivityJournal();
    const date = await screen.findByText("Date:");
    const time  = await screen.findByText("Time:");
    const activity = await screen.findByText("Activity:");
    const duration = await screen.findByText("Duration(min):");
    const notes  = await screen.findByText("Notes:");

    const dateValue = await screen.findByText("2014-01-01");
    const timeValue = await screen.getByText("8h36");
    const activityValue = await screen.getByText("Swimming");
    const durationValue = await screen.getByText("45");
    const notesValue = await screen.getByText("notes");

    expect(date).toBeInTheDocument();
    expect(time).toBeInTheDocument();
    expect(activity).toBeInTheDocument();
    expect(duration).toBeInTheDocument();
    expect(notes).toBeInTheDocument();

    expect(dateValue).toBeInTheDocument();
    expect(timeValue).toBeInTheDocument();
    expect(activityValue).toBeInTheDocument();
    expect(durationValue).toBeInTheDocument();
    expect(notesValue).toBeInTheDocument();
})

test("Cancel button functions correctly", async() => {
    render(<GetActivityJournal params={{ activityJournal:'1' }}/>);
    const cancelButton = screen.getAllByRole('button')[0];
    await userEvent.click(cancelButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith('/getActivityJournals')
})

test("Update button functions correctly", async() => {
    render(<GetActivityJournal params={{ activityJournal:'1' }}/>);
    const updateButton = screen.getAllByRole('button')[1];
    await userEvent.click(updateButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith('/getActivityJournals/1/1')
})