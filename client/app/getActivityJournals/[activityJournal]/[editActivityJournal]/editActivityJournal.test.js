import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getActivityJournal } from '../../../http/activityJournalAPI';
import EditActivityJournal from './page';

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
jest.mock("../../../contexts/AuthContext", () => {
  return {
    useAuth: () =>{
      return {
          user: userData
      }
    }
  };
});


jest.mock('../../../http/activityJournalAPI', () => {
    return {
        getActivityJournal: () => {
            return {
                    success: "SUCCESS",
                    data: 
                        {
                            id: '1',
                            date: '2014-01-01',
                            time: '8:36',
                            activity: 'Cycling',
                            duration: 75,
                            notes: 'notes'
                    }
            }
        },
        updateActivityJournal: jest.fn()
    }
});

jest.mock("../../../contexts/UserContext", () => {
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

test("Form submits correctly", async () =>{
    const updateActivityJournal = jest.fn();
    render(<EditActivityJournal params={{ activityJournal:'1'}}/>);
    await getActivityJournal();
    const date = screen.getByLabelText("Date");
    const time  = screen.getByLabelText("Time");
    const activity = screen.getByLabelText("Activity");
    const duration = screen.getByLabelText("Duration (in minutes)");
    const notes  = screen.getByLabelText("Notes");
    const submitButton = screen.getAllByRole('button')[2];

    expect(date).toBeInTheDocument();
    expect(time).toBeInTheDocument();
    expect(activity).toBeInTheDocument();
    expect(duration).toBeInTheDocument();
    expect(notes).toBeInTheDocument();

    await userEvent.click(submitButton);
    setTimeout(() => {
      expect(updateActivityJournal).toHaveBeenCalledTimes(1);
    }, 1000);
})

test("Cancel button works correctly", async () =>{
    render(<EditActivityJournal params={{ activityJournal:'1'}}/>);
    await getActivityJournal();
    const cancelButton = screen.getAllByRole('button')[1];
    await userEvent.click(cancelButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith(`/getActivityJournals/1`);
})