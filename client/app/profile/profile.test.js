import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import Profile from '../profile/page';
import { useRouter } from 'next/navigation';


const mockRouter= jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    }
}));

    test("All fields are tested if visible to the user", () => {
        render(<Profile/>);
        const firstname = screen.getByText("First Name :");  
        expect(firstname).toBeInTheDocument();

        const lasttname = screen.getByText("Last Name :");  
        expect(lasttname).toBeInTheDocument();

        const email = screen.getByText("Email :");  
        expect(email).toBeInTheDocument();

        const streetaddress = screen.getByText("Street Address :");  
        expect(streetaddress).toBeInTheDocument();

        const city = screen.getByText("City:");  
        expect(city).toBeInTheDocument();

        const province = screen.getByText("Province:");  
        expect(province).toBeInTheDocument();

        const postalcode = screen.getByText("Postal Code :");  
        expect(postalcode).toBeInTheDocument();

        const phone = screen.getByText("Phone number :");  
        expect(phone).toBeInTheDocument();

        const birthdate = screen.getByText("Birth Date :");  
        expect(birthdate).toBeInTheDocument();

        const sex = screen.getByText("Sex :");  
        expect(sex).toBeInTheDocument();

    })

