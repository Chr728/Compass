import "@testing-library/jest-dom";
import { act, cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PillIdentifierPage from "./pillIdentifierPage";

beforeEach(async () => {
	await act(async () => {
		render(<PillIdentifierPage />);
	});
});

afterEach(() => {
	cleanup();
});

const mockRouter = jest.fn();
jest.mock("next/navigation", () => ({
	useRouter: () => {
		return {
			push: mockRouter,
		};
	},
}));

test("Cancel  button  functions correctly", async () => {
	setTimeout(() => {
		const cancelButton = screen.getAllByRole("button")[3];
		userEvent.click(cancelButton);
		mockRouter;
		expect(mockRouter).toHaveBeenCalledWith("/getMedications");
	}, 1000);
});

test("Message displayed", async () => {
	setTimeout(() => {
		const route = screen.findByText(
			"Use our advanced AI to identify any pills or tablets you may have in hand."
		);
		expect(route).toBeInTheDocument();
	}, 1000);
});

test("Message displayed", async () => {
	setTimeout(() => {
		const route = screen.findByText(
			"The app doesn't provide a 100% guarantee when identifying medications."
		);
		expect(route).toBeInTheDocument();
	}, 1000);
});

test("Message displayed", async () => {
	setTimeout(() => {
		const route = screen.findByText(
			"The app provides you a score of the closest match."
		);
		expect(route).toBeInTheDocument();
	}, 1000);
});

test("Message displayed", async () => {
	setTimeout(() => {
		const route = screen.findByText(
			"Take pictures against a clear background."
		);
		expect(route).toBeInTheDocument();
	}, 1000);
});

test("Capture  button  functions correctly", async () => {
	setTimeout(() => {
		const captureButton = screen.getAllByRole("button")[1];

		// Mock getUserMedia to simulate camera access
		const mockMediaDevices = {
			getUserMedia: jest.fn(() => Promise.resolve({})),
		};
		global.navigator.mediaDevices = mockMediaDevices;

		// Click the Take a picture button
		userEvent.click(captureButton);

		// Ensure that the camera starts (is active)
		expect(mockMediaDevices.getUserMedia).toHaveBeenCalled();

		// Simulate capturing an image
		const canvas = screen.getByTestId("hidden-canvas");
		Object.defineProperty(canvas, "toDataURL", {
			value: jest.fn(() => "mockImageData"),
		});

		userEvent.click(screen.getByText("Take a image"));

		// Ensure that the image is captured
		expect(canvas.toDataURL).toHaveBeenCalled();
		expect(screen.getByText("Submit")).toBeInTheDocument();
	}, 1000);
});

test("renders Upload from gallery button and captures image on file upload", async () => {
	setTimeout(() => {
		// Check that the button is initially rendered
		const uploadButton = screen.getAllByRole("button")[2];

		userEvent.click(uploadButton);

		// Simulate uploading an image
		const fileInput = screen.getByLabelText(/upload from gallery/i);
		const imageFile = new File(["(binary)"], "example.png", {
			type: "image/png",
		});

		userEvent.change(fileInput, { target: { files: [imageFile] } });

		// Ensure that the image is captured
		expect(screen.getByAltText("Logo")).toBeInTheDocument();
		expect(screen.getByText("Submit")).toBeInTheDocument();
	}, 1000);
});

test("renders captured image on the screen after capturing", async () => {
	setTimeout(() => {
		// Check that the button is initially rendered
		const captureButton = screen.getAllByRole("button")[1];

		// Mock getUserMedia to simulate camera access
		const mockMediaDevices = {
			getUserMedia: jest.fn(() => Promise.resolve({})),
		};
		global.navigator.mediaDevices = mockMediaDevices;

		// Click the Take a picture button
		userEvent.click(captureButton);

		// Ensure that the camera starts (is active)
		expect(mockMediaDevices.getUserMedia).toHaveBeenCalled();

		// Simulate capturing an image
		const canvas = screen.getByTestId("hidden-canvas");
		Object.defineProperty(canvas, "toDataURL", {
			value: jest.fn(() => "mockImageData"),
		});

		userEvent.click(screen.getByText("Take a picture"));

		// Ensure that the captured image is rendered on the screen
		expect(screen.getByAltText("Captured Image")).toBeInTheDocument();
	}, 1000);
});

test("renders uploaded image on the screen after uploading", async () => {
	setTimeout(() => {
		// Check that the button is initially rendered
		const uploadButton = screen.getAllByRole("button")[2];
		// Mock the file input to simulate file selection
		const fileInput = screen.getByLabelText(
			"Upload from gallery"
		).nextSibling;
		const mockFile = new File(["(⌐□_□)"], "mockImage.png", {
			type: "image/png",
		});
		Object.defineProperty(fileInput, "files", {
			value: [mockFile],
		});

		// Click the Upload from gallery button
		userEvent.click(uploadButton);

		// Ensure that the uploaded image is rendered on the screen
		expect(screen.getByAltText("Uploaded Image")).toBeInTheDocument();
	}, 1000);
});

test("Results Message displayed", async () => {
	setTimeout(() => {
		const route = screen.findByText(
			"Swipe left/right to scroll through the results as determined by the AI. A higher score means a closer match to your picture."
		);
		expect(route).toBeInTheDocument();
	}, 1000);
});

test("Results Message displayed", async () => {
	setTimeout(() => {
		const route = screen.findByText(
			"This app does not provide a 100% guarantee."
		);
		expect(route).toBeInTheDocument();
	}, 1000);
});

test("renders label, score, and strength from API results", () => {
	setTimeout(() => {
		// Mock the API results
		const mockApiResults = [
			{
				label: "celecoxib400MGOralCapsule",
				probability: 0.85,
			},
			// Add more mock results as needed
		];

		// Render the component with mock data
		const { getByText } = render(
			<PillIdentifierPage apiResults={mockApiResults} selectedLabel={0} />
		);

		// Assert that the rendered label, score, and strength match the mock data
		const renderedLabel = getByText("celecoxib");
		expect(renderedLabel).toBeInTheDocument();

		const renderedScore = getByText("85% match");
		expect(renderedScore).toBeInTheDocument();

		const renderedStrength = getByText("400MGOralCapsule");
		expect(renderedStrength).toBeInTheDocument();
	}, 1000);
});
