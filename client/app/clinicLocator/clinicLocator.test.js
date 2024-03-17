import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useAuth } from "../contexts/AuthContext";
import ClinicLocator from './clinicLocator';
import {beforeEach} from "node:test";

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

navigator.geolocation = {
    getCurrentPosition: jest.fn()
};

function mockLocalStorage() {
    let store = {};
    return {
        getItem: function(key) {
            return store[key];
        },
        setItem: function(key, value) {
            store[key] = value.toString();
        },
        clear: function() {
            store = {};
        }
    };
}

beforeEach(() => {
    useAuth.mockImplementation(() => {
        return {
            user: {uid: "AKSODN#KLAD12nkvs"},
        };
    });
});

beforeEach(() => {
    // Mock the geolocation API
    global.navigator.geolocation = {
        getCurrentPosition: jest.fn()
            .mockImplementationOnce((success, error) => success({
                coords: {
                    latitude: 43.65107,
                    longitude: -79.347015
                }
            }))
        // Use .mockImplementationOnce again if you want to test error handling in another test
    };
});


    describe('LocateClinic', () => {
        it('renders the enable location button when location is not available', () => {
            render(<ClinicLocator/>);
            const image = screen.getByAltText('Location Disabled');
            expect(screen.getByText('Enable Location')).toBeInTheDocument();
        });

        it('calls geolocation API when enable location button is clicked', () => {
            render(<ClinicLocator/>);
            const button = screen.getByText('Enable Location');
            fireEvent.click(button);
            expect(navigator.geolocation.getCurrentPosition).toHaveBeenCalledTimes(1);
        });

        it('renders the clinic locator when location is available', () => {
            localStorage.setItem('location', JSON.stringify({latitude: 12.345, longitude: 67.890, timestamp: Date.now()}));

            render(<ClinicLocator/>);
            expect(screen.getByText('Locate Clinic')).toBeInTheDocument();
            expect(screen.getByText('Choose a type of clinic to locate')).toBeInTheDocument();
            expect(screen.getByText('Pharmacy')).toBeInTheDocument();
            expect(screen.getByText('Hospital')).toBeInTheDocument();
            expect(screen.getByText('Doctor')).toBeInTheDocument();
            expect(screen.getByText('Dentist')).toBeInTheDocument();
            expect(screen.getByText('Physiotherapist')).toBeInTheDocument();

        });

    })
