import {render, screen, act, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GetMoodJournal from './page';
import { getMoodJournal } from '../../http/moodJournalAPI';
import { useAuth } from '../../contexts/AuthContext';


const mockRouter = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

jest.mock('../../http/moodJournalAPI', () => {
    return {
        getMoodJournal: jest.fn().mockResolvedValue(
            {
                success: "SUCCESS",
                    data: 
                        {
                            id: '1',
                            date: '2014-01-01',
                            howAreYou: 'good',
                            stressSignals: '',
                            notes: 'notes',
                            time:"10:00"
                    }
            }
        ),
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


jest.mock('../../contexts/AuthContext', () => {
    return {
        useAuth: jest.fn(),
    }
});


describe("User is logged in", () => {

    beforeEach(async() => {
        useAuth.mockImplementation(() => {
            return {
                user: {
                    uid: '1'
                }
            }
        })
    })

    test("User data is displayed correctly", async () => {
        render(<GetMoodJournal params={{ viewMoodJournal:'1' }}/>);
        setTimeout(() => {
            expect(screen.getByText("Date:")).toBeInTheDocument();
            expect(screen.getByText("How Were You:")).toBeInTheDocument();
            expect(screen.getByText("Stress Signals:")).toBeInTheDocument();
            expect(screen.getByText("I feel tired:")).toBeInTheDocument();
            expect(screen.getByText("I'm not sleeping well:")).toBeInTheDocument();
            expect(screen.getByText("I'm not hungry:")).toBeInTheDocument();
            expect(screen.getByText("I ate too much:")).toBeInTheDocument();
            expect(screen.getByText("I feel sad or depressed:")).toBeInTheDocument();
            expect(screen.getByText("I feel like things are just too much:")).toBeInTheDocument();
            expect(screen.getByText("I have trouble paying attention:")).toBeInTheDocument();
            expect(screen.getByText("I feel nervous or anxious:")).toBeInTheDocument();
            expect(screen.getByText("I feel angry or irritated:")).toBeInTheDocument();
            expect(screen.getByText("I get headaches and&sol;or colds:")).toBeInTheDocument();
            expect(screen.getByText("Notes:")).toBeInTheDocument();
            expect(screen.getByText("Time:")).toBeInTheDocument();
        }, 1000);
    })

    test("Cancel button functions correctly", async() => {
        render(<GetMoodJournal params={{ viewMoodJournal:'1' }}/>);
        setTimeout(() => {
            const cancelButton = screen.getAllByRole('button')[2];
            userEvent.click(cancelButton);
            mockRouter;
            expect(mockRouter).toHaveBeenCalledWith('/moodjournal')
        }, 1000);
    })

    test("Update button functions correctly", async() => {
        render(<GetMoodJournal params={{ viewMoodJournal:'1' }}/>);
        setTimeout(() => {
            const updateButton = screen.getAllByRole('button')[1];
            userEvent.click(updateButton);
            mockRouter;
            expect(mockRouter).toHaveBeenCalledWith('/updateEntryId/1')
        }, 1000);
    })

    test("getMoodJournal function is called correctly", async () => {
        render(<GetMoodJournal params={{ viewMoodJournal: '1' }} />);
        await waitFor(() => {
            expect(getMoodJournal).toHaveBeenCalled();
        }); 
    })
})
