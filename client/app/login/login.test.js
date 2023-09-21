import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Login from "../login/page";
import { useAuth, AuthProvider } from '../contexts/AuthContext';


jest.mock('../contexts/AuthContext', () => {
    return {
        useAuth: jest.fn()
    }
})



describe("Login Page error messages", () => {
    beforeEach(() => {
        useAuth.mockImplementation(() => 
        { 
            return {
                user: { email: 'd@d.com'},
                login: jest.fn()
            }
        })
    })

    test("render all the content to the screen", () => {
        render(<Login/>);
        const signInHeader = screen.getAllByText(/Sign In/i)[0];
        const noAccountHeader = screen.getByText(/Don't have an account yet?/i);
        const signUpHeader = screen.getByText(/sign up now/i);
        const emailLabel = screen.getByText(/email/i);
        const passwordLabel = screen.getAllByText(/password/i)[0];
        const emailInput = screen.getByLabelText("Email");
        const passwordInput = screen.getByLabelText("Password");
        const button = screen.getByRole('button');
        const forgotPasswordText = screen.getByText(/forgot password?/i)
    
    })
    
    test("renders error messages when email and password not entered", async () => {
        render( <Login/>);
        const emailInput = screen.getByLabelText("Email");
        const passwordInput = screen.getByLabelText("Password");
        const button = screen.getByRole('button');
        userEvent.click(button);
        const emailError = await screen.findByText(/email is required/i);
        const passwordError = await screen.findByText(/password is required/i);
        expect(emailError).toBeInTheDocument();
        expect(passwordError).toBeInTheDocument();
    
    })
    
    test("renders email error message on incorrect email and correct password",  async () => {
        render( <Login/>);
        const emailInput = screen.getByRole("textbox", { name: /email/i});
        const passwordInput = screen.getByLabelText("Password");
        await userEvent.type(emailInput, "georgia");
        await userEvent.type(passwordInput, "password")
        const emailError = screen.getByText(/invalid email format/i);
        expect(emailError).toBeInTheDocument();
    })
    
    test("renders password required error message on correct email and no password",  async () => {
        render( <Login/>);
        const emailInput = screen.getByRole("textbox", { name: /email/i});
        await userEvent.type(emailInput, "georgia@georgia.georgia");
        const button = screen.getByRole('button');
        await userEvent.click(button);
        const passwordError = screen.getByText(/password is required/i)
        expect(passwordError).toBeInTheDocument();
    })
    
    test("renders error message on incorrect email and no password", async () => {
        render( <Login/>);
        const emailInput = screen.getByRole("textbox", { name: /email/i});
        await userEvent.type(emailInput, "georgia");
        const button = screen.getByRole('button');
        await userEvent.click(button);
        const emailError = screen.getByText(/invalid email format/i);
        const passwordError = screen.getByText(/password is required/i);
        expect(emailError).toBeInTheDocument();
        expect(passwordError).toBeInTheDocument();
    })

    test("shows email error message on blur", async () => {
        render( <Login/>);
        const emailInput = screen.getByRole("textbox", { name: /email/i});
        await userEvent.type(emailInput, "georgia");
        fireEvent.blur(emailInput);
        const emailError = await screen.findByText(/invalid email format/i);
        expect(emailError).toBeInTheDocument();

    })

    test("shows password error message on blur", async () => {
        render( <Login/>);
        const passwordInput = screen.getByLabelText("Password");
        await userEvent.click(passwordInput);
        fireEvent.blur(passwordInput);
        const passwordError = await screen.findByText(/password is required/i)
        expect(passwordError).toBeInTheDocument();

    })

    test("toggling the eye icon shows/hides the password", async () => {
        render( <Login/>);
        const passwordInput = screen.getByLabelText("Password");
        const eyeIcon = screen.getByAltText(/eye icon/i);
        await userEvent.click(eyeIcon);
        expect(passwordInput).toHaveAttribute('type', 'text');
        await userEvent.click(eyeIcon);
        expect(passwordInput).toHaveAttribute('type', 'password');

    })

    test("link redirects to register page", async () => {
        render(<Login/>);
        const linkElement = screen.getAllByRole("link")[0];
        expect(linkElement).toHaveAttribute("href", "/register");
    })
})


describe("Invalid login credentails", () => {
    beforeEach(() => {
        useAuth.mockImplementation(() => 
        { 
            return {
                user: null,
                login: jest.fn(),
                error: "Invalid Credentials. Please try again."
            }
        })
    })

    test('logging in with invalid credentials', async () => {
        render( <Login/>);
        const emailInput = screen.getByRole("textbox", { name: /email/i});
        const passwordInput = screen.getByLabelText("Password");
        const button = screen.getByRole('button');
        await userEvent.type(emailInput, "georgia@georgia.com");
        await userEvent.type(passwordInput, "georgia");
        await userEvent.click(button);
        const error = await screen.findByText(/invalid credentials. please try again./i);
        expect(error).toBeInTheDocument();
    })

})


describe("Valid login credentials", () => {
    beforeEach(() => {
        useAuth.mockImplementation(() => 
        { 
            return {
                user: {},
                login: jest.fn(),
                error: null
            }
        })
    })

    test('logging in with valid credentials', async () => {
        render( <Login/>);
        const emailInput = screen.getByRole("textbox", { name: /email/i});
        const passwordInput = screen.getByLabelText("Password");
        const button = screen.getByRole('button');
        await userEvent.type(emailInput, "georgia@georgia.com");
        await userEvent.type(passwordInput, "georgia");
        await userEvent.click(button);
        const error = await screen.queryByText(/invalid credentials. please try again./i);
        expect(error).not.toBeInTheDocument();
    })

})