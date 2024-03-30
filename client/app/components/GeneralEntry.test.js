import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import Result from "../components/GeneralEntry"; // Assuming the component name is Result

describe("Result Component", () => {
	test("renders label and value 1", () => {
		const props = {
			value1: "Test Value1",
			value2: "Test Value2",
			value3: "Test Value3",
		};
		const value1 = "Test Value1";

		render(<Result {...props} />);
		const valueText1 = screen.getByText(value1);
		expect(valueText1).toBeInTheDocument();
	});

	test("renders label and value 2", () => {
		const props = {
			value1: "Test Value1",
			value2: "Test Value2",
			value3: "Test Value3",
		};
		const value2 = "Test Value2";

		render(<Result {...props} />);
		const valueText2 = screen.getByText(value2);
		expect(valueText2).toBeInTheDocument();
	});

	test("renders label and value 3", () => {
		const props = {
			value1: "Test Value1",
			value2: "Test Value2",
			value3: "Test Value3",
		};
		const value3 = "Test Value3";

		render(<Result {...props} />);
		const valueText3 = screen.getByText(value3);
		expect(valueText3).toBeInTheDocument();
	});
});
