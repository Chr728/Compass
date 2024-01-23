import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

test("data is displayed correctly", async () => {
	render(<privacyPage />);
	setTimeout(() => {
		expect(
			screen.getByText(
				"This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You. We use Your Personal data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy."
			)
		).toBeInTheDocument();
	}, 1000);
});

test("data is displayed correctly", async () => {
	render(<privacyPage />);
	setTimeout(() => {
		expect(
			screen.getByText(
				"If you have any questions about this Privacy Policy, You can contact us: * By email: soen4901medicalapp@gmail.com"
			)
		).toBeInTheDocument();
	}, 1000);
});
