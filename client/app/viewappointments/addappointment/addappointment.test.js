import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import AddAppointment from './page'

const mockRouter = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));


test("All elements are displayed to user", () => {
    render(<AddAppointment/>);
    const appointmentWith = screen.getByLabelText('Appointment With');
    const reason = screen.getByLabelText('Reason');
    const date = screen.getByLabelText('Date');
    const time = screen.getByLabelText('Time');
    const notes = screen.getByLabelText('Notes');

    expect(appointmentWith).toBeInTheDocument();
    expect(reason).toBeInTheDocument();
    expect(date).toBeInTheDocument();
    expect(time).toBeInTheDocument();
    expect(notes).toBeInTheDocument();
})

test('Back icon redirects to view appointments page', async () => {
    render(<AddAppointment/>);
    const backIcon = screen.getByRole('link');
    await userEvent.click(backIcon);
    expect(backIcon).toHaveAttribute('href', '/viewappointment');
})

test("Cancel button functions correctly", async () => {
    render(<AddAppointment/>);
    const cancelButton = screen.getAllByRole('button')[0];
    await userEvent.click(cancelButton);
    await mockRouter();
    expect(mockRouter).toBeCalledWith('/addappointment');
})

