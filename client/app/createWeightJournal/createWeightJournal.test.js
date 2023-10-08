import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CreateWeightJournal from '../createWeightJournal/page';

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


jest.mock('../../http/weightJournalAPI', () => {
    return {
        createWeightJournal: jest.fn()
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

const { createWeightJournal} = require('../../http/weightJournalAPI');
 
    test("All fields are displayed to the user", () => {
        render(<CreateWeightJournal/>);
        const date = screen.getByLabelText("Date");
        const time  = screen.getByLabelText("Time");
        const weight = screen.getByLabelText("Weight");
        const height = screen.getByLabelText("Height");
        const unit = screen.getByLabelText("Unit");
        const notes  = screen.getByLabelText("Notes");

        expect(date).toBeInTheDocument();
        expect(time).toBeInTheDocument();
        expect(weight).toBeInTheDocument();
        expect(height).toBeInTheDocument();
        expect(unit).toBeInTheDocument();
        expect(notes).toBeInTheDocument();
    })

    test("Error displayed if any of the fields are empty", async () => {
        render(<CreateWeightJournal/>);
        const date = screen.getByLabelText("Date");
        fireEvent.blur(date);
        const error = await screen.findByText("This field can't be left empty.");
        expect(error).toBeInTheDocument();

        const time = screen.getByLabelText("Time");
        fireEvent.blur(time);
        const error1 = await screen.findByText("This field can't be left empty.");
        expect(error1).toBeInTheDocument();

        const weight = screen.getByLabelText("Weight");
        fireEvent.blur(weight);
        const error2 = await screen.findByText("This field can't be left empty or zero.");
        expect(error2).toBeInTheDocument();


        const unit = screen.getByLabelText("Unit");
        fireEvent.blur(unit);
        const error3 = await screen.findByText("This field can't be left empty.");
        expect(error3).toBeInTheDocument();

        const height = screen.getByLabelText("Height");
        fireEvent.blur(height);
        const error4 = await screen.findByText("This field can't be left empty or zero.");
        expect(error4).toBeInTheDocument();
    })

    test("Height or weight cant contain zero", async () => {
        render(<CreateWeightJournal/>);
        const weight = screen.getByLabelText("Weight");
        await userEvent.type(weight, "0");
        fireEvent.blur(weight);
        const error = await screen.findByText("You can't enter a negative weight or a weight of zero.");
        expect(error).toBeInTheDocument();

        const height = screen.getByLabelText("Height");
        await userEvent.type(height, "0");
        fireEvent.blur(weight);
        const error1 = await screen.findByText("You can't enter a negative height or a height of zero.");
        expect(error1).toBeInTheDocument();
       
    })


    test("Height or weight cant be negative", async () => {
        render(<CreateWeightJournal/>);
        const weight = screen.getByLabelText("Weight");
        await userEvent.type(weight, "-7");
        fireEvent.blur(weight);
        const error = await screen.findByText("You can't enter a negative weight or a weight of zero.");
        expect(error).toBeInTheDocument();

        const height = screen.getByLabelText("Height");
        await userEvent.type(height, "-4");
        fireEvent.blur(weight);
        const error1 = await screen.findByText("You can't enter a negative height or a height of zero.");
        expect(error1).toBeInTheDocument();
       
    })

    test("Submit button calls createweightjournal function", async () => {
        render(<CreateWeightJournal/>);
        const date = screen.getByLabelText("Date");
        const time  = screen.getByLabelText("Time");
        const weight = screen.getByLabelText("Weight");
        const height = screen.getByLabelText("Height");
        const unit = screen.getByLabelText("Unit");
        const notes  = screen.getByLabelText("Notes");
        const submitButton = screen.getAllByRole('button')[1];

        await userEvent.type(date, "2023-09-09");
        await userEvent.type(time, "8:36")
        await userEvent.type(weight, "85");
        await userEvent.type(unit, "Kg");
        await userEvent.type(height, "1.70");
        await userEvent.type(notes, "abc");

        await userEvent.click(submitButton);
        await createWeightJournal;
        await mockRouter;

        expect(createWeightJournal).toHaveBeenCalledTimes(1);
        expect(mockRouter).toHaveBeenCalledWith('/createWeightJournal');
    })

    test("Cancel button redirects to getWeightJournals page", async () => {
        render(<CreateWeightJournal/>);
        const cancelButton = screen.getAllByRole('button')[1];
        await userEvent.click(cancelButton);
        await mockRouter;
        expect(mockRouter).toHaveBeenCalledWith('/getWeightJournals');

    })