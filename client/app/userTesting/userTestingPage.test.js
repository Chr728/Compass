import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

test("data is displayed correctly", async () => {
	render(<userTestingPage />);
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
