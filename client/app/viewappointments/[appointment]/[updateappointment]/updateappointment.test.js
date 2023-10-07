import {render, screen, act} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import UpdateAppointment from './page';
import {getAppointment, updateAppointment} from '../../../http/appointmentAPI';

const mockRouter = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

jest.mock('../../../http/appointmentAPI', () => {
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
        },
        updateAppointment: jest.fn()
    }
});

beforeEach(async () => {
    await act(async () => {
        render(<UpdateAppointment params={{ appointment: '1' }}/>);
      });
})

test("Form submits correctly", async () =>{
    await getAppointment();
    const date = screen.getByLabelText("Date");
    const time = screen.getByLabelText("Time");
    const appointment = screen.getByLabelText("Appointment With");
    const reason = screen.getByLabelText("Reason");
    const notes = screen.getByLabelText("Notes");
    const submitButton = screen.getAllByRole('button')[1];

    expect(date).toHaveValue("2014-01-01");
    expect(time.getAttribute('value')).toBe('8:36');
    expect(appointment).toHaveValue("Dr. John");
    expect(reason).toHaveValue("reason");
    expect(notes).toHaveValue("notes");

    await userEvent.click(submitButton);
    await updateAppointment;
    expect(updateAppointment).toHaveBeenCalledTimes(1);
})

test("Cancel button works correctly", async () =>{
    await getAppointment();
    const date = screen.getByLabelText("Date");
    const time = screen.getByLabelText("Time");
    const appointment = screen.getByLabelText("Appointment With");
    const reason = screen.getByLabelText("Reason");
    const notes = screen.getByLabelText("Notes");
    const cancelButton = screen.getAllByRole('button')[0];
    await userEvent.click(cancelButton);
    await mockRouter;
    expect(mockRouter).toHaveBeenCalledWith('/viewappointments');
})