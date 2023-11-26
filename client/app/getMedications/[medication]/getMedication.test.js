import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GetActivityJournal from './page';
import { getActivityJournal } from '../../http/activityJournalAPI';
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

describe("Getting an activity journal", () => {

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

    it('getActivityJournal() functions correctly', async () => {
        const mockUser = { id: '1', name: 'John Doe', email: 'johndoe@example.com' };
        render(<GetActivityJournal params={{ activityJournal: mockUser.id }}/>);
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

        const userData = await getActivityJournal(mockUser.id);

        expect(mockResponse.json).toHaveBeenCalled();
        expect(mockFetch).toHaveBeenCalledWith(
            `${process.env.NEXT_PUBLIC_API_URL}/api/journals/activity/${mockUser.id}`,
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
        render(<GetActivityJournal params={{ activityJournal:'1' }}/>);
        setTimeout(() => {
            expect(screen.getByText(/Date:/i)).toBeInTheDocument();
            expect(screen.getByText("Time:")).toBeInTheDocument();
            expect(screen.getByText("Activity:")).toBeInTheDocument();
            expect(screen.getByText("Duration(min):")).toBeInTheDocument();
            expect(screen.getByText("Notes:")).toBeInTheDocument();
            expect(screen.getByText("Jan 1, 2014")).toBeInTheDocument();
            expect(screen.getByText("8h36")).toBeInTheDocument();
            expect(screen.getByText("Swimming")).toBeInTheDocument();
            expect(screen.getByText("45")).toBeInTheDocument();
            expect(screen.getByText("notes")).toBeInTheDocument();
        }, 1000);
    })
    
    it("Cancel button functions correctly", async() => {
        render(<GetActivityJournal params={{ activityJournal:'1' }}/>);
        setTimeout(() => {
            const cancelButton = screen.getAllByRole('button')[2];
            userEvent.click(cancelButton);
            expect(mockRouter).toHaveBeenCalledWith('/getActivityJournals')
        }, 1000);
    })
    
    it("Back button redirects to main journals view", async () => {
        render(<GetActivityJournal params={{ activityJournal:'1' }}/>);
        const button = screen.getAllByRole("button")[0];
        await userEvent.click(button);
        expect(mockRouter).toHaveBeenCalledWith('/getActivityJournals');
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
        render(<GetActivityJournal params={{ activityJournal: null }}/>);
        const errorText = await screen.findByText("Error 403 - Access Forbidden");
        expect(errorText).toBeInTheDocument();
    })
})