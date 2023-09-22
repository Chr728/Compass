import { render, screen } from "@testing-library/react";
import Menu from '../components/Menu';

describe("Menu component", () => {
    // Render the Menu component before each test.
    beforeEach(() => {
        render(<Menu />);
    });

    test("link redirects to main page", async () => {
        render(<Menu/>);
        const linkElement = screen.getByRole("link");
        expect(linkElement).toHaveAttribute("href", "/");
    })

    test("link redirects to main page", async () => {
        render(<Menu/>);
        const linkElement = screen.getByRole("link");
        expect(linkElement).toHaveAttribute("href", "/settings");
    })
});
