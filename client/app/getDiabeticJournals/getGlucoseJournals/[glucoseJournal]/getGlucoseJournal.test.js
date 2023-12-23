import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GetGlucoseJournal from './page';


const mockRouter = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

jest.mock('../../../http/diabeticJournalAPI', () => {
    return {
        getGlucoseJournal: () => {
            return {
                    success: "SUCCESS",
                    data: 
                        {
                            id: '1',
                            date: 'Jan 1,2014',
                            mealTime: '30min after breakfast',
                            bloodGlucose: '3',
                            unit: 'mmol/L',
                            notes: 'notes'
                    }
            }
        }
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


test("User data is displayed correctly", async () => {
    render(<GetGlucoseJournal params={{ glucoseJournal:'1' }}/>);
    setTimeout(() => {
        expect(screen.getByText("Date:")).toBeInTheDocument();
        expect(screen.getByText("Meal Time:")).toBeInTheDocument();
        expect(screen.getByText("Blood Glucose:")).toBeInTheDocument();
        expect(screen.getByText("Unit:")).toBeInTheDocument();
        expect(screen.getByText("Notes:")).toBeInTheDocument();
        expect(screen.getByText("Jan 1,2014")).toBeInTheDocument();
        expect(screen.getByText("30min after breakfast")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();
        expect(screen.getByText("mmol/L")).toBeInTheDocument();
        expect(screen.getByText("notes")).toBeInTheDocument();
    }, 1000);
})

test("Cancel button functions correctly", async() => {
    render(<GetGlucoseJournal params={{ glucoseJournal:'1' }}/>);
    setTimeout(() => {
        const cancelButton = screen.getAllByRole('button')[2];
        userEvent.click(cancelButton);
        mockRouter;
        expect(mockRouter).toHaveBeenCalledWith('/getDiabeticJournals')
    }, 1000);
})

test("Update button functions correctly", async() => {
    render(<GetGlucoseJournal params={{ glucoseJournal:'1' }}/>);
    setTimeout(() => {
        const updateButton = screen.getAllByRole('button')[1];
        userEvent.click(updateButton);
        mockRouter;
        expect(mockRouter).toHaveBeenCalledWith('/getDiabeticJournals/getGlucoseJournals/editGlucoseJournals/1')
    }, 1000);
})