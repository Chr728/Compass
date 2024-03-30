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

const formatPhoneNumber = (phoneNumberString) => {
    const match = phoneNumberString.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
  }

describe('formatPhoneNumber', () => {
    it('formats a 10-digit number correctly', () => {
      const input = '1234567890';
      const expectedOutput = '(123) 456-7890';
      expect(formatPhoneNumber(input)).toBe(expectedOutput);
    });
  
    it('returns null for a number with less than 10 digits', () => {
      const input = '123456789';
      expect(formatPhoneNumber(input)).toBeNull();
    });
  
    it('returns null for a number with more than 10 digits', () => {
      const input = '12345678901';
      expect(formatPhoneNumber(input)).toBeNull();
    });
  
    it('returns null for a non-numeric string', () => {
      const input = 'abcdefghij';
      expect(formatPhoneNumber(input)).toBeNull();
    });
  });