import {render, screen, act, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GetMedication from './page';
import { useAuth } from '../../contexts/AuthContext';
import { getMedication } from '../../http/medicationAPI';


const mockRouter = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

jest.mock('../../http/medicationAPI', () => {
    return {
        getMedication: jest.fn().mockResolvedValue(() => {
            return {
                    success: "SUCCESS",
                    data: 
                        {
                            uid: '1',
                             medicationName: 'Advil',
                            dateStarted: '2014-01-01',
                            time: '08:36',
                            dosage: 60,
                            unit: 'milligram (mg)',
                            frequency: 'Six times a day',
                            route: 'Rectal',
                            Notes : 'Test medication'
                    }
            }
        })
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
})


describe("User is logged in", () => {

    beforeEach(() => {
        useAuth.mockImplementation(() => {
            return {
                user: {
                    uid: '1'
                }
            }
        })
    })

    test("User data is displayed correctly", async () => {
        render(<GetMedication params={{ medication:'1' }}/>);
        setTimeout(() => {
            expect(screen.getByText("Start Date:")).toBeInTheDocument();
            expect(screen.getByText("Time:")).toBeInTheDocument();
            expect(screen.getByText("Medication Name:")).toBeInTheDocument(); 
            expect(screen.getByText("Dosage:")).toBeInTheDocument();
            expect(screen.getByText("Frequency:")).toBeInTheDocument();
            expect(screen.getByText("Unit:")).toBeInTheDocument();
            expect(screen.getByText("Route:")).toBeInTheDocument();
            expect(screen.getByText("Notes:")).toBeInTheDocument();
            expect(screen.getByText("Jan 1,2014")).toBeInTheDocument();
            expect(screen.getByText("8h36")).toBeInTheDocument();
            expect(screen.getByText("advil")).toBeInTheDocument();
            expect(screen.getByText("80")).toBeInTheDocument();
            expect(screen.getByText("other")).toBeInTheDocument();
            expect(screen.getByText("other")).toBeInTheDocument();
            expect(screen.getByText("other")).toBeInTheDocument();
            expect(screen.getByText("I got a lower dose")).toBeInTheDocument();
        }, 1000);
    })
    
    test("Cancel button functions correctly", async() => {
        render(<GetMedication params={{ medication:'1' }}/>);
        setTimeout(() => {
            const cancelButton = screen.getAllByRole('button')[2];
            userEvent.click(cancelButton);
            mockRouter;
            expect(mockRouter).toHaveBeenCalledWith('/getMedications')
        }, 1000);
    })
    
    test("Update button functions correctly", async() => {
        render(<GetMedication params={{ medication:'1' }}/>);
        setTimeout(() => {
            const updateButton = screen.getAllByRole('button')[1];
            userEvent.click(updateButton);
            mockRouter;
            expect(mockRouter).toHaveBeenCalledWith('/getMedications/1/1')
        }, 1000);
    })

    test("getMedication function is called correctly", async () => {
        await act(async () => {
            jest.advanceTimersByTime(1000);
        });
        await waitFor(() => {
            expect(getMedication).toHaveBeenCalled();
        }); 
    })
})


describe("User is not logged in", () => {

    beforeEach(() => {
        useAuth.mockImplementation(() => {
            return {
                user: null
            }
        })
    })

    test("Error message is shown", async () => {
        render(<GetMedication params={{ medication:'1' }}/>);
        const errorText = await screen.findByText("Error 403 - Access Forbidden");
        const errorRedirectingText = await screen.findByText("Redirecting to Login Page...");
        expect(errorText).toBeInTheDocument();
        expect(errorRedirectingText).toBeInTheDocument();
    })
})