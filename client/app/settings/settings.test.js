import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import SettingsPage from "./settingsPage";

//Mock useRouter from next/navigation
jest.mock("next/navigation", () => ({
	useRouter: jest.fn(),
}));

//Mock push from next Router
const mockRouterPush = jest.fn();

const mockLogOut = jest.fn();
jest.mock("../contexts/AuthContext", () => ({
	useAuth: () => ({
		logout: mockLogOut,
	}),
}));

//Mock back from next Router
const mockRouterBack = jest.fn();

//Setitng useRouter mock behaviour before executing tests
beforeAll(() => {
	useRouter.mockReturnValue({
		query: {},
		push: mockRouterPush,
		back: mockRouterBack,
	});
});

describe("Settings Page", () => {
	//Test to check if page is rendered correctly with proper text and button
	test("Renders correct content and button", async () => {
		render(<SettingsPage />);
		const SettingsHeader = screen.getAllByText(/Settings/i)[0];
		const YourAccountHeader = screen.getByText(/Your account/i);
		const YourProfile = screen.getByText(/Your Profile/i);
		const ChangeYourPassword = screen.getByText(/Change your password/i);
		const HowToUse = screen.getByText(/How you use Compass/i);
		const PushNotifications = screen.getByText(/Push notifications/i);
		const AboutCompass = screen.getByText(/About Compass/i);
		const Privacy = screen.getByText(/Privacy Policy/i);
		const MoreInfo = screen.getByText(/More Info/i);
		const BackButton = screen.getAllByRole("button")[0];
		const LogoutButton = screen.getAllByRole("button")[1];

		expect(SettingsHeader).toBeInTheDocument();
		expect(YourAccountHeader).toBeInTheDocument();
		expect(YourProfile).toBeInTheDocument();
		expect(ChangeYourPassword).toBeInTheDocument();
		expect(HowToUse).toBeInTheDocument();
		expect(PushNotifications).toBeInTheDocument();
		expect(AboutCompass).toBeInTheDocument();
		expect(Privacy).toBeInTheDocument();
		expect(MoreInfo).toBeInTheDocument();

		expect(BackButton).toBeInTheDocument();
		fireEvent.click(BackButton);

		await mockRouterPush;
		expect(mockRouterPush).toHaveBeenCalledTimes(1);

		expect(LogoutButton).toBeInTheDocument();
		fireEvent.click(LogoutButton);
	});

	// test("Check if button navigates to logout page", () => {
	//   render(<SettingsPage />);
	//   const LogoutButton = screen.getByText("Sign Out"); // Assuming the button text is 'Sign Out'
	//   fireEvent.click(LogoutButton);
	//   expect(mockLogOut).toHaveBeenCalled(); // Check if the logout function is called
	// });

	test("link redirects to logout page", async () => {
		render(<SettingsPage />);
		const linkElement = screen.getAllByRole("link")[1];
		expect(linkElement).toHaveAttribute(
			"href",
			"/forgotpassword?loggedIn=true"
		);
	});
});
