import {render} from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuth } from './contexts/AuthContext';
import Home from './page'; 

const mockRouter= jest.fn();
const mockUsePathname = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter
        }
    },
    usePathname: () => mockUsePathname()
}));

jest.mock('./contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('./welcome/page', () => ({
    __esModule: true,
    default: () => <div data-testid="welcome">Welcome Mock</div>,
}));

describe('Home component', () => {

  it('Renders Welcome component when user is not logged in', () => {
    useAuth.mockReturnValue(
        { 
            user: null 
        }
    );
    const renderedComponent = render(<Home />);
    expect(renderedComponent.getByTestId('welcome')).toBeTruthy();
  });

  it('Redirects user to main page when the user is authenticated', () => {
    useAuth.mockReturnValue(
        { user: 
            { 
                uid: '1' 
            } 
        }
    );
    render(<Home />);
    expect(mockRouter).toBeCalledWith('/');
  });

});
