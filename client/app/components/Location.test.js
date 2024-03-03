import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import LocationComponent from '../components/Location';

describe('LocationComponent', () => {
    const mockProps = {
        name: "Test Location",
        address: "123 Test St",
        rating: 4.5,
        userRatingsTotal: 200,
        icon: "http://example.com/icon.png",
    };

    it('displays the name', () => {
        render(<LocationComponent {...mockProps} />);
        expect(screen.getByText(mockProps.name)).toBeInTheDocument();
    });

    it('displays the address', () => {
        render(<LocationComponent {...mockProps} />);
        expect(screen.getByText(mockProps.address)).toBeInTheDocument();
    });

    it('displays the icon with the correct src', () => {
        render(<LocationComponent {...mockProps} />);

        const icon = screen.getByAltText("Business Icon");
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('src', mockProps.icon);
    });

    it('calls onClick when the component is clicked', () => {
        const mockOnClick = jest.fn();
        render(<LocationComponent {...mockProps} onClick={mockOnClick} />);

        const locationComponent = screen.getByText(mockProps.name).closest('div');
        fireEvent.click(locationComponent);

        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
