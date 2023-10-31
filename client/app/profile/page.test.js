import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';
import  Profile from './page'
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';

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

jest.mock("../contexts/UserContext", () =>{
    return {
        useUser: jest.fn(),
    }
})

describe("Profile page shown only to logged in users", () =>{

    it("Error page is shown", async () => {
        useAuth.mockImplementation(() => {
            return {
            user: null,
            };
        });

        useUser.mockImplementation(() => {
            return {
                userInfo: null,
            };
        });
        
        render(<Profile />);
        const errorMessage = await screen.findByText("Error 403 - Access Forbidden");
        expect(errorMessage).toBeInTheDocument();
    })


})