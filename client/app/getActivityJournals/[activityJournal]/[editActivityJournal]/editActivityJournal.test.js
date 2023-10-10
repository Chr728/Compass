import {render, screen, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import EditActivityJournal from './page';
import {getActivityJournal, updateActivityJournal} from '../../../http/activityJournalAPI';

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

beforeEach(async () => {
    await act(async () => {
        render(<EditActivityJournal params={{ activityJournal:'1'}}/>);
      });
})

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
    await updateActivityJournal;
    expect(updateActivityJournal).toHaveBeenCalledTimes(1);
})

test("Cancel button works correctly", async () =>{
    await getActivityJournal();
    const date = screen.getByLabelText("Date");
    const time  = screen.getByLabelText("Time");
    const activity = screen.getByLabelText("Activity");
    const duration = screen.getByLabelText("Duration (in minutes)");
    const notes  = screen.getByLabelText("Notes");
    const cancelButton = screen.getAllByRole('button')[1];
    await userEvent.click(cancelButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith(`/getActivityJournals/1`);
})