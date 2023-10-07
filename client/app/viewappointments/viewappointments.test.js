import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewAppointmentsPage from './viewAppointmentsPage';

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


jest.mock('../http/appointmentAPI', () => {
    return {
        getAppointments: () => {
            return {
                
                    success: "SUCCESS",
                    data: [
                        {
                            id: '1',
                            date: '2014-01-01',
                            time: '8:36',
                            appointmentWith: 'Dr. John',
                            reason: 'reason',
                            notes:'notes'
                    }
                ]
            }
        }
    }
});
   
    test("Appointment list is displayed correctly", async () => {
        render(<ViewAppointmentsPage/>);
        const date = await screen.findByText('Jan 1, 2014,');
        const time = await screen.findByText('8h36');
        const doctor = await screen.findByText('Dr. John');
        expect(date).toBeInTheDocument();
        expect(time).toBeInTheDocument();
        expect(doctor).toBeInTheDocument();
    })