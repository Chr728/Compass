import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import ProfilePage from "./profilePage";

const mockRouter = jest.fn();

jest.mock("next/navigation", () => ({
	useRouter: () => {
		return {
			push: mockRouter,
		};
	},
}));

jest.mock("../contexts/UserContext", () => {
	const originalModule = jest.requireActual("../contexts/UserContext");

	return {
		...originalModule,
		useUser: jest.fn(), // Mock the useUser hook
		UserProvider: ({ children }) => {
			// Mock the UserProvider component
			const userInfo = {
				id: 1,
				uid: "mock-uid",
				email: "mock@example.com",
				firstName: "John",
				lastName: "Doe",
				phoneNumber: "123-456-7890",
				birthDate: new Date(),
				sex: "Male",
			};

			return <div>{children}</div>; // You can adjust this mock component as needed
		},
	};
});

test("All fields are tested if visible to the user", () => {
	require("../contexts/UserContext").useUser.mockReturnValue({
		userInfo: {
			id: 1,
			uid: "mock-uid",
			email: "mock@example.com",
			firstName: "John",
			lastName: "Doe",
			phoneNumber: "123-456-7890",
			birthDate: "1990-01-01",
			sex: "male",
		},
	});
	render(<ProfilePage />);
	expect(screen.getByText("First Name :")).toBeInTheDocument();
	expect(screen.getByText("John")).toBeInTheDocument();

	expect(screen.getByText("Last Name :")).toBeInTheDocument();
	expect(screen.getByText("Doe")).toBeInTheDocument();

	expect(screen.getByText("Email :")).toBeInTheDocument();
	expect(screen.getByText("mock@example.com")).toBeInTheDocument();

	expect(screen.getByText("Phone number :")).toBeInTheDocument();
	expect(screen.getByText("123-456-7890")).toBeInTheDocument();

	expect(screen.getByText("Birth Date :")).toBeInTheDocument();
	expect(screen.getByText("1990-01-01")).toBeInTheDocument();

	expect(screen.getByText("Sex :")).toBeInTheDocument();
	expect(screen.getByText("male")).toBeInTheDocument();
});

test("profile page background image is displayed", () => {
	render(<ProfilePage />);
	const backgroundImage = screen.getByTestId("profile-background-image");
	expect(backgroundImage).toBeInTheDocument();
});

// test("Logo displayed correctly", async () => {
// 	require("../contexts/UserContext").useUser.mockReturnValue({
// 		userInfo: {
// 			id: 1,
// 			uid: "mock-uid",
// 			email: "mock@example.com",
// 			firstName: "John",
// 			lastName: "Doe",
// 			phoneNumber: "123-456-7890",
// 			birthDate: "1990-01-01",
// 			sex: "Male",
// 		},
// 	});
// 	render(<ProfilePage />);
// 	const maleImage = screen.getByAltText("Male");
// 	expect(maleImage).toBeVisible();
// });
// test("Logo displayed correctly", async () => {
// 	render(<ProfilePage />); // Render the ProfilePage component with a male profile

// 	// Wait for the image to be present in the DOM
// 	const maleImage = await screen.findByTestId("male-image");

// 	// Assert that the male image is visible
// 	expect(maleImage).toBeVisible();
// });

test("Male image displayed correctly", async () => {
	// Mock profile data with sex as "male"
	const profile = { sex: "male" };

	// Render the ProfilePage component with the mock profile data
	render(<ProfilePage profile={profile} />);

	// Find the male image by its alt text
	const maleImage = await screen.findByAltText("Male");

	// Assert that the male image is visible
	expect(maleImage).toBeVisible();
});
