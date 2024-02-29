import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Health from './HealthPage';
import { useAuth } from "../contexts/AuthContext";

const mockRouter= jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

jest.mock("../contexts/AuthContext", () =>{
    return {
        useAuth: jest.fn(),
    }
})

describe("Health Menu Test", () => {

    it("All elements are displayed to the user", async () => {
        useAuth.mockImplementation(() => {
            return {
              user: { uid: "AKSODN#KLAD12nkvs" },
            };
          });
        render(<Health/>);
        await waitFor(async () =>{
            const heading = screen.getByText("Your Health");
            const subheading = screen.getByText("Let Compass remove the hassle of recalling when to take your medications and when you have important medical appointments.")
            const appointmentBox = screen.getAllByRole('link')[0];
            const medicationBox = screen.getAllByRole('link')[1];
            const snoreDetectionBox = screen.getAllByRole('link')[2];
            expect(heading).toBeInTheDocument();
            expect(subheading).toBeInTheDocument();
            expect(appointmentBox).toBeInTheDocument();
            expect(medicationBox).toBeInTheDocument();
            expect(snoreDetectionBox).toBeInTheDocument();
        }) 
    })

    it("User not logged in", async () => {
        useAuth.mockImplementation(() => {
            return {
              user: null
            };
          });
        render(<Health/>);
        const text = await screen.findByText("Error 403 - Access Forbidden"); 
        expect(text).toBeInTheDocument();
    })
});
