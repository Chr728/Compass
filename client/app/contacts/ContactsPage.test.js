import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Contacts from './ContactsPage';
import { useAuth } from "../contexts/AuthContext";
import userEvent from '@testing-library/user-event';

const mockRouter= jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

jest.mock("../contexts/AuthContext", () =>{
    return {
        useAuth: jest.fn(),
    }
})

describe("Contacts Menu Test", () => {
    it("All elements are displayed to the user", async () => {
        useAuth.mockImplementation(() => {
            return {
              user: { uid: "AKSODN#KLAD12nkvs" },
            };
          });
        render(<Contacts/>);
        await waitFor(async () =>{
            const heading = screen.getByText("Your Contacts");
            const subheading = screen.getByText("Contact your loved ones with the click of a button.")
            expect(heading).toBeInTheDocument();
            expect(subheading).toBeInTheDocument();

        }) 
    })

    it("Back button redirects to home page", async () => {
        useAuth.mockImplementation(() => {
            return {
              user: { uid: "AKSODN#KLAD12nkvs" },
            };
          });
        render(<Contacts />);
        const backButton = screen.getAllByRole('button')[0];
        userEvent.click(backButton);
        await waitFor(() => {
            expect(mockRouter).toHaveBeenCalledWith('/tpage');
        });
    })
});
