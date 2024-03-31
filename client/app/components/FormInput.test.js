import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import Notes from "./FormInput";
describe("Notes component", () => {
	test("renders correctly", () => {
		const mockOnChange = jest.fn();
		const mockOnBlur = jest.fn();
		render(
			<Notes
				label="Test Label"
				value="Test Value"
				onChange={mockOnChange}
				onBlur={mockOnBlur}
			/>
		);

		expect(screen.getByText("Test Value")).toBeInTheDocument();
	});

	test("renders correctly", () => {
		const label = "Test Label";

		const { getByText } = render(<Notes label={label} />);

		const labelElement = getByText(label);

		expect(labelElement).toBeInTheDocument();
	});
	test("calls onChange and onBlur handlers", () => {
		const mockOnChange = jest.fn();
		const mockOnBlur = jest.fn();

		const { getByTestId } = render(
			<Notes
				label="Test Label"
				value="Test Value"
				onChange={mockOnChange}
				onBlur={mockOnBlur}
			/>
		);

		const textareaElement = getByTestId("notes-textarea");

		fireEvent.change(textareaElement, {
			target: { value: "Updated Value" },
		});
		fireEvent.blur(textareaElement);

		expect(mockOnChange).toHaveBeenCalled();
		expect(mockOnBlur).toHaveBeenCalled();
	});
});
