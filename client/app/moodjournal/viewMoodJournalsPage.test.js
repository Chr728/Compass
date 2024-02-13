import {render, screen, act} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ViewMoodJournalsPage from './viewMoodJournalsPage.tsx';
import { deleteMoodJournal } from '../http/moodJournalAPI';

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

beforeEach(async () => {
    await act(async () => {
        render(<ViewMoodJournalsPage />);
      });
})


jest.mock('../http/moodJournalAPI', () => {
    return {
        getMoodJournals: () => {
            return {
                
                    success: "SUCCESS",
                    data: [
                        {
                          date:"2023-10-17T00:00:00.000Z",
                          howAreYou:"awesome",
                          id:4,
                          notes:"abcd",
                          stressSignals:{"tired":"always","sleep":"often","hunger":"always","overeating":"often","depressed":"always","pressure":"sometimes","anxiety":"always","attention":"sometimes","anger":"always","headache":"never"}
                    }
                ]
            }
        },

        deleteMoodJournal: async (moodJournalId) => {
            return {
                status: "SUCCESS",
                data: `Successfully deleted mood journal entry.`,
            };
        },
    }
});
   
    test("Mood journal is displayed correctly", async () => {
        setTimeout(() => {
            const date = screen.findByText('Oct 17, 2023');
            const notes = screen.findByText('abcd')
            expect(date).toBeInTheDocument();
            expect(notes).toBeInTheDocument();
        }, 1000);    
    })

    test("Clicking on the delete button calls the delete function", async () => {
        setTimeout(() => {
            const deleteBtn = screen.getByText('Delete');
            const moodJournalId = '1';
            userEvent.click(deleteBtn);
            const result = deleteMoodJournal(moodJournalId);
            expect(result.status).toEqual('SUCCESS');
            expect(result.data).toEqual('Successfully deleted mood journal entry.');
        }, 1000);    
    })

    test("Click on the filters", async () => {
        const orderDate = screen.getByLabelText("orderDate")
        await userEvent.click(orderDate)
        await userEvent.click(orderDate)
    })