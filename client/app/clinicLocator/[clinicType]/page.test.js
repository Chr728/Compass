import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useAuth } from "../../contexts/AuthContext";
import ClinicLocations from './page';
import {beforeEach} from "node:test";

const mockRouter= jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

jest.mock("../../contexts/AuthContext", () =>{
    return {
        useAuth: jest.fn(),
    }
})

beforeEach(() => {
    useAuth.mockImplementation(() => {
        return {
            user: {uid: "AKSODN#KLAD12nkvs"},
        };
    });
});


describe("Locations page tests", () => {
    it("Renders the page", () => {
        render(<ClinicLocations params={{ clinicType: 'Hospital' }} />);
        const header = screen.getByText("Locate Hospital");
        expect(header).toBeInTheDocument();
        expect(screen.getByText("Select a location to get directions")).toBeInTheDocument();
        expect(screen.getByText("No clinics found near your location.")).toBeInTheDocument();
    })
})

