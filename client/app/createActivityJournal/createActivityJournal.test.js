import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CreateActivityJournalPage from './createActivityJournalPage';
import { createActivityJournal } from '../http/activityJournalAPI';
import { auth } from '../config/firebase';


const mockRouter = jest.fn();

const fakeUser = {
    uid: "1"
}

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

jest.mock('../contexts/AuthContext', () => {
    return {
        useAuth: () => {
            return {
                user : fakeUser
            }
        }
    }
});

describe("Activity Journal tests", () => { 
    
    beforeEach(() => {
        global.fetch = jest.fn();
      });
    
      afterEach(() => {
        jest.resetAllMocks();
      });
    
    it('activity journal entry is created on submitting', async () => {
        const mockUserId = '11';
        render(<CreateActivityJournalPage />);

        const submitButton = screen.getByRole('button', { name: /Submit/i });
        const date = screen.getByLabelText('Date');
        const time = screen.getByLabelText('Time');
        const activity = screen.getByLabelText('Activity');
        const duration = screen.getByLabelText('Duration (in minutes)');
        const notes = screen.getByLabelText('Notes');

        await userEvent.type(date, '2023-09-09');
        await userEvent.type(time, '8:36');
        await userEvent.type(activity, '85');
        await userEvent.type(duration, '1.70');
        await userEvent.type(notes, 'abc');

        const mockActivityJournalData = {
          date: date.value,
          time: time.value,
          activity: activity.value,
          duration: duration.value,
          notes: notes.value,
        };
    
        await userEvent.click(submitButton);

        const mockToken = 'mockToken';
        const mockCurrentUser = {
          uid: mockUserId,
          getIdToken: jest.fn().mockResolvedValue(mockToken),
        };
    
        Object.defineProperty(auth, 'currentUser', {
          get: jest.fn().mockReturnValue(mockCurrentUser),
        });
    
        const mockResponse = {
          ok: true,
          json: jest.fn().mockResolvedValue(mockActivityJournalData),
        };
        const mockFetch = jest.fn().mockResolvedValue(mockResponse);
        global.fetch = mockFetch;
    
        const result = await createActivityJournal(mockUserId, mockActivityJournalData);
    
        expect(mockFetch).toHaveBeenCalledWith(
          `${process.env.NEXT_PUBLIC_API_URL}/api/journals/activity/user/${mockUserId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${mockToken}`,
            },
            body: "\"11\"",
          }
        );
        expect(result).toEqual(mockActivityJournalData);
      });

    it("All fields are displayed to the user", () => {
        render(<CreateActivityJournalPage/>);
        const date = screen.getByLabelText("Date");
        const time  = screen.getByLabelText("Time");
        const activity = screen.getByLabelText("Activity");
        const duration = screen.getByLabelText("Duration (in minutes)");
        const notes  = screen.getByLabelText("Notes");

        expect(date).toBeInTheDocument();
        expect(time).toBeInTheDocument();
        expect(activity).toBeInTheDocument();
        expect(duration).toBeInTheDocument();
        expect(notes).toBeInTheDocument();
    })

    it("Error displayed if any of the fields are empty", async () => {
        render(<CreateActivityJournalPage/>);
        const date = screen.getByLabelText("Date");
        fireEvent.blur(date);
        const time = screen.getByLabelText("Time");
        fireEvent.blur(time);
        const activity = screen.getByLabelText("Activity");
        fireEvent.blur(activity);
        const duration = screen.getByLabelText("Duration (in minutes)");
        fireEvent.blur(duration);
        const submitButton = screen.getByRole('button', { name: /submit/i });
        userEvent.click(submitButton);

        const errorMessages = await screen.findAllByText("This field can't be left empty.", { exact: false });
        expect(errorMessages.length).toBe(3);
      
        const error = errorMessages[0];
        expect(error).toBeInTheDocument();
      
        const error1 = errorMessages[1];
        expect(error1).toBeInTheDocument();
    })

    it("Duration cant be zero", async () => {
      render(<CreateActivityJournalPage />);
      const duration = screen.getByLabelText("Duration (in minutes)");
      await userEvent.type(duration, "0");
      fireEvent.blur(duration);
    
      const durationError = screen.getByLabelText("Duration (in minutes)").nextElementSibling;
      expect(durationError.textContent).toBe("This field can't be left empty or zero.");
    });
    
    it("duration cant be negative", async () => {
        render(<CreateActivityJournalPage />);
        
        const duration = screen.getByLabelText("Duration (in minutes)");
        userEvent.clear(duration);
        userEvent.type(duration, `${parseInt("-1")}`);
        fireEvent.blur(duration);
      
        await waitFor(() => {
            const durationError = screen.getByLabelText("Duration (in minutes)").nextElementSibling;
            expect(durationError.textContent).toBe("You can't enter a negative duration or a duration of zero.");
        })
      });

    it("Cancel button redirects to getActivityJournals page", async () => {
        render(<CreateActivityJournalPage/>);
        const cancelButton = screen.getAllByRole('button')[1];
        await userEvent.click(cancelButton);
        await mockRouter;
        expect(mockRouter).toHaveBeenCalledWith('/getActivityJournals');
    })
})