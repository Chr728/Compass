import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import EditProfile from '../editprofile/page';

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
        const submitButton = screen.getByRole("button");

        expect(firstName).toBeInTheDocument();
        expect(lastName).toBeInTheDocument();
        expect(street).toBeInTheDocument();
        expect(city).toBeInTheDocument();
        expect(province).toBeInTheDocument();
        expect(postalCode).toBeInTheDocument();
        expect(phone).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    })

    test("Postal Code error message", async () => {
        render(<EditProfile/>);
        const postalCode = screen.getByLabelText("Postal Code");
        await userEvent.type(postalCode, "H8SSSS");
        fireEvent.blur(postalCode);
        const error = screen.getByText("Invalid Postal Code");
        expect(error).toBeInTheDocument();
    })

    test("Phone Number error message", async () => {
        render(<EditProfile/>);
        const phone = screen.getByLabelText("Phone Number");
        await userEvent.type(phone, "123123");
        fireEvent.blur(phone);
        const error = screen.getByText("Please enter a 10 digit number");
        expect(error).toBeInTheDocument();
    })


})