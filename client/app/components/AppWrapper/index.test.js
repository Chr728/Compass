import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppWrapper from './index';
import { usePathname } from 'next/navigation';

// Mock the usePathname hook from next/navigation
jest.mock('next/navigation', () => ({
    usePathname: jest.fn()
}));

// Mocking the contexts and Menu component to isolate AppWrapper during the test
jest.mock('../../contexts/AuthContext', () => ({
    AuthProvider: ({ children }) => <div>{children}</div>
}));

jest.mock('../../contexts/UserContext', () => ({
    UserProvider: ({ children }) => <div>{children}</div>
}));

jest.mock('../Menu', () => () => <div>Menu Component</div>);

const mockUsePathname = usePathname;

describe('AppWrapper', () => {
    it('renders children', () => {
        render(<AppWrapper>Test Child</AppWrapper>);
        expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('renders menu when not on login or register page', () => {
        // Mocking the return value of usePathname
        mockUsePathname.mockReturnValue('/dashboard');
        render(<AppWrapper>Test Child</AppWrapper>);
        expect(screen.getByText('Menu Component')).toBeInTheDocument();
    });

    it('does not render menu on login page', () => {
        mockUsePathname.mockReturnValue('/login');
        render(<AppWrapper>Test Child</AppWrapper>);
        expect(screen.queryByText('Menu Component')).toBeNull();
    });

    it('does not render menu on register page', () => {
        mockUsePathname.mockReturnValue('/register');
        render(<AppWrapper>Test Child</AppWrapper>);
        expect(screen.queryByText('Menu Component')).toBeNull();
    });
});
