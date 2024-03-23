import "@testing-library/jest-dom";
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { render, screen } from "@testing-library/react";
import UserTestingPage from "./userTestingPage.tsx";

jest.mock("../contexts/PropContext", () => ({
  __esModule: true,
  useProp: jest.fn(() => ({
    handlePopUp: jest.fn(),
  })),
}));

const fakeUser = {
  uid: "1"
}

jest.mock('../contexts/AuthContext', () => {
  return {
      useAuth: () => {
          return {
              user : fakeUser
          }
      }
  }
});

const mockRouter= jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => {
      return {
          push: mockRouter
      }
  }
}));

jest.mock("../contexts/UserContext", () => {
  return {
    useUser: () =>{
      return {
          userInfo: {
              uid: '1',
          }
      }
    }
  };
});

test("data is displayed correctly", async () => {
	render(<UserTestingPage />);
	setTimeout(() => {
		expect(
			screen.getByText(
				"We would like to get your feedback please fill out the following annonymous survey :"
			)
		).toBeInTheDocument();
	}, 1000);
});

test("Start Survey button functions correctly", async () => {
	setTimeout(() => {
		const surveyButton = screen.getAllByRole("button")[1];
		userEvent.click(surveyButton);
		mockRouter;
		expect(mockRouter).toHaveBeenCalledWith("/forms.gle/8imvZJFK4C7zZ3iR6");
	}, 1000);
});

test("Back button redirects to getDiabeticJournals page", async () => {
	render(<UserTestingPage/>);
	const backButton = screen.getAllByRole('button')[0];
	await userEvent.click(backButton);
	await mockRouter;
	expect(mockRouter).toHaveBeenCalledWith('/settings');
})