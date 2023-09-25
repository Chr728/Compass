import React from "react";
import { fireEvent, render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ForgotPassword from "../forgotpassword/page";

// Test forgot password page
describe("Forgot password page messages", () => {
  test("render all content to the screen", () => {
    render(<ForgotPassword />);
    const resetPassordHeader = screen.getAllByText(/Reset Password/i)[0];
    const descriptionHeader = screen.getByText(
      /Enter your email for a password reset link./i
    );
    const forgetEmailLink = screen.getByText(/Forgot Email ?/i);
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
    const linkElement = screen.getAllByRole("link")[1];
    expect(linkElement).toHaveAttribute("href", "/login");
  });
});

// Test change password page
describe("Change password page messages", () => {
  beforeEach(() => {
    act(() => {
      const setLoggedIn = jest.fn();
      jest.spyOn(React, "useState").mockReturnValue([true, setLoggedIn]);
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
