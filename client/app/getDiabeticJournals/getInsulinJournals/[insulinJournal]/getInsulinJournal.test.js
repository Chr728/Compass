import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GetInsulinJournal from './page';
import { getInsulinJournal } from '../../http/diabeticJournalAPI';
import { auth } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';

const mockRouter = jest.fn();
const mockUsePathname = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    },
    usePathname: () => mockUsePathname()
}));

jest.mock("../../contexts/AuthContext", () => {
    return {
        useAuth: jest.fn()
    }
})

describe("Getting an Insulin journal", () => {

    beforeEach(() => {
        global.fetch = jest.fn();

        useAuth.mockImplementation(() => {
            return {
                user: {
                    uid: '1'
                }
            }
        })

    });
    
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('getInsulinJournal() functions correctly', async () => {
        const mockUser = { id: '1', name: 'John Doe', email: 'johndoe@example.com' };
        render(<GetInsulinJournal params={{ insulinJournal: mockUser.id }}/>);
        const mockToken = 'mockToken';
        const mockCurrentUser = {
            uid: mockUser.id,
            getIdToken: jest.fn().mockResolvedValue(mockToken),
        };

        Object.defineProperty(auth, 'currentUser', {
            get: jest.fn().mockReturnValue(mockCurrentUser),
        });

        const mockResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({}),
        };
        const mockFetch = jest.fn().mockResolvedValue(mockResponse);
        global.fetch = mockFetch;

        const userData = await getInsulinJournal(mockUser.id);

        expect(mockResponse.json).toHaveBeenCalled();
        expect(mockFetch).toHaveBeenCalledWith(
            `${process.env.NEXT_PUBLIC_API_URL}/api/journals/diabetic/insulin/${mockUser.id}`,
            {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${mockToken}`,
            },
            method: 'GET',
            }
        );
    });
    
    it("All fields are is displayed correctly", async () => {
        render(<GetInsulinJournal params={{ insulinJournal:'1' }}/>);
        setTimeout(() => {
            expect(screen.getByText(/Date:/i)).toBeInTheDocument();
            expect(screen.getByText("Time:")).toBeInTheDocument();
            expect(screen.getByText("Type:")).toBeInTheDocument();
            expect(screen.getByText("Units:")).toBeInTheDocument();
            expect(screen.getByText("Body Site:")).toBeInTheDocument();
            expect(screen.getByText("Notes:")).toBeInTheDocument();
            expect(screen.getByText("Jan 1, 2014")).toBeInTheDocument();
            expect(screen.getByText("8h36")).toBeInTheDocument();
            expect(screen.getByText("Humalog (Insulin lispro)")).toBeInTheDocument();
            expect(screen.getByText("10")).toBeInTheDocument();
            expect(screen.getByText("Buttocks (left)")).toBeInTheDocument();
            expect(screen.getByText("notes")).toBeInTheDocument();
        }, 1000);
    })
    
    it("Cancel button functions correctly", async() => {
        render(<GetInsulinJournal params={{ insulinJournal:'1' }}/>);
        setTimeout(() => {
            const cancelButton = screen.getAllByRole('button')[2];
            userEvent.click(cancelButton);
            expect(mockRouter).toHaveBeenCalledWith('/getDiabeticJournals')
        }, 1000);
    })
    
    it("Back button redirects to main journals view", async () => {
        render(<GetInsulinJournal params={{ insulinJournal:'1' }}/>);
        const button = screen.getAllByRole("button")[0];
        await userEvent.click(button);
        expect(mockRouter).toHaveBeenCalledWith('/getDiabeticJournals');
    })
})


describe("User not logged in", () => {

    beforeEach(() => {
        useAuth.mockImplementation(() => {
            return {
                user: null
            }
        })
    })

    afterEach( () => {
        jest.resetAllMocks();
    })

    it("Error page displayed", async () => {
        render(<GetInsulinJournal params={{ insulinJournal: null }}/>);
        const errorText = await screen.findByText("Error 403 - Access Forbidden");
        expect(errorText).toBeInTheDocument();
    })
})