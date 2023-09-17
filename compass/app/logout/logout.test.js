import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Login from "../login/page";
import { useAuth, AuthProvider } from '../contexts/AuthContext';


// jest.mock('../contexts/AuthContext', () => {
//     return {
//         useAuth: jest.fn()
//     }
// })

describe("Returning back to home main page", () => {
    beforeEach(() => {
    test("link redirects to main page", async () => {
        render(<Logout/>);
        const linkElement = screen.getAllByRole("link")[0];
        expect(linkElement).toHaveAttribute("href", "/");
    })

 })

})