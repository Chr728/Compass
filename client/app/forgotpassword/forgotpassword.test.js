import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ForgotPassword from "../forgotpassword/page";
import { act } from "react-dom/test-utils";
import { auth } from "../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

// Mock useSearchParams directly in this test file
jest.mock("next/navigation", () => ({
  useSearchParams: () => ({
    get: jest.fn(),
  }),
}));

// Mocking next and firebase modules
jest.mock("next/image", () => ({ src, alt }) => <img src={src} alt={alt} />);
jest.mock(
  "next/link",
  () =>
    ({ children }) =>
      children
);
jest.mock("../../logger", () => ({ error: jest.fn() }));

jest.mock("firebase/auth", () => ({
  getAuth: jest.fn(),
  sendPasswordResetEmail: jest.fn(), // Mocking the function
}));

// Mocking the auth object
jest.mock("../config/firebase", () => ({
  auth: {
    currentUser: {
      uid: 1,
      getIdToken: jest.fn().mockResolvedValue("mockToken"),
    },
  },
}));

// Test forgot password page
describe("Forgot password page messages", () => {
  test("render all content to the screen", () => {
    render(<ForgotPassword />);
    const resetPassordHeader = screen.getAllByText(/Reset Password/i)[0];
    const descriptionHeader = screen.getByText(
      /Enter your email for a password reset link./i
    );
    const emailLabel = screen.findAllByText(/Email/i);
    const buttonconst = screen.getByRole("button");
    const backToLoginLink = screen.getByText(/Back to Sign in/i);
  });

  test("renders error messages when email not entered", async () => {
    render(<ForgotPassword />);
    const emailInput = screen.getByLabelText("Email");
    const button = screen.getByRole("button");
    userEvent.click(button);
    const emailError = await screen.findByText(/email is required/i);
    expect(emailError).toBeInTheDocument();
  });

  test("renders email error message on incorrect email", async () => {
    render(<ForgotPassword />);
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    await userEvent.type(emailInput, "georgia");
    const button = screen.getByRole("button");
    await userEvent.click(button);
    const emailError = screen.getByText(/invalid email format/i);
    expect(emailError).toBeInTheDocument();
  });

  test("shows email error message on blur", async () => {
    render(<ForgotPassword />);
    const emailInput = screen.getByRole("textbox", { name: /email/i });
    await userEvent.type(emailInput, "georgia");
    fireEvent.blur(emailInput);
    const emailError = await screen.findByText(/invalid email format/i);
    expect(emailError).toBeInTheDocument();
  });

  test("link redirects to login page", async () => {
    render(<ForgotPassword />);
    const linkElement = screen.getAllByRole("link")[0];
    expect(linkElement).toHaveAttribute("href", "/login");
  });
});

// Test change password page
describe("Change password page messages", () => {
  beforeEach(() => {
    act(() => {
      const setPage = jest.fn();
      jest.spyOn(React, "useState").mockReturnValue([true, setPage]);
    });
  });

  afterEach(() => {
    // Restore the original implementation after the tests
    act(() => {
      jest.restoreAllMocks();
    });
  });

  test("render all content to the screen", () => {
    render(<ForgotPassword />);
    const resetPassordHeader = screen.getAllByText(/Password Change/i)[0];
    const descriptionHeader = screen.getByText(
      /Enter your email for a password reset link./i
    );
    const emailLabel = screen.findAllByText(/Email/i);
    const buttonconst = screen.getByRole("button");
  });

  test("link redirects back to settings page", async () => {
    render(<ForgotPassword />);
    const linkElement = screen.getAllByRole("link")[0];
    expect(linkElement).toHaveAttribute("href", "/settings");
  });
});

// Tests for when submitting the form
describe("tests when submitting password reset form", () => {
  test("handles form submission and triggers password reset email", async () => {
    render(<ForgotPassword />);

    // Simulate user entering a valid email
    await userEvent.type(
      screen.getByLabelText("Email"),
      "valid-email@example.com"
    );
    userEvent.click(screen.getByText("Send Reset Link"));

    // Ensure the sendPasswordResetEmail function is called with the correct arguments
    await waitFor(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(
        expect.objectContaining(auth),
        "valid-email@example.com"
      );
    });

    // Mock a successful password reset email sending
    sendPasswordResetEmail.mockResolvedValue();

    // Submit the form again to trigger the success scenario
    userEvent.click(screen.getByText("Send Reset Link"));

    // Ensure the sendPasswordResetEmail function is called again
    await waitFor(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(
        expect.objectContaining(auth),
        "valid-email@example.com"
      );
    });
  });
});
