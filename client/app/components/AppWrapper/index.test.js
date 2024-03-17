// AppWrapper.test.js
import React from 'react';
import "@testing-library/jest-dom";
import AppWrapper from './index';
import AuthContext from "../../contexts/AuthContext";
import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../contexts/UserContext";
import {PropProvider, useProp} from "../../contexts/PropContext";
import { render, screen } from "@testing-library/react";


const mockRouter = jest.fn();
const mockUsePathname = jest.fn();
const mockSearchParams = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => {
        return {
            push: mockRouter,
        };
    },
    useSearchParams: () => {
        return {
            get: mockSearchParams
        }
    },
    usePathname: () => mockUsePathname(),
}));

jest.mock("../../contexts/UserContext", () => ({
    UserProvider: ({ children }) => <div>{children}</div>,
    useUser: jest.fn(),
}));

jest.mock("../../contexts/PropContext", () => ({
    PropProvider: ({ children }) => <div>{children}</div>,
        useProp: jest.fn(),
        loading: false,
        popUp: {show: false, message: ""},
        introJsActive: false,

}));

jest.mock('../../contexts/AuthContext', () => ({
    AuthProvider: ({ children }) => <div>{children}</div>,
    useAuth: jest.fn(),
}));



describe("AppWrapper", () => {
    it("renders children when user is logged in", () => {
        mockUsePathname.mockReturnValue("/dashboard");
        useAuth.mockImplementation(() => {
            return {
                user: { uid: "123" },
                login: jest.fn(),
                logout: jest.fn(),
                error: null,
                signUp: jest.fn(),
            };
        });

        useUser.mockImplementation(() => {
            return {
                userInfo: { uid: "123", name: "Test User" },
            };
        });

        useProp.mockImplementation(() => {
            return {
                handleLoading: jest.fn(),
                loading: false,
                handlePopUp: jest.fn(),
                popUp: {show: false, message: ""},
                introJsActive: false,
                handleIntroJsActive: jest.fn(),
            };
        });

        render(<AppWrapper>Test Child</AppWrapper>);
        expect(screen.getByText('Test Child')).toBeInTheDocument();
    });
});