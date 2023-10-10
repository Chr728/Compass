import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CreateActivityJournal from './page';
import {createActivityJournal} from '../http/activityJournalAPI';


const fakeUser = {
    uid: "1"
}
jest.mock('../contexts/AuthContext', () => {
    return {
        useAuth: () => {
            return {
                user : fakeUser
            }
        }
    }
});

jest.mock('../http/activityJournalAPI', () => {
    return {
        createActivityJournal: jest.fn()
    }
});

const mockRouter= jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

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



// const { createActivityJournal} = require('../http/activityJournalAPI');
 
    test("All fields are displayed to the user", () => {
        render(<CreateActivityJournal/>);
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

    test("Error displayed if any of the fields are empty", async () => {
        render(<CreateActivityJournal/>);
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

    test("Duration cant be zero", async () => {
      render(<CreateActivityJournal />);
      const duration = screen.getByLabelText("Duration (in minutes)");
      await userEvent.type(duration, "0");
      fireEvent.blur(duration);
    
      const durationError = screen.getByLabelText("Duration (in minutes)").nextElementSibling;
      expect(durationError.textContent).toBe("This field can't be left empty or zero.");
    });
    
    test("duration cant be negative", async () => {
        render(<CreateActivityJournal />);
        
        const duration = screen.getByLabelText("Duration (in minutes)");
        userEvent.clear(duration);
        userEvent.type(duration, `${parseInt("-1")}`);
        fireEvent.blur(duration);
      
        await waitFor(() => {
            const durationError = screen.getByLabelText("Duration (in minutes)").nextElementSibling;
            expect(durationError.textContent).toBe("You can't enter a negative duration or a duration of zero.");
        })
      });



    test("Submit button calls createactivityjournal function", async () => {
        render(<CreateActivityJournal/>);
        const date = screen.getByLabelText("Date");
        const time  = screen.getByLabelText("Time");
        const activity = screen.getByLabelText("Activity");
        const duration = screen.getByLabelText("Duration (in minutes)");
        const notes  = screen.getByLabelText("Notes");
        const submitButton = screen.getAllByRole('button')[1];

        await userEvent.type(date, "2023-09-09");
        await userEvent.type(time, "8:36")
        await userEvent.type(activity, "85");
        await userEvent.type(duration, "1.70");
        await userEvent.type(notes, "abc");

        await userEvent.click(submitButton);
        await createActivityJournal();
        await mockRouter;

        expect(createActivityJournal).toHaveBeenCalledTimes(1);
        expect(mockRouter).toHaveBeenCalledWith('/getActivityJournals');
    })

    test("Cancel button redirects to getActivityJournals page", async () => {
        render(<CreateActivityJournal/>);
        const cancelButton = screen.getAllByRole('button')[1];
        await userEvent.click(cancelButton);
        await mockRouter;
        expect(mockRouter).toHaveBeenCalledWith('/getActivityJournals');
    })