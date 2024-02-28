import {render, screen, act, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import GetBloodPressureJournal from './page';
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


describe("Getting a blood pressure journal", () => {

    beforeEach(() => {
        useAuth.mockImplementation(() => {
            return {
                user: { uid: "AKSODN#KLAD12nkvs" },
            };
        });
    })

    it("All fields are is displayed correctly", async () => {
        
    })
})