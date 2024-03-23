import "@testing-library/jest-dom";
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { render, screen } from "@testing-library/react";
import PrivacyPage from "./privacyPage";

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
	render(<PrivacyPage />);
	setTimeout(() => {
		expect(
			screen.getByText(
				"This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You. We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy."
			)
		).toBeInTheDocument();
	}, 1000);
});

test("data is displayed correctly", async () => {
	render(<PrivacyPage />);
	setTimeout(() => {
		expect(
			screen.getByText(
				"If you have any questions about this Privacy Policy, You can contact us: * By email: soen4901medicalapp@gmail.com"
			)
		).toBeInTheDocument();
	}, 1000);
});

test("Back button redirects to settings page", async () => {
	render(<PrivacyPage/>);
	const backButton = screen.getAllByRole('button')[0];
	await userEvent.click(backButton);
	await mockRouter;
	expect(mockRouter).toHaveBeenCalledWith('/settings');
})