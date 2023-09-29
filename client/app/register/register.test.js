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

describe("All elements displayed on appropriate pages", () => {

    test("Elements displayed on the first page", () => {
        render(<Register/>);
        const emailInput = screen.getByLabelText("Email Address");
        const passwordInput = screen.getByLabelText("Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm Password");
        const firstName = screen.getByLabelText("First Name");
        const lastName = screen.getByLabelText("Last Name");
        const street = screen.queryByLabelText("Street Address");
        const city = screen.queryByLabelText("City");
        const province = screen.queryByLabelText("Province");
        const postalCode = screen.queryByLabelText("Postal Code");
        const phone = screen.queryByLabelText("Phone Number");
        const birthdate = screen.queryByLabelText("Birthdate");
        const sex = screen.queryByLabelText("Sex");

        expect(emailInput).toBeInTheDocument();
        expect(passwordInput).toBeInTheDocument();
        expect(confirmPasswordInput).toBeInTheDocument();
        expect(firstName).toBeInTheDocument();
        expect(lastName).toBeInTheDocument();

        expect(street).not.toBeInTheDocument();
        expect(city).not.toBeInTheDocument();
        expect(province).not.toBeInTheDocument();
        expect(postalCode).not.toBeInTheDocument();
        expect(phone).not.toBeInTheDocument();
        expect(birthdate).not.toBeInTheDocument();
        expect(sex).not.toBeInTheDocument();
    })

    test("Elements displayed on the second page", async () => {
        render(<Register/>);
        const firstNextButton = screen.getAllByRole("button")[0];
        const emailInput = screen.queryByLabelText("Email Address");
        const passwordInput = screen.queryByLabelText("Password");
        const confirmPasswordInput = screen.queryByLabelText("Confirm Password");
        const firstName = screen.queryByLabelText("First Name");
        const lastName = screen.queryByLabelText("Last Name");

        await userEvent.type(emailInput, "georgia@georgia.com");
        await userEvent.type(passwordInput, "password");
        await userEvent.type(confirmPasswordInput, "password");
        await userEvent.type(firstName, "Georgia");
        await userEvent.type(lastName, "Georgia");
        await userEvent.click(firstNextButton);

        
        const street = screen.getByLabelText("Street Address");
        const city = screen.getByLabelText("City");
        const province = screen.getByLabelText("Province");
        const postalCode = screen.queryByLabelText("Postal Code");
        const phone = screen.queryByLabelText("Phone Number");
        const birthdate = screen.queryByLabelText("Birthdate");
        const sex = screen.queryByLabelText("Sex");

        
        expect(street).toBeInTheDocument();
        expect(city).toBeInTheDocument();
        expect(province).toBeInTheDocument();
        expect(postalCode).toBeInTheDocument();
        expect(phone).toBeInTheDocument();

        expect(lastName).not.toBeInTheDocument();
        expect(birthdate).not.toBeInTheDocument();
        expect(sex).not.toBeInTheDocument();
    })

    test("Elements displayed on the third page", async () => {
        render(<Register/>);
        const firstNextButton = screen.getAllByRole("button")[0];
        const emailInput = screen.queryByLabelText("Email Address");
        const passwordInput = screen.queryByLabelText("Password");
        const confirmPasswordInput = screen.queryByLabelText("Confirm Password");
        const firstName = screen.queryByLabelText("First Name");
        const lastName = screen.queryByLabelText("Last Name");

        await userEvent.type(emailInput, "georgia@georgia.com");
        await userEvent.type(passwordInput, "password");
        await userEvent.type(confirmPasswordInput, "password");
        await userEvent.type(firstName, "Georgia");
        await userEvent.type(lastName, "Georgia");
        await userEvent.click(firstNextButton);

        
        const street = screen.queryByLabelText("Street Address");
        const city = screen.queryByLabelText("City");
        const province = screen.queryByLabelText("Province");
        const postalCode = screen.queryByLabelText("Postal Code");
        const phone = screen.queryByLabelText("Phone Number");
        const secondNextButton = screen.getAllByRole("button")[1];
        await userEvent.type(street, "123 Street");
        await userEvent.type(city, "City");
        await userEvent.type(province, "Province");
        await userEvent.type(postalCode, "A1A1A1");
        await userEvent.type(phone, "1231231234");
        await userEvent.click(secondNextButton);

       
        const birthdate = screen.getByLabelText("Birthdate");
        const sex = screen.getByLabelText("Sex");

        expect(birthdate).toBeInTheDocument();
        expect(sex).toBeInTheDocument();

        expect(emailInput).not.toBeInTheDocument();
        expect(passwordInput).not.toBeInTheDocument();
        expect(confirmPasswordInput).not.toBeInTheDocument();
        expect(firstName).not.toBeInTheDocument();
        expect(lastName).not.toBeInTheDocument();
        expect(street).not.toBeInTheDocument();
        expect(city).not.toBeInTheDocument();
        expect(province).not.toBeInTheDocument();
        expect(postalCode).not.toBeInTheDocument();
        expect(phone).not.toBeInTheDocument();

    })
})


describe("Error validation", () => {
  
    test("Next button is disabled if all inputs are not provided", async () => {
        render(<Register/>);
        const nextButton = screen.getAllByRole('button')[0];
        const emailInput = screen.getByLabelText("Email Address");
        await userEvent.type(emailInput, "georgia@georgia.com");
        expect(nextButton).toBeDisabled();
    })

    test("Next button works if all mandatory fields are filled correctly", async () => {
        render(<Register/>);
        const nextButton = screen.getAllByRole('button')[0];
        const emailInput = screen.getByLabelText("Email Address");
        const passwordInput = screen.getByLabelText("Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm Password");
        const firstName = screen.getByLabelText("First Name");
        const lastName = screen.getByLabelText("Last Name");
        await userEvent.type(emailInput, "georgia@georgia.com");
        await userEvent.type(passwordInput, "password");
        await userEvent.type(confirmPasswordInput, "password");
        await userEvent.type(firstName, "Georgia");
        await userEvent.type(lastName, "Georgia");
        await userEvent.click(nextButton);
        expect(nextButton.getAttribute("disabled")).toBeNull();
    })

    test("Next button on page two is disabled until the mandatory field is filled", async () => {
        render(<Register/>);
        const firstNextButton = screen.getAllByRole('button')[0];
        const emailInput = screen.getByLabelText("Email Address");
        const passwordInput = screen.getByLabelText("Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm Password");
        const firstName = screen.getByLabelText("First Name");
        const lastName = screen.getByLabelText("Last Name");
        await userEvent.type(emailInput, "georgia@georgia.com");
        await userEvent.type(passwordInput, "password");
        await userEvent.type(confirmPasswordInput, "password");
        await userEvent.type(firstName, "Georgia");
        await userEvent.type(lastName, "Georgia");
        await userEvent.click(firstNextButton);
        const secondNextButton = screen.getAllByRole('button')[1];
        expect(secondNextButton).toBeDisabled();
    })

    test("Submit button is disabled until mandatory fields are filled correctly", async () => {
        render(<Register/>);
        const firstNextButton = screen.getAllByRole("button")[0];
        const emailInput = screen.getByLabelText("Email Address");
        const passwordInput = screen.getByLabelText("Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm Password");
        const firstName = screen.getByLabelText("First Name");
        const lastName = screen.getByLabelText("Last Name");
        await userEvent.type(emailInput, "georgia@georgia.com");
        await userEvent.type(passwordInput, "password");
        await userEvent.type(confirmPasswordInput, "password");
        await userEvent.type(firstName, "Georgia");
        await userEvent.type(lastName, "Georgia");
        await userEvent.click(firstNextButton);
        const secondNextButton = screen.getAllByRole('button')[1];
        const phone = screen.queryByLabelText("Phone Number");
        await userEvent.type(phone, "1231231234");
        await userEvent.click(secondNextButton);
        const submitButton = screen.getAllByRole("button")[1];
        await userEvent.click(submitButton);
        expect(signup).toHaveBeenCalledTimes(0);
    })

    test("Submit button works correctly", async () => {
        render(<Register/>);
        const firstNextButton = screen.getAllByRole("button")[0];
        const emailInput = screen.getByLabelText("Email Address");
        const passwordInput = screen.getByLabelText("Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm Password");
        const firstName = screen.getByLabelText("First Name");
        const lastName = screen.getByLabelText("Last Name");
        await userEvent.type(emailInput, "georgia@georgia.com");
        await userEvent.type(passwordInput, "password");
        await userEvent.type(confirmPasswordInput, "password");
        await userEvent.type(firstName, "Georgia");
        await userEvent.type(lastName, "Georgia");
        await userEvent.click(firstNextButton);
        const secondNextButton = screen.getAllByRole('button')[1];
        const street = screen.getByLabelText("Street Address");
        const city = screen.getByLabelText("City");
        const province = screen.getByLabelText("Province");
        const postalCode = screen.getByLabelText("Postal Code");
        const phone = screen.getByLabelText("Phone Number");
        await userEvent.type(street, "123 Street");
        await userEvent.type(city, "City");
        await userEvent.type(province, "Province");
        await userEvent.type(postalCode, "A1A1A1");
        await userEvent.type(phone, "1231231234");
        await userEvent.click(secondNextButton);
        const birthdate = screen.getByLabelText("Birthdate");
        const sex = screen.getByLabelText("Sex");
        await userEvent.type(birthdate, "2002-08-07");
        await userEvent.type(sex, "Female");
        const submitButton = screen.getAllByRole("button")[1];
        await userEvent.click(submitButton);
        await signup();
        expect(signup).toHaveBeenCalledTimes(1);
    })

    test("Previous button on the second page works correctly", async() => {
        render(<Register/>);
        const emailInput = screen.getByLabelText("Email Address");
        const passwordInput = screen.getByLabelText("Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm Password");
        const firstName = screen.getByLabelText("First Name");
        const lastName = screen.getByLabelText("Last Name");
        const firstNextButton = screen.getAllByRole('button')[0];
        await userEvent.type(emailInput, "georgia@georgia.com");
        await userEvent.type(passwordInput, "password");
        await userEvent.type(confirmPasswordInput, "password");
        await userEvent.type(firstName, "Georgia");
        await userEvent.type(lastName, "Georgia");
        await userEvent.click(firstNextButton);
        const previousButton = screen.getAllByRole('button')[0];
        await userEvent.click(previousButton);

        const email = screen.getByLabelText("Email Address");
        const password = screen.getByLabelText("Password");
        const confirmpassword = screen.getByLabelText("Confirm Password");
        const firstname = screen.getByLabelText("First Name");
        const lastname = screen.getByLabelText("Last Name");
        expect(email).toBeInTheDocument();
        expect(email).toHaveValue("georgia@georgia.com");
        expect(password).toBeInTheDocument();
        expect(password).toHaveValue("password");
        expect(confirmpassword).toBeInTheDocument();
        expect(confirmpassword).toHaveValue("password");
        expect(firstname).toBeInTheDocument();
        expect(firstname).toHaveValue("Georgia");
        expect(lastname).toBeInTheDocument();
        expect(lastname).toHaveValue("Georgia");
    })

    test("Previous button on the third page works correctly", async() => {
        render(<Register/>);
        const emailInput = screen.getByLabelText("Email Address");
        const passwordInput = screen.getByLabelText("Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm Password");
        const firstName = screen.getByLabelText("First Name");
        const lastName = screen.getByLabelText("Last Name");
        const firstNextButton = screen.getAllByRole('button')[0];
        await userEvent.type(emailInput, "georgia@georgia.com");
        await userEvent.type(passwordInput, "password");
        await userEvent.type(confirmPasswordInput, "password");
        await userEvent.type(firstName, "Georgia");
        await userEvent.type(lastName, "Georgia");
        await userEvent.click(firstNextButton);

        const secondNextButton = screen.getAllByRole('button')[1];
        const street = screen.getByLabelText("Street Address");
        const city = screen.getByLabelText("City");
        const province = screen.getByLabelText("Province");
        const postalCode = screen.getByLabelText("Postal Code");
        const phone = screen.getByLabelText("Phone Number");
        await userEvent.type(street, "123 Street");
        await userEvent.type(city, "City");
        await userEvent.type(province, "Province");
        await userEvent.type(postalCode, "A1A1A1");
        await userEvent.type(phone, "1231231234");
        await userEvent.click(secondNextButton);
        const previousButton = screen.getAllByRole('button')[0];
        await userEvent.click(previousButton);
        const phonenumber = screen.getByLabelText("Phone Number");
        expect(phonenumber).toBeInTheDocument();
        expect(phonenumber).toHaveValue("1231231234");
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
        const emailInput = screen.getByLabelText("Email Address");
        const passwordInput = screen.getByLabelText("Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm Password");
        const firstName = screen.getByLabelText("First Name");
        const lastName = screen.getByLabelText("Last Name");
        const firstNextButton = screen.getAllByRole('button')[0];
        await userEvent.type(emailInput, "georgia@georgia.com");
        await userEvent.type(passwordInput, "password");
        await userEvent.type(confirmPasswordInput, "password");
        await userEvent.type(firstName, "Georgia");
        await userEvent.type(lastName, "Georgia");
        await userEvent.click(firstNextButton);

        const phone = screen.getByLabelText("Phone Number");
        fireEvent.blur(phone);    
        const error = await screen.findByText("Phone Number Required");
        expect(error).toBeInTheDocument();
    })

    test("Invalid phone number error message", async () => {
        render(<Register/>);
        const emailInput = screen.getByLabelText("Email Address");
        const passwordInput = screen.getByLabelText("Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm Password");
        const firstName = screen.getByLabelText("First Name");
        const lastName = screen.getByLabelText("Last Name");
        const firstNextButton = screen.getAllByRole('button')[0];
        await userEvent.type(emailInput, "georgia@georgia.com");
        await userEvent.type(passwordInput, "password");
        await userEvent.type(confirmPasswordInput, "password");
        await userEvent.type(firstName, "Georgia");
        await userEvent.type(lastName, "Georgia");
        await userEvent.click(firstNextButton);

        const phone = screen.getByLabelText("Phone Number");
        await userEvent.type(phone, "123123");
        fireEvent.blur(phone);
        const error = await screen.findByText("Please enter a 10 digit number");
        expect(error).toBeInTheDocument();
    })

    test("Birthdate required error message", async () => {
        render(<Register/>);
        const emailInput = screen.getByLabelText("Email Address");
        const passwordInput = screen.getByLabelText("Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm Password");
        const firstName = screen.getByLabelText("First Name");
        const lastName = screen.getByLabelText("Last Name");
        const firstNextButton = screen.getAllByRole('button')[0];
        await userEvent.type(emailInput, "georgia@georgia.com");
        await userEvent.type(passwordInput, "password");
        await userEvent.type(confirmPasswordInput, "password");
        await userEvent.type(firstName, "Georgia");
        await userEvent.type(lastName, "Georgia");
        await userEvent.click(firstNextButton);

        const secondNextButton = screen.getAllByRole('button')[1];
        const street = screen.getByLabelText("Street Address");
        const city = screen.getByLabelText("City");
        const province = screen.getByLabelText("Province");
        const postalCode = screen.getByLabelText("Postal Code");
        const phone = screen.getByLabelText("Phone Number");
        await userEvent.type(street, "123 Street");
        await userEvent.type(city, "City");
        await userEvent.type(province, "Province");
        await userEvent.type(postalCode, "A1A1A1");
        await userEvent.type(phone, "1231231234");
        await userEvent.click(secondNextButton);
        const birthdate = screen.getByLabelText("Birthdate");
        fireEvent.blur(birthdate);
        const error = await screen.findByText("Birthdate Required");
        expect(error).toBeInTheDocument();
    })

    test("Sex required error message", async () => {
        render(<Register/>);
        const emailInput = screen.getByLabelText("Email Address");
        const passwordInput = screen.getByLabelText("Password");
        const confirmPasswordInput = screen.getByLabelText("Confirm Password");
        const firstName = screen.getByLabelText("First Name");
        const lastName = screen.getByLabelText("Last Name");
        const firstNextButton = screen.getAllByRole('button')[0];
        await userEvent.type(emailInput, "georgia@georgia.com");
        await userEvent.type(passwordInput, "password");
        await userEvent.type(confirmPasswordInput, "password");
        await userEvent.type(firstName, "Georgia");
        await userEvent.type(lastName, "Georgia");
        await userEvent.click(firstNextButton);

        const secondNextButton = screen.getAllByRole('button')[1];
        const street = screen.getByLabelText("Street Address");
        const city = screen.getByLabelText("City");
        const province = screen.getByLabelText("Province");
        const postalCode = screen.getByLabelText("Postal Code");
        const phone = screen.getByLabelText("Phone Number");
        await userEvent.type(street, "123 Street");
        await userEvent.type(city, "City");
        await userEvent.type(province, "Province");
        await userEvent.type(postalCode, "A1A1A1");
        await userEvent.type(phone, "1231231234");
        await userEvent.click(secondNextButton);
        const sex = screen.getByLabelText("Sex");
        fireEvent.blur(sex);
        const error = await screen.findByText("Sex Required");
        expect(error).toBeInTheDocument();
    })

})