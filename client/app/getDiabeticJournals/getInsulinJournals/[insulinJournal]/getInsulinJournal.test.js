import {render, screen, act, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GetInsulinJournal from './page';
import { auth } from '../../../config/firebase';
import { getInsulinJournal } from '../../../http/diabeticJournalAPI';
import { useAuth } from '../../../contexts/AuthContext';

const mockRouter = jest.fn();
const mockUsePathname = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    },
    usePathname: () => mockUsePathname()
}));

jest.mock("../../../contexts/AuthContext", () => {
    return {
        useAuth: jest.fn()
    }
})

jest.mock('../../../http/diabeticJournalAPI', () => {
    return {
        getInsulinJournal: jest.fn().mockResolvedValue(
            {
                success: "SUCCESS",
                data:
                {
                    id: '1',
                    date: 'Jan 1,2014',
                    time: '8:36',
                    typeOfInsulin: 'Humalog (Insulin lispro)',
                    unit: 'mmol/L',
                    bodySite: 'arm',
                    notes: 'notes',
                }
            }
        
        )
    }
})

describe("Getting an Insulin journal", () => {

    beforeEach(() => {
        // global.fetch = jest.fn();

        useAuth.mockImplementation(() => {
            return {
                user: {
                    uid: '1'
                }
            }
        })

    });
     
    it("All fields are is displayed correctly", async () => {
        render(<GetInsulinJournal params={{ insulinJournal:'1' }}/>);
        await waitFor(() => {
            expect(screen.getByText("Date:")).toBeInTheDocument();
            expect(screen.getByText("Time:")).toBeInTheDocument();
            expect(screen.getByText("Type:")).toBeInTheDocument();
            expect(screen.getByText("Units:")).toBeInTheDocument();
            expect(screen.getByText("Body Site:")).toBeInTheDocument();
            expect(screen.getByText("Notes:")).toBeInTheDocument();
            expect(screen.getByText("Jan 1, 2014")).toBeInTheDocument();
            expect(screen.getByText("8h36")).toBeInTheDocument();
            expect(screen.getByText("Humalog (Insulin lispro)")).toBeInTheDocument();
            expect(screen.getByText("mmol/L")).toBeInTheDocument();
            expect(screen.getByText("arm")).toBeInTheDocument();
            expect(screen.getByText("notes")).toBeInTheDocument();
        }, { timeout: 2000 })
    })
    
    it("Cancel button functions correctly", async() => {
        render(<GetInsulinJournal params={{ insulinJournal:'1' }}/>);
        setTimeout(() => {
            const cancelButton = screen.getAllByRole('button')[2];
            userEvent.click(cancelButton);
            expect(mockRouter).toHaveBeenCalledWith('/getDiabeticJournals')
        }, 1000);
    })
    
    it("Back button redirects to main journals view", async () => {
        render(<GetInsulinJournal params={{ insulinJournal:'1' }}/>);
        const button = screen.getAllByRole("button")[0];
        await userEvent.click(button);
        expect(mockRouter).toHaveBeenCalledWith('/getDiabeticJournals');
    })

    it("Fetches insulin journal correctly", async () => {
        render(<GetInsulinJournal params={{ insulinJournal:'1' }} />);
        await act(async () => {
            jest.advanceTimersByTime(1000);
        });
        await waitFor(() => {
            expect(getInsulinJournal).toHaveBeenCalled();
        }); 
    })
})
