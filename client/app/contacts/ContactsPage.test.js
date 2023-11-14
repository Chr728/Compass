import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Contacts from './ContactsPage';
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

describe("Contacts Menu Test", () => {

});
