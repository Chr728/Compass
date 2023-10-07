import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AddAppointmentPage from './addAppointmentPage';

const fakeUser = {
    uid: "1"
}
jest.mock('../../contexts/AuthContext', () => {
    return {
        useAuth: () => {
            return {
                user : fakeUser
            }
        }
    }
});


jest.mock('../../http/appointmentAPI', () => {
    return {
        createAppointment: jest.fn()
    }
});

const mockRouter= jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

const { createAppointment} = require('../../http/appointmentAPI');
 
    test("All fields are displayed to the user", () => {
        render(<AddAppointmentPage/>);
        const doctor = screen.getByLabelText("Appointment With");
        const reason = screen.getByLabelText("Reason");
        const date = screen.getByLabelText("Date");
        const time  = screen.getByLabelText("Time");
        const notes  = screen.getByLabelText("Notes");

        expect(doctor).toBeInTheDocument();
        expect(reason).toBeInTheDocument();
        expect(date).toBeInTheDocument();
        expect(time).toBeInTheDocument();
        expect(notes).toBeInTheDocument();
    })

    test("Error displayed if 'Appointment With' field not filled", async () => {
        render(<AddAppointmentPage/>);
        const doctor = screen.getByLabelText("Appointment With");
        fireEvent.blur(doctor);
        const error = await screen.findByText("Name is required.");
        expect(error).toBeInTheDocument();
       
    })

    test("Name must not contain numbers", async () => {
        render(<AddAppointmentPage/>);
        const doctor = screen.getByLabelText("Appointment With");
        await userEvent.type(doctor, "9abc");
        fireEvent.blur(doctor);
        const error = await screen.findByText("Names cannot contain numbers and must not begin or end with a space.");
        expect(error).toBeInTheDocument();
       
    })

    test("Submit button calls createAppointment function", async () => {
        render(<AddAppointmentPage/>);
        const doctor = screen.getByLabelText("Appointment With");
        const reason = screen.getByLabelText("Reason");
        const date = screen.getByLabelText("Date");
        const time  = screen.getByLabelText("Time");
        const notes  = screen.getByLabelText("Notes");
        const submitButton = screen.getAllByRole('button')[1];

        await userEvent.type(doctor, "Dr. Georgia");
        await userEvent.type(reason, "abc");
        await userEvent.type(date, "2023-09-09");
        await userEvent.type(time, "8:36")
        await userEvent.type(notes, "abc");

        await userEvent.click(submitButton);
        await createAppointment;
        await mockRouter;

        expect(createAppointment).toHaveBeenCalledTimes(1);
        expect(mockRouter).toHaveBeenCalledWith('/viewappointments');
    })

    test("Cancel button redirects to appointments page", async () => {
        render(<AddAppointmentPage/>);
        const cancelButton = screen.getAllByRole('button')[1];
        await userEvent.click(cancelButton);
        await mockRouter;
        expect(mockRouter).toHaveBeenCalledWith('/viewappointments');

    })



