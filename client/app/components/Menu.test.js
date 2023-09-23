import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import Menu from '../components/Menu';

describe("Menu components", () => {
    // Render the Menu component before each test.
    beforeEach(() => {
        render(<Menu />);
    });

    test("link redirects to main page", async () => {
        const linkElement = screen.getAllByRole("link")[0];
        expect(linkElement).toHaveAttribute("href", "/");
    })

    test("link redirects to settings page", async () => {
        const linkElement = screen.getAllByRole("link")[4];
        expect(linkElement).toHaveAttribute("href", "/settings");
    })
});
