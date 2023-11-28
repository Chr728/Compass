import {render, screen, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GetMedication from './page';
import {getMedication,getMedications} from '../../http/medicationAPI';
import { useRouter } from "next/navigation";
import { useUser } from '../../contexts/UserContext';

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
        getMedication: () => {
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
        expect(screen.getByText("I got higher dose")).toBeInTheDocument();
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