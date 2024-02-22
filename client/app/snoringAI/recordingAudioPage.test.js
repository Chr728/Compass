import "@testing-library/jest-dom";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RecordAudioPage from "./recordAudioPage";
import { it } from "node:test";

const mockRouter = jest.fn();
jest.mock("next/navigation", () => ({
	useRouter: () => {
		return {
			push: mockRouter,
		};
	},
}));

const userData = {
    uid: '1',
}

describe ("Logged in user", () => {
    jest.mock("../contexts/AuthContext", () => {
        return {
          useAuth: () =>{
            return {
                user: userData
            }
          }
        };
      });
      
    beforeEach(async () => {
        await act(async () => {
            render(<RecordAudioPage />);
          });
    })

    test("Table is displayed correctly", () => {
        const dateHeader = screen.getByText("Date");
        const resultHeader = screen.getByText("Result");
        expect(dateHeader).toBeInTheDocument();
        expect(resultHeader).toBeInTheDocument();
    });
});

describe("User not logged in", () => {
    beforeEach( () => {
        jest.mock("../contexts/AuthContext", () => {
            return {
              useAuth: () =>{
                return {
                    user: null
                }
              }
            };
          });
    });

    test("Router push method redirects to login page", () => {
        render(<RecordAudioPage />);
        expect(mockRouter).toBeCalledWith('/login');
    });
});