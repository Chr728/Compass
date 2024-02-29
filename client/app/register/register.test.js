import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Register from '../register/page';

const signup = jest.fn();
jest.mock('../contexts/AuthContext', () => {
    return {
        useAuth: () => {
            return {
                signUp : signup
            }
            
        }
    }
})

describe("All elements displayed on pages", () => {

    test("Elements displayed on the page", async () => {
        render(<Register/>);
        const emailInput = screen.queryByLabelText("Email Address");
        const passwordInput = screen.queryByLabelText("Password");
        const confirmPasswordInput = screen.queryByLabelText("Confirm Password");
        const firstName = screen.queryByLabelText("First Name");
        const lastName = screen.queryByLabelText("Last Name");
        const phone = screen.queryByLabelText("Phone Number");
        const birthdate = screen.getByLabelText("Birthdate");
        const sex = screen.getByLabelText("Sex");

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(confirmPasswordInput).toBeInTheDocument();
        expect(firstName).toBeInTheDocument();
        expect(lastName).toBeInTheDocument();
        expect(phone).toBeInTheDocument();
        expect(birthdate).toBeInTheDocument();
        expect(sex).toBeInTheDocument();

    })
})


describe("Error validation", () => {

    test("Submit button is disabled until all fields are filled correctly", async () => {
        render(<Register/>);
        const submitButton = screen.getByRole("button");
        await userEvent.click(submitButton);
        const emailError = await screen.findByText("Email Required");
        const passwordError = await screen.findByText("Password Required");
        const confPasswordError = await screen.findByText("Confirmation of Password Required");
        const fnameError = await screen.findByText("First Name Required");
        const lnameError = await screen.findByText("Last Name Required");
        const phoneError = await screen.findByText("Phone Number Required");
        const birthdateError = await screen.findByText("Birthdate Required");
        const sexError = await screen.findByText("Sex Required");

        expect(emailError).toBeInTheDocument();
        expect(passwordError).toBeInTheDocument();
        expect(confPasswordError).toBeInTheDocument();
        expect(fnameError).toBeInTheDocument();
        expect(lnameError).toBeInTheDocument();
        expect(phoneError).toBeInTheDocument();
        expect(birthdateError).toBeInTheDocument();
        expect(sexError).toBeInTheDocument();

    })

    test("Submit button works correctly", async () => {
        render(<Register/>);
        const emailInput = screen.getByLabelText("Email Address");
        const passwordInput = screen.getByLabelText("Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm Password");
        const firstName = screen.getByLabelText("First Name");
        const lastName = screen.getByLabelText("Last Name");
        const phone = screen.getByLabelText("Phone Number");
        const birthdate = screen.getByLabelText("Birthdate");
        const sex = screen.getByLabelText("Sex");
        await userEvent.type(emailInput, "georgia@georgia.com");
        await userEvent.type(passwordInput, "password");
        await userEvent.type(confirmPasswordInput, "password");
        await userEvent.type(firstName, "Georgia");
        await userEvent.type(lastName, "Georgia");
        await userEvent.type(phone, "1231231234");
        await userEvent.type(birthdate, "2002-08-07");
        await userEvent.type(sex, "Female");
        const submitButton = screen.getByRole("button");
        await userEvent.click(submitButton);
        await signup();
        expect(signup).toHaveBeenCalledTimes(1);
    })
 
    test("Email error message", async () => {
        render(<Register/>);
        const emailInput = screen.getByLabelText("Email Address");
        await userEvent.type(emailInput, "georgia");
        fireEvent.blur(emailInput);
        const error = await screen.findByText("Invalid email format");
        expect(error).toBeInTheDocument();
    })

    test("Password error message", async () => {
        render(<Register/>);
        const passwordInput = screen.getByLabelText("Password");
        fireEvent.blur(passwordInput);
        const error = await screen.findByText("Password Required");
        expect(error).toBeInTheDocument();
        const invalidPass = '123456'
        const invalidPassError = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character';
        await userEvent.type(passwordInput, invalidPass);
        fireEvent.blur(passwordInput);
        const error2 = await screen.findByText(invalidPassError);
        expect(error2).toBeInTheDocument();
        const validPass = 'Password@123'
        await userEvent.clear(passwordInput);
        await userEvent.type(passwordInput, validPass);
        fireEvent.blur(passwordInput);
        const error3 = await screen.queryByText(invalidPassError);
        expect(error3).toBeNull();

    })

    test("Confirm password error message", async () => {
        render(<Register/>);
        const confirmPasswordInput = screen.getByLabelText("Confirm Password");
        fireEvent.blur(confirmPasswordInput);
        const error = await screen.findByText("Confirmation of Password Required");
        expect(error).toBeInTheDocument();
    })

    test("Password and Confirm Password do not match", async() => {
        render(<Register/>);
        const passwordInput = screen.getByLabelText("Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm Password");
        await userEvent.type(passwordInput, "password");
        await userEvent.type(confirmPasswordInput, "passwords");
        fireEvent.blur(confirmPasswordInput);
        const error = await screen.findByText("Passwords provided must match");
        expect(error).toBeInTheDocument();
    })

    test("First Name empty error message", async() => {
        render(<Register/>);
        const firstName = screen.getByLabelText("First Name");
        fireEvent.blur(firstName);
        const error = await screen.findByText("First Name Required");
        expect(error).toBeInTheDocument();
    })

    test("First name cannot contain numbers", async() =>{
        render(<Register/>);
        const firstName = screen.getByLabelText("First Name");
        await userEvent.type(firstName, "Georgia9");
        fireEvent.blur(firstName);
        const error = await screen.findByText("Names cannot contain numbers and must not begin or end with a space.");
        expect(error).toBeInTheDocument();
    })

    test("First name cannot begin with a space", async() =>{
        render(<Register/>);
        const firstName = screen.getByLabelText("First Name");
        await userEvent.type(firstName, " Georgia");
        fireEvent.blur(firstName);
        const error = await screen.findByText("Names cannot contain numbers and must not begin or end with a space.");
        expect(error).toBeInTheDocument();
    })
    
    test("First name cannot end with a space", async() =>{
        render(<Register/>);
        const firstName = screen.getByLabelText("First Name");
        await userEvent.type(firstName, "Georgia ");
        fireEvent.blur(firstName);
        const error = await screen.findByText("Names cannot contain numbers and must not begin or end with a space.");
        expect(error).toBeInTheDocument();
    })

    test("Last name empty error message", async() => {
        render(<Register/>);
        const lastName = screen.getByLabelText("Last Name");
        fireEvent.blur(lastName);
        const error = await screen.findByText("Last Name Required");
        expect(error).toBeInTheDocument();
    })

    test("Last name cannot contain numbers", async() =>{
        render(<Register/>);
        const lastName = screen.getByLabelText("Last Name");
        await userEvent.type(lastName, "Georgia9");
        fireEvent.blur(lastName);
        const error = await screen.findByText("Names cannot contain numbers and must not begin or end with a space.");
        expect(error).toBeInTheDocument();
    })
    test("Last name cannot begin with a space", async() =>{
        render(<Register/>);
        const lastName = screen.getByLabelText("Last Name");
        await userEvent.type(lastName, " Georgia");
        fireEvent.blur(lastName);
        const error = await screen.findByText("Names cannot contain numbers and must not begin or end with a space.");
        expect(error).toBeInTheDocument();
    })
    test("Last name cannot end with a space", async() =>{
        render(<Register/>);
        const lastName = screen.getByLabelText("Last Name");
        await userEvent.type(lastName, "Georgia ");
        fireEvent.blur(lastName);
        const error = await screen.findByText("Names cannot contain numbers and must not begin or end with a space.");
        expect(error).toBeInTheDocument();
    })

    test("Phone number required error message", async()=>{
        render(<Register/>);
        const phone = screen.getByLabelText("Phone Number");
        fireEvent.blur(phone);    
        const error = await screen.findByText("Phone Number Required");
        expect(error).toBeInTheDocument();
    })

    test("Invalid phone number error message", async () => {
        render(<Register/>);
        const phone = screen.getByLabelText("Phone Number");
        await userEvent.type(phone, "123123");
        fireEvent.blur(phone);
        const error = await screen.findByText("Please enter a 10 digit number");
        expect(error).toBeInTheDocument();
    })

    test("Birthdate required error message", async () => {
        render(<Register/>);
        const birthdate = screen.getByLabelText("Birthdate");
        fireEvent.blur(birthdate);
        const error = await screen.findByText("Birthdate Required");
        expect(error).toBeInTheDocument();
    })

    test("Sex required error message", async () => {
        render(<Register/>);
        const sex = screen.getByLabelText("Sex");
        fireEvent.blur(sex);
        const error = await screen.findByText("Sex Required");
        expect(error).toBeInTheDocument();
    })
})