import {render, screen, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Appointment from './page';
import {getAppointment} from '../../http/appointmentAPI';

const mockRouter = jest.fn();
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
jest.mock("../../contexts/AuthContext", () => {
    return {
      useAuth: () =>{
        return {
            user: userData
        }
      }
    };
  });

jest.mock('../../http/appointmentAPI', () => {
    return {
        getAppointment: () => {
            return {
                    success: "SUCCESS",
                    data: 
                        {
                            id: '1',
                            date: '2014-01-01',
                            time: '8:36',
                            appointmentWith: 'Dr. John',
                            reason: 'reason',
                            notes: 'notes'
                    }
            }
        }
    }
});

beforeEach(async () => {
    await act(async () => {
        render(<Appointment params={{ appointment: '1' }}/>);
      });
})

test("User data is displayed correctly", async () => {
    await getAppointment();
    const date = screen.getByText("Date:");
    const time = screen.getByText("Time:");
    const appointment = screen.getByText("Appointment:");
    const reason = screen.getByText("Reason:");
    const notes = screen.getByText("Notes:");

    const dateValue = await screen.findByText("Jan 1, 2014");
    const timeValue = await screen.findByText("8h36");
    const appointmentValue = await screen.findByText("Dr. John");
    const reasonValue = await screen.findByText("reason");
    const notesValue = await screen.findByText("notes");

    expect(date).toBeInTheDocument();
    expect(time).toBeInTheDocument();
    expect(appointment).toBeInTheDocument();
    expect(reason).toBeInTheDocument();
    expect(notes).toBeInTheDocument();

    expect(dateValue).toBeInTheDocument();
    expect(timeValue).toBeInTheDocument();
    expect(appointmentValue).toBeInTheDocument();
    expect(reasonValue).toBeInTheDocument();
    expect(notesValue).toBeInTheDocument();
})

test("Cancel button functions correctly", async() => {
    const cancelButton = screen.getAllByRole('button')[0];
    await userEvent.click(cancelButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith('/viewappointments')
})

test("Update button functions correctly", async() => {
    const updateButton = screen.getAllByRole('button')[1];
    await userEvent.click(updateButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith('/viewappointments/1/1')
})
