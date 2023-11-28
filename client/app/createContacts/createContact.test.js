import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import CreateContactPage from './createContact';
import { createSpeedDial } from '../http/speedDialAPI';
import { auth } from '../config/firebase';


const mockRouter = jest.fn();

const fakeUser = {
    uid: "1"
}

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

jest.mock('../contexts/AuthContext', () => {
    return {
        useAuth: () => {
            return {
                user : fakeUser
            }
        }
    }
});

describe("Create speed dial entry tests", () => { 
    
    beforeEach(() => {
        global.fetch = jest.fn();
      });
    
      afterEach(() => {
        jest.resetAllMocks();
      });
    
    it('speed dial entry is created on submitting', async () => {
        const mockUserId = '11';
        render(<CreateContactPage />);

        const submitButton = screen.getByRole('button', { name: /Submit/i });
        const contactName = screen.getByLabelText('Contact Name');
        const phone = screen.getByLabelText('Phone Number');

        await userEvent.type(contactName, 'John Doe');
        await userEvent.type(phone, '514-123-4567');

        const mockSpeedDialData = {
          contactName: contactName.value,
          phone: phone.value,
        };
    
        await userEvent.click(submitButton);

        const mockToken = 'mockToken';
        const mockCurrentUser = {
          uid: mockUserId,
          getIdToken: jest.fn().mockResolvedValue(mockToken),
        };
    
        Object.defineProperty(auth, 'currentUser', {
          get: jest.fn().mockReturnValue(mockCurrentUser),
        });
    
        const mockResponse = {
          ok: true,
          json: jest.fn().mockResolvedValue(mockSpeedDialData),
        };
        const mockFetch = jest.fn().mockResolvedValue(mockResponse);
        global.fetch = mockFetch;
    
        const result = await createSpeedDial(mockUserId, mockSpeedDialData);
    
        expect(mockFetch).toHaveBeenCalledWith(
          `${process.env.NEXT_PUBLIC_API_URL}/api/speed-dials/${mockUserId}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${mockToken}`,
            },
            body: "\"11\"",
          }
        );
        expect(result).toEqual(mockActivityJournalData);
      });

    it("All fields are displayed to the user", () => {
        render(<CreateContactPage/>);
        const contactName = screen.getByLabelText('Contact Name');
        const phone = screen.getByLabelText('Phone Number');

        expect(contactName).toBeInTheDocument();
        expect(phone).toBeInTheDocument();
    })

    it("Error displayed if any of the fields are empty", async () => {
        render(<CreateContactPage/>);
        const contactName = screen.getByLabelText("Contact Name");
        fireEvent.blur(contactName);
        const phone = screen.getByLabelText("Phone Number");
        fireEvent.blur(phone);
        const submitButton = screen.getByRole('button', { name: /submit/i });
        userEvent.click(submitButton);

        const errorMessages = await screen.findAllByText("This field can't be left empty.", { exact: false });
        expect(errorMessages.length).toBe(3);
      
        const error = errorMessages[0];
        expect(error).toBeInTheDocument();
      
        const error1 = errorMessages[1];
        expect(error1).toBeInTheDocument();
    })

    it("Cancel button redirects to contacts page", async () => {
        render(<CreateContactPage/>);
        const cancelButton = screen.getAllByRole('button')[1];
        await userEvent.click(cancelButton);
        await mockRouter;
        expect(mockRouter).toHaveBeenCalledWith('/contacts');
    })
})