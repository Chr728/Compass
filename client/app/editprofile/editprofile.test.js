import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import EditProfile from '../editprofile/page';

const mockRouter= jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

describe("Error Messages", () => {
    test("All fields are visible to the user", () => {
        render(<EditProfile/>);
        const firstName = screen.getByLabelText("First Name");
        const lastName = screen.getByLabelText("Last Name");
        const street = screen.getByLabelText("Street Address");
        const city = screen.getByLabelText("City");
        const province = screen.getByLabelText("Province");
        const postalCode = screen.getByLabelText("Postal Code");
        const phone = screen.getByLabelText("Phone Number");
        const cancelButton = screen.getAllByRole("button")[0];
        const submitButton = screen.getAllByRole("button")[1];

        expect(firstName).toBeInTheDocument();
        expect(lastName).toBeInTheDocument();
        expect(street).toBeInTheDocument();
        expect(city).toBeInTheDocument();
        expect(province).toBeInTheDocument();
        expect(postalCode).toBeInTheDocument();
        expect(phone).toBeInTheDocument();
        expect(cancelButton).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    })

    test("First Name error message", async () => {
        render(<EditProfile/>);
        const fname = await screen.findByLabelText("First Name");
        await userEvent.type(fname, "georgia9");
        fireEvent.blur(fname);
        const error = await screen.findByText("Names cannot contain numbers and must not begin or end with a space.");
        expect(error).toBeInTheDocument();
    })

    test("Last Name error message", async () => {
        render(<EditProfile/>);
        const lname = await screen.findByLabelText("Last Name");
        await userEvent.type(lname, "georgia9");
        fireEvent.blur(lname);
        const error = await screen.findByText("Names cannot contain numbers and must not begin or end with a space.");
        expect(error).toBeInTheDocument();
    })

    test("Postal Code error message", async () => {
        render(<EditProfile/>);
        const postalCode = await screen.findByLabelText("Postal Code");
        await userEvent.type(postalCode, "H8SSSS");
        fireEvent.blur(postalCode);
        const error = await screen.findByText("Invalid Postal Code");
        expect(error).toBeInTheDocument();
    })

    test("Phone Number error message", async () => {
        render(<EditProfile/>);
        const phone = await screen.findByLabelText("Phone Number");
        await userEvent.type(phone, "123123");
        fireEvent.blur(phone);
        const error = await screen.findByText("Please enter a 10 digit number");
        expect(error).toBeInTheDocument();
    })

    test("Cancel Button functions correctly", async () =>{
        render(<EditProfile/>);
        const cancelButton = screen.getAllByRole("button")[0];
        await userEvent.click(cancelButton);
        await mockRouter;
        expect(mockRouter).toHaveBeenCalledTimes(1);
    })


})