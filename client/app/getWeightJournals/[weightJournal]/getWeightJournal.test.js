import '@testing-library/jest-dom';
import { render, screen, waitFor, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GetWeightJournal from './page';
import { useAuth } from '../../contexts/AuthContext';
import { getWeightJournal } from '../../http/weightJournalAPI';


const mockRouter = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

jest.mock('../../http/weightJournalAPI', () => {
    return {
        getWeightJournal: jest.fn().mockResolvedValue(
            {
                success: "SUCCESS",
                data: 
                {
                    id: '1',
                    date: 'Jan 1,2014',
                    time: '08:36',
                    weight: '186',
                    unit: 'lb',
                    height: '174',
                    notes: 'notes'
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
        render(<GetWeightJournal params={{ weightJournal:'1' }}/>);
        await waitFor(() => {
            expect(screen.getByText("Date:")).toBeInTheDocument();
            expect(screen.getByText("Time:")).toBeInTheDocument();
            expect(screen.getByText("Weight:")).toBeInTheDocument();
            expect(screen.getByText("Height:")).toBeInTheDocument();
            expect(screen.getByText("Unit:")).toBeInTheDocument();
            expect(screen.getByText("Notes:")).toBeInTheDocument();
            expect(screen.getByText("Jan 1, 2014")).toBeInTheDocument();
            expect(screen.getByText("8h36")).toBeInTheDocument();
            expect(screen.getByText("186")).toBeInTheDocument();
            expect(screen.getByText("lb")).toBeInTheDocument();
            expect(screen.getByText("174")).toBeInTheDocument();
            expect(screen.getByText("notes")).toBeInTheDocument();
        }, { timeout: 2000 })
    })

    test("Cancel button functions correctly", async() => {
        render(<GetWeightJournal params={{ weightJournal:'1' }}/>);
        setTimeout(() => {
            const cancelButton = screen.getAllByRole('button')[2];
            userEvent.click(cancelButton);
            mockRouter;
            expect(mockRouter).toHaveBeenCalledWith('/getWeightJournals')
        }, 1000);
    })

    test("Update button functions correctly", async() => {
        render(<GetWeightJournal params={{ weightJournal:'1' }}/>);
        setTimeout(async() => {
            const updateButton = screen.getAllByRole('button')[1];
            userEvent.click(updateButton);
            await waitFor(() => {
                expect(mockRouter).toHaveBeenCalledWith('/editWeightJournals/1')
            });
            
        }, 1000);
    })

    test("getWeightJournal function is called correctly", async () => {
        render(<GetWeightJournal params={{ weightJournal: '1' }} />);
        await act(async () => {
            jest.advanceTimersByTime(2000);
        });
        await waitFor(() => {
            expect(getWeightJournal).toHaveBeenCalled();
        }); 
    })

})

describe("User is not logged in", () => {

    beforeEach(async() => {
        useAuth.mockImplementation(() => {
            return {
                user: null
            }
        })
    })

    test("Error message is shown", async () => {
        render(<GetWeightJournal params={{ weightJournal: '1' }} />);
        const errorText = await screen.findByText("Error 403 - Access Forbidden");
        const errorRedirectingText = await screen.findByText("Redirecting to Login Page...");
        expect(errorText).toBeInTheDocument();
        expect(errorRedirectingText).toBeInTheDocument();
        
    })
})