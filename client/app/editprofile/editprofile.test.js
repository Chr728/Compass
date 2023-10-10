import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import EditProfilePage from './editProfilePage';

const mockRouter= jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

const mockUpdateCurrentUser = jest.fn();
jest.mock('../contexts/UserContext', () => {
    const originalModule = jest.requireActual('../contexts/UserContext');
    const mockUserInfo = {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '123-456-7890',
    };

    return {
        ...originalModule,
        useUser: jest.fn(() => ({
            updateCurrentUser: mockUpdateCurrentUser,  // Mock the updateCurrentUser function
            userInfo: mockUserInfo
        })),
        // ...
    }
});




describe("Error Messages", () => {

    test("All fields are visible to the user", () => {
        render(<EditProfilePage/>);
        const firstName = screen.getByLabelText("First Name");
        const lastName = screen.getByLabelText("Last Name");
        const phone = screen.getByLabelText("Phone Number");
        const cancelButton = screen.getAllByRole("button")[0];
        const submitButton = screen.getAllByRole("button")[1];

        expect(firstName).toBeInTheDocument();
        expect(lastName).toBeInTheDocument();
        expect(phone).toBeInTheDocument();
        expect(cancelButton).toBeInTheDocument();
        expect(submitButton).toBeInTheDocument();
    })

    test("First name error message", async () => {
        render(<EditProfilePage/>);
        const fname = await screen.findByLabelText("First Name");
        await userEvent.type(fname, "georgia9");
        fireEvent.blur(fname);
        const error = await screen.findByText("Names cannot contain numbers and must not begin or end with a space.");
        expect(error).toBeInTheDocument();
    })

    test("Last name error message", async () => {
        render(<EditProfilePage/>);
        const lname = await screen.findByLabelText("Last Name");
        await userEvent.type(lname, "georgia9");
        fireEvent.blur(lname);
        const error = await screen.findByText("Names cannot contain numbers and must not begin or end with a space.");
        expect(error).toBeInTheDocument();
    })

    test("Phone number error message", async () => {
        render(<EditProfilePage/>);
        const phone = await screen.findByLabelText("Phone Number");
        await userEvent.type(phone, "123123");
        fireEvent.blur(phone);
        const error = await screen.findByText("Please enter a 10 digit number");
        expect(error).toBeInTheDocument();
    })

    test("Cancel button functions correctly", async () =>{
        render(<EditProfilePage/>);
        const cancelButton = screen.getAllByRole("button")[0];
        await userEvent.click(cancelButton);
        await mockRouter;
        expect(mockRouter).toHaveBeenCalledTimes(1);
    })

    test("Submit button functions correctly", async () =>{
        render(<EditProfilePage/>);
        const submitButton = screen.getAllByRole("button")[1];
        await userEvent.click(submitButton);
        expect(mockRouter).toHaveBeenCalledWith('/profile');
    })


})