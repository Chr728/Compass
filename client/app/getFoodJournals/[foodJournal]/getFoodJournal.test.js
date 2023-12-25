import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GetFoodJournal from './page';


const mockRouter = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

jest.mock('../../http/foodJournalAPI', () => {
    return {
        getFoodJournal: () => {
            return {
                    success: "SUCCESS",
                    data: 
                        {
                            uid: '1',
                            date: 'Jan 1,2014',
                            time: '08:36',
                            foodName: 'pasta',
                            servingNumber: 2,
                            mealType:'Lunch',
                            Notes : 'I am still Hungry'
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
    render(<GetFoodJournal params={{ foodJournal:'1' }}/>);
    setTimeout(() => {
        expect(screen.getByText("Date:")).toBeInTheDocument();
        expect(screen.getByText("Time:")).toBeInTheDocument();
        expect(screen.getByText("Name of Food:")).toBeInTheDocument(); 
        expect(screen.getByText("Meal Type:")).toBeInTheDocument();
        expect(screen.getByText("Number of Servings:")).toBeInTheDocument();
        expect(screen.getByText("Notes:")).toBeInTheDocument();
        expect(screen.getByText("Jan 1,2014")).toBeInTheDocument();
        expect(screen.getByText("8h36")).toBeInTheDocument();
        expect(screen.getByText("pasta")).toBeInTheDocument();
        expect(screen.getByText("Lunch")).toBeInTheDocument();
        expect(screen.getByText("2")).toBeInTheDocument();
        expect(screen.getByText("notes")).toBeInTheDocument();
    }, 1000);
})

test("Cancel button functions correctly", async() => {
    render(<GetFoodJournal params={{ foodJournal:'1' }}/>);
    setTimeout(() => {
        const cancelButton = screen.getAllByRole('button')[2];
        userEvent.click(cancelButton);
        mockRouter;
        expect(mockRouter).toHaveBeenCalledWith('/getFoodJournals')
    }, 1000);
})

test("Update button functions correctly", async() => {
    render(<GetFoodJournal params={{ foodJournal:'1' }}/>);
    setTimeout(() => {
        const updateButton = screen.getAllByRole('button')[1];
        userEvent.click(updateButton);
        mockRouter;
        expect(mockRouter).toHaveBeenCalledWith('/editFoodJournals/1')
    }, 1000);
})