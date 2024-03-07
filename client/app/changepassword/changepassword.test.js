import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChangePassword from "./page";
import { useRouter } from "next/navigation";
import "@testing-library/jest-dom";
import { auth } from "../config/firebase";
import Swal from "sweetalert2";
import {
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
} from "firebase/auth";

// Mocking console.error
const consoleErrorMock = jest.spyOn(console, "error");
consoleErrorMock.mockImplementation(() => {});

// Mocking the next/navigation and firebase dependencies
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({ push: jest.fn() })),
  useSearchParams: jest.fn(() => ({ get: jest.fn(() => null) })),
}));

// Mocking SweetAlert2
jest.mock("sweetalert2", () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: true, isDismissed: false }),
}));

// Mock user object
const mockUser = {
  email: "test@example.com",
  uid: 1,
  getIdToken: jest.fn().mockResolvedValue("mockToken"),
};

// Mock firebase functions
jest.mock("firebase/auth", () => ({
  ...jest.requireActual("firebase/auth"),
  reauthenticateWithCredential: jest.fn(),
  updatePassword: jest.fn(),
  EmailAuthProvider: {
    credential: jest.fn().mockImplementation((email, password) => ({
      email,
      password,
    })),
  },
}));

describe("ChangePassword rendering tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("renders without errors", () => {
    render(<ChangePassword />);
    expect(screen.getByText("Change your password")).toBeInTheDocument();
  });

  test("handles current password visibility toggle", () => {
    render(<ChangePassword />);
    const currentPasswordInput = screen.getByLabelText("Current Password");
    const visibilityButton =
      screen.getByText("Current Password").parentNode.lastChild;

    expect(currentPasswordInput.type).toBe("password");

    fireEvent.click(visibilityButton);

    expect(currentPasswordInput.type).toBe("password");
  });

  test("handles new password visibility toggle", () => {
    render(<ChangePassword />);
    const newPasswordInput = screen.getByLabelText("New Password");
    const visibilityButton =
      screen.getByText("New Password").parentNode.lastChild;

    expect(newPasswordInput.type).toBe("password");

    fireEvent.click(visibilityButton);

    expect(newPasswordInput.type).toBe("password");
  });
});

describe("ChangePassword form validation tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("handles new password validation - required", async () => {
    const { getByLabelText, getByText } = render(<ChangePassword />);

    fireEvent.change(getByLabelText("New Password"), { target: { value: "" } });
    fireEvent.blur(getByLabelText("New Password"));

    await waitFor(() => {
      expect(screen.getByText("New Password is required")).toBeInTheDocument();
    });
  });

  test("handles new password validation - length", async () => {
    const { getByLabelText, getByText } = render(<ChangePassword />);

    fireEvent.change(getByLabelText("New Password"), {
      target: { value: "123" },
    });
    fireEvent.blur(getByLabelText("New Password"));

    await waitFor(() => {
      expect(
        screen.getByText("Password must be at least 6 characters long")
      ).toBeInTheDocument();
    });
  });

  test("handles new password validation - same as current password", async () => {
    const { getByLabelText, getByText } = render(<ChangePassword />);

    fireEvent.change(getByLabelText("Current Password"), {
      target: { value: "currentPassword123" },
    });
    fireEvent.change(getByLabelText("New Password"), {
      target: { value: "currentPassword123" },
    });
    fireEvent.blur(getByLabelText("New Password"));

    await waitFor(() => {
      expect(
        screen.getByText(
          "New Password cannot be the same as the Current Password"
        )
      ).toBeInTheDocument();
    });
  });

  test("handles confirm password validation - required", async () => {
    const { getByLabelText, getByText } = render(<ChangePassword />);

    fireEvent.change(getByLabelText("Confirm Password"), {
      target: { value: "" },
    });
    fireEvent.blur(getByLabelText("Confirm Password"));

    await waitFor(() => {
      expect(
        screen.getByText("Confirm Password is required")
      ).toBeInTheDocument();
    });
  });

  test("handles confirm password validation - match", async () => {
    const { getByLabelText, getByText } = render(<ChangePassword />);

    fireEvent.change(getByLabelText("New Password"), {
      target: { value: "newPassword123" },
    });
    fireEvent.change(getByLabelText("Confirm Password"), {
      target: { value: "mismatch" },
    });
    fireEvent.blur(getByLabelText("Confirm Password"));

    await waitFor(() => {
      expect(screen.getByText("Passwords do not match")).toBeInTheDocument();
    });
  });
});

describe("ChangePassword form submit tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("handles user not authenticated", async () => {
    // Mocking currentUser as null
    Object.defineProperty(auth, "currentUser", {
      get: jest.fn().mockReturnValue(null),
    });

    const { getByLabelText, getByText } = render(<ChangePassword />);

    // Filling in the form fields
    fireEvent.change(getByLabelText("Current Password"), {
      target: { value: "currentPassword123" },
    });
    fireEvent.change(getByLabelText("New Password"), {
      target: { value: "newPassword123" },
    });
    fireEvent.change(getByLabelText("Confirm Password"), {
      target: { value: "newPassword123" },
    });

    // Submitting the form
    fireEvent.submit(getByText("Change Password"));

    // Wait for asynchronous operations to complete
    await waitFor(() => {
      // Asserting that the console.error function was called with the expected message
      expect(console.error).toHaveBeenCalledWith("User not authenticated.");
    });
  });

  test("submits the form successfully", async () => {
    const mockPush = jest.fn();
    useRouter.mockImplementation(() => ({
      push: mockPush,
    }));

    // Mocking currentUser with a user object
    Object.defineProperty(auth, "currentUser", {
      get: jest.fn().mockReturnValue(mockUser),
    });

    const { getByLabelText, getByText } = render(<ChangePassword />);

    // Filling in the form fields
    fireEvent.change(getByLabelText("Current Password"), {
      target: { value: "currentPassword123" },
    });
    fireEvent.change(getByLabelText("New Password"), {
      target: { value: "newPassword123" },
    });
    fireEvent.change(getByLabelText("Confirm Password"), {
      target: { value: "newPassword123" },
    });

    // Submitting the form
    fireEvent.submit(getByText("Change Password"));

    // Wait for asynchronous operations to complete
    await waitFor(() => {
      // Asserting that the EmailAuthProvider.credential function was called
      expect(EmailAuthProvider.credential).toHaveBeenCalledWith(
        "test@example.com",
        "currentPassword123"
      );
      // Asserting that the reauthenticateWithCredential function was called
      expect(reauthenticateWithCredential).toHaveBeenCalled();
    });

    // Wait for asynchronous operations to complete
    await waitFor(() => {
      // Asserting that the updatePassword function was called
      expect(updatePassword).toHaveBeenCalledWith(
        expect.any(Object),
        "newPassword123"
      );

      // Asserting that the SweetAlert success message was displayed
      expect(Swal.fire).toHaveBeenCalledWith({
        title: "Success!",
        text: "Password changed successfully!",
        icon: "success",
      });

      // Asserting that the router.push function was called
      expect(useRouter().push).toHaveBeenCalledWith("/settings");
    });
  });

  test("handles reauthentication failure", async () => {
    // Mocking currentUser with a user object
    Object.defineProperty(auth, "currentUser", {
      get: jest.fn().mockReturnValue(mockUser),
    });

    // Mocking reauthenticateWithCredential failure
    const mockError = new Error("Reauthentication failed");
    reauthenticateWithCredential.mockRejectedValueOnce(mockError);

    const { getByLabelText, getByText } = render(<ChangePassword />);

    // Filling in the form fields
    fireEvent.change(getByLabelText("Current Password"), {
      target: { value: "currentPassword123" },
    });
    fireEvent.change(getByLabelText("New Password"), {
      target: { value: "newPassword123" },
    });
    fireEvent.change(getByLabelText("Confirm Password"), {
      target: { value: "newPassword123" },
    });

    // Submitting the form
    fireEvent.submit(getByText("Change Password"));

    // Wait for asynchronous operations to complete
    await waitFor(() => {
      // Asserting that the reauthenticateWithCredential function was called
      expect(reauthenticateWithCredential).toHaveBeenCalled();
      expect(consoleErrorMock).toHaveBeenCalledWith(
        "Reauthentication failed:",
        mockError
      );
    });
  });
});
