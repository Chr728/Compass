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
        expect(linkElement).toHaveAttribute("href", "/tpage");
    })

    test("link redirects to appointments  page", async () => {
        const linkElement = screen.getAllByRole("link")[1];
        expect(linkElement).toHaveAttribute("href", "/health");
    })
    
    test("link redirects to journals page", async () => {
        const linkElement = screen.getAllByRole("link")[2];
        expect(linkElement).toHaveAttribute("href", "/journals");
    })

    test("link redirects to settings page", async () => {
        const linkElement = screen.getAllByRole("link")[4];
        expect(linkElement).toHaveAttribute("href", "/settings");
    })
    
});
