import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import  MainMenu from './page'
import { useAuth } from '../contexts/AuthContext';

const mockRouter= jest.fn();
const mockUsePathname = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    },
    usePathname: () => mockUsePathname()
}));

jest.mock("../contexts/AuthContext", () =>{
    return {
        useAuth: jest.fn(),
    }
})

describe("Main page shown only to logged in users", () => {
    beforeEach(() => {
        useAuth.mockImplementation(() => {
            return {
            user: { uid: "AKSODN#KLAD12nkvs" },
            };
        });
    })

    it("All elements are shown to the user", () => {
        render(<MainMenu/>);
        const welcomeText = screen.getByText("Welcome to Compass");
        const quickstartText = screen.getByText("Quickstart Your Journey...");
        const appointmentTextElement = screen.getByText("Appointments");
        const medicationTextElement = screen.getByText("Medications");
        const JournalTextElement = screen.getAllByText("Journals")[0];
        const profileTextElement = screen.getByText("Profile");

        expect(welcomeText).toBeInTheDocument();
        expect(quickstartText).toBeInTheDocument();
        expect(appointmentTextElement).toBeInTheDocument();
        expect(medicationTextElement).toBeInTheDocument();
        expect(JournalTextElement).toBeInTheDocument();
        expect(profileTextElement).toBeInTheDocument();
    })

    it("Error page is shown", async () => {
        useAuth.mockImplementation(() => {
            return {
            user: null,
            };
        });
        render(<MainMenu />);
        const errorMessage = await screen.findByText("Error 403 - Access Forbidden");
        expect(errorMessage).toBeInTheDocument();
    })


    it("Error page is not shown", async () =>{
        render(<MainMenu/>);
        const errorMessage = screen.queryByText("Error 403 - Access Forbidden");
        expect(errorMessage).not.toBeInTheDocument();
        })

    it("Redirect to appointments routes", async() => {
        render(<MainMenu/>);
        const appointments = screen.getByText("Appointments");
        await userEvent.click(appointments);
        expect(mockRouter).toBeCalledWith('/viewappointments');
    })

    it("Redirected to journals route ", async() => {
        render(<MainMenu/>);
        const journals = screen.getAllByText("Journals")[0];
        await userEvent.click(journals);
        expect(mockRouter).toBeCalledWith('/journals');
    })

    it("Redirected to profile route", async() => {
        render(<MainMenu/>);
        const profile = screen.getByText("Profile");
        await userEvent.click(profile);
        expect(mockRouter).toBeCalledWith('/profile');
    })
})