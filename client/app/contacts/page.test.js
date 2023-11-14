import {render, screen, waitFor} from '@testing-library/react';
import '@testing-library/jest-dom';
import  Contacts from './page'
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

describe("Health page shown only to logged in users", () =>{


})