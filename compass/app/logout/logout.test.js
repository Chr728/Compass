import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Logout from "../logout/page";

describe("Returning back to home main page", () => {

    test("Logo displayed correctly", async () => {
        render(<Logout/>);
        const logoImage = screen.getByAltText("Logo");
        expect(logoImage).toBeVisible();
    })

    
    test("logout Message displayed", async () => {
        render(<Logout/>);
        const message = screen.getByText(/Successfully logged out/i);
        expect(message).toBeInTheDocument();
    })
    test("link redirects to main page", async () => {
        render(<Logout/>);
        const linkElement = screen.getByRole("link");
        expect(linkElement).toHaveAttribute("href", "/");
    })
})