import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import Profile from '../profile/page';
import { useRouter } from 'next/navigation';
import {useUser} from '../contexts/UserContext';
import {UserProvider} from '../contexts/UserContext';


const mockRouter= jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

jest.mock('../contexts/UserContext', () => {
    const originalModule = jest.requireActual('../contexts/UserContext');

    return {
        ...originalModule,
        useUser: jest.fn(), // Mock the useUser hook
        UserProvider:({ children }) => {
            // Mock the UserProvider component
            const userInfo = {
                id: 1,
                uid: 'mock-uid',
                email: 'mock@example.com',
                firstName: 'John',
                lastName: 'Doe',
                streetAddress: '1234 Main St',
                city: 'Mock City',
                province: 'Mock Province',
                postalCode: '12345',
                phoneNumber: '123-456-7890',
                birthDate: new Date(),
                sex: 'Male',
            };

            return <div>{children}</div>; // You can adjust this mock component as needed
        },
    };
});




    test("All fields are tested if visible to the user", () => {
        require('../contexts/UserContext').useUser.mockReturnValue({
            userInfo: {
                id: 1,
                uid: 'mock-uid',
                email: 'mock@example.com',
                firstName: 'John',
                lastName: 'Doe',
                streetAddress: '1234 Main St',
                city: 'Mock City',
                province: 'Mock Province',
                postalCode: '12345',
                phoneNumber: '123-456-7890',
                birthDate: "1990-01-01",
                sex: 'Male',
            },
        });
        render(<Profile/>);
        expect(screen.getByText("First Name :")).toBeInTheDocument();
        expect(screen.getByText("John")).toBeInTheDocument();

        expect(screen.getByText("Last Name :")).toBeInTheDocument();
        expect(screen.getByText("Doe")).toBeInTheDocument();

        expect(screen.getByText("Email :")).toBeInTheDocument();
        expect(screen.getByText("mock@example.com")).toBeInTheDocument();

        expect(screen.getByText("Street Address :")).toBeInTheDocument();
        expect(screen.getByText("1234 Main St")).toBeInTheDocument();

        expect(screen.getByText("City:")).toBeInTheDocument();
        expect(screen.getByText("Mock City")).toBeInTheDocument();

        expect(screen.getByText("Province:")).toBeInTheDocument();
        expect(screen.getByText("Mock Province")).toBeInTheDocument();

        expect(screen.getByText("Postal Code :")).toBeInTheDocument();
        expect(screen.getByText("12345")).toBeInTheDocument();

        expect(screen.getByText("Phone number :")).toBeInTheDocument();
        expect(screen.getByText("123-456-7890")).toBeInTheDocument();

        expect(screen.getByText("Birth Date :")).toBeInTheDocument();
        expect(screen.getByText("1990-01-01")).toBeInTheDocument();

        expect(screen.getByText("Sex :")).toBeInTheDocument();
        expect(screen.getByText("Male")).toBeInTheDocument();

    })

